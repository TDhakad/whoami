// ─────────────────────────────────────────────────────────────────────────────
// portfolio-data.ts
//
// Single source of truth for all portfolio content.
// Edit this file to update any text, links, or data that appears on the site.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Types ────────────────────────────────────────────────────────────────────

export type ButtonVariant = "default" | "outline" | "ghost";

export type EducationItem = {
  id: string;
  degree: string;
  org: string;
  period: string;
  gpa?: string;
};

// ─── Education Timeline (vertical rail) ──────────────────────────────────────

export type EducationTimelineCta = {
  label: string;
  action: "scene" | "route" | "download";
  target: string;
};

export type EducationTimelineItem = {
  id: string;
  label: string;
  title: string;
  org: string;
  meta: string;
  description: string;
  bullets?: string[];
  ctas?: EducationTimelineCta[];
};

export type SpellItem = {
  name: string;
  built: string;
  learned: string;
};

// ─── Hero ─────────────────────────────────────────────────────────────────────

export const hero = {
  eyebrow: "Welcome to the story of an AI artistry magician.",
  name: "Tushar Dhakad",
  tagline: "Full-Stack Developer • AI-assisted craftsmanship",
  ctas: [
    { label: "Enter", variant: "default" as ButtonVariant },
    { label: "View Work", variant: "outline" as ButtonVariant },
  ],
} as const;

// ─── Narrator ─────────────────────────────────────────────────────────────────
//
// Keys are scene indices (0-based).
// Only scenes with an entry will trigger a narrator moment.

export const narratorLines: Record<number, string> = {
  0: "Welcome to the story of an AI artistry magician.",
  1: "Oh? Starting with the origins… I like you already.",
  2: "You're peeking behind the curtain… want the spells?",
};

// ─── Education Scene ──────────────────────────────────────────────────────────

export const education = {
  eyebrow: "Education",
  title: "The Origin Path",
  description:
    "The foundations that shaped how I build today.",
  items: [
    {
      id: "bachelors",
      degree: "B.Tech — Computer Science & Engineering",
      org: "Institute of Design Systems",
      period: "2021 — 2025",
      gpa: "3.9 / 4.0",
    },
    {
      id: "specialization",
      degree: "Specialization — Human-AI Interaction",
      org: "Studio for Human-AI Narratives",
      period: "2023 — 2024",
      gpa: "4.0 / 4.0",
    },
  ] satisfies EducationItem[],
};

// ─── Education Timeline (vertical rail) — new interactive version ─────────────

export const educationTimeline = {
  eyebrow: "EDUCATION",
  title: "The Origin Path",
  subtitle:
    "Three chapters that built the foundation: first principles, computer science, then deep specialisation.",
  items: [
    {
      id: "foundation",
      label: "Foundation",
      title: "Higher Secondary — Science & Mathematics",
      org: "Delhi Public School, R.K. Puram",
      meta: "2017 – 2019  •  PCM + Computer Science",
      description:
        "Where it all started. Rigorous mathematics and an introductory CS curriculum planted the seed: logic is beautiful, and code is a way to think precisely. Topped the school in programming and mathematics.",
      bullets: [
        "Scored 97 % in Mathematics and 95 % in Computer Science (CBSE Board)",
        "Built the school's first automated timetable generator in Python",
        "Won the district-level science exhibition with a working neural-network demo",
      ],
    },
    {
      id: "bachelors",
      label: "Bachelors",
      title: "B.Tech — Computer Science & Engineering",
      org: "Institute of Design Systems",
      meta: "2019 – 2023  •  GPA 3.9 / 4.0",
      description:
        "Four years of systems thinking, algorithms, and human-computer interaction research. Graduated with distinction. Thesis explored using generative language models to scaffold front-end code from natural-language descriptions.",
      bullets: [
        "Graduated in the top 2 % of the cohort (rank 3 / 180)",
        "Research assistant: published a paper on transformer-based UI generation",
        "Led the dev team for the university's open-source design-system library",
        "Internship at a fintech startup — redesigned their onboarding flow, cutting drop-off by 38 %",
      ],
      ctas: [
        { label: "View Thesis", action: "route", target: "/thesis" },
      ],
    },
    {
      id: "specialization",
      label: "Specialization",
      title: "Specialization — Human-AI Interaction Design",
      org: "Studio for Human-AI Narratives",
      meta: "2023 – 2024  •  GPA 4.0 / 4.0",
      description:
        "A one-year intensive at the intersection of LLM product design, interaction research, and creative coding. Studied under practitioners building production AI tools. Culminated in a capstone that shipped to 2 000+ beta users.",
      bullets: [
        "Completed 6 project-based modules — all graded with real-world briefs",
        "Capstone: multi-modal AI creative assistant, used by 2 k beta testers in 3 months",
        "Presented at the studio's annual showcase; received the 'Most Innovative Prototype' award",
      ],
      ctas: [
        { label: "See Capstone", action: "route", target: "/capstone" },
        { label: "Certificate", action: "download", target: "/certificate.pdf" },
      ],
    },
  ] satisfies EducationTimelineItem[],
} as const;

// ─── Coursework / Spells Scene ────────────────────────────────────────────────

export const coursework = {
  eyebrow: "Coursework",
  title: "Spells I'm Practicing",
  description:
    "Six focused disciplines I'm casting into real-world experiences.",
  spells: [
    {
      name: "Generative AI",
      built: "A multi-model pipeline that blends text and image generation for live creative demos.",
      learned: "How to wrangle non-determinism into useful, repeatable product experiences.",
    },
    {
      name: "Full-Stack Systems",
      built: "An end-to-end SaaS starter with auth, billing, and real-time data sync.",
      learned: "How to reason about the full request lifecycle and keep it fast at every layer.",
    },
    {
      name: "Data Visualization",
      built: "An interactive dashboard that surfaces patterns across millions of events.",
      learned: "That the best charts make the insight obvious before the user reads a label.",
    },
    {
      name: "Creative Coding",
      built: "Generative canvas sketches and shader experiments embedded in live web pages.",
      learned: "How math and randomness combine to create work that feels intentional.",
    },
    {
      name: "Human-Centered Design",
      built: "A research-driven redesign that cut task completion time by 40 %.",
      learned: "Listening first always produces better screens than designing first.",
    },
    {
      name: "Performance & Accessibility",
      built: "A zero-layout-shift, 100-Lighthouse-score page with full keyboard navigation.",
      learned: "Fast and accessible aren't trade-offs — they're the same goal.",
    },
  ] satisfies SpellItem[],
};

// ─── Spell Carousel (3D coverflow) ───────────────────────────────────────────

export const spellCarousel = {
  eyebrow: "COURSEWORK",
  title: "Spells I'm Casting",
  subtitle: "Six focused disciplines I'm forging into real-world craft. Click a card to flip it.",
  items: [
    {
      id: "gen-ai",
      title: "Generative AI",
      icon: "spark" as const,
      summary:
        "Wrangling LLMs, diffusion models, and multi-modal pipelines into products that are actually reliable.",
      tags: ["LLMs", "Diffusion", "RAG", "Prompt Eng."],
      details: [
        "Built a multi-model pipeline blending text + image generation for live demos.",
        "Designed prompt-chaining patterns to reduce hallucination rates by ~60 %.",
        "Integrated vector search (pgvector) for semantic document retrieval.",
        "Shipped a production RAG chatbot used by 500+ internal users.",
      ],
    },
    {
      id: "fullstack",
      title: "Full-Stack Systems",
      icon: "code" as const,
      summary:
        "End-to-end SaaS architecture: auth, billing, real-time sync, and keeping every layer fast.",
      tags: ["Next.js", "tRPC", "Postgres", "Redis"],
      details: [
        "Architected a SaaS starter with Clerk auth, Stripe billing, and Postgres.",
        "Reduced API p99 latency from 420 ms → 38 ms using edge-cached tRPC routes.",
        "Implemented real-time presence with Supabase Realtime channels.",
        "Set up a CI/CD pipeline with zero-downtime deployments on Vercel.",
      ],
    },
    {
      id: "creative-coding",
      title: "Creative Coding",
      icon: "wand" as const,
      summary:
        "Canvas sketches, GLSL shaders, and generative art — where math and randomness become beauty.",
      tags: ["Canvas 2D", "WebGL", "GLSL", "p5.js"],
      details: [
        "Wrote a procedural terrain generator using Perlin noise in GLSL.",
        "Embedded interactive shader art into live Next.js pages without FPS drops.",
        "Created a generative type system that responds to audio frequency data.",
        "Open-sourced a micro creative-coding library with 300+ GitHub stars.",
      ],
    },
    {
      id: "data-viz",
      title: "Data Visualization",
      icon: "chart" as const,
      summary:
        "Dashboards that surface insight before the user reads a single label — performance matters too.",
      tags: ["D3.js", "Observable", "Recharts", "SVG"],
      details: [
        "Built an event-analytics dashboard handling 10 M+ rows via server aggregation.",
        "Designed a custom D3 force-layout for a network-graph explorer.",
        "Reduced time-to-insight by 55 % through progressive-disclosure UX.",
        "Maintained 60 fps animations on large datasets using canvas rendering.",
      ],
    },
    {
      id: "hci",
      title: "Human-Centered Design",
      icon: "brain" as const,
      summary:
        "Research-first redesigns that cut task completion time and actually ship without compromise.",
      tags: ["User Research", "Figma", "Usability", "A/B Testing"],
      details: [
        "Conducted 18 moderated usability sessions; synthesised into a prioritised backlog.",
        "Redesigned an onboarding flow — cut drop-off by 38 % in the first sprint.",
        "Ran an A/B test framework that became the team's standard for feature launches.",
        "Maintained a living design system used by 4 product teams simultaneously.",
      ],
    },
    {
      id: "perf-a11y",
      title: "Performance & Accessibility",
      icon: "layers" as const,
      summary:
        "Zero layout shift, 100 Lighthouse score, full keyboard navigation — fast and accessible are the same goal.",
      tags: ["Core Web Vitals", "WCAG 2.2", "a11y", "Lighthouse"],
      details: [
        "Achieved a perfect Lighthouse score (100/100 all four categories) in production.",
        "Eliminated all CLS by converting dynamic content to CSS aspect-ratio placeholders.",
        "Audited and fixed 42 WCAG 2.2 AA violations across a large legacy codebase.",
        "Mentored a team of 5 on accessible component patterns, reducing future regressions.",
      ],
    },
  ],
};

// ─── Coursework Grid (expandable card grid) ───────────────────────────────────

export const courseworkGrid = {
  eyebrow: "COURSEWORK",
  title: "Spells I'm Practicing",
  subtitle:
    "Six disciplines I'm actively forging into real craft — click a card to unfold what I built and learned.",
  items: [
    {
      id: "gen-ai",
      title: "Generative AI",
      summary: "Turning non-deterministic models into dependable product experiences.",
      content:
        "Designed and shipped multi-model pipelines that blend text and image generation. Built RAG systems on top of pgvector, wrote prompt-chaining strategies to cut hallucination rates significantly, and integrated everything into a chatbot used by 500+ internal users.",
      skills: ["LLMs", "RAG", "pgvector", "Prompt Engineering", "Diffusion Models", "LangChain"],
      projectLink: { label: "See related project", target: "projects" },
    },
    {
      id: "fullstack",
      title: "Full-Stack Systems",
      summary: "End-to-end SaaS architecture with auth, billing, and real-time data.",
      content:
        "Architected a production SaaS starter covering Clerk auth, Stripe billing, Postgres + Drizzle ORM, and edge-cached tRPC routes. Reduced API p99 latency from 420 ms to 38 ms, and implemented real-time presence via Supabase Realtime channels.",
      skills: ["Next.js", "tRPC", "Postgres", "Drizzle ORM", "Redis", "Stripe", "Clerk"],
    },
    {
      id: "data-viz",
      title: "Data Visualization",
      summary: "Dashboards that surface insight before the user reads a single label.",
      content:
        "Built an event-analytics dashboard handling 10 M+ rows via server-side aggregation. Designed a custom D3 force-layout network graph, and maintained 60 fps on large datasets by offloading rendering to a canvas worker.",
      skills: ["D3.js", "Observable", "SVG", "Canvas API", "Recharts", "SQL aggregations"],
      projectLink: { label: "See related project", target: "projects" },
    },
    {
      id: "creative-coding",
      title: "Creative Coding",
      summary: "Canvas sketches and GLSL shaders — where math and randomness become beauty.",
      content:
        "Wrote a procedural terrain generator using Perlin noise in GLSL, embedded interactive shader art in live Next.js pages without FPS drops, and created a generative type system that responds to real-time audio frequency data.",
      skills: ["Canvas 2D", "WebGL", "GLSL", "p5.js", "Perlin Noise", "Web Audio API"],
    },
    {
      id: "hci",
      title: "Human-Centered Design",
      summary: "Research-first redesigns that cut task completion time and actually ship.",
      content:
        "Conducted 18 moderated usability sessions and synthesised findings into a prioritised backlog. Redesigned an onboarding flow that cut drop-off by 38 % in the first sprint. Ran an A/B test framework that became the team's standard for feature launches.",
      skills: ["User Research", "Figma", "Usability Testing", "A/B Testing", "Jobs-to-be-Done", "Design Systems"],
    },
    {
      id: "perf-a11y",
      title: "Performance & Accessibility",
      summary: "100 Lighthouse, zero CLS, full keyboard nav — fast and accessible are the same goal.",
      content:
        "Achieved a perfect Lighthouse score across all four categories in production. Eliminated CLS with CSS aspect-ratio containers, audited and fixed 42 WCAG 2.2 AA violations in a large legacy codebase, and mentored a team of 5 on accessible component patterns.",
      skills: ["Core Web Vitals", "WCAG 2.2", "Lighthouse", "ARIA", "Keyboard Navigation", "CSS Containment"],
    },
  ],
};

// ─── Work Experience ──────────────────────────────────────────────────────────

import type { WorkRoleType } from "@/components/work-experience";

export type WorkRoleData = {
  id: string;
  type: WorkRoleType;
  title: string;
  company: string;
  dates: string;
  hook: string;
  techBullets: string[];
  businessBullets: string[];
  skills: string[];
  narratorLine?: string;
  supervisor?: { name: string; role: string };
  companyUrl?: string;
};

export const workExperience = {
  eyebrow: "EXPERIENCE",
  title: "Chapters in the Field",
  subtitle:
    "Every role taught something the classroom couldn't. These are the real proving grounds.",
  roles: [
    {
      id: "swe-intern-nova",
      type: "Intern" as WorkRoleType,
      title: "Software Engineering Intern",
      company: "Nova Systems",
      dates: "May 2022 – Aug 2022",
      hook: "Cut API latency by 3× with edge caching and redesigned the data-ingestion pipeline.",
      narratorLine:
        "The first real production bug is unforgettable — and you fixed it in three hours.",
      supervisor: { name: "Priya Mehta", role: "Senior SWE" },
      companyUrl: "https://example.com/nova",
      techBullets: [
        "Migrated six REST endpoints to tRPC with Zod validation, eliminating an entire category of runtime type errors.",
        "Built an edge-cache layer using Cloudflare Workers KV, reducing median API latency from 310 ms to 98 ms.",
        "Rewrote the CSV data-ingestion pipeline in a streaming fashion, cutting peak memory usage by 70 %.",
        "Added OpenTelemetry instrumentation and built a Grafana dashboard surfacing p50/p95/p99 latencies.",
        "Wrote 40+ unit and integration tests, raising coverage from 48 % to 81 % on the data service.",
      ],
      businessBullets: [
        "The latency reduction directly unblocked a customer who had raised a blocking support ticket.",
        "Streaming ingestion enabled processing files 5× larger than the previous limit, opening a new enterprise tier.",
        "Improved observability reduced mean time to detection for incidents from 22 min to under 5 min.",
      ],
      skills: [
        "TypeScript", "tRPC", "Zod", "Cloudflare Workers", "OpenTelemetry",
        "Grafana", "Postgres", "Node.js",
      ],
    },
    {
      id: "fe-engineer-prism",
      type: "Full-time" as WorkRoleType,
      title: "Frontend Engineer",
      company: "Prism Labs",
      dates: "Sep 2023 – Jun 2024",
      hook: "Owned the design system and shipped the AI-powered search feature used by 40 k users.",
      narratorLine:
        "Design systems are invisible until they're not — and then everyone notices.",
      supervisor: { name: "Daniel Park", role: "Engineering Lead" },
      companyUrl: "https://example.com/prism",
      techBullets: [
        "Architected and shipped a 60-component Radix-based design system with full Storybook documentation.",
        "Implemented semantic vector search UI (pgvector + OpenAI embeddings) with streaming result rendering.",
        "Achieved a Core Web Vitals score of 98 in production by eliminating layout shift and optimising LCP.",
        "Migrated the dashboard from Create React App to Next.js 14 App Router — build times fell from 4 min to 34 s.",
        "Built a real-time collaboration layer using Liveblocks for shared dashboards.",
        "Led accessibility audit; fixed 42 WCAG 2.2 AA violations across the product.",
      ],
      businessBullets: [
        "The design system cut new feature UI development time by ~40 % (measured over six sprints).",
        "AI search increased session depth by 28 % and reduced zero-result searches from 18 % to 4 %.",
        "Performance improvements correlated with a 12 % lift in free-to-paid conversion within 60 days.",
        "Accessibility fixes expanded the addressable market to government procurement channels.",
      ],
      skills: [
        "Next.js", "React", "TypeScript", "Radix UI", "Tailwind CSS",
        "Framer Motion", "Liveblocks", "OpenAI", "Storybook", "Playwright",
      ],
    },
    {
      id: "ai-engineer-meridian",
      type: "Full-time" as WorkRoleType,
      title: "AI Product Engineer",
      company: "Meridian AI",
      dates: "Jul 2024 – Present",
      hook: "Building production RAG pipelines and an agent orchestration layer serving 500+ internal users.",
      narratorLine:
        "Working at the frontier means the map runs out — and that's exactly where it gets interesting.",
      supervisor: { name: "Sofia Reyes", role: "Head of AI Products" },
      companyUrl: "https://example.com/meridian",
      techBullets: [
        "Designed a multi-step RAG pipeline with hybrid BM25 + vector retrieval, cutting hallucination rates by ~60 %.",
        "Built an agent orchestration layer using LangGraph with tool-call retry logic and structured output validation.",
        "Implemented streaming SSE responses in Next.js, enabling real-time token rendering across all AI surfaces.",
        "Created an automated prompt-evaluation harness that runs on every PR, catching regressions before they reach prod.",
        "Optimised context window usage by implementing adaptive chunking strategies (late chunking + contextual retrieval).",
        "Shipped a multi-modal pipeline combining GPT-4o vision with custom OCR post-processing for document Q&A.",
      ],
      businessBullets: [
        "The RAG pipeline reduced customer support ticket volume by 34 % in the first month post-launch.",
        "Agent orchestration cut average task-completion time for internal analysts from 25 min to under 4 min.",
        "Prompt evaluation harness caught 11 quality regressions in the first quarter, preventing three production incidents.",
        "Document Q&A feature became the top-requested integration, directly influencing two enterprise contract renewals.",
        "Streaming responses improved perceived latency scores (user surveys) by 41 percentage points.",
      ],
      skills: [
        "LangGraph", "LangChain", "RAG", "pgvector", "GPT-4o",
        "Next.js", "TypeScript", "SSE", "Prompt Engineering", "Python",
      ],
    },
  ] satisfies WorkRoleData[],
};
