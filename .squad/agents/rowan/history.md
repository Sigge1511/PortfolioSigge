# Project Context

- **Owner:** MajaSigfeldt
- **Project:** Witchy female squad bootstrap
- **Stack:** TBD
- **Created:** 2026-03-02T15:53:08Z

## Learnings

### Devcontainer first-launch (AI-Harness 01)

- **CLI**: `devcontainer` is not installed globally on Maja's machine. Use `npx --yes @devcontainers/cli up --workspace-folder <path>` instead.
- **GPU**: Docker Desktop has the NVIDIA runtime (`nvidia` in `docker info Runtimes`). `--gpus all` in runArgs works.
- **.env file**: The `.env` file exists but contains only comments (0 key=value pairs). This is fine — Docker's `--env-file` accepts empty/comment-only files without erroring.
- **postCreateCommand bug**: `npx github:bradygaster/squad` fails with "could not determine executable to run" because the `@bradygaster/squad` package has no `bin` entry. Fixed by changing to `npm install -g github:bradygaster/squad`.
- **Tool locations after postCreate**:
  - `claude` → `/home/vscode/.local/bin/claude` (v2.1.85) — PATH must include `/home/vscode/.local/bin`
  - `claude-flow` → `/usr/local/share/nvm/versions/node/v24.14.0/bin/claude-flow` (v3.5.48) — accessible via nvm node PATH
- **Container ID on this run**: `ec8028965e59` (name: `exciting_jackson`)
- **Build time**: All Dockerfile layers were cached; container was up in ~26 seconds.

### 2026-03-27: Stale container image— UserStore CmsPostFeedSeedingService fix

- **Root cause**: `foidentityuserstoreservice:dev` image was built on 2026-03-16T13:33:14Z. The fix commit (`bcc2d4bc`, CmsPostFeedSeedingService always-seed change) landed on 2026-03-27 12:14:37 +0100 — 11 days later. The running container never saw the fix.
- All other containers were healthy. `spicedb-init` and `spicedb-migrate` exited(0) — correct, they are one-shot init jobs.
- SSL certs are present and valid (generated 2026-02-09, pfx files present for all services including UserStore).
- **Fix**: `docker-compose up -d --build fo.identity.userstore.service` at repo root. No pre-requisites needed; env is already up.
- **Pattern to remember**: Docker Compose does NOT auto-rebuild images when source changes. You must pass `--build` explicitly. A stale image is the first thing to check when a code fix "isn't showing up" in the running environment.

### 2026-03-PR365: Path casing fix in docker-compose.dcproj
- `docker-compose.dcproj` had `certs\Fix-My-Certs.ps1` (lowercase `c`) while the actual folder is `Certs/` (capital C).
- On Linux (case-sensitive), this causes a file-not-found at build time. On Windows it silently works.
- Fixed by capitalising: `Certs\Fix-My-Certs.ps1`. Always verify path casing in `.dcproj` includes when the target OS is Linux.

### Devcontainer bootstrap pattern
- `.devcontainer/devcontainer.json` uses `--env-file ${localWorkspaceFolder}/.devcontainer/.env` in `runArgs`. Docker hard-errors (exit 125) if that file is missing — this is the #1 cause of "devcontainer won't connect" on a fresh clone.
- Fix: `cp .devcontainer/.env.example .devcontainer/.env`. The file is now gitignored via `.gitignore`.
- Secondary risk: the Dockerfile manually installs Docker using the Ubuntu APT key on a Debian-based .NET SDK 10 image. The `docker-in-docker` devcontainer feature supersedes this, so it hasn't caused failures yet, but a Dockerfile rebuild from scratch would fail.
- The `--gpus all` runArg requires NVIDIA runtime in Docker Desktop. Runtime is present on Maja's machine (`Runtimes: … nvidia`), so GPU is not blocking.

### 2026-03-21T15xxZ: Issue #349 — CMS risk checks
- Created .github/workflows/cms-tests.yml: split CMS test suite into fast unit lane (every push) and slow integration lane (PR to main/workflow_dispatch). Both jobs scoped to UserStore/**. Pattern mirrors pr-validation.yml env var style.
- All changes merged to squad/349-cms-risk-checks, decisions.md updated, inbox cleared.


### 2026-03-17: CMS CI lane split (Issue #349)

- Created `.github/workflows/cms-tests.yml` with two jobs: `cms-unit-tests` (fast lane, runs on every push to any branch) and `cms-integration-tests` (slow lane, runs only on PR to main or `workflow_dispatch`).
- Both jobs are scoped to `UserStore/**` path filters to avoid unnecessary runs.
- Integration lane has `needs: cms-unit-tests` to gate on unit pass before spending time on slower tests.
- Pattern mirrors `pr-validation.yml` env var style (`DOTNET_VERSION: '10.0.x'`).
- All three CMS test projects confirmed present: `Cms.Domain.Tests`, `Cms.Grain.Tests`, `Cms.Service.Tests`.


- Initial team seeded for CI/CD and infrastructure support.
- Quill build wiring: root package.json postinstall copies from node_modules to wwwroot. csproj InstallAndCopyQuill target runs this before dotnet build (not in Docker). Committed quill.js acts as Docker cache.

### 2026-03-17: CMS backend completion coordination

- Assessed operational readiness and identified deployment/CI gaps that could block backend release.
- Linked operational prerequisites to Circe phase gates and Nyx quality matrix for release sequencing.
