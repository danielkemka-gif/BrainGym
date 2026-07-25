# BrainGym Design Implementation Checklist

This checklist focuses on replacing the marketing hero and onboarding visuals with the new premium illustration system.

## 1. Generate illustration drafts
- Use `DESIGN_PROMPTS.md` to generate 5 concept art options.
- Select one hero illustration for the marketing homepage.
- Select one onboarding illustration for the welcome/onboarding flow.
- Prefer artwork with blue/purple/cyan gradients and subtle glowing depth.

## 2. Add assets to the repo
- Create `public/illustrations/hero-ai-brain.png` or `.svg`.
- Create `public/illustrations/onboarding-transformation.png` or `.svg`.
- Optionally add `public/illustrations/hero-ai-brain@2x.png` for high DPI.

## 3. Implement marketing hero update
- Replace the generic hero background in `src/app/(marketing)/page.tsx`.
- Add a new illustration container or `next/image` component for the hero asset.
- Keep the current headline, CTA, and category chips but update spacing around the illustration.
- Use a subtle dark gradient or glass panel behind the artwork to integrate it with the page.

## 4. Implement onboarding visual upgrade
- Enhance `src/app/(onboarding)/onboarding/page.tsx` with a hero illustration at the top.
- Consider adding the illustration above or beside the `OnboardingWizard` component.
- Use a transformational progress metaphor: path, growth, milestones.
- Keep the screen visually light, with clean spacing and modern layout.

## 5. Adjust supporting design tokens
- Update color palette references if needed to match the new hero art.
- Use more premium gradients in hero/background surfaces.
- Ensure text contrast and readability remain strong.

## 6. Review and iterate
- Check the implementation on mobile and desktop screen sizes.
- Validate that the new visuals feel premium and not cluttered.
- Confirm consistency with the recommendation in `DESIGN_UPGRADE_PLAN.md`.

## Optional next step
- Replace icon-heavy onboarding cards with subtle micro-illustrations using the same visual system.
- Add small branded illustration accents to the feature section on the marketing page.
