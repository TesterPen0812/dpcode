# DP Code Mobile/PWA Benchmark Spec

## Objective

Turn DP Code into a polished, fully working mobile web/PWA experience that visually matches the existing desktop app while fitting phone screens perfectly.

This is an independent implementation benchmark. You are working alone. Do not coordinate with another agent. Do not wait for another branch. Do not design for future collaboration. Produce your best complete solution from this repository state.

## Product goal

The existing app should become usable on mobile phones as if it were a real mobile app, while preserving the desktop experience.

The fastest acceptable delivery is a production-quality responsive web app/PWA. A native wrapper is optional only if the mobile web/PWA work is already stable.

## Non-negotiable requirements

1. Preserve the desktop layout and behavior.
2. Make the app work well at these widths:
   - 360px
   - 375px
   - 390px
   - 414px
   - 430px
3. No horizontal scrolling on core screens.
4. All primary workflows must be touch-friendly.
5. Tap targets should be at least 44px where practical.
6. The mobile UI must visually match the desktop app's design language.
7. Do not create a separate toy mobile prototype.
8. Do not remove existing functionality to make mobile easier.
9. Handle mobile viewport height, safe areas, virtual keyboard behavior, and scroll issues.
10. Run the project checks before finishing.

## Areas to inspect

Inspect the repo before coding, especially:

- apps/web
- apps/server
- apps/desktop
- shared UI components
- routing
- layout components
- session/chat views
- terminal/log/code/diff views
- settings/modals/dialogs
- package scripts
- existing styling system

## Expected mobile behavior

The mobile version should use appropriate phone patterns:

- Desktop sidebars should become drawers, sheets, or mobile navigation.
- Multi-pane desktop layouts should become stacked, tabbed, or sheet-based layouts.
- Primary session/chat/agent output should be prioritized.
- Terminal, logs, code, diffs, and secondary panels should remain accessible.
- Composer/input area should remain usable when the mobile keyboard is open.
- Hover-only actions should have touch alternatives.
- Dialogs should become mobile-friendly full-screen overlays or bottom sheets where appropriate.
- Navigation should be reachable without keyboard shortcuts.

## PWA expectations

Add or improve:

- mobile viewport metadata
- manifest
- app icons if practical
- installable app behavior if practical
- safe-area support
- mobile browser polish
- sensible offline/error fallback if practical

## Subagent usage

You are strongly encouraged to use any available subagents, parallel agents, delegated workers, or internal review agents as much as useful.

You may delegate work for:

- repository exploration
- responsive layout analysis
- mobile UX implementation
- PWA implementation
- code review
- regression checking
- accessibility review
- build/test debugging
- manual verification planning
- PR summary writing

However:

- You remain responsible for the final implementation.
- Subagents must follow this same spec.
- Subagents must not inspect or reference another benchmark branch.
- Subagents must not coordinate with a competing implementation.
- Subagents must not change the benchmark starting branch.
- All work must remain on your assigned branch.
- Final output must clearly describe the actual changes made and checks run.

## Technical constraints

- Prefer adapting existing components over duplicating the app.
- Avoid large dependency additions unless clearly justified.
- Keep changes idiomatic to the current stack.
- Do not break existing routes.
- Do not break desktop.
- Keep the implementation maintainable.

## Required checks

Run whatever scripts are available and relevant. At minimum, attempt:

```bash
bun install
bun run typecheck
bun run test
bun run build
```

If a command fails because of pre-existing repo issues, document that clearly and continue with the remaining checks.

## Manual verification

Verify the main app screens at:

- 360px
- 375px
- 390px
- 414px
- 430px

Also check one landscape phone viewport if possible.

## Final answer format

When finished, report:

1. Summary of changes
2. Main files changed
3. Mobile behavior implemented
4. PWA behavior implemented
5. Commands run and results
6. Viewports tested
7. Known limitations
8. Subagents used and what they reviewed or implemented
9. Anything that still needs human review

## Definition of done

A user can open DP Code on a phone, navigate the app, start or use a coding-agent session, read outputs, type prompts, access settings/actions, and manage the core workflow without fighting the layout.

The mobile UI should feel like DP Code on a phone, not like a stripped-down clone.
