## 1. Repository Hygiene

- [x] 1.1 Update root `.gitignore` to exclude `artifacts/` and `scratch/` directories.
- [x] 1.2 Remove any accidentally tracked files from `artifacts/` or `scratch/` using `git rm --cached` if necessary.

## 2. CI Pipeline Optimization

- [x] 2.1 Refactor `.github/workflows/ci.yml` to implement Playwright browser caching using `actions/cache`.
- [x] 2.2 Split the CI workflow into logical jobs: `test-and-build`, `e2e-tests` (depends on build), and `deploy` (depends on e2e).
- [x] 2.3 Implement GitHub Action artifact sharing: Upload the `dist` folder in the build job and download it in the test and deploy jobs.
- [x] 2.4 Update Playwright E2E step to run against the production build using `npm run preview` instead of the development server.
- [x] 2.5 Configure Playwright to only upload trace artifacts on failure to keep the CI artifacts clean.

## 3. Verification

- [x] 3.1 Verify that `git status` no longer shows files in `artifacts/` or `scratch/`.
- [ ] 3.2 Commit changes and push to trigger the new pipeline.
- [ ] 3.3 Monitor the GitHub Actions run to ensure jobs execute correctly and browsers are cached.
