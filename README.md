# CraftMyPage

CraftMyPage is a free, privacy-first browser app for creating invitations, invoices and ATS-friendly resumes. The live application is designed to let people create and export documents without creating an account or uploading their document contents to a server.

## Public tools

- **Invoice maker:** GST and freelancer invoice creation, editable line items and PDF export.
- **Invitation maker:** invitation templates, custom text and print-ready PDF export.
- **Resume builder:** ATS-friendly resume templates and PDF export.
- **Guides and landing pages:** practical invoice, invitation and resume guidance for common user intents.
- **Privacy and terms:** public policy pages describing the intended data handling and use of the application.

## Privacy and data handling

- No mandatory account or login.
- Document editing and export are designed to run in the browser.
- No core document upload or cloud document storage is required.
- Do not enter highly sensitive personal, financial or identity information into public demos or test fixtures.

The privacy policy on the live site is the user-facing source of truth. Any new third-party integration, analytics, advertising, or storage behavior must be reflected in that policy before release.

## Development and verification

The project uses Vite, React, TypeScript and browser-based PDF/image generation. Quality gates include:

- TypeScript type-checking and ESLint
- Vitest unit tests and template validation
- Production build and SEO shell verification
- Playwright route smoke tests
- Chromium document-export tests for invitation and resume PDFs
- Dependency vulnerability audit on every CI run and weekly scheduled checks

## Contributing

Work on a focused branch, run all checks, and open a pull request. Do not push directly to main. Never commit credentials, generated dependency directories, test artifacts, or private user documents.
