// TODO: 顧問姓名、學經歷、數據、案例與價格皆為示範用假資料，上線前請替換為真實資訊。

export const en = {
  skipLink: "Skip to main content",

  nav: {
    brand: "Dr. Lin Yu-Chen",
    brandSub: "Food Research Advisory",
    label: "Main",
    links: {
      about: "About",
      clients: "Who I help",
      services: "Services",
      process: "Process",
      contact: "Contact",
    },
    cta: "Start an inquiry",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },

  hero: {
    eyebrow: "Independent food research consultant",
    titleLines: ["Food science answers,", "backed by real research."],
    intro:
      "I'm Dr. Lin Yu-Chen, a food scientist with 14 years in R&D and quality labs. I help individuals, growing brands and larger teams make evidence-based decisions on formulation, shelf life, food safety and labeling — as your advisor, on your schedule.",
    primaryCta: "Describe your project",
    secondaryCta: "See how it works",
    statsLabel: "At a glance",
    stats: [
      { value: "14 yrs", label: "in food R&D and quality assurance" },
      { value: "120+", label: "advisory projects completed" },
      { value: "2 days", label: "typical first reply" },
    ],
    scrollHint: "Scroll to explore",
  },

  about: {
    eyebrow: "About me",
    title: "A researcher who explains the science — and its limits",
    paragraphs: [
      "I spent eight years leading product development at a packaged-food manufacturer and four years running a quality lab before becoming an independent consultant. That means I've seen both sides: the formulation bench and the audit table.",
      "Today I work remotely with clients across Taiwan and abroad. You bring the question; I bring the literature, the standards and the practical experience to turn it into a clear, documented answer.",
    ],
    credentialsTitle: "Background",
    credentials: [
      "Ph.D. in Food Science & Technology",
      "8 years leading R&D for a packaged-food manufacturer",
      "Former QA manager — HACCP and ISO 22000 systems",
      "12 peer-reviewed papers on food preservation",
    ],
    principlesTitle: "How I work",
    principles: [
      {
        title: "Evidence first",
        text: "Every recommendation cites data, a standard or published research — never guesswork.",
      },
      {
        title: "Plain language",
        text: "Clear explanations and concrete next steps, whatever your technical background.",
      },
      {
        title: "Confidential by default",
        text: "Your recipes and documents stay private. I sign an NDA on request.",
      },
      {
        title: "Honest scope",
        text: "If a question needs a lab, a lawyer or another specialist, I'll say so and point you to one.",
      },
    ],
  },

  clients: {
    eyebrow: "Who I help",
    title: "Find the way of working that fits you",
    intro:
      "Whether you're testing a recipe at home or managing a product portfolio, here's exactly what working together looks like.",
    tabsLabel: "Client type",
    labels: {
      fit: "You might be",
      help: "What I can help with",
      format: "How we work",
      deliverables: "What you receive",
      pricing: "Pricing",
    },
    types: {
      individual: {
        name: "Individuals",
        tagline: "Home producers, founders, students",
        fit: [
          "A home baker or small producer preparing to sell",
          "A founder with a product idea and no technical team",
          "A student or researcher who needs a second opinion",
        ],
        help: [
          "Is my product safe to sell, and how long does it keep?",
          "What must appear on my label?",
          "Which tests do I actually need — and which can I skip?",
        ],
        format:
          "A 60-minute video consultation, prepared in advance from the materials you send. Follow-up questions by email for 14 days.",
        deliverables: [
          "Written summary with prioritized next steps",
          "Checklist tailored to your product",
          "Links to the relevant regulations and references",
        ],
        pricing: "Single session from USD 150. Quoted before we start.",
      },
      sme: {
        name: "Small & medium businesses",
        tagline: "Growing brands, factories, restaurant groups",
        fit: [
          "A brand launching new SKUs or entering a new market",
          "A factory preparing for HACCP or ISO 22000 certification",
          "A team facing a recurring quality problem",
        ],
        help: [
          "Formulation adjustments and ingredient substitutions",
          "Shelf-life strategy and test plan design",
          "Label and claim review before printing",
        ],
        format:
          "A fixed-scope project (typically 2–6 weeks) with agreed milestones and scheduled check-in calls.",
        deliverables: [
          "Technical report with findings and recommendations",
          "Test plans and specification sheets",
          "Review notes on your documents and labels",
        ],
        pricing: "Fixed project fee agreed in a written proposal.",
      },
      enterprise: {
        name: "Enterprise outsourcing",
        tagline: "R&D, QA and regulatory teams",
        fit: [
          "An R&D team needing specialist capacity for a project",
          "A QA department wanting an independent review",
          "A regulatory team needing a literature-backed position",
        ],
        help: [
          "Independent technical reviews and gap analyses",
          "Literature reviews and scientific position papers",
          "Supplier and co-manufacturer technical evaluation",
        ],
        format:
          "Consulting-only engagement under your procurement process: NDA, statement of work, and invoicing per milestone or retainer.",
        deliverables: [
          "Reports in your required format and language (EN / ZH)",
          "Presentation to stakeholders on request",
          "Full documentation of sources and methods",
        ],
        pricing: "Per project or monthly retainer. Vendor documents provided on request.",
      },
    },
    cta: "Start an inquiry",
  },

  services: {
    eyebrow: "Services",
    title: "Six areas I advise on",
    intro:
      "Pick the area closest to your question. Each one comes with a ready-made email template, so you know exactly what to send.",
    questionsLabel: "Typical questions",
    deliverablesLabel: "Typical deliverables",
    useTemplate: "Use this template",
    items: {
      regulatory: {
        title: "Labeling & regulatory",
        summary: "Make sure what's on the package matches the rules in your target market.",
        questions: [
          "Are my ingredient list and allergen declarations correct?",
          "Can I make this health or nutrition claim?",
        ],
        deliverables: ["Label review report", "Claim risk assessment"],
      },
      product: {
        title: "Product & formulation",
        summary: "Turn a recipe into a stable, repeatable, scalable product.",
        questions: [
          "Why does my product separate, harden or lose flavor?",
          "How do I replace an ingredient without changing the product?",
        ],
        deliverables: ["Formulation recommendations", "Scale-up checklist"],
      },
      shelfLife: {
        title: "Shelf life & preservation",
        summary: "Set a shelf life you can defend, using the right hurdles and tests.",
        questions: [
          "How long can I safely label my product?",
          "Can I reduce preservatives without losing shelf life?",
        ],
        deliverables: ["Shelf-life test plan", "Preservation strategy"],
      },
      safety: {
        title: "Food safety systems",
        summary: "Build practical HACCP and hygiene systems that pass audits and work on the floor.",
        questions: [
          "Where are my critical control points?",
          "What's missing before a HACCP or ISO 22000 audit?",
        ],
        deliverables: ["Gap analysis", "HACCP plan review"],
      },
      quality: {
        title: "Quality issues & complaints",
        summary: "Find the root cause of defects and complaints, and stop them coming back.",
        questions: [
          "Why do customers report off-flavors or foreign matter?",
          "How do I investigate a batch failure?",
        ],
        deliverables: ["Root-cause analysis", "Corrective action plan"],
      },
      research: {
        title: "Research & technical writing",
        summary: "Get the science summarized, referenced and written up for your audience.",
        questions: [
          "What does the literature say about this ingredient or process?",
          "Can you draft a technical dossier or white paper?",
        ],
        deliverables: ["Literature review", "Technical report or dossier"],
      },
    },
  },

  process: {
    eyebrow: "Process",
    title: "A transparent path from question to answer",
    intro:
      "No surprises: you'll know what happens next, how long it takes and what it costs before any paid work begins.",
    steps: [
      {
        title: "Send your inquiry",
        text: "Choose a service category, start from the email template, and send it through the form below.",
        duration: "5–10 minutes",
      },
      {
        title: "I reply with questions",
        text: "I read everything you sent and reply with clarifying questions or a request for documents.",
        duration: "Within 2 business days",
      },
      {
        title: "Free scoping call",
        text: "An optional 20-minute call to agree on the goal. An NDA can be signed before this call.",
        duration: "20 minutes · free",
      },
      {
        title: "Written proposal",
        text: "You receive the scope, deliverables, timeline and a fixed quote. Nothing starts until you approve.",
        duration: "Within 3 business days",
      },
      {
        title: "Research & check-ins",
        text: "I carry out the work and share progress at agreed milestones, so there are no surprises at the end.",
        duration: "Per proposal",
      },
      {
        title: "Delivery & follow-up",
        text: "You receive the final deliverables, plus 14 days of follow-up questions by email.",
        duration: "14 days of support",
      },
    ],
    note: "Steps 1 to 4 are free. You only pay after approving a written proposal.",
  },

  cases: {
    eyebrow: "Sample projects",
    title: "Examples of past work",
    intro: "Client names are withheld to protect confidentiality.",
    labels: { problem: "Challenge", approach: "Approach", outcome: "Outcome" },
    items: [
      {
        client: "Home bakery · Individual",
        category: "Shelf life & preservation",
        problem: "Cookies went soft within a week, limiting online sales.",
        approach: "Reviewed the recipe and packaging, then designed a water-activity and packaging test plan.",
        outcome: "Shelf life extended from 7 to 45 days with no added preservatives.",
      },
      {
        client: "Sauce brand · SME",
        category: "Labeling & regulatory",
        problem: "A new product line was about to print labels for three markets.",
        approach: "Line-by-line label review against each market's rules, with a claim risk assessment.",
        outcome: "Nine label issues corrected before printing; launch stayed on schedule.",
      },
      {
        client: "Beverage manufacturer · Enterprise",
        category: "Research & technical writing",
        problem: "The R&D team needed an independent view on a new plant-based ingredient.",
        approach: "Systematic literature review and supplier data assessment over six weeks.",
        outcome: "A 40-page technical report used to support the internal go / no-go decision.",
      },
    ],
  },

  scope: {
    eyebrow: "Scope",
    title: "What's included — and what isn't",
    intro:
      "I work strictly as a consultant. Being clear about the boundaries helps you plan budgets and choose the right partners.",
    doTitle: "What I do",
    doItems: [
      "Remote consultations and document reviews",
      "Research, analysis and written recommendations",
      "Test plans for accredited third-party labs",
      "Training sessions for your team",
    ],
    dontTitle: "What I don't do",
    dontItems: [
      "In-house lab testing or sample production",
      "Manufacturing or co-packing",
      "Legal representation or guaranteed regulatory approval",
      "Formulating products with medical claims",
    ],
    note: "Need lab testing? I'll design the test plan and recommend accredited labs. Testing fees are paid directly to the lab.",
  },

  contact: {
    eyebrow: "Contact",
    title: "Tell me about your project",
    intro:
      "Choose a category, start from the email template, then add your details. I reply within 2 business days.",
    stepCategory: "Choose a category",
    stepTemplate: "Start from the template",
    stepDetails: "Add your details",
    templateHelp:
      "Replace the [bracketed] parts. Share only what you're comfortable with — confidential details can wait until an NDA is signed.",
    subjectLabel: "Subject",
    bodyLabel: "Message",
    currentTemplate: "Template for",
    copy: "Copy template",
    copyDone: "Copied!",
    insertDone: "Inserted!",
    copied: "Template copied to clipboard.",
    copyFailed: "Couldn't copy automatically. Please select the text and copy it manually.",
    insert: "Insert into form",
    inserted: "Template inserted into the subject and message fields.",
    replaceConfirm: "Replace what you've already written in the subject and message?",
    directEmailText: "Prefer your own email app?",
    directEmailLink: "Email me directly",
    email: "hello@example.com",
    form: {
      name: "Name",
      email: "Email",
      clientType: "You are",
      clientTypeOptions: {
        individual: "An individual",
        sme: "A small or medium business",
        enterprise: "A large company (outsourcing)",
      },
      organization: "Company",
      subject: "Subject",
      timeline: "Desired timeline",
      timelineOptions: {
        flexible: "Flexible",
        month: "Within a month",
        urgent: "Urgent (under 2 weeks)",
      },
      message: "Message",
      messageHint: "At least 20 characters. The template above is a good starting point.",
      consent: "I agree that my information will be used only to reply to this inquiry.",
      optional: "optional",
      required: "required",
      selectPlaceholder: "Please choose",
      placeholders: {
        name: "e.g. Alex Wang",
        email: "e.g. alex@sunrise.com",
        organization: "e.g. Sunrise Foods Co., Ltd.",
      },
      honeypot: "Leave this field empty",
      submit: "Send inquiry",
      sending: "Sending…",
      errorSummary: "Please correct the following:",
      errors: {
        required: "This field is required.",
        email: "Enter a valid email address, like name@example.com.",
        tooLong: "This entry is too long.",
        tooShort: "Please write at least 20 characters.",
      },
      serverError: "Something went wrong. Please try again, or email me directly.",
      successTitle: "Thank you — your inquiry has been received.",
      successText:
        "I'll read it carefully and reply within 2 business days with next steps or clarifying questions.",
      newInquiry: "Send another inquiry",
    },
    templates: {
      regulatory: {
        subject: "Label review request — [Product name]",
        body: `Hello Dr. Lin,

I'd like a review of the label for [product name], which will be sold in [country / market].

About the product:
- Product type: [e.g. sauce, baked good, beverage]
- Sales channel: [online / retail / export]
- Planned print or launch date: [date]

What I'd like checked:
- [ ] Ingredient list and allergens
- [ ] Nutrition facts
- [ ] Claims (e.g. "no added sugar", "high protein")
- [ ] Other: [please describe]

I can share: [draft label / recipe / specification sheet]

Thank you,
[Your name]`,
      },
      product: {
        subject: "Formulation support — [Product name]",
        body: `Hello Dr. Lin,

I'm developing [product name] and would like help with its formulation.

Current situation:
- Stage: [idea / home recipe / pilot / in production]
- Main problem: [e.g. texture, stability, taste, cost, scaling up]
- What I've already tried: [brief description]

Goal:
[e.g. replace an ingredient, extend stability, prepare for factory production]

Constraints:
[budget, equipment, clean label, dietary requirements]

Thank you,
[Your name]`,
      },
      shelfLife: {
        subject: "Shelf-life question — [Product name]",
        body: `Hello Dr. Lin,

I'd like advice on the shelf life of [product name].

About the product:
- Product type and main ingredients: [description]
- Packaging: [e.g. vacuum pack, glass jar, paper bag]
- Storage: [room temperature / chilled / frozen]
- Current shelf life on the label: [days, or "not set yet"]

What I'd like to know:
[e.g. a safe shelf life, a test plan, reducing preservatives]

Any existing test data: [yes / no — please describe]

Thank you,
[Your name]`,
      },
      safety: {
        subject: "Food safety system review — [Company or site]",
        body: `Hello Dr. Lin,

We're looking for support with our food safety system at [company / site].

Background:
- Products made: [description]
- Current system: [none / HACCP / ISO 22000 / FSSC 22000 / other]
- Upcoming audit or deadline: [date, if any]

What we need:
- [ ] Gap analysis
- [ ] HACCP plan review
- [ ] Hygiene and SOP documentation
- [ ] Other: [please describe]

Thank you,
[Your name, job title]`,
      },
      quality: {
        subject: "Quality issue investigation — [Product name]",
        body: `Hello Dr. Lin,

We're seeing a recurring quality issue with [product name] and would like help finding the root cause.

The issue:
- What happens: [e.g. off-flavor, color change, foreign matter, swelling]
- When it started / how often: [description]
- Batches or lots affected: [details]
- Customer complaints received: [number, summary]

What we've checked so far: [description]

Thank you,
[Your name, job title]`,
      },
      research: {
        subject: "Research / technical writing request — [Topic]",
        body: `Hello Dr. Lin,

We need a research-based document on [topic].

Details:
- Purpose: [internal decision / regulatory submission / marketing / training]
- Audience: [e.g. management, regulators, customers]
- Format and length: [report, white paper, presentation — approx. pages]
- Language: [English / Traditional Chinese / both]
- Deadline: [date]

Existing materials we can share: [description]

Thank you,
[Your name, job title]`,
      },
    },
  },

  faq: {
    eyebrow: "FAQ",
    title: "Frequently asked questions",
    items: [
      {
        q: "Do I need a detailed brief before contacting you?",
        a: "No. The email templates cover what I need to get started. If something is missing, I'll ask in my first reply.",
      },
      {
        q: "Is the first conversation really free?",
        a: "Yes. Your inquiry, my reply, the 20-minute scoping call and the written proposal are all free. Paid work begins only after you approve the proposal.",
      },
      {
        q: "How do you protect confidential information?",
        a: "I treat everything you send as confidential and can sign your NDA — or provide mine — before you share recipes, specifications or internal data.",
      },
      {
        q: "Can you test my product in a lab?",
        a: "I don't run a lab. I design the test plan, recommend accredited labs, and interpret the results with you. Testing fees are paid directly to the lab.",
      },
      {
        q: "Do you work with companies outside Taiwan?",
        a: "Yes. All work is remote, in English or Traditional Chinese. I can advise on Taiwan regulations directly and help you coordinate with local experts for other markets.",
      },
      {
        q: "How do payments work?",
        a: "Individual sessions are paid in advance. Projects are invoiced per milestone. Enterprise clients can be invoiced according to their procurement process.",
      },
    ],
  },

  footer: {
    tagline: "Independent food research and consulting. Remote, confidential, evidence-based.",
    navLabel: "Footer",
    rights: "All rights reserved.",
    backToTop: "Back to top",
  },
};

export type Dictionary = typeof en;
