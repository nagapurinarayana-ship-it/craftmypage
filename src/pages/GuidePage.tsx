import type React from 'react'
import { useParams } from 'react-router-dom'
import GuideArticle from '../components/GuideArticle'
import type { GuideMeta } from '../components/GuideArticle'

type Guide = { meta: GuideMeta; content: React.ReactNode }

const GUIDES: Record<string, Guide> = {}

const GUIDE_DATA: Record<string, { meta: Omit<GuideMeta, 'slug'>; content: React.ReactNode }> = {
  'birthday-invitation-whatsapp': {
    meta: { title: 'How to create a birthday invitation for WhatsApp', description: 'A practical guide to choosing a readable invitation size, writing clear wording, and sharing a birthday invite on WhatsApp.', category: 'invitation', readMinutes: 5 },
    content: (
      <>
        <section><h2>Start with the information guests need</h2><p>Before choosing colors or decorations, write down the guest of honor, occasion, date, start time, venue or meeting point, and RSVP contact. If the location is difficult to find, add a landmark or a short directions note.</p></section>
        <section><h2>Choose a phone-friendly layout</h2><p>Portrait designs work well when an invitation will mainly be viewed on a phone. Square layouts are useful when the same artwork will also be posted elsewhere. Keep the date, time and venue visually prominent and avoid placing important text close to the edges.</p></section>
        <section><h2>Write wording people can scan</h2><p>A simple structure is: invitation line, guest of honor, date and time, venue, then RSVP or additional notes. For example: “Join us to celebrate Maya’s 10th birthday — Saturday, 14 March, 5 PM — Green Park Community Hall. RSVP: Priya, 98765 43210.”</p></section>
        <section><h2>Check it before sharing</h2><ul><li>Read the date and time once more.</li><li>Verify the venue spelling and address.</li><li>Open the final image on a phone.</li><li>Make sure text is readable without zooming.</li><li>Send the final version rather than an unfinished draft.</li></ul></section>
      </>
    ),
  },
  'wedding-invitation-wording': {
    meta: { title: 'Wedding invitation wording examples', description: 'Classic, modern, and Indian wedding invitation wording examples, plus a simple structure for writing your own.', category: 'invitation', readMinutes: 6 },
    content: (
      <>
        <section><h2>A simple wedding wording structure</h2><p>Start with the hosts or families if appropriate, introduce the couple, state the occasion, and then give the ceremony or reception date, time and venue. If there are multiple events, make each event easy to distinguish.</p></section>
        <section><h2>Classic formal example</h2><p>“Together with their families, Aarav and Ananya request the pleasure of your company at their wedding on Saturday, 14 February 2027 at The Royal Gardens, Udaipur.”</p></section>
        <section><h2>Modern example</h2><p>“Aarav & Ananya are getting married! Join us on 14 February 2027 at 11 AM at The Royal Gardens. We would love to celebrate with you. RSVP: Priya, 98765 43210.”</p></section>
        <section><h2>Indian wedding wording</h2><p>For a traditional ceremony, include the families, the couple, the ceremony name when useful, and any details guests need to follow. If there are several functions, consider separate sections for mehendi, sangeet, ceremony and reception rather than putting everything into one paragraph.</p></section>
        <section><h2>Final wording checklist</h2><ul><li>Confirm both names and spellings.</li><li>Confirm every date and start time.</li><li>Use the correct venue and address.</li><li>State RSVP details if guests need to respond.</li><li>Read the wording aloud once before sharing.</li></ul></section>
      </>
    ),
  },
  'invitation-details': {
    meta: { title: 'What details should an invitation contain?', description: 'A practical invitation checklist covering the event, date, time, location, RSVP details and useful extras.', category: 'invitation', readMinutes: 4 },
    content: (
      <>
        <section><h2>The five essentials</h2><p>A useful invitation answers five questions quickly: <strong>who</strong> is hosting or being celebrated, <strong>what</strong> is happening, <strong>when</strong> it happens, <strong>where</strong> it happens, and <strong>how</strong> guests should respond or get help.</p></section>
        <section><h2>Helpful extras</h2><p>Add an RSVP contact and deadline when attendance affects planning. Dress guidance can help for formal or themed events. For a venue that is hard to locate, add a landmark, map link or concise directions.</p></section>
        <section><h2>What to leave out</h2><p>Do not overload the main invitation with long paragraphs that make the important details hard to find. Put optional information in a secondary section or message when appropriate.</p></section>
        <section><h2>Quick review</h2><ul><li>Can a guest find the date in a few seconds?</li><li>Is the start time unambiguous?</li><li>Is the venue specific enough?</li><li>Is an RSVP method included when needed?</li><li>Are names and contact numbers correct?</li></ul></section>
      </>
    ),
  },
  'invitation-sizes': {
    meta: { title: 'Invitation sizes for WhatsApp, Instagram and printing', description: 'A practical guide to digital invitation dimensions and print sizes, with guidance on choosing the right canvas.', category: 'invitation', readMinutes: 5 },
    content: (
      <>
        <section><h2>Choose the size for the destination</h2><p>For digital invitations, a 1080×1350 portrait canvas or 1080×1080 square canvas can work well for social and messaging use. For vertical story or status formats, 1080×1920 is a common choice. The best size is the one that matches where guests will actually view the invitation.</p></section>
        <section><h2>Printing is different</h2><p>Print dimensions should be specified in physical units and prepared at an appropriate resolution. Common invitation formats include 5×7 inches and 4×6 inches. A 5×7-inch design at 300 DPI is 1500×2100 pixels.</p></section>
        <section><h2>Leave room for important text</h2><p>Do not push names, dates or addresses against the edge. If a design will be printed, keep important content inside a safe area and account for the printer's bleed and trim requirements when applicable.</p></section>
        <section><h2>Pick one primary use</h2><p>If an invitation must work for both phone sharing and printing, design for readability first and then test the exported version at the intended physical or screen size. A design that looks attractive on a large monitor can become difficult to read on a phone.</p></section>
      </>
    ),
  },
  'housewarming-invitation-wording': {
    meta: { title: 'Housewarming invitation wording', description: 'Housewarming and Gruhapravesam wording examples with a practical checklist for dates, addresses and ceremony details.', category: 'invitation', readMinutes: 5 },
    content: (
      <>
        <section><h2>Include the home details guests need</h2><p>State the hosts or family, occasion, date, time and complete address. If guests need to enter through a particular gate or use a landmark, add a short directions note.</p></section>
        <section><h2>Formal Gruhapravesam example</h2><p>“With the blessings of our family, we invite you to the Gruhapravesam of our new home on Sunday, 16 May 2027 at 9 AM. 12 Green Valley Residency, Vijayawada. Your presence and blessings will make the occasion special.”</p></section>
        <section><h2>Warm and friendly example</h2><p>“We have a new home! Please join us for our housewarming on 16 May from 9 AM onwards. We would be delighted to celebrate this new beginning with you.”</p></section>
        <section><h2>Before sharing</h2><ul><li>Check the full address.</li><li>Confirm the ceremony and gathering times.</li><li>Add RSVP details if required.</li><li>Make sure the map or landmark information is understandable.</li></ul></section>
      </>
    ),
  },
  'naming-ceremony-invitation': {
    meta: { title: 'Naming ceremony invitation examples', description: 'Naming ceremony wording ideas for traditional and modern invitations, with a checklist for family and ceremony details.', category: 'invitation', readMinutes: 5 },
    content: (
      <>
        <section><h2>Build the invitation around the ceremony</h2><p>Include the parents or family, the baby or child when the name is being announced, ceremony date and time, venue and RSVP details. If the ceremony follows a particular family tradition, include only the details guests need to participate.</p></section>
        <section><h2>Traditional example</h2><p>“With joy and gratitude, we invite you to the naming ceremony of our daughter on 10 March 2027 at 11 AM at our residence. Your presence and blessings are warmly requested.”</p></section>
        <section><h2>Modern example</h2><p>“It is time to give our little one a name! Please join us on 10 March at 11 AM as we celebrate with family and friends. RSVP: 98765 43210.”</p></section>
        <section><h2>Keep the wording respectful and clear</h2><p>Family traditions vary, so avoid assuming that one ceremony format applies to every family. Use the wording that accurately reflects your event and make the practical details easy to find.</p></section>
      </>
    ),
  },
  'ats-friendly-resume': {
    meta: { title: 'How to create an ATS-friendly resume', description: 'Practical resume formatting and content guidance for making your experience easy for recruiters and applicant tracking systems to read.', category: 'resume', readMinutes: 7 },
    content: (
      <>
        <section><h2>Start with a clear structure</h2><p>Use familiar headings such as Work Experience, Education, Skills and Projects. Put your most relevant information where a recruiter can find it quickly. A clean single-column layout is often the safest choice when compatibility matters.</p></section>
        <section><h2>Use job-relevant language naturally</h2><p>Read the job description and use accurate terminology for skills you actually have. Do not copy a keyword repeatedly or claim experience you do not have. Strong bullets connect an action to an outcome, for example: “Reduced API response time by 40% by optimizing database queries.”</p></section>
        <section><h2>Keep formatting predictable</h2><p>Use readable fonts, consistent dates, clear section headings and normal text rather than putting important information inside images or decorative shapes. Export the finished resume and inspect the PDF before applying.</p></section>
        <section><h2>Do not treat ATS as a guarantee</h2><p>Applicant tracking systems vary, and a technically parseable resume is only one part of an application. Relevance, evidence of skills, clarity and fit for the role still matter.</p></section>
        <section><h2>Final checklist</h2><ul><li>Use standard section headings.</li><li>Keep dates and job titles consistent.</li><li>Match relevant skills honestly.</li><li>Use measurable outcomes where available.</li><li>Check the exported file for missing or misplaced text.</li></ul></section>
      </>
    ),
  },
  'fresher-resume-format': {
    meta: { title: 'Fresher resume format with examples', description: 'A practical resume structure for students and fresh graduates, including projects, skills, education and internships.', category: 'resume', readMinutes: 6 },
    content: (
      <>
        <section><h2>A strong fresher structure</h2><p>Start with your name and contact details, followed by a short profile if it adds useful context. Then show education, projects, skills, internships or relevant experience, certifications and other evidence that supports the role.</p></section>
        <section><h2>Make projects do the work</h2><p>For each useful project, explain what you built, what technologies you used and what the result was. “Built a student attendance app using React and Firebase” is stronger than listing only the project title.</p></section>
        <section><h2>Education without unnecessary detail</h2><p>Include your degree, institution and dates. Add CGPA or marks when they are useful for the role or when an application asks for them. Avoid filling the page with school-level details that do not help the target application.</p></section>
        <section><h2>Keep it focused</h2><p>A fresher resume does not need to look artificially full. One clear page with relevant evidence is better than dense text that is difficult to scan.</p></section>
      </>
    ),
  },
  'software-engineer-resume': {
    meta: { title: 'Software engineer resume guide', description: 'A practical software engineering resume guide covering impact, technical skills, projects and evidence of ownership.', category: 'resume', readMinutes: 7 },
    content: (
      <>
        <section><h2>Lead with impact</h2><p>Describe what changed because of your work. Useful evidence can include latency, reliability, cost, adoption, delivery time or scale. For example: “Reduced API response time by 40% after optimizing database queries.”</p></section>
        <section><h2>Show the technical context</h2><p>Name the languages, frameworks, databases and cloud or developer tools that were genuinely important to the work. Grouping skills makes the stack easier to scan, while the experience section should show how those skills were used.</p></section>
        <section><h2>Write stronger bullets</h2><p>A useful pattern is <strong>action + technical work + outcome</strong>. Replace “Worked on backend APIs” with a specific description such as “Designed and maintained Node.js APIs for order processing, adding validation that reduced failed requests.”</p></section>
        <section><h2>Tailor without rewriting everything</h2><p>Keep a strong base resume, then adjust the summary, skills emphasis and most relevant bullets for the role. Only claim technologies and responsibilities that accurately represent your experience.</p></section>
      </>
    ),
  },
  'one-page-vs-two-page-resume': {
    meta: { title: 'One-page versus two-page resume', description: 'How to decide between a one-page and two-page resume based on experience, relevance and the amount of useful evidence you have.', category: 'resume', readMinutes: 5 },
    content: (
      <>
        <section><h2>Choose one page when it tells the story clearly</h2><p>Students, fresh graduates and many early-career candidates can usually present their strongest evidence on one page. The goal is not to hit a page count; it is to make the relevant information easy to find.</p></section>
        <section><h2>Use two pages when the evidence earns the space</h2><p>More experienced professionals may need two pages to cover several relevant roles, leadership responsibilities, major projects or substantial achievements. Do not expand a resume to two pages by increasing spacing or repeating information.</p></section>
        <section><h2>What to remove first</h2><p>Cut outdated or unrelated experience, repetitive bullets, generic objectives and low-value skill lists before shrinking the font. Keep evidence that helps the reader understand your fit for the target role.</p></section>
        <section><h2>Final test</h2><p>Ask someone unfamiliar with your work to scan the resume briefly and identify your target role, strongest skills and most important achievements. If they cannot find those quickly, simplify the document.</p></section>
      </>
    ),
  },
}

for (const slug of Object.keys(GUIDE_DATA)) {
  GUIDES[slug] = { meta: { slug, ...GUIDE_DATA[slug].meta }, content: GUIDE_DATA[slug].content }
}

export default function GuidePage() {
  const { slug } = useParams<{ slug: string }>()
  const guide = slug ? GUIDES[slug] : undefined

  if (!guide) {
    return <div className="max-w-3xl mx-auto p-6"><h1 className="text-3xl font-bold mb-4">Guide not found</h1><p className="text-gray-600">We could not find that guide. Browse all guides on the guides page.</p></div>
  }

  return <GuideArticle meta={guide.meta}>{guide.content}</GuideArticle>
}
