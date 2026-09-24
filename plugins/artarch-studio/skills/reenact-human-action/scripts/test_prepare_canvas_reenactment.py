import importlib.util
import unittest
from pathlib import Path


SCRIPT = Path(__file__).with_name("prepare_canvas_reenactment.py")
SPEC = importlib.util.spec_from_file_location("prepare_canvas_reenactment", SCRIPT)
MODULE = importlib.util.module_from_spec(SPEC)
assert SPEC and SPEC.loader
SPEC.loader.exec_module(MODULE)


class PlanBoundariesTest(unittest.TestCase):
    def test_prefers_scene_cuts_and_splits_long_scenes(self):
        boundaries = MODULE.plan_boundaries(34.0, [8.0, 19.0], 15.0, 4.0)
        self.assertEqual(boundaries, [0.0, 8.0, 19.0, 34.0])
        self.assertTrue(all(end - start <= 15.0 for start, end in zip(boundaries, boundaries[1:])))

    def test_ignores_too_short_scene_fragments(self):
        boundaries = MODULE.plan_boundaries(12.0, [1.0, 6.0, 11.0], 15.0, 4.0)
        self.assertEqual(boundaries, [0.0, 6.0, 12.0])

    def test_evenly_splits_a_long_scene(self):
        boundaries = MODULE.plan_boundaries(31.0, [], 15.0, 4.0)
        durations = [end - start for start, end in zip(boundaries, boundaries[1:])]
        self.assertEqual(len(durations), 3)
        self.assertTrue(all(duration <= 15.0 for duration in durations))


if __name__ == "__main__":
    unittest.main()
