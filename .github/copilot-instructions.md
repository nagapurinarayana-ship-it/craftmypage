# CraftMyPage — Copilot coding instructions

## Product
Build CraftMyPage: a completely free, privacy-first browser application for creating invitations, resumes/CVs, cover letters, and printable designs.

Core promise:
- No account or login.
- No database, backend, cloud storage, or server-side document processing.
- No file uploads to any server.
- No watermark or paid download gate.
- All personal data and imported images remain on the user's device.
- Unlimited local PDF and PNG downloads.
- Monetization may use non-intrusive display ads only after useful content exists.

## Required stack
- Vite, React, and strict TypeScript.
- Tailwind CSS or scoped CSS.
- React Router for real routes.
- Fabric.js or Konva.js for the invitation editor.
- PDF-lib or jsPDF for exports.
- IndexedDB for projects; localStorage only for lightweight preferences.
- Vitest and Testing Library.
- Playwright for critical end-to-end flows.
- GitHub Actions running install, typecheck, lint, unit tests, build, and template validation.
- Cloudflare Pages compatible static output.

Use supported stable package versions and commit the lockfile. Do not suppress test, lint, typecheck, or validation failures with `|| true`.

## Launch scope
1. Homepage with two primary actions: Create an Invitation and Build a Resume.
2. Invitation maker:
   - structured JSON templates;
   - editable names, message, date, time, and venue;
   - text/font/color controls;
   - local photo selection without network upload;
   - move, resize, align, undo, and redo;
   - portrait, landscape, square, story, and 5x7 print presets;
   - PNG, WhatsApp-friendly image, and print-quality PDF exports;
   - save, duplicate, reopen, and delete projects locally.
3. Resume builder:
   - contact, summary, experience, education, skills, projects, certifications, achievements, languages, and custom sections;
   - add/remove/reorder sections and repeated entries;
   - live preview;
   - one-page and two-page layouts;
   - at least ATS Classic, ATS Modern, Fresher, Software Engineer, Experienced Professional, Minimal, Two-Page Professional, and Academic CV templates;
   - selectable-text PDF and TXT exports;
   - multiple locally saved versions and full local-data deletion.
4. Legal and trust pages: About, Privacy, Terms, Contact, and a clear local-processing explanation.
5. SEO: unique metadata, canonical URLs, sitemap with accurate lastmod, robots.txt, social cards, breadcrumbs, and valid structured data.
6. Accessibility: keyboard navigation, labels, visible focus, contrast, reduced motion, and screen-reader feedback.

Initial invitation categories: birthday, wedding, engagement, baby shower, housewarming, naming ceremony, anniversary, graduation, corporate event, and general party.

## Architecture rules
- Use shared components and one reusable editor/template engine.
- Keep templates as validated structured data, not duplicated hard-coded pages.
- Sanitize imported text and validate all project/template data.
- Never add external AI APIs, analytics, trackers, authentication, RSVP storage, email delivery, hosted resumes, subscriptions, or paid templates unless the owner explicitly requests them later.
- Do not copy competitor templates, copyrighted graphics, or brand assets. Use original assets or compatible open licences and record attribution where required.
- Do not place secrets, credentials, personal information, or generated user documents in the repository.
- Do not change the product name, repository visibility, licence, hosting provider, or privacy model without owner approval.

## Quality gates
Before requesting review:
- `npm ci`
- typecheck
- lint
- unit tests
- template validation
- production build
- Playwright smoke tests for invitation and resume export
- verify mobile layouts and direct navigation to every public route
- verify resume PDF text is selectable/extractable
- verify the network panel shows no upload of user documents or photos

Do not claim completion with placeholders, disabled buttons, fake downloads, swallowed errors, or tests that always pass.

## Git workflow
- Never push directly to `main`.
- Create a focused branch and pull request for each milestone.
- Keep commits intentional and PRs reviewable.
- Do not merge your own pull requests.
- Include summary, screenshots for UI changes, test evidence, privacy impact, accessibility impact, and remaining work in each PR.
- Preserve unrelated owner changes.

## Build order
1. Replace the temporary scaffold workflow with a working Vite/React/TypeScript foundation and strict CI.
2. Build routing, design system, homepage, and trust/legal pages.
3. Build the invitation template schema, validator, gallery, editor, local persistence, and exports.
4. Build the resume schema, form, templates, local persistence, and selectable-text exports.
5. Add original templates, SEO content, PWA/offline support, accessibility checks, and performance hardening.
