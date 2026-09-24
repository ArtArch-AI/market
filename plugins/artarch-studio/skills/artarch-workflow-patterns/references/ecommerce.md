# Ecommerce Content Canvas

## Purpose

Produce a controlled family of marketplace and campaign images from one canonical
product asset. Use it for listing images, PDP secondary images, lifestyle scenes,
detail shots, A+ hero modules, social crops, and paid-ad variants.

## Topology

`product truth brief -> P0 canonical product -> listing system -> parallel channel derivatives`

Recommended groups:

1. `01 Product truth and brief`
2. `02 Canonical product`
3. `03 Marketplace derivatives`

The canonical product output must feed every derived image that needs product
fidelity. Do not regenerate the product independently in each branch.

## Product truth contract

Record category, silhouette, dimensions, materials, finish, packaging geometry,
label and logo spelling, fixed colors, movable parts, contents, target channel,
and prohibited claims. Prefer a real uploaded product image for production. The
maintained canvas uses a fictional serum bottle only to demonstrate topology.

## Example nodes

- `Product truth + channel brief`: visible invariants and channel scope.
- `P0 Canonical product master`: clean catalog view used as product authority.
- `Listing-set prompt contract`: ordered deliverables and preservation rules.
- `P1 Marketplace image set`: consistent secondary-image visual system.
- `P2 Lifestyle use scene`: product in context without altering packaging.
- `P3 Material and detail`: macro evidence of material or mechanism.
- `P4 A+ hero banner`: wide campaign asset with safe copy space.

## Example prompt pattern

`deliverable -> product authority -> composition -> physical light -> material evidence -> channel crop -> copy-safe space -> invariants`

Example:

> 16:9 A+ hero artwork using the canonical amber serum bottle as the only product
> authority. Bottle on the right third, soft clinical daylight, translucent serum
> and glass edge detail visible, calm white and sage environment, generous empty
> space on the left for deterministic copy layout. Preserve bottle geometry,
> label, cap, logo, material, and color exactly. Render no text.

## Acceptance

Reject a set when variants alter product truth, when the primary product becomes
too small for the channel, or when generated copy is presented as final without a
legibility and claim review.
