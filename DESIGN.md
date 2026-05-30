# Design Brief

## Direction

Lottery Celebration — vibrant, optimistic simulator celebrating the thrill of drawing lucky numbers.

## Tone

Playful and approachable with energetic celebration vibes; bright, friendly consumer-facing interface.

## Differentiation

Bold circular number badges with glowing gold animation on winning matches create immediate visual reward.

## Color Palette

| Token      | OKLCH       | Role                                |
| ---------- | ----------- | ----------------------------------- |
| background | 0.98 0.008 60  | Clean warm cream, relaxed          |
| foreground | 0.18 0.02 280  | Deep navy text, high contrast       |
| card       | 1.0 0.004 60   | Bright white card surface           |
| primary    | 0.55 0.22 280  | Rich royal blue, main CTA           |
| accent     | 0.7 0.25 70    | Vibrant gold, winning number glow   |
| muted      | 0.94 0.02 280  | Subtle grey, inactive states        |

## Typography

- Display: Bricolage Grotesque — headings, hero text, number badges
- Body: Plus Jakarta Sans — labels, button text, body copy
- Scale: hero `text-5xl font-bold tracking-tight`, h2 `text-3xl font-bold`, label `text-sm font-semibold`, body `text-base`

## Elevation & Depth

Centered content card on full-height background with elevated shadow; single-page layout minimizes depth layers.

## Structural Zones

| Zone    | Background          | Border | Notes                              |
| ------- | ------------------- | ------ | ---------------------------------- |
| Header  | bg-background       | —      | App title and subtitle             |
| Content | bg-card elevated    | —      | Centered card with numbers display |
| Footer  | bg-background       | —      | Minimal action zone                |

## Spacing & Rhythm

Generous spacing (gap-8, p-8) for breathing room; compact grouping within number badges (gap-2); consistent vertical rhythm.

## Component Patterns

- Buttons: Royal blue primary, gold accent highlights, rounded-lg, hover darken effect
- Cards: White bg-card with `shadow-lg` elevation, rounded-lg corners
- Badges: Circular number display, 60px diameter, muted grey until matched (gold glow + pulse animation)
- Labels: Small caps, bold weight, deep navy text

## Motion

- Entrance: Smooth fade-in (0.3s) on page load
- Hover: Button color shift, interactive opacity changes
- Decorative: Pulse animation on winning gold number badges (2s cycle)

## Constraints

- Single page, no navigation or multi-step flows
- Lottery numbers displayed as bold circular badges (1–49 range)
- Matched vs unmatched states clearly differentiated (color + animation)
- All colors derive from token system, no arbitrary colors

## Signature Detail

Glowing gold accent on matched lottery numbers with continuous pulse animation creates celebration moment.
