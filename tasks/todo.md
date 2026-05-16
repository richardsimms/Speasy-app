# RS-879 - Vary audio script openings and closings

## Plan

- [x] Confirm current `process_llm_job` prompt path and baseline behavior
- [x] Add rotating opening/closing style variants to summary prompt instructions
- [x] Tighten guardrails against repetitive generic intros and sign-offs
- [x] Run lint and type checks for repository safety
- [x] Commit, push, and open/update PR
- [ ] Deploy updated `process_llm_job` edge function to `speasy-signups`

## Review

- Implemented RS-879 in `supabase/functions/process_llm_job/index.ts`:
  - Added explicit anti-generic opening/closing prompt constraints.
  - Added deterministic 4-variant prompt rotation via `selectSummaryPromptVariant(job.id)`.
  - Added few-shot opening/closing style cues through `buildSummaryUserPrompt`.
  - Extended summary validation warnings for repetitive opening/closing phrases.
- Preserved existing production-only telemetry logic from deployed function:
  - `TTS_BITRATE_BPS` and duration calculation for `audio_files.duration`.
  - `markJobDone(jobId, processingTimeMs)` and processing-time persistence.
- Validation:
  - `pnpm run check:types` ✅
  - `pnpm test` ✅ (after installing Playwright Chromium in this environment)
  - `pnpm run lint` ✅ with pre-existing repo warnings only (no errors).
