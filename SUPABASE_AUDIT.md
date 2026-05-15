# Supabase Audit

- Generated: 2026-05-15T12:53:35.685066+00:00
- Repo root: `C:\Users\dell\Desktop\SQUAD HACKATHON`
- Project-scoped MCP server: `prova-supabase`
- MCP transport: hosted streamable HTTP
- Scoped URL: `https://isrrqqdncniqtbjkyasn.supabase.co/` via `https://mcp.supabase.com/mcp?project_ref=isrrqqdncniqtbjkyasn&read_only=true`
- MCP auth source: local bearer token from `.env.local` reused without printing the secret
- Live SQL connection check: database `postgres`, user `supabase_read_only_user`

## Instructions Loaded

- [AGENTS.md](AGENTS.md) created from repo instructions
- [copilot-instructions](C:\Users\dell\Desktop\SQUAD HACKATHON\.github\copilot-instructions.md)
- [docs-first instructions](C:\Users\dell\Desktop\SQUAD HACKATHON\.github\instructions\docs-first.instructions.md)
- [live-info instructions](C:\Users\dell\Desktop\SQUAD HACKATHON\.github\instructions\live-info.instructions.md)
- [README](C:\Users\dell\Desktop\SQUAD HACKATHON\README.md)
- [workspace MCP config](C:\Users\dell\Desktop\SQUAD HACKATHON\.vscode\mcp.json)

## Environment And MCP Config

- `.env.local` project ref: `isrrqqdncniqtbjkyasn`
- `.env.local` URL: `https://isrrqqdncniqtbjkyasn.supabase.co`
- `.env.local` publishable key: `sb_pub...poe9OA`
- `.env.local` anon key variable value: `sb_pub...poe9OA`
- `.env.local` access token: present and reused for MCP auth
- `.vscode/mcp.json` contains a project-ref-scoped Supabase server config using `.env.local`
- `~/.codex/config.toml` now contains a distinct `prova-supabase` server; no existing Supabase project server was reused

## Live Project Identity

- Project ref connected: `isrrqqdncniqtbjkyasn`
- Live project URL: `https://isrrqqdncniqtbjkyasn.supabase.co`
- Live default publishable key: `sb_pub...poe9OA`
- Live legacy anon key present: `True`
- Installed extensions: `pgcrypto@1.3`, `plpgsql@1.0`, `uuid-ossp@1.1`, `pg_stat_statements@1.11`, `supabase_vault@0.3.1`
- Live migrations: `20260511220120_enable_pgcrypto`, `20260511220527_create_prova_base_schema`

## Schema Summary

| Schema | Table | Exact rows | RLS | Policy count |
| --- | --- | ---: | --- | ---: |
| `public` | `audit_events` | 9 | true | 4 |
| `public` | `beneficiaries` | 6 | true | 6 |
| `public` | `payout_batches` | 0 | true | 2 |
| `public` | `payout_items` | 0 | true | 2 |
| `public` | `profiles` | 4 | true | 5 |
| `public` | `programs` | 2 | true | 3 |
| `public` | `verification_results` | 1 | true | 2 |
| `public` | `verification_rules` | 3 | true | 1 |
| `public` | `verification_submissions` | 2 | true | 3 |
| `auth` | `audit_log_entries` | 0 | true |  |
| `auth` | `custom_oauth_providers` | 0 | false |  |
| `auth` | `flow_state` | 0 | true |  |
| `auth` | `identities` | 4 | true |  |
| `auth` | `instances` | 0 | true |  |
| `auth` | `mfa_amr_claims` | 1 | true |  |
| `auth` | `mfa_challenges` | 0 | true |  |
| `auth` | `mfa_factors` | 0 | true |  |
| `auth` | `oauth_authorizations` | 0 | false |  |
| `auth` | `oauth_client_states` | 0 | false |  |
| `auth` | `oauth_clients` | 0 | false |  |
| `auth` | `oauth_consents` | 0 | false |  |
| `auth` | `one_time_tokens` | 1 | true |  |
| `auth` | `refresh_tokens` | 1 | true |  |
| `auth` | `saml_providers` | 0 | true |  |
| `auth` | `saml_relay_states` | 0 | true |  |
| `auth` | `schema_migrations` | 76 | true |  |
| `auth` | `sessions` | 1 | true |  |
| `auth` | `sso_domains` | 0 | true |  |
| `auth` | `sso_providers` | 0 | true |  |
| `auth` | `users` | 4 | true |  |
| `auth` | `webauthn_challenges` | 0 | false |  |
| `auth` | `webauthn_credentials` | 0 | false |  |
| `storage` | `buckets` | 0 | true |  |
| `storage` | `buckets_analytics` | 0 | true |  |
| `storage` | `buckets_vectors` | 0 | true |  |
| `storage` | `migrations` | 61 | true |  |
| `storage` | `objects` | 0 | true |  |
| `storage` | `s3_multipart_uploads` | 0 | true |  |
| `storage` | `s3_multipart_uploads_parts` | 0 | true |  |
| `storage` | `vector_indexes` | 0 | true |  |

## Public Domain Counts

- `programs`: 2
- `beneficiaries`: 6
- `verification_submissions`: 2
- `verification_results`: 1
- `payout_batches`: 0
- `payout_items`: 0
- `audit_events`: 9
- `verification_rules`: 3

## Auth Counts

- `auth.users`: 4
- `auth.identities`: 4
- `public.profiles`: 4
- admin profiles: 2
- beneficiary profiles: 2

## Transaction / Deposit / Order Stats

- No `transactions`, `deposits`, or `orders` tables exist in the live `public` schema.

## Edge Functions

| Function | verify_jwt | Status | Version | Local repo match |
| --- | --- | --- | ---: | --- |
| `bootstrap-admin` | false | `ACTIVE` | 3 | yes |
| `get-admin-dashboard` | false | `ACTIVE` | 3 | yes |
| `get-beneficiary-status` | false | `ACTIVE` | 3 | yes |
| `list-beneficiaries` | false | `ACTIVE` | 3 | yes |
| `run-verification-pipeline` | false | `ACTIVE` | 3 | yes |
| `squad-account-lookup` | true | `ACTIVE` | 5 | no |
| `squad-transfer` | true | `ACTIVE` | 5 | no |
| `submit-beneficiary-verification` | false | `ACTIVE` | 3 | yes |

### Local vs Live Function Delta

- Local function directories: `bootstrap-admin`, `get-admin-dashboard`, `get-beneficiary-status`, `list-beneficiaries`, `run-verification-pipeline`, `submit-beneficiary-verification`
- Live deployed functions: `bootstrap-admin`, `get-admin-dashboard`, `get-beneficiary-status`, `list-beneficiaries`, `run-verification-pipeline`, `squad-account-lookup`, `squad-transfer`, `submit-beneficiary-verification`
- Live-only functions: `squad-account-lookup`, `squad-transfer`
- Local-only functions: none

## Security Findings

- Advisor findings: 9
- `function_search_path_mutable` [WARN]: Function \`public.set_updated_at\` has a role mutable search_path ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0011_function_search_path_mutable))
- `rls_policy_always_true` [WARN]: Table `public.audit_events` has an RLS policy `audit_events_insert_authenticated` for `INSERT` that allows unrestricted access (WITH CHECK clause is always true). This effectively bypasses row-level security for authenticated. ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0024_permissive_rls_policy))
- `rls_policy_always_true` [WARN]: Table `public.beneficiaries` has an RLS policy `allow_all_beneficiaries_for_dev` for `ALL` that allows unrestricted access (both USING and WITH CHECK are always true). This effectively bypasses row-level security for -. ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0024_permissive_rls_policy))
- `rls_policy_always_true` [WARN]: Table `public.profiles` has an RLS policy `profiles_update_admin` for `UPDATE` that allows unrestricted access (WITH CHECK clause is always true). This effectively bypasses row-level security for authenticated. ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0024_permissive_rls_policy))
- `anon_security_definer_function_executable` [WARN]: Function `public.handle_new_user()` can be executed by the `anon` role as a `SECURITY DEFINER` function via `/rest/v1/rpc/handle_new_user`. Revoke `EXECUTE` or switch it to `SECURITY INVOKER` if that is not intentional. ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable))
- `anon_security_definer_function_executable` [WARN]: Function `public.sync_auth_user_profile()` can be executed by the `anon` role as a `SECURITY DEFINER` function via `/rest/v1/rpc/sync_auth_user_profile`. Revoke `EXECUTE` or switch it to `SECURITY INVOKER` if that is not intentional. ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0028_anon_security_definer_function_executable))
- `authenticated_security_definer_function_executable` [WARN]: Function `public.handle_new_user()` can be executed by the `authenticated` role as a `SECURITY DEFINER` function via `/rest/v1/rpc/handle_new_user`. Revoke `EXECUTE` or switch it to `SECURITY INVOKER` if that is not intentional. ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable))
- `authenticated_security_definer_function_executable` [WARN]: Function `public.sync_auth_user_profile()` can be executed by the `authenticated` role as a `SECURITY DEFINER` function via `/rest/v1/rpc/sync_auth_user_profile`. Revoke `EXECUTE` or switch it to `SECURITY INVOKER` if that is not intentional. ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0029_authenticated_security_definer_function_executable))
- `auth_leaked_password_protection` [WARN]: Supabase Auth prevents the use of compromised passwords by checking against HaveIBeenPwned.org. Enable this feature to enhance security. ([remediation](https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection))

## Performance Findings

- Advisor findings: 25
- `unindexed_foreign_keys` [INFO]: Table \`public.audit_events\` has a foreign key \`audit_events_actor_profile_id_fkey\` without a covering index. This can lead to suboptimal query performance. ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys))
- `unindexed_foreign_keys` [INFO]: Table \`public.payout_batches\` has a foreign key \`payout_batches_created_by_fkey\` without a covering index. This can lead to suboptimal query performance. ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys))
- `unindexed_foreign_keys` [INFO]: Table \`public.verification_results\` has a foreign key \`verification_results_created_by_fkey\` without a covering index. This can lead to suboptimal query performance. ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0001_unindexed_foreign_keys))
- `auth_rls_initplan` [WARN]: Table \`public.profiles\` has a row level security policy \`profiles_read_own\` that re-evaluates current_setting() or auth.<function>() for each row. This produces suboptimal query performance at scale. Resolve the issue by replacing \`auth.<function>()\` with \`(select auth.<function>())\`. See [docs](https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select) for more info. ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan))
- `auth_rls_initplan` [WARN]: Table \`public.beneficiaries\` has a row level security policy \`beneficiaries_insert_own\` that re-evaluates current_setting() or auth.<function>() for each row. This produces suboptimal query performance at scale. Resolve the issue by replacing \`auth.<function>()\` with \`(select auth.<function>())\`. See [docs](https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select) for more info. ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan))
- `auth_rls_initplan` [WARN]: Table \`public.beneficiaries\` has a row level security policy \`beneficiaries_read_own_or_admin\` that re-evaluates current_setting() or auth.<function>() for each row. This produces suboptimal query performance at scale. Resolve the issue by replacing \`auth.<function>()\` with \`(select auth.<function>())\`. See [docs](https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select) for more info. ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan))
- `auth_rls_initplan` [WARN]: Table \`public.audit_events\` has a row level security policy \`audit_events_read_own_or_admin\` that re-evaluates current_setting() or auth.<function>() for each row. This produces suboptimal query performance at scale. Resolve the issue by replacing \`auth.<function>()\` with \`(select auth.<function>())\`. See [docs](https://supabase.com/docs/guides/database/postgres/row-level-security#call-functions-with-select) for more info. ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0003_auth_rls_initplan))
- `unused_index` [INFO]: Index \`programs_created_by_idx\` on table \`public.programs\` has not been used ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index))
- `unused_index` [INFO]: Index \`beneficiaries_program_id_idx\` on table \`public.beneficiaries\` has not been used ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index))
- `unused_index` [INFO]: Index \`payout_batches_program_id_idx\` on table \`public.payout_batches\` has not been used ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index))
- `unused_index` [INFO]: Index \`payout_items_batch_id_idx\` on table \`public.payout_items\` has not been used ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0005_unused_index))
- `multiple_permissive_policies` [WARN]: Table \`public.audit_events\` has multiple permissive policies for role \`authenticated\` for action \`INSERT\`. Policies include \`{audit_events_insert_admin,audit_events_insert_authenticated}\` ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies))
- `multiple_permissive_policies` [WARN]: Table \`public.audit_events\` has multiple permissive policies for role \`authenticated\` for action \`SELECT\`. Policies include \`{audit_events_read_own_or_admin,audit_events_select_admin}\` ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies))
- `multiple_permissive_policies` [WARN]: Table \`public.beneficiaries\` has multiple permissive policies for role \`authenticated\` for action \`DELETE\`. Policies include \`{allow_all_beneficiaries_for_dev,beneficiaries_admin_all}\` ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies))
- `multiple_permissive_policies` [WARN]: Table \`public.beneficiaries\` has multiple permissive policies for role \`authenticated\` for action \`INSERT\`. Policies include \`{allow_all_beneficiaries_for_dev,beneficiaries_admin_all,beneficiaries_insert_own}\` ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies))
- `multiple_permissive_policies` [WARN]: Table \`public.beneficiaries\` has multiple permissive policies for role \`authenticated\` for action \`SELECT\`. Policies include \`{allow_all_beneficiaries_for_dev,beneficiaries_admin_all,beneficiaries_read_own_or_admin,beneficiaries_select_own}\` ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies))
- `multiple_permissive_policies` [WARN]: Table \`public.beneficiaries\` has multiple permissive policies for role \`authenticated\` for action \`UPDATE\`. Policies include \`{allow_all_beneficiaries_for_dev,beneficiaries_admin_all,beneficiaries_update_own}\` ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies))
- `multiple_permissive_policies` [WARN]: Table \`public.payout_batches\` has multiple permissive policies for role \`authenticated\` for action \`SELECT\`. Policies include \`{payout_batches_admin_all,payout_batches_select_linked_beneficiary}\` ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies))
- `multiple_permissive_policies` [WARN]: Table \`public.payout_items\` has multiple permissive policies for role \`authenticated\` for action \`SELECT\`. Policies include \`{payout_items_admin_all,payout_items_select_own}\` ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies))
- `multiple_permissive_policies` [WARN]: Table \`public.profiles\` has multiple permissive policies for role \`authenticated\` for action \`SELECT\`. Policies include \`{profiles_read_own,profiles_select_admin,profiles_select_own}\` ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies))
- `multiple_permissive_policies` [WARN]: Table \`public.profiles\` has multiple permissive policies for role \`authenticated\` for action \`UPDATE\`. Policies include \`{profiles_update_admin,profiles_update_own}\` ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies))
- `multiple_permissive_policies` [WARN]: Table \`public.programs\` has multiple permissive policies for role \`authenticated\` for action \`SELECT\`. Policies include \`{programs_admin_all,programs_read_authenticated,programs_select_linked_beneficiary}\` ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies))
- `multiple_permissive_policies` [WARN]: Table \`public.verification_results\` has multiple permissive policies for role \`authenticated\` for action \`SELECT\`. Policies include \`{verification_results_admin_all,verification_results_select_own}\` ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies))
- `multiple_permissive_policies` [WARN]: Table \`public.verification_submissions\` has multiple permissive policies for role \`authenticated\` for action \`INSERT\`. Policies include \`{verification_submissions_admin_all,verification_submissions_insert_own}\` ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies))
- `multiple_permissive_policies` [WARN]: Table \`public.verification_submissions\` has multiple permissive policies for role \`authenticated\` for action \`SELECT\`. Policies include \`{verification_submissions_admin_all,verification_submissions_select_own}\` ([remediation](https://supabase.com/docs/guides/database/database-linter?lint=0006_multiple_permissive_policies))

## Public Table Column Audit

### `public.audit_events`

- Exact rows: 9
- RLS enabled: true
- Policy count: 4

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | options `updatable`; default `gen_random_uuid()` |
| `actor_profile_id` | `uuid` | options `nullable`, `updatable` |
| `entity_type` | `text` | options `updatable` |
| `entity_id` | `uuid` | options `nullable`, `updatable` |
| `event_type` | `text` | options `updatable` |
| `payload` | `jsonb` | options `updatable`; default `'{}'::jsonb` |
| `created_at` | `timestamp with time zone` | format `timestamptz`; options `updatable`; default `now()` |

### `public.beneficiaries`

- Exact rows: 6
- RLS enabled: true
- Policy count: 6
- Live `status` enum values: `draft`, `submitted`, `approved`, `review`, `rejected`, `pending`

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | options `updatable`; default `gen_random_uuid()` |
| `program_id` | `uuid` | options `updatable` |
| `profile_id` | `uuid` | options `nullable`, `updatable` |
| `full_name` | `text` | options `updatable` |
| `email` | `text` | options `nullable`, `updatable` |
| `phone` | `text` | options `nullable`, `updatable` |
| `student_identifier` | `text` | options `updatable` |
| `bank_code` | `text` | options `updatable` |
| `account_number` | `text` | options `updatable` |
| `account_name_lookup` | `text` | options `nullable`, `updatable` |
| `status` | `USER-DEFINED` | format `beneficiary_status`; options `updatable`; default `'pending'::beneficiary_status`; enum `draft`, `submitted`, `approved`, `review`, `rejected`, `pending` |
| `created_at` | `timestamp with time zone` | format `timestamptz`; options `updatable`; default `now()` |
| `updated_at` | `timestamp with time zone` | format `timestamptz`; options `updatable`; default `now()` |

### `public.payout_batches`

- Exact rows: 0
- RLS enabled: true
- Policy count: 2

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | options `updatable`; default `gen_random_uuid()` |
| `program_id` | `uuid` | options `updatable` |
| `batch_name` | `text` | options `updatable` |
| `total_amount` | `numeric` | options `updatable`; default `0`; check `total_amount >= 0::numeric` |
| `status` | `USER-DEFINED` | format `payout_batch_status`; options `updatable`; default `'draft'::payout_batch_status`; enum `draft`, `ready`, `processing`, `completed`, `failed` |
| `created_by` | `uuid` | options `nullable`, `updatable` |
| `created_at` | `timestamp with time zone` | format `timestamptz`; options `updatable`; default `now()` |
| `updated_at` | `timestamp with time zone` | format `timestamptz`; options `updatable`; default `now()` |

### `public.payout_items`

- Exact rows: 0
- RLS enabled: true
- Policy count: 2

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | options `updatable`; default `gen_random_uuid()` |
| `batch_id` | `uuid` | options `updatable` |
| `beneficiary_id` | `uuid` | options `updatable` |
| `amount` | `numeric` | options `updatable`; check `amount > 0::numeric` |
| `decision_snapshot` | `USER-DEFINED` | format `verification_decision`; options `nullable`, `updatable`; enum `approved`, `review`, `rejected` |
| `squad_transaction_reference` | `text` | options `nullable`, `updatable` |
| `squad_status` | `USER-DEFINED` | format `payout_item_status`; options `updatable`; default `'pending'::payout_item_status`; enum `pending`, `queued`, `processing`, `successful`, `failed` |
| `released_at` | `timestamp with time zone` | format `timestamptz`; options `nullable`, `updatable` |
| `updated_at` | `timestamp with time zone` | format `timestamptz`; options `updatable`; default `now()` |

### `public.profiles`

- Exact rows: 4
- RLS enabled: true
- Policy count: 5

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | options `updatable`; default `gen_random_uuid()` |
| `role` | `USER-DEFINED` | format `app_role`; options `updatable`; default `'beneficiary'::app_role`; enum `admin`, `beneficiary` |
| `full_name` | `text` | options `nullable`, `updatable` |
| `email` | `text` | options `nullable`, `updatable` |
| `phone` | `text` | options `nullable`, `updatable` |
| `created_at` | `timestamp with time zone` | format `timestamptz`; options `updatable`; default `now()` |
| `updated_at` | `timestamp with time zone` | format `timestamptz`; options `updatable`; default `now()` |

### `public.programs`

- Exact rows: 2
- RLS enabled: true
- Policy count: 3

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | options `updatable`; default `gen_random_uuid()` |
| `name` | `text` | options `updatable` |
| `organization_name` | `text` | options `updatable` |
| `program_type` | `text` | options `updatable` |
| `created_by` | `uuid` | options `nullable`, `updatable` |
| `created_at` | `timestamp with time zone` | format `timestamptz`; options `updatable`; default `now()` |
| `updated_at` | `timestamp with time zone` | format `timestamptz`; options `updatable`; default `now()` |

### `public.verification_results`

- Exact rows: 1
- RLS enabled: true
- Policy count: 2

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | options `updatable`; default `gen_random_uuid()` |
| `beneficiary_id` | `uuid` | options `updatable` |
| `liveness_score` | `numeric` | options `nullable`, `updatable`; check `liveness_score IS NULL OR liveness_score >= 0::numeric AND liveness_score <= 100::numeric` |
| `face_match_score` | `numeric` | options `nullable`, `updatable`; check `face_match_score IS NULL OR face_match_score >= 0::numeric AND face_match_score <= 100::numeric` |
| `document_score` | `numeric` | options `nullable`, `updatable`; check `document_score IS NULL OR document_score >= 0::numeric AND document_score <= 100::numeric` |
| `risk_score` | `numeric` | options `nullable`, `updatable`; check `risk_score IS NULL OR risk_score >= 0::numeric AND risk_score <= 100::numeric` |
| `decision` | `USER-DEFINED` | format `verification_decision`; options `updatable`; enum `approved`, `review`, `rejected` |
| `reason_codes` | `ARRAY` | format `_text`; options `updatable`; default `'{}'::text[]` |
| `raw_provider_summary` | `jsonb` | options `updatable`; default `'{}'::jsonb` |
| `review_notes` | `text` | options `nullable`, `updatable` |
| `created_by` | `uuid` | options `nullable`, `updatable` |
| `created_at` | `timestamp with time zone` | format `timestamptz`; options `updatable`; default `now()` |

### `public.verification_rules`

- Exact rows: 3
- RLS enabled: true
- Policy count: 1

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | options `updatable`; default `gen_random_uuid()` |
| `rule_key` | `text` | options `updatable`, `unique` |
| `name` | `text` | options `updatable` |
| `description` | `text` | options `nullable`, `updatable` |
| `threshold_value` | `numeric` | options `nullable`, `updatable` |
| `decision_on_fail` | `USER-DEFINED` | format `verification_decision`; options `updatable`; default `'review'::verification_decision`; enum `approved`, `review`, `rejected` |
| `is_active` | `boolean` | format `bool`; options `updatable`; default `true` |
| `created_at` | `timestamp with time zone` | format `timestamptz`; options `updatable`; default `now()` |
| `updated_at` | `timestamp with time zone` | format `timestamptz`; options `updatable`; default `now()` |

### `public.verification_submissions`

- Exact rows: 2
- RLS enabled: true
- Policy count: 3

| Column | Type | Notes |
| --- | --- | --- |
| `id` | `uuid` | options `updatable`; default `gen_random_uuid()` |
| `beneficiary_id` | `uuid` | options `updatable` |
| `selfie_file_path` | `text` | options `nullable`, `updatable` |
| `document_file_path` | `text` | options `nullable`, `updatable` |
| `submitted_at` | `timestamp with time zone` | format `timestamptz`; options `updatable`; default `now()` |

## Auth And Storage Table Column Audit

### `auth.audit_log_entries`

- Exact rows: 0
- RLS enabled: true
- Columns: `instance_id:uuid`, `id:uuid`, `payload:json`, `created_at:timestamp with time zone`, `ip_address:character varying`

### `auth.custom_oauth_providers`

- Exact rows: 0
- RLS enabled: false
- Columns: `id:uuid`, `provider_type:text`, `identifier:text`, `name:text`, `client_id:text`, `client_secret:text`, `acceptable_client_ids:ARRAY`, `scopes:ARRAY`, `pkce_enabled:boolean`, `attribute_mapping:jsonb`, `authorization_params:jsonb`, `enabled:boolean`, `email_optional:boolean`, `issuer:text`, `discovery_url:text`, `skip_nonce_check:boolean`, `cached_discovery:jsonb`, `discovery_cached_at:timestamp with time zone`, `authorization_url:text`, `token_url:text`, `userinfo_url:text`, `jwks_uri:text`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`

### `auth.flow_state`

- Exact rows: 0
- RLS enabled: true
- Columns: `id:uuid`, `user_id:uuid`, `auth_code:text`, `code_challenge_method:USER-DEFINED`, `code_challenge:text`, `provider_type:text`, `provider_access_token:text`, `provider_refresh_token:text`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`, `authentication_method:text`, `auth_code_issued_at:timestamp with time zone`, `invite_token:text`, `referrer:text`, `oauth_client_state_id:uuid`, `linking_target_id:uuid`, `email_optional:boolean`

### `auth.identities`

- Exact rows: 4
- RLS enabled: true
- Columns: `provider_id:text`, `user_id:uuid`, `identity_data:jsonb`, `provider:text`, `last_sign_in_at:timestamp with time zone`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`, `email:text`, `id:uuid`

### `auth.instances`

- Exact rows: 0
- RLS enabled: true
- Columns: `id:uuid`, `uuid:uuid`, `raw_base_config:text`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`

### `auth.mfa_amr_claims`

- Exact rows: 1
- RLS enabled: true
- Columns: `session_id:uuid`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`, `authentication_method:text`, `id:uuid`

### `auth.mfa_challenges`

- Exact rows: 0
- RLS enabled: true
- Columns: `id:uuid`, `factor_id:uuid`, `created_at:timestamp with time zone`, `verified_at:timestamp with time zone`, `ip_address:inet`, `otp_code:text`, `web_authn_session_data:jsonb`

### `auth.mfa_factors`

- Exact rows: 0
- RLS enabled: true
- Columns: `id:uuid`, `user_id:uuid`, `friendly_name:text`, `factor_type:USER-DEFINED`, `status:USER-DEFINED`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`, `secret:text`, `phone:text`, `last_challenged_at:timestamp with time zone`, `web_authn_credential:jsonb`, `web_authn_aaguid:uuid`, `last_webauthn_challenge_data:jsonb`

### `auth.oauth_authorizations`

- Exact rows: 0
- RLS enabled: false
- Columns: `id:uuid`, `authorization_id:text`, `client_id:uuid`, `user_id:uuid`, `redirect_uri:text`, `scope:text`, `state:text`, `resource:text`, `code_challenge:text`, `code_challenge_method:USER-DEFINED`, `response_type:USER-DEFINED`, `status:USER-DEFINED`, `authorization_code:text`, `created_at:timestamp with time zone`, `expires_at:timestamp with time zone`, `approved_at:timestamp with time zone`, `nonce:text`

### `auth.oauth_client_states`

- Exact rows: 0
- RLS enabled: false
- Columns: `id:uuid`, `provider_type:text`, `code_verifier:text`, `created_at:timestamp with time zone`

### `auth.oauth_clients`

- Exact rows: 0
- RLS enabled: false
- Columns: `id:uuid`, `client_secret_hash:text`, `registration_type:USER-DEFINED`, `redirect_uris:text`, `grant_types:text`, `client_name:text`, `client_uri:text`, `logo_uri:text`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`, `deleted_at:timestamp with time zone`, `client_type:USER-DEFINED`, `token_endpoint_auth_method:text`

### `auth.oauth_consents`

- Exact rows: 0
- RLS enabled: false
- Columns: `id:uuid`, `user_id:uuid`, `client_id:uuid`, `scopes:text`, `granted_at:timestamp with time zone`, `revoked_at:timestamp with time zone`

### `auth.one_time_tokens`

- Exact rows: 1
- RLS enabled: true
- Columns: `id:uuid`, `user_id:uuid`, `token_type:USER-DEFINED`, `token_hash:text`, `relates_to:text`, `created_at:timestamp without time zone`, `updated_at:timestamp without time zone`

### `auth.refresh_tokens`

- Exact rows: 1
- RLS enabled: true
- Columns: `instance_id:uuid`, `id:bigint`, `token:character varying`, `user_id:character varying`, `revoked:boolean`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`, `parent:character varying`, `session_id:uuid`

### `auth.saml_providers`

- Exact rows: 0
- RLS enabled: true
- Columns: `id:uuid`, `sso_provider_id:uuid`, `entity_id:text`, `metadata_xml:text`, `metadata_url:text`, `attribute_mapping:jsonb`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`, `name_id_format:text`

### `auth.saml_relay_states`

- Exact rows: 0
- RLS enabled: true
- Columns: `id:uuid`, `sso_provider_id:uuid`, `request_id:text`, `for_email:text`, `redirect_to:text`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`, `flow_state_id:uuid`

### `auth.schema_migrations`

- Exact rows: 76
- RLS enabled: true
- Columns: `version:character varying`

### `auth.sessions`

- Exact rows: 1
- RLS enabled: true
- Columns: `id:uuid`, `user_id:uuid`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`, `factor_id:uuid`, `aal:USER-DEFINED`, `not_after:timestamp with time zone`, `refreshed_at:timestamp without time zone`, `user_agent:text`, `ip:inet`, `tag:text`, `oauth_client_id:uuid`, `refresh_token_hmac_key:text`, `refresh_token_counter:bigint`, `scopes:text`

### `auth.sso_domains`

- Exact rows: 0
- RLS enabled: true
- Columns: `id:uuid`, `sso_provider_id:uuid`, `domain:text`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`

### `auth.sso_providers`

- Exact rows: 0
- RLS enabled: true
- Columns: `id:uuid`, `resource_id:text`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`, `disabled:boolean`

### `auth.users`

- Exact rows: 4
- RLS enabled: true
- Columns: `instance_id:uuid`, `id:uuid`, `aud:character varying`, `role:character varying`, `email:character varying`, `encrypted_password:character varying`, `email_confirmed_at:timestamp with time zone`, `invited_at:timestamp with time zone`, `confirmation_token:character varying`, `confirmation_sent_at:timestamp with time zone`, `recovery_token:character varying`, `recovery_sent_at:timestamp with time zone`, `email_change_token_new:character varying`, `email_change:character varying`, `email_change_sent_at:timestamp with time zone`, `last_sign_in_at:timestamp with time zone`, `raw_app_meta_data:jsonb`, `raw_user_meta_data:jsonb`, `is_super_admin:boolean`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`, `phone:text`, `phone_confirmed_at:timestamp with time zone`, `phone_change:text`, `phone_change_token:character varying`, `phone_change_sent_at:timestamp with time zone`, `confirmed_at:timestamp with time zone`, `email_change_token_current:character varying`, `email_change_confirm_status:smallint`, `banned_until:timestamp with time zone`, `reauthentication_token:character varying`, `reauthentication_sent_at:timestamp with time zone`, `is_sso_user:boolean`, `deleted_at:timestamp with time zone`, `is_anonymous:boolean`

### `auth.webauthn_challenges`

- Exact rows: 0
- RLS enabled: false
- Columns: `id:uuid`, `user_id:uuid`, `challenge_type:text`, `session_data:jsonb`, `created_at:timestamp with time zone`, `expires_at:timestamp with time zone`

### `auth.webauthn_credentials`

- Exact rows: 0
- RLS enabled: false
- Columns: `id:uuid`, `user_id:uuid`, `credential_id:bytea`, `public_key:bytea`, `attestation_type:text`, `aaguid:uuid`, `sign_count:bigint`, `transports:jsonb`, `backup_eligible:boolean`, `backed_up:boolean`, `friendly_name:text`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`, `last_used_at:timestamp with time zone`

### `storage.buckets`

- Exact rows: 0
- RLS enabled: true
- Columns: `id:text`, `name:text`, `owner:uuid`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`, `public:boolean`, `avif_autodetection:boolean`, `file_size_limit:bigint`, `allowed_mime_types:ARRAY`, `owner_id:text`, `type:USER-DEFINED`

### `storage.buckets_analytics`

- Exact rows: 0
- RLS enabled: true
- Columns: `name:text`, `type:USER-DEFINED`, `format:text`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`, `id:uuid`, `deleted_at:timestamp with time zone`

### `storage.buckets_vectors`

- Exact rows: 0
- RLS enabled: true
- Columns: `id:text`, `type:USER-DEFINED`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`

### `storage.migrations`

- Exact rows: 61
- RLS enabled: true
- Columns: `id:integer`, `name:character varying`, `hash:character varying`, `executed_at:timestamp without time zone`

### `storage.objects`

- Exact rows: 0
- RLS enabled: true
- Columns: `id:uuid`, `bucket_id:text`, `name:text`, `owner:uuid`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`, `last_accessed_at:timestamp with time zone`, `metadata:jsonb`, `path_tokens:ARRAY`, `version:text`, `owner_id:text`, `user_metadata:jsonb`

### `storage.s3_multipart_uploads`

- Exact rows: 0
- RLS enabled: true
- Columns: `id:text`, `in_progress_size:bigint`, `upload_signature:text`, `bucket_id:text`, `key:text`, `version:text`, `owner_id:text`, `created_at:timestamp with time zone`, `user_metadata:jsonb`, `metadata:jsonb`

### `storage.s3_multipart_uploads_parts`

- Exact rows: 0
- RLS enabled: true
- Columns: `id:uuid`, `upload_id:text`, `size:bigint`, `part_number:integer`, `bucket_id:text`, `key:text`, `etag:text`, `owner_id:text`, `version:text`, `created_at:timestamp with time zone`

### `storage.vector_indexes`

- Exact rows: 0
- RLS enabled: true
- Columns: `id:text`, `name:text`, `bucket_id:text`, `data_type:text`, `dimension:integer`, `distance_metric:text`, `metadata_configuration:jsonb`, `created_at:timestamp with time zone`, `updated_at:timestamp with time zone`

## Repo vs Live Mismatches

- `VITE_SUPABASE_ANON_KEY` is set to the publishable key value, not the legacy anon key. This works with the current client fallback but the variable name is misleading.
- The live project has migrations, but the repo has no checked-in `supabase/migrations/` directory.
- Live edge functions exist that are not present locally: `squad-account-lookup`, `squad-transfer`.
- The live `beneficiary_status` enum includes `pending`, but local TypeScript and Edge Function unions only model `draft | submitted | approved | review | rejected`.
- The live project has no storage buckets configured, despite the product docs describing document/selfie uploads.
- `.vscode/mcp.json` names the remote project server `supabaseLocal`, but it targets the hosted project ref rather than a local stack.
- The repo env files do not document `SUPABASE_SERVICE_ROLE_KEY`, even though local Edge Function code requires it for server-side execution.

## Operational Conclusion

- Project instructions are loaded.
- A distinct project-scoped Codex MCP server is configured as `prova-supabase`.
- The hosted MCP endpoint was verified directly via MCP initialize/session/tool calls in read-only mode.
- The live backend scope is broader than the checked-in repo because the project has deployed Squad transfer functions and live schema/RLS state not fully represented locally.
- Feature work should stay blocked until the enum drift, migration-source-of-truth gap, live-only function gap, and permissive RLS findings are understood and intentionally accepted or corrected.