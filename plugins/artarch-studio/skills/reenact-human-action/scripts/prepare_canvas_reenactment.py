#!/usr/bin/env python3
"""Prepare frame-aligned source, audio, and review assets for a canvas reenactment."""

from __future__ import annotations

import argparse
import hashlib
import json
import math
import re
import shutil
import subprocess
import sys
from pathlib import Path
from typing import Any


def run(command: list[str], *, capture: bool = False) -> subprocess.CompletedProcess[str]:
    return subprocess.run(
        command,
        check=True,
        text=True,
        stdout=subprocess.PIPE if capture else None,
        stderr=subprocess.PIPE if capture else None,
    )


def require_tool(name: str) -> str:
    resolved = shutil.which(name)
    if not resolved:
        raise RuntimeError(f"required executable is not on PATH: {name}")
    return resolved


def probe(path: Path) -> dict[str, Any]:
    result = run(
        [
            require_tool("ffprobe"),
            "-v",
            "error",
            "-show_streams",
            "-show_format",
            "-of",
            "json",
            str(path),
        ],
        capture=True,
    )
    payload = json.loads(result.stdout)
    streams = payload.get("streams", [])
    video = next((item for item in streams if item.get("codec_type") == "video"), None)
    audio = next((item for item in streams if item.get("codec_type") == "audio"), None)
    if video is None:
        raise RuntimeError(f"no decodable video stream: {path}")
    duration = float(payload.get("format", {}).get("duration") or video.get("duration") or 0)
    if duration <= 0:
        raise RuntimeError(f"video duration is unavailable: {path}")
    return {
        "duration_seconds": duration,
        "width": int(video.get("width") or 0),
        "height": int(video.get("height") or 0),
        "avg_frame_rate": video.get("avg_frame_rate") or "0/0",
        "sample_aspect_ratio": video.get("sample_aspect_ratio") or "1:1",
        "has_audio": audio is not None,
    }


def source_fingerprint(path: Path) -> dict[str, Any]:
    stat = path.stat()
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return {
        "path": str(path),
        "size_bytes": stat.st_size,
        "mtime_ns": stat.st_mtime_ns,
        "sha256": digest.hexdigest(),
    }


def detect_scene_cuts(path: Path, threshold: float) -> list[float]:
    result = subprocess.run(
        [
            require_tool("ffmpeg"),
            "-hide_banner",
            "-i",
            str(path),
            "-filter:v",
            f"select='gt(scene,{threshold})',showinfo",
            "-an",
            "-f",
            "null",
            "-",
        ],
        check=False,
        text=True,
        stdout=subprocess.DEVNULL,
        stderr=subprocess.PIPE,
    )
    if result.returncode != 0:
        raise RuntimeError("ffmpeg scene detection failed")
    return sorted({float(value) for value in re.findall(r"pts_time:([0-9.]+)", result.stderr)})


def plan_boundaries(duration: float, cuts: list[float], maximum: float, minimum: float) -> list[float]:
    if duration <= 0 or maximum <= 0 or minimum < 0 or minimum > maximum:
        raise ValueError("invalid duration constraints")
    scene_boundaries = [0.0]
    for cut in sorted(set(cuts)):
        if cut <= 0 or cut >= duration:
            continue
        if cut - scene_boundaries[-1] < minimum or duration - cut < minimum:
            continue
        scene_boundaries.append(cut)
    scene_boundaries.append(duration)

    boundaries = [0.0]
    for start, end in zip(scene_boundaries, scene_boundaries[1:]):
        span = end - start
        pieces = max(1, math.ceil(span / maximum))
        for piece in range(1, pieces + 1):
            boundary = start + (span * piece / pieces)
            if boundary - boundaries[-1] > 1e-6:
                boundaries.append(boundary)
    boundaries[-1] = duration
    return [round(value, 6) for value in boundaries]


def remove_previous_outputs(output_dir: Path) -> None:
    for name in ("source_segments", "audio_segments", "inspection_frames"):
        target = output_dir / name
        if target.exists():
            shutil.rmtree(target)
    manifest = output_dir / "manifest.json"
    if manifest.exists():
        manifest.unlink()


def media_duration(path: Path) -> float:
    result = run(
        [require_tool("ffprobe"), "-v", "error", "-show_entries", "format=duration", "-of", "default=nw=1:nk=1", str(path)],
        capture=True,
    )
    return float(result.stdout.strip())


def render_segment(source: Path, target: Path, start: float, duration: float) -> None:
    run(
        [
            require_tool("ffmpeg"),
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(source),
            "-ss",
            f"{start:.6f}",
            "-t",
            f"{duration:.6f}",
            "-map",
            "0:v:0",
            "-map",
            "0:a?",
            "-c:v",
            "libx264",
            "-preset",
            "medium",
            "-crf",
            "18",
            "-pix_fmt",
            "yuv420p",
            "-c:a",
            "aac",
            "-movflags",
            "+faststart",
            str(target),
        ]
    )


def render_audio(source: Path, target: Path, start: float, duration: float) -> None:
    run(
        [
            require_tool("ffmpeg"),
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-i",
            str(source),
            "-ss",
            f"{start:.6f}",
            "-t",
            f"{duration:.6f}",
            "-map",
            "0:a:0",
            "-vn",
            "-c:a",
            "pcm_s16le",
            str(target),
        ]
    )


def render_frame(source: Path, target: Path, timestamp: float) -> None:
    run(
        [
            require_tool("ffmpeg"),
            "-hide_banner",
            "-loglevel",
            "error",
            "-y",
            "-ss",
            f"{timestamp:.6f}",
            "-i",
            str(source),
            "-frames:v",
            "1",
            "-vf",
            "scale='min(960,iw)':-2",
            "-q:v",
            "5",
            str(target),
        ]
    )


def prepare(args: argparse.Namespace) -> dict[str, Any]:
    source = args.input.expanduser().resolve()
    output_dir = args.output_dir.expanduser().resolve()
    if not source.is_file():
        raise RuntimeError(f"input video does not exist: {source}")
    if args.overwrite:
        remove_previous_outputs(output_dir)
    elif (output_dir / "manifest.json").exists():
        raise RuntimeError("manifest already exists; use --overwrite to replace prepared outputs")

    output_dir.mkdir(parents=True, exist_ok=True)
    source_dir = output_dir / "source_segments"
    audio_dir = output_dir / "audio_segments"
    frame_dir = output_dir / "inspection_frames"
    source_dir.mkdir(exist_ok=True)
    audio_dir.mkdir(exist_ok=True)
    frame_dir.mkdir(exist_ok=True)

    metadata = probe(source)
    cuts = [] if args.skip_scene_detection else detect_scene_cuts(source, args.scene_threshold)
    boundaries = plan_boundaries(metadata["duration_seconds"], cuts, args.max_seconds, args.min_seconds)
    segments: list[dict[str, Any]] = []
    tolerance = max(0.12, 2 / max(1.0, parse_frame_rate(metadata["avg_frame_rate"])))

    for index, (start, end) in enumerate(zip(boundaries, boundaries[1:]), start=1):
        segment_id = f"segment_{index:04d}"
        planned_duration = end - start
        video_path = source_dir / f"{segment_id}.mp4"
        render_segment(source, video_path, start, planned_duration)
        actual_duration = media_duration(video_path)
        if actual_duration > args.max_seconds + tolerance:
            raise RuntimeError(f"prepared segment exceeds {args.max_seconds}s: {video_path} ({actual_duration:.3f}s)")

        audio_path: Path | None = None
        if metadata["has_audio"]:
            audio_path = audio_dir / f"{segment_id}.wav"
            render_audio(source, audio_path, start, planned_duration)

        frame_paths: list[str] = []
        for frame_index, ratio in enumerate((0.1, 0.5, 0.9), start=1):
            frame_path = frame_dir / f"{segment_id}_{frame_index}.jpg"
            render_frame(source, frame_path, min(end - 0.001, start + planned_duration * ratio))
            frame_paths.append(str(frame_path))

        segments.append(
            {
                "id": segment_id,
                "order": index,
                "start_seconds": start,
                "end_seconds": end,
                "planned_duration_seconds": planned_duration,
                "actual_duration_seconds": actual_duration,
                "source_video": str(video_path),
                "source_audio": str(audio_path) if audio_path else None,
                "inspection_frames": frame_paths,
                "replaceable_slots": {"people": [], "background": None, "status": "needs_visual_review"},
                "verification": {"status": "passed", "maximum_seconds": args.max_seconds},
            }
        )

    manifest = {
        "schema_version": 1,
        "status": "prepared",
        "mode": "artarch_canvas_depth_reenactment",
        "source": source_fingerprint(source),
        "source_media": metadata,
        "segmentation": {
            "scene_threshold": None if args.skip_scene_detection else args.scene_threshold,
            "minimum_seconds": args.min_seconds,
            "maximum_seconds": args.max_seconds,
            "detected_scene_cuts_seconds": cuts,
            "boundaries_seconds": boundaries,
        },
        "segments": segments,
        "next_action": "Inspect every compressed frame, identify stable people and background slots, then create the ArtArch canvas without running generation.",
    }
    manifest_path = output_dir / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    return manifest


def parse_frame_rate(raw: str) -> float:
    try:
        numerator, denominator = raw.split("/", 1)
        return float(numerator) / float(denominator)
    except (ValueError, ZeroDivisionError):
        return 0.0


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", type=Path, required=True)
    parser.add_argument("--output-dir", type=Path, required=True)
    parser.add_argument("--max-seconds", type=float, default=15.0)
    parser.add_argument("--min-seconds", type=float, default=4.0)
    parser.add_argument("--scene-threshold", type=float, default=0.35)
    parser.add_argument("--skip-scene-detection", action="store_true")
    parser.add_argument("--overwrite", action="store_true")
    return parser


def main() -> int:
    try:
        args = build_parser().parse_args()
        if args.max_seconds > 15:
            raise RuntimeError("--max-seconds must not exceed 15 for the canvas reference-video contract")
        manifest = prepare(args)
        print(json.dumps(manifest, ensure_ascii=False))
        return 0
    except (RuntimeError, ValueError, subprocess.CalledProcessError, json.JSONDecodeError) as exc:
        print(f"error: {exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
