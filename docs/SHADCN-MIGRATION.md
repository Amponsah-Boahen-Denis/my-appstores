# Shadcn Migration Notes

This repo contains an in-progress migration to a shadcn-style design system (Tailwind + small UI primitives).

What was added so far
- `src/components/ui/*` primitives: `button`, `input`, `label`, `card`, `checkbox`, `badge`, `icon`.
- `src/lib/utils.ts` with `cn()` helper.
- Several pages/components were updated to use the primitives (Login, Signup, Home, Footer, LayoutToggle).

Next steps to complete full migration
1. Create or adapt remaining primitives (select, textarea, dialog/modal, dropdown, tooltip, avatar).
2. Migrate `src/components/*` shared components to use primitives.
3. Migrate `src/features/*` components in phases (search, results, store forms first).
4. Run `npm run build` and fix any runtime/type issues.
5. Move changes to a dedicated branch `shadcn-migration` and open a PR.

Dev notes
- Dependencies installed: `class-variance-authority`, `tailwind-merge`, `lucide-react`.
- For icons we use `lucide-react` via `src/components/ui/icon.tsx`.

How to continue locally
1. Run `npm install` to ensure deps are present.
2. Run `npm run dev` and review pages.
3. Incrementally migrate components and confirm build.
