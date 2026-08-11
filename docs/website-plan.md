# CraftMyPage — Website Plan

## Final concept

Build a completely free, privacy-first design website for creating:

* Invitations
* Resumes/CVs
* Cover letters
* Thank-you cards
* Greeting cards
* Certificates
* Business cards

Everything will work directly in the browser:

* No account
* No database
* No subscriptions
* No watermarks
* No document uploads to a server
* Unlimited PDF and image downloads
* User data remains on the device
* Revenue from display ads only

## Recommended name

**CraftMyPage**

Suggested repository:

```text
craftmypage
```

Suggested Cloudflare Pages address:

```text
craftmypage.pages.dev
```

Brand tagline:

> Free invitations, resumes and printable designs—created privately in your browser.

Before purchasing a custom domain, we should separately verify domain and trademark availability.

---

## 1. Market position

We should not attempt to reproduce all of Canva.

Canva and Adobe already compete through enormous template libraries and general-purpose editors. Greetings Island combines invitations with RSVP management, while Resume.io restricts its free resume downloads and promotes paid plans. [Canva](https://www.canva.com/create/resumes/), [Adobe Express](https://www.adobe.com/express/create/invitation), [Greetings Island](https://www.greetingsisland.com/invitations), [Resume.io](https://resume.io/pricing)

CraftMyPage's advantage will be:

> A simpler, completely free alternative with no login, no watermark and no server upload.

The strongest differentiators:

* Every template is genuinely free.
* PDF and PNG downloads are unlimited.
* No surprise payment screen after completing a design.
* No account is required.
* Designs remain on the user's device.
* Fast, focused editors instead of a complicated Canva-style editor.
* Indian and international templates.
* Mobile-friendly WhatsApp sharing formats.
* ATS-friendly resume templates.
* Offline/PWA support in a later release.

---

## 2. Target users

### Invitations

* Indian wedding and engagement users
* Parents creating birthday invitations
* Baby shower and naming ceremony organizers
* Housewarming and religious event organizers
* Schools and small businesses
* People sharing invitations through WhatsApp

### Resume tools

* Students and fresh graduates
* Software and IT professionals
* Experienced job seekers
* People needing ATS-friendly resumes
* Users who do not want to pay merely to download their resume
* Indian and international job applicants

---

## 3. Phase-one launch scope

Do not launch with every possible design category. The first release needs two excellent products.

### A. Free Invitation Maker

Initial categories:

1. Birthday invitation
2. Wedding invitation
3. Engagement invitation
4. Baby shower invitation
5. Housewarming invitation
6. Naming ceremony invitation
7. Anniversary invitation
8. Graduation invitation
9. Corporate event invitation
10. General party invitation

Editor features:

* Select an original template.
* Edit names, message, date, time and venue.
* Change fonts and colors.
* Upload a photo from the device.
* Move, resize and align text.
* Replace or remove decorative elements.
* Undo and redo.
* Preview portrait, landscape or square format.
* Download as PNG.
* Download print-quality PDF.
* Generate a WhatsApp-friendly image.
* Save an editable project locally.
* Start again or duplicate a design.

Recommended output sizes:

| Format               |         Size | Purpose                       |
| -------------------- | -----------: | ----------------------------- |
| Portrait invitation  |  1500 × 2100 | WhatsApp and printing         |
| Landscape invitation |  2100 × 1500 | Email and display             |
| Square invitation    |  1080 × 1080 | Social sharing                |
| Story invitation     |  1080 × 1920 | WhatsApp/Instagram stories    |
| Print invitation     | 5 × 7 inches | Home or professional printing |

### B. Free Resume Builder

Initial resume templates:

1. ATS Classic
2. ATS Modern
3. Software Engineer
4. Experienced Professional
5. Student/Fresher
6. Minimal One-Page
7. Two-Page Professional
8. Academic CV

Resume sections:

* Contact details
* Professional summary
* Work experience
* Education
* Technical skills
* Projects
* Certifications
* Achievements
* Languages
* Custom section

Editor features:

* Add, remove and reorder sections.
* Add multiple jobs, projects and education entries.
* Live resume preview.
* One-page and two-page layouts.
* Control fonts, spacing and colors.
* ATS readability warning.
* Spelling checks through the browser.
* Import data from a locally stored project.
* Save multiple versions in the browser.
* Download unlimited PDFs.
* Export plain text.
* Print directly.
* Delete all locally saved information.

Resume data must remain selectable text in the PDF. It should not be converted into a screenshot.

---

## 4. Phase-two tools

After the first two editors are stable:

### Career tools

* Cover Letter Builder
* Resume Summary Generator using rule-based suggestions
* Resume Bullet-Point Helper
* ATS Resume Checklist
* Job Description Keyword Comparison
* LinkedIn Headline Generator
* Professional Bio Generator
* Reference Page Builder
* Resignation Letter Builder
* Experience Letter Template
* Internship Resume Builder

The keyword checker can run completely in the browser by comparing words from the resume and pasted job description. No external AI API is required.

### Event and printable tools

* Save-the-Date Maker
* Thank-You Card Maker
* Greeting Card Maker
* Certificate Maker
* Business Card Maker
* Event Poster Maker
* Menu Card Maker
* Wedding Program Maker
* QR Code Invitation Maker
* Calendar Maker

These tools should reuse the same editor engine rather than becoming separate codebases.

---

## 5. Features deliberately excluded

These conflict with the free, serverless architecture and should not be included initially:

* User accounts
* Cloud storage
* Online RSVP tracking
* Email invitation delivery
* Paid templates
* Subscription plans
* Server-side AI generation
* Team collaboration
* Professional printing orders
* Publicly hosted resume links
* Contact or applicant databases

RSVP tracking would require storing guest information, authentication and additional privacy controls. Competitors already provide it; it is not necessary for our initial advantage.

---

## 6. Website structure

```text
/
├── invitation-maker
│   ├── birthday-invitations
│   ├── wedding-invitations
│   ├── engagement-invitations
│   ├── baby-shower-invitations
│   ├── housewarming-invitations
│   └── naming-ceremony-invitations
├── resume-builder
│   ├── ats-resume-builder
│   ├── fresher-resume-builder
│   ├── software-engineer-resume
│   └── professional-cv-maker
├── cover-letter-builder
├── certificate-maker
├── business-card-maker
├── templates
├── guides
├── privacy
├── about
└── contact
```

Every category page must contain a real working tool or relevant templates—not only SEO text.

---

## 7. Homepage structure

### Hero

**H1:**

> Create free invitations, resumes and printable designs

**Supporting text:**

> Customize original templates and download high-quality PDFs or images. No account, no watermark and no file uploads.

Primary buttons:

* Create an Invitation
* Build a Resume

### Remaining sections

1. Popular tools
2. Invitation categories
3. Resume templates
4. How it works
5. Privacy explanation
6. Recently added templates
7. Helpful guides
8. Frequently asked questions
9. Footer navigation

Do not put an advertisement above the main editor or between an important form and its download button.

---

## 8. Technical architecture

Recommended stack:

* Vite
* TypeScript
* React
* Tailwind CSS or scoped CSS
* Fabric.js or Konva.js for the invitation canvas
* React Hook Form for resume data
* PDF-lib or jsPDF for PDF generation
* IndexedDB for locally saved projects
* LocalStorage for lightweight preferences
* DOMPurify for imported text sanitization
* Cloudflare Pages for hosting
* GitHub Actions for tests and deployment
* PWA service worker for offline operation

Architecture:

```text
User input
    ↓
Browser editor
    ↓
Local project storage
    ↓
PDF/PNG generation
    ↓
Download to device
```

No design or personal information needs to leave the browser.

---

## 9. Template system

Templates must be stored as structured JSON rather than hard-coded HTML.

Example:

```json
{
  "id": "birthday-modern-blue",
  "category": "birthday",
  "canvas": {
    "width": 1500,
    "height": 2100
  },
  "elements": [
    {
      "type": "text",
      "key": "guestName",
      "editable": true
    }
  ]
}
```

Benefits:

* One editor supports every invitation.
* New templates can be added without changing the application.
* Templates can be filtered by category, color and style.
* Translations become easier.
* Automated template validation becomes possible.

Only original graphics, licensed assets, open-source fonts and properly licensed icons should be used.

---

## 10. Initial template target

A good launch target is **40 high-quality original templates**, not hundreds of weak variations.

| Category                | Templates |
| ----------------------- | --------: |
| Birthday                |         8 |
| Wedding                 |         8 |
| Engagement              |         4 |
| Baby shower             |         4 |
| Housewarming            |         4 |
| Naming ceremony         |         4 |
| Corporate/general event |         4 |
| Resumes                 |         8 |
| **Total**               |   **44** |

Every template must be tested for:

* Long names
* Mobile screens
* Download quality
* Missing optional fields
* Different date formats
* Print margins
* Font loading
* PDF generation

---

## 11. Indian-market differentiation

This can be our strongest SEO opportunity.

Invitation categories should eventually include:

* Gruhapravesam/housewarming
* Naming ceremony
* Annaprasana
* Half-saree ceremony
* Dhoti ceremony
* Mehndi
* Sangeet
* Haldi
* Engagement
* Wedding reception
* Satyanarayana Vratham
* Retirement
* First birthday

Language expansion:

1. English
2. Telugu
3. Hindi
4. Tamil
5. Kannada
6. Malayalam

The first launch can remain English, but Unicode-compatible Indian-language fonts and layout support should be designed into the editor immediately.

---

## 12. SEO plan

### Primary commercial keywords

* free invitation maker
* free resume builder
* free CV maker
* ATS resume builder
* wedding invitation maker
* birthday invitation maker
* invitation maker without watermark
* resume builder free PDF download
* invitation maker for WhatsApp

### Indian long-tail keywords

* Telugu wedding invitation maker
* Gruhapravesam invitation maker
* naming ceremony invitation template
* Indian wedding invitation online free
* fresher resume format India
* software engineer resume template India

### SEO requirements

* Unique title and description on every tool page
* One descriptive H1
* Canonical URLs
* Breadcrumbs
* Open Graph and Twitter images
* FAQ structured data where appropriate
* SoftwareApplication structured data on tools
* HowTo structured data only when the visible guide qualifies
* Template preview images
* XML sitemap with accurate `lastmod`
* `robots.txt`
* Clean permanent URLs
* Fast Core Web Vitals
* Internal links between related tools and guides

---

## 13. Content plan

Launch with useful, manually reviewed guides:

### Invitation guides

* How to create a birthday invitation for WhatsApp
* Wedding invitation wording examples
* What details should an invitation contain?
* Invitation sizes for WhatsApp, Instagram and printing
* Housewarming invitation wording
* Naming ceremony invitation examples

### Resume guides

* How to create an ATS-friendly resume
* Fresher resume format with examples
* Software engineer resume guide
* One-page versus two-page resume
* Resume skills section examples
* Common resume formatting mistakes
* How to tailor a resume to a job description
* Resume PDF versus Word format

Each guide should contain:

* Original examples
* Screenshots from our tool
* A concise checklist
* Links directly into the corresponding template/editor
* Author and update date
* Relevant preview images

---

## 14. Monetization

The website remains completely free. Revenue comes from:

* Google AdSense
* Contextual display ads
* Carefully selected affiliate links later, such as printing or career books
* Optional donation link only if desired

Initial ad placement:

* One ad after the homepage tool/category section
* One ad inside long guides after meaningful content
* One ad below the completed download area
* Desktop sidebar ad on guide pages

Avoid:

* Ads inside the editing canvas
* Ads covering controls
* Fake download buttons
* Pop-ups before downloading
* Forced ad viewing
* Excessive ads on thin template pages

Apply for AdSense only after the site has strong content, legal pages, working tools and sufficient original templates.

---

## 15. Performance and security

Targets:

* Lighthouse Performance: 90+
* Accessibility: 95+
* SEO: 95+
* Best Practices: 95+
* Main page JavaScript under reasonable limits
* Lazy-load template thumbnails
* Load the editor only when the user opens it
* Cache fonts and static assets
* Use fingerprinted filenames
* Compress preview images to WebP/AVIF
* Set a strict Content Security Policy
* No third-party tracking beyond approved advertising
* Strip metadata from locally added images before export where practical
* Never execute text imported from user files
* Validate every template definition

---

## 16. Testing plan

### Unit tests

* Template validation
* Resume section ordering
* Date and text formatting
* Local project save/load
* Filename generation
* PDF page calculations
* ATS text extraction

### Browser tests

* Create invitation
* Edit all fields
* Upload a local photo
* Download PNG
* Download PDF
* Create a resume
* Add and remove sections
* Save and reopen locally
* Download a selectable-text PDF
* Delete local data

### Compatibility

* Chrome
* Edge
* Firefox
* Safari
* Android Chrome
* iPhone Safari

### Accessibility

* Keyboard navigation
* Visible focus
* Form labels
* Color contrast
* Screen-reader announcements
* Reduced-motion support
* Accessible editor alternatives where canvas controls are difficult

---

## 17. Delivery roadmap

### Milestone 1 — Foundation

* Create `craftmypage` GitHub repository.
* Configure Cloudflare Pages.
* Build common header, footer and routing.
* Add privacy, about, contact and terms pages.
* Add sitemap, robots file and social metadata.
* Establish design system.

### Milestone 2 — Invitation MVP

* Build JSON template engine.
* Implement canvas editor.
* Add text, color and image editing.
* Add PNG and PDF export.
* Add local project saving.
* Publish first 20 invitation templates.

### Milestone 3 — Resume MVP

* Build structured resume form.
* Add live preview.
* Add eight ATS-friendly templates.
* Add section reordering.
* Add PDF and text download.
* Test PDF text extraction.

### Milestone 4 — Content and SEO

* Publish initial guides.
* Create social preview images.
* Add structured data.
* Add category landing pages.
* Complete internal linking.
* Submit sitemap to search engines.

### Milestone 5 — Expansion

* Reach 44 templates.
* Add cover-letter builder.
* Add job-description keyword comparison.
* Add certificate and business-card makers.
* Add PWA/offline functionality.
* Begin Telugu and Hindi invitation support.

---

## 18. Launch definition

The website should not be called complete until:

* Both main editors work on mobile and desktop.
* At least 30 original templates are published.
* Invitation downloads work as PNG and PDF.
* Resume PDFs contain selectable text.
* Projects can be saved and deleted locally.
* No account or server upload is required.
* Privacy and legal pages are complete.
* At least eight useful guides are published.
* Sitemap and structured data validate.
* All important browser tests pass.
* Live Cloudflare deployment is verified.

The correct first build order is:

1. Create the new `craftmypage` repository.
2. Build the shared website foundation.
3. Complete the invitation editor.
4. Complete the resume builder.
5. Add original templates and guides.
6. Perform SEO, accessibility and live-site testing.
7. Apply for AdSense only after the site has enough genuine content.