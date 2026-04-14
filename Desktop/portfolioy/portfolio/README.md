# Alex Voss — Creative Developer Portfolio

A premium, Awwwards-level portfolio built with Next.js 14, Three.js, GSAP, and Lenis smooth scroll.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) |
| 3D / WebGL | Three.js + custom GLSL shaders |
| Animation | GSAP + ScrollTrigger |
| Smooth Scroll | Lenis |
| Styling | CSS Modules |
| Language | TypeScript |

## Features

- **Cinematic loader** — animated counter with curtain-reveal transition
- **WebGL particle field** — 1800 particles with custom vertex/fragment shaders, mouse repulsion, additive blending
- **GSAP ScrollTrigger** — every section has scroll-driven reveal animations
- **Lenis smooth scroll** — buttery 60fps scroll integrated with GSAP ticker
- **Custom cursor** — dot + ring with magnetic hover states and "VIEW" label
- **Floating project preview** — ghost card follows cursor on project hover
- **Magnetic CTA button** — follows cursor proximity on hover
- **Film grain overlay** — animated CSS noise texture
- **Responsive** — works on all screen sizes

## Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# 1. Navigate into the project folder
cd portfolio

# 2. Install dependencies (takes ~60 seconds)
npm install

# 3. Start the dev server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000)

### Production build

```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   └── page.tsx            # Entry point, orchestrates all sections
├── components/
│   ├── Loader/             # Cinematic loading screen
│   ├── Cursor/             # Custom cursor with magnetic effects
│   ├── Nav/                # Fixed navigation with hide-on-scroll
│   ├── Hero/
│   │   ├── Hero.tsx        # Hero section with GSAP text reveal
│   │   └── ParticleField.tsx  # Three.js WebGL particle system
│   ├── About/              # Animated about section + stats
│   ├── Projects/           # Interactive project list with floating preview
│   └── Contact/            # Animated contact form + magnetic button
├── hooks/
│   └── useLenis.ts         # Lenis smooth scroll + GSAP integration
└── styles/
    └── globals.css         # CSS variables, resets, grain animation
```

## Key Animation Details

### Particle Field (Three.js + GLSL)
- Custom vertex shader handles per-particle drift using sin/cos with individual speed + offset attributes
- Mouse repulsion calculated in clip space using NDC coordinates
- Fragment shader renders soft glowing dots with radial falloff
- Additive blending creates luminous overlapping effect
- Two particle layers at different scales/rotations for depth

### GSAP ScrollTrigger Integration
- Each section uses `scrollTrigger: { start: "top 75%" }` for staggered reveals
- Headline words use `yPercent: 110` + `rotate: 3` for a masked-clip character
- Lenis scroll events pipe into `ScrollTrigger.update` for synchronized scrub animations

### Lenis + GSAP Ticker
```js
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0); // critical for 60fps
```

## Customization

1. **Content** — Edit text in each component file (projects, bio, email, etc.)
2. **Colors** — Change CSS variables in `globals.css` (`:root` block)
3. **Particles** — Adjust `COUNT`, `uColor`, `uMouseRadius` in `ParticleField.tsx`
4. **Fonts** — Swap Google Fonts imports in `globals.css` + update `--font-*` variables

## Performance Notes

- `devicePixelRatio` capped at 1.5 for WebGL renderer
- `will-change: transform` on cursor elements only
- Particles use `depthWrite: false` + `THREE.AdditiveBlending` — no overdraw penalty
- All GSAP imports are dynamic (`await import(...)`) to avoid SSR issues
- Images are lazy-loaded; Three.js canvas is pointer-events none
