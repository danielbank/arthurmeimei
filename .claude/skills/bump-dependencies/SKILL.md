---
name: bump-dependencies
description: Check and upgrade this repo's pnpm dependencies (single Next.js package).
disable-model-invocation: true
---

This is a single-package **pnpm** repo (`pnpm@9.14.2`, lockfile `pnpm-lock.yaml`). There is one dependency ecosystem — the npm packages in `package.json`.

1. **Survey** outdated packages:

   ```bash
   pnpm outdated
   ```

2. **Sweep the low-risk bumps**: upgrade the patch and minor versions, writing exact versions:

   ```bash
   pnpm add <pkg>@<version> --save-exact
   ```

   Every version in `package.json` is pinned exact (no `^`). This repo sets no `save-prefix`/`save-exact` config, so a bare `pnpm add` writes a floating `^` range — always pass `--save-exact` to preserve the convention. Use `--save-dev` for `devDependencies`. Done when every outdated patch/minor dependency is either bumped or listed with the reason it was skipped.

3. **Gate the majors**: list the remaining major bumps and ask the user which to take. For each approved major, research the migration first (use the `research` skill to find migration guides and the new version's API patterns), then upgrade. Watch the tightly-coupled sets — `next` / `eslint-config-next`, `react` / `react-dom` / `@types/react`, `tailwindcss` / `@tailwindcss/*`, `contentlayer2` / `next-contentlayer2` — and bump each set together.

4. **Verify**: this repo has no `test` script, so the health gate is typecheck, lint, and a clean production build (it deploys on Vercel, so the build must pass):

   ```bash
   pnpm exec tsc --noEmit
   pnpm lint
   pnpm build
   ```

   Done when all three pass. Commit `package.json` and the updated `pnpm-lock.yaml` together.

## Security overrides

Security pins live in `pnpm.overrides` in `package.json` (e.g. `"@grpc/grpc-js@<1.14.4": ">=1.14.4"`). When a bumped or transitive package makes an override redundant (the resolved version already satisfies it), drop the stale override rather than leaving it to accumulate — verify with `pnpm why <pkg>` before removing. Re-run `pnpm install` after editing overrides so the lockfile reflects them.
