# BrainGym Visual Asset Inventory & Screen Mapping

This inventory summarizes the current visual assets and proposes where the new premium illustration concepts should be applied.

## Current visual asset landscape

### 1. Logo and brand assets
- `public/logo.png` — app logo
- `public/favicon.png` — favicon
- `public/og-image.png` — Open Graph cover image
- `public/x-logo.jpg`, social icons for sharing links

### 2. Illustration and visual usage
- No dedicated hero illustrations or branded onboarding graphics found in `src/`.
- Marketing and dashboard pages rely on:
  - Lucide icons (`Brain`, `Target`, `Zap`, `Award`, etc.)
  - emoji-style progress icons in dashboard and achievement components
  - gradient background effects, soft glows, and dot-grid texture overlays

### 3. Current visual patterns
- Primary marketing hero uses a blurred gradient circle and dot grid background, but no unique illustration.
- Onboarding prompt uses icon cards and emoji chips, not a central illustration.
- Dashboard and feature screens use simple icon cards, not premium visual storytelling.
- The app currently leans on UI components and iconography rather than a cohesive illustration system.

## Key screens for new visual concepts

### Landing / Marketing homepage (`src/app/(marketing)/page.tsx`)
- Replace the current generic hero section with one of these concepts:
  - **Futuristic AI Brain** for a premium lead hero
  - **Neural Network Growth** for a subtly scientific first impression
- Use the illustration as the hero centerpiece with supporting headline and CTA buttons.

### Onboarding flow (`src/app/(onboarding)/onboarding/page.tsx` + `src/components/onboarding/onboarding-wizard.tsx`)
- Add a branded visual system to the onboarding screens:
  - **Cognitive Transformation Journey** for the initial welcome screen
  - **Brain Gym / Mental Workout** for workout / habit formation steps
- Use concept art to make onboarding feel aspirational and intuitive.

### Dashboard welcome / prompt (`src/components/dashboard/onboarding-prompt.tsx`)
- Convert the current emoji/icon prompt into a premium micro-illustration card.
- Use **Brain Power Achievement System** visuals to make prompts feel motivating.

### Features section and marketing cards (`src/app/(marketing)/page.tsx` features block)
- Replace or augment icon cards with small abstract visuals derived from the new illustration system.
- Use line-based neural motifs and micro-illustrations around each key feature.

### AI Coach screen and premium feature pages
- Apply **Futuristic AI Brain** and **Neural Network Growth** visuals across AI Coach and Decision Lab pages.
- Add subtle branded background graphics to frame chat and analysis panels.

### App store screenshot / promotional marketing
- Use the generated image prompts to create app store screenshot layouts and social promo art.
- Recommended screenshot concepts:
  - Brain progress dashboard with achievement badge
  - AI coach card with neural brain accent
  - Daily workout summary screen with motion and glowing nodes

## Recommended visual upgrade rollout

1. **Hero illustration for marketing page** — high-impact first impression.
2. **Onboarding system graphics** — improve early retention and enjoyment.
3. **Dashboard prompt/feature visuals** — add consistency and delight.
4. **Achievement and progress visuals** — increase motivation and perceived value.
5. **Icon/system refinement** — replace emoji icons with premium iconography.

## Suggested asset structure

- `public/illustrations/` — final PNG/SVG previews for hero and onboarding art
- `src/components/illustrations/` — React wrappers for illustration assets
- `src/components/visual-system/` — shared gradient/shape components for background treatments

## Recommended next step
- Generate 5 premium illustration drafts using `DESIGN_PROMPTS.md`.
- Choose 1 hero illustration and 1 onboarding illustration to implement first.
- Replace top-level marketing and onboarding hero sections with the new artwork.
- Update icons in the feature and achievement flows to match the new premium style.
