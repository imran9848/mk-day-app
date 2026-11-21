# MK Day App — Protected Home Screen Rules

Last updated: 2026-11-21 (Bangladesh time)

## Status
The Home Screen fixes completed up to this date are treated as protected/stable. Do not casually redesign, remove, overwrite, or regress them while working on other parts of the app.

## Protected work areas
- Home Screen layout and header/profile area
- Responsive Home Screen behavior in split-screen and full-screen
- Contact card, contact search, and visible contact-row sizing/scroll behavior
- Add-contact floating control positioning
- Existing Home Screen calculations, data bindings, and action handlers
- Bottom navigation placement/theme that is already restored (unless the user explicitly requests changes to it)

## Current responsive contact-list target
- Full-screen: show 5 contacts when space allows.
- Small split-screen: show 2 contacts.
- Medium split-screen: show 3 contacts.
- Contact-card border/box may be shifted lower or expanded to allocate row space; search/caption can move lower as needed.
- Floating Add Contact control may remain in place or move slightly upward if necessary.
- These targets are user-requested. Do not claim they are verified on a physical device unless tested there.

## Protected changes history
- PR #95: Home contact list expansion after split-screen resize.
- PR #96: responsive contact count attempt.
- PR #97: increase Home contact list visible height responsively.
- Main deployment for PR #97 was reported as successful, but real-device rendering remains unverified.

## Change-scope rules for future work
1. Work only on the component/screen explicitly requested by the user.
2. When working on the bottom menu bar, do not change Home Screen contact-card sizing, contact rows, search, header, profile, calculations, or handlers.
3. Do not make broad global CSS/JS changes when a narrow scoped fix will do.
4. Before editing, inspect the existing code and all relevant CSS overrides; avoid adding another conflicting override block without understanding the cascade.
5. If a protected area must change to enable the requested feature, explain why and keep the change minimal.
6. Before any changes, create a dated backup branch from the current main.
7. Make changes on a feature branch, inspect the diff, run available checks, and merge only after the change is limited to the requested scope and checks pass.
8. After deployment, confirm GitHub Actions/Pages status. Be honest: a successful deployment does not prove the user's device layout is correct.
9. Never replace or revert existing user-approved functionality while implementing another task.
10. If a regression is suspected, stop new design work and diagnose the existing code/layout before applying another patch.

## Next task
The next requested work area is the bottom menu bar at the bottom of the Home Screen. Treat it as a separate scoped task and preserve all protected areas above.
