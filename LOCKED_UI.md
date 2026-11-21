# MK Day App — Protected UI Areas (Lock Checkpoint)

**Checkpoint date:** 2026-11-21  
**Base:** main at the time this lock was established  
**Backup branch:** `backup-main-2026-11-21-ui-lock-checkpoint`

## Locked areas — do not change without explicit user confirmation and unlocking first

1. Report/Guard menu and its placement/order.
2. Top/header bar and its arrangement.
3. Clock/time display and its placement.
4. Profile area and its placement.
5. Contact section and its placement.
6. Main menu list and menu arrangement.
7. Bottom navigation bar, icons, labels, order, and placement.

## Change-control rule

- These protected areas are considered approved and locked.
- Before any coding task that may affect a locked area, explain which protected area may be affected and ask the user for confirmation.
- Do not proceed on a potentially impactful change until the user explicitly approves unlocking that area.
- When approved, unlock only the specific affected area(s), not the entire UI.
- Create a new backup branch from the current `main` **before every coding task**.
- Work on a dedicated feature branch. Keep the task isolated and avoid unrelated changes.
- If something breaks, restore from the task backup/checkpoint and report what was restored.
- After completing the task, ask the user to approve re-locking the affected area(s); preserve the approved state.

## Lock is a workflow safeguard

This document records the project workflow and protected scope. It does not itself enforce GitHub branch permissions or technically prevent code edits. The assistant must follow this change-control rule and obtain confirmation before touching protected UI.
