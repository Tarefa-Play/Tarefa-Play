<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
>
> ## What Lovable manages
> Rules outside this block are the project's own. Change the pieces below in
> Lovable, not by hand. With the [Lovable MCP](https://mcp.lovable.dev)
> connected, `send_message` asks Lovable to do it; otherwise ask the user to
> use the editor.
>
> - **Database.** Do not add or edit `supabase/migrations/` or `drizzle/`.
>   Ask Lovable to change the schema.
> - **Generated files.** Do not edit a file whose header says it is automatically
>   generated.
> - **AI gateway.** Keep model calls on Lovable's gateway, and keep
>   `LOVABLE_API_KEY` out of browser code.
> - **Connectors.** Lovable provides native connectors. `list_connectors` shows
>   which are enabled; `add_connector` only returns the dashboard link. When a
>   connector is enabled, calls go through the connector gateway and need
>   `LOVABLE_API_KEY`. When Lovable does not provide one, users can bring their
>   own key and store it in Secrets.
> - **Secrets.** Lovable manages them. Do not put secret values in the repo.
<!-- LOVABLE:END -->

## Project overview
- Tarefa-Play is a Brazilian Portuguese, BRL, mobile-first platform. Use
  `America/Sao_Paulo` for product dates and times.
- The platform has three roles: `validador`, `anunciante`, and `admin`.
  Role-specific areas are `/validador`, `/anunciante`, and `/admin`.
- Follow the phase order in the project prompt document. Do not start Phase 3
  until Phases 1 and 2 have been audited, their acceptance criteria met, and
  the user has been told about any remaining limitations.
- Preserve completed work from earlier phases unless the user explicitly asks
  for a change. Pix, phone verification, and external integrations remain
  mocks/TODOs until their implementation phase.

## Authorization and role security
- Roles live only in `public.user_roles`; never store a role in `profiles`,
  signup metadata as an authoritative permission, or client-side storage.
- Use `public.has_role(user_id, role)` in database authorization policies.
  Client-side route guards improve navigation but are not a security boundary;
  RLS is authoritative.
- Signup may assign only `validador` or `anunciante`. Never allow public
  signup, editable user metadata, or client code to grant `admin`.
- Admin assignment must use an explicitly authorized, trusted administrative
  procedure. Do not create test accounts, promote users, or change real user
  roles without the user's explicit approval.
- Keep each role's route area guarded and ensure users cannot access another
  role's data by changing a URL or calling the API directly.

## Database ownership and migration workflow
- Lovable Cloud is the source of truth and owner for this project's database.
  **All schema, policy, function, trigger, and migration changes must be made
  through the Lovable Cloud agent/workflow.**
- Never create, edit, or apply database migrations through GitHub, local SQL
  scripts, CI, or manual edits to `supabase/migrations/` or `drizzle/`.
  GitHub PRs may update application code and this documentation, but must not
  be used to bypass Lovable's database workflow.
- Before proposing or applying a database change, inspect the live database
  read-only. Compare actual tables, columns, constraints, indexes, grants,
  RLS flags, policies, functions, triggers, and relevant seed data with the
  intended state. Do not assume that a pasted bootstrap script is absent or
  safe to rerun.
- Treat existing production data as valuable. Prefer the smallest additive
  change that resolves a verified discrepancy. Do not drop/recreate objects,
  truncate tables, reset the database, or reinsert seed data to make the schema
  match a reference script.
- Database changes must be narrowly scoped, safe to retry where possible,
  and compatible with existing data. Check for existing objects before
  creating them; use idempotent operations when supported by Lovable's
  workflow. Never claim a migration ran unless Lovable confirms it and a
  read-only post-migration inspection verifies the resulting state.
- Before applying a migration, explain its purpose, exact objects affected,
  expected data impact, and rollback/recovery approach. Obtain explicit user
  approval for production data changes or any operation that can delete,
  overwrite, expose, or materially alter user data. A prior general request to
  fix the project is not approval for unrelated destructive changes.
- After a migration, verify the intended objects and definitions in the live
  database, confirm existing RLS and grants remain correct, and run relevant
  application tests. Report what was changed and what could not be verified.
- If Lovable Cloud actions, workspace credits, permissions, or service limits
  prevent inspection or migration, stop. Report the exact blocker; do not
  switch to a GitHub/local SQL workaround or report success.

## Database security baseline
- Enable RLS on every exposed application table. Review grants and policies
  together: SQL privileges alone do not grant row access, and RLS does not
  replace least-privilege grants.
- Policies must enforce least privilege for `anon`, `authenticated`, and
  `service_role`. Public reads must be intentional and limited to the
  necessary tables/columns.
- Use `SECURITY DEFINER` only when required. Every such function must set a
  safe, fixed `search_path`, qualify object names, and expose only the
  minimum required behavior. Review function ownership and execute grants.
- Never let signup or user-controlled metadata create privileged roles.
  Prevent users from changing their own role assignments.
- Audit sensitive mutations, including role, configuration, and category
  changes. Audit records must not expose passwords, auth tokens, secrets,
  full payment credentials, or unnecessary personal data. For profile changes,
  record the profile ID and changed field names only; do not copy names,
  telephone numbers, or full OLD/NEW row values into the audit log.
- Do not weaken or remove RLS policies to make a UI operation work. Fix the
  authorization flow and verify the affected operation under the intended
  authenticated role.

## Application and product rules
- Each role has its own route area and layout. Route guards are in
  `src/components/role-area.tsx`; keep database authorization in RLS.
- Read business values, limits, and deadlines from `public.configuracoes`,
  never hardcode them in application logic.
- Money must use an immutable ledger; do not update historical ledger entries
  to correct balances. Record compensating entries instead.
- Register sensitive actions in the audit log while minimizing personal data.
- Never promise or guarantee earnings in public-facing copy. State that
  earnings vary and are not guaranteed.
- Keep Pix and phone verification as mocks/TODOs until their planned phase.
- Do not represent planned integrations or real-world task verification as
  already available when they are still mocked or unimplemented.

## Testing and delivery
- For application changes, add or update focused tests and run the repository's
  CI checks (tests and production build).
- For authorization changes, test both allowed and denied cases. A passing
  client-side test does not prove database RLS; live RLS verification requires
  authorized test sessions and must not be simulated as a production result.
- Do not create test users, send emails, or mutate production records merely
  to make a test pass unless the user explicitly authorizes that exact action.
- Use a feature branch and pull request for GitHub changes. Do not merge into
  `main`; the user performs the merge. Include the PR and CI run links in
  status updates, and distinguish code CI success from live database
  verification.
