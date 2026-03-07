"use client";

import * as React from "react";
import type { Variants } from "framer-motion";
import { motion, useReducedMotion } from "framer-motion";
import { Container } from "@/components/container";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { FogRevealText } from "@/components/fog-reveal-text";
import { FogWipeReveal } from "@/components/fog-wipe-reveal";
import { Stage } from "@/components/stage";
import { EducationTimeline } from "@/components/education-timeline";
import type { EducationTimelineItem } from "@/components/education-timeline";
import { CourseworkGrid } from "@/components/coursework-grid";
import { WorkExperience } from "@/components/work-experience";
import type { WorkRole } from "@/components/work-experience";
import { LearningSection } from "@/components/learning-section";
import type { LearningItem } from "@/components/learning-section";
import { Footer } from "@/components/footer";
import { ProjectsCarousel } from "@/components/projects-carousel";
import { hero, educationTimeline, courseworkGrid, workExperience, projectsMeta, projectsData } from "@/lib/portfolio-data";

/* ── Learning data (unified model) ───────────────────────────────── */

const learningItems: LearningItem[] = [
  {
    id: "learn-deep-learning",
    type: "course",
    title: "Deep Learning Specialization",
    author: "Andrew Ng",
    source: "Coursera",
    duration: "~60 h",
    completed: "Aug 2024",
    nugget:
      "Backpropagation finally made visual sense. Every weight update is just gradient descent — that reframe changed how I reason about every ML system I touch.",
    appliedIn: [
      "Designed layer architecture for a neural net side-project without copy-pasting templates",
      "Explained gradient flow to teammates at a study group",
    ],
    tags: ["Neural Nets", "Deep Learning", "Python", "TensorFlow"],
    url: "https://www.coursera.org/specializations/deep-learning",
    certificateUrl: "https://coursera.org",
  },
  {
    id: "learn-cs50",
    type: "course",
    title: "CS50x",
    author: "David Malan",
    source: "Harvard / edX",
    duration: "~100 h",
    completed: "Jan 2023",
    nugget:
      "Abstraction layers exist to be understood, not just used. Writing C before JavaScript made me permanently better at both.",
    appliedIn: [
      "Debugged a subtle memory leak in a Node.js buffer by thinking at the C level",
      "Taught pointer concepts when mentoring a junior developer",
    ],
    tags: ["Foundations", "C", "Algorithms", "Memory"],
    url: "https://cs50.harvard.edu/x/",
  },
  {
    id: "learn-missing-semester",
    type: "course",
    title: "The Missing Semester of CS",
    author: "MIT",
    source: "MIT OCW",
    duration: "~12 h",
    completed: "Mar 2023",
    nugget:
      "Shell pipes and awk scripts replaced hours of manual work. ‘Know your tools’ stopped being advice and became a competitive advantage.",
    appliedIn: [
      "Wrote a shell pipeline that automated a weekly CSV report",
      "Configured Vim motions — cut editing time meaningfully",
    ],
    tags: ["Shell", "Vim", "Git", "Debugging"],
    url: "https://missing.csail.mit.edu/",
  },
  {
    id: "learn-you-dont-know-js",
    type: "article",
    title: "You Don’t Know JS (Yet)",
    author: "Kyle Simpson",
    source: "GitHub / O’Reilly",
    duration: "~8 h read",
    completed: "Nov 2023",
    nugget:
      "The `this` keyword stopped being confusing the moment I understood lexical scope vs. call-site binding. Six years of copy-pasting code vanished overnight.",
    appliedIn: [
      "Refactored an event-listener class that had a silent `this`-binding bug",
      "Wrote an internal wiki page on closure semantics for the team",
    ],
    tags: ["JavaScript", "Scope", "Closures", "Prototypes"],
    url: "https://github.com/getify/You-Dont-Know-JS",
  },
  {
    id: "learn-fp-mostly-adequate",
    type: "article",
    title: "Mostly Adequate Guide to FP",
    author: "Prof Frisby",
    source: "Gitbook",
    duration: "~6 h read",
    completed: "Feb 2024",
    nugget:
      "Pure functions and function composition aren’t academic — they’re the reason React hooks feel so natural. Immutability clicked as a practical tool, not a constraint.",
    appliedIn: [
      "Replaced a stateful utility class with a chain of pure functions",
      "Used function composition for a data-transformation pipeline in a side project",
    ],
    tags: ["FP", "Functors", "Monads", "Composition"],
    url: "https://mostly-adequate.gitbook.io/mostly-adequate-guide",
  },
  {
    id: "learn-theo-fullstack",
    type: "youtube",
    title: "Why I Stopped Using REST",
    author: "Theo (t3.gg)",
    source: "YouTube",
    duration: "28 min",
    nugget:
      "Type-safe APIs aren’t a trade-off between speed and safety — tRPC proved you can have both for free if you own both ends of the wire.",
    appliedIn: [
      "Adopted tRPC for an internal dashboard; eliminated a whole category of type mismatches",
      "Stopped writing separate API type files; types flow server-to-client automatically",
    ],
    tags: ["tRPC", "TypeScript", "API Design", "Full-stack"],
    url: "https://www.youtube.com/@t3dotgg",
  },
  {
    id: "learn-primeagen-algo",
    type: "youtube",
    title: "Last Algorithms Course You’ll Need",
    author: "ThePrimeagen",
    source: "Frontend Masters",
    duration: "9 h",
    nugget:
      "Big-O clicked as physical intuition, not math. Watching real traversal paths made me stop guessing and start predicting performance.",
    appliedIn: [
      "Replaced an O(n²) list-diff with a hash-map approach in a React reconciliation hotpath",
      "Identified a linear-scan bottleneck in a search feature using the vocabulary from this course",
    ],
    tags: ["Algorithms", "Data Structures", "Performance", "DSA"],
    url: "https://frontendmasters.com/courses/algorithms/",
  },
  {
    id: "learn-fireship-docker",
    type: "youtube",
    title: "Docker in 100 Seconds",
    author: "Fireship",
    source: "YouTube",
    duration: "2 min",
    nugget:
      "‘Works on my machine’ became ‘I can prove this runs identically everywhere.’ Reproducible builds stopped being a DevOps luxury.",
    appliedIn: [
      "Containerised this portfolio’s dev environment so onboarding is a single command",
      "Set up a Docker-based CI pipeline that mirrors production exactly",
    ],
    tags: ["Docker", "DevOps", "Containers", "CI/CD"],
    url: "https://youtu.be/Gjnup-PuquQ",
  },
  {
    id: "learn-hpbn",
    type: "article",
    title: "High Performance Browser Networking",
    author: "Ilya Grigorik",
    source: "hpbn.co",
    duration: "~10 h read",
    completed: "Jul 2024",
    nugget:
      "Every millisecond of latency has a physical explanation. Once I understood TCP slow-start and TLS handshakes, I stopped treating the network as a black box.",
    appliedIn: [
      "Reduced TTFB on a Next.js app by pre-connecting to third-party origins",
      "Switched to HTTP/2 multiplexing after understanding why HTTP/1.1 head-of-line blocking hurt",
    ],
    tags: ["Networking", "HTTP", "TCP", "Performance", "Web"],
    url: "https://hpbn.co",
  },
  {
    id: "yt-fireship-nextjs",
    type: "youtube",
    title: "Next.js in 100 Seconds",
    author: "Fireship",
    source: "YouTube",
    duration: "2 min",
    tags: ["Next.js", "SSR", "Overview"],
    nugget:
      "Reframed Next.js from 'React with routing' to a full-stack execution environment — that mental shift changed how I structure every project.",
    appliedIn: [
      "Adopted App Router from day one for this portfolio",
      "Stopped thinking of pages as 'routes' and started thinking of them as server-rendered shells",
    ],
    url: "https://youtu.be/Sklc_fQBmcs",
  },
  {
    id: "yt-theo-server-components",
    type: "youtube",
    title: "React Server Components — Why They're a Big Deal",
    author: "Theo (t3.gg)",
    source: "YouTube",
    duration: "22 min",
    tags: ["React", "RSC", "Performance"],
    nugget:
      "Understood the real boundary between server and client for the first time. Zero-bundle-cost data fetching stopped being magic and became a deliberate tool.",
    appliedIn: [
      "Moved static data fetching out of client components in this portfolio",
      "Reduced hydration payload by keeping leaf nodes as server components",
    ],
    url: "https://youtu.be/h7tur48HShs",
  },
  {
    id: "yt-web-dev-simplified-ts",
    type: "youtube",
    title: "TypeScript — The Basics You Didn't Learn",
    author: "Web Dev Simplified",
    source: "YouTube",
    duration: "35 min",
    tags: ["TypeScript", "Types", "Generics"],
    nugget:
      "Generics clicked. Suddenly I could write utilities that were both flexible and type-safe instead of escaping to `any`.",
    appliedIn: [
      "Wrote reusable typed helper functions in lib/utils.ts",
      "Typed all component props with discriminated unions throughout this codebase",
    ],
  },
  {
    id: "course-josh-trpc",
    type: "course",
    title: "Build a Full-Stack App with Next.js & tRPC",
    author: "Josh tried coding",
    source: "YouTube / Self-paced",
    duration: "8 videos",
    tags: ["tRPC", "Next.js", "Full-stack"],
    nugget:
      "End-to-end type safety isn't a luxury — it catches entire classes of runtime bugs before they ever ship. API contracts became first-class citizens in my projects.",
    appliedIn: [
      "Adopted tRPC for internal API routes in a side project",
      "Stopped writing separate API type files; types flow from server to client automatically",
    ],
  },
  {
    id: "course-kent-react-perf",
    type: "course",
    title: "React Performance",
    author: "Kent C. Dodds",
    source: "Epic React",
    duration: "~3 h",
    tags: ["React", "Performance", "Memoization"],
    nugget:
      "Premature optimisation via `useMemo`/`useCallback` was costing more than it saved. Profiling first, then memoising only verified bottlenecks.",
    appliedIn: [
      "Removed unnecessary useMemo calls from CourseworkGrid after profiling",
      "Established a 'measure before memoising' rule in code review",
    ],
    url: "https://epicreact.dev/performance",
  },
  {
    id: "course-tailwind-hero-patterns",
    type: "course",
    title: "Building Beautiful UIs with Tailwind CSS",
    author: "Adam Wathan",
    source: "Tailwind UI / Screencasts",
    duration: "~2 h",
    tags: ["Tailwind", "Design Systems", "CSS"],
    nugget:
      "Treating design tokens as constraints — not suggestions — forces visual consistency at the component level rather than at the design-system level.",
    appliedIn: [
      "Built the entire portfolio palette around CSS custom properties",
      "Used Tailwind semantics (muted, accent, primary) instead of hard-coded colours",
    ],
  },
  {
    id: "article-dan-react-model",
    type: "article",
    title: "A Complete Guide to useEffect",
    author: "Dan Abramov",
    source: "overreacted.io",
    duration: "45 min read",
    tags: ["React", "Hooks", "Mental Model"],
    nugget:
      "Effects synchronise React state with external systems — that single sentence replaced years of 'useEffect as lifecycle' muscle memory and eliminated an entire category of bugs.",
    appliedIn: [
      "Rewrote media-query hooks in CourseworkGrid and LearningShelf to follow the sync model",
      "Stopped using empty dependency arrays as a proxy for componentDidMount",
    ],
    url: "https://overreacted.io/a-complete-guide-to-useeffect/",
  },
  {
    id: "article-josh-css-for-js",
    type: "article",
    title: "The Surprising Truth About Pixels and Accessibility",
    author: "Josh W. Comeau",
    source: "joshwcomeau.com",
    duration: "20 min read",
    tags: ["CSS", "Accessibility", "Typography"],
    nugget:
      "Using `rem` for font-size and `px` for border-radius isn't just convention — it directly affects users who adjust default font size in their browser.",
    appliedIn: [
      "Audited and converted all font-size values to rem units across the portfolio",
      "Added this as a checklist item for every new component",
    ],
    url: "https://www.joshwcomeau.com/css/surprising-truth-about-pixels-and-accessibility/",
  },
  {
    id: "article-lea-oklch",
    type: "article",
    title: "oklch() in CSS: Why We Moved from RGB and HSL",
    author: "Lea Verou",
    source: "lea.verou.me",
    duration: "15 min read",
    tags: ["CSS", "Color", "Design Tokens"],
    nugget:
      "Perceptual uniformity means colours look as different as they measure. Lightness in oklch is the real lightness — opacity-scaled palette derivation finally works predictably.",
    appliedIn: [
      "Defined the entire portfolio palette in oklch in globals.css",
      "Used chroma adjustments instead of opacity hacks for muted variants",
    ],
    url: "https://lea.verou.me/blog/2020/04/lch-colors-in-css-what-why-and-how/",
  },
  {
    id: "article-sam-accessibility-patterns",
    type: "article",
    title: "Accessible Tab Interfaces",
    author: "Sarah Higley",
    source: "sarahmhigley.com",
    duration: "12 min read",
    tags: ["Accessibility", "ARIA", "Tabs"],
    nugget:
      "The difference between role=tab and role=listbox matters beyond semantics — it sets keyboard interaction contracts. Getting ARIA right the first time is faster than retrofitting.",
    appliedIn: [
      "Implemented tablist/tab/tabpanel pattern in this very LearningShelf component",
      "Added Up/Down arrow navigation to all listbox-role components",
    ],
    url: "https://www.sarahmhigley.com/writing/tabs-too-often/",
  },
];

const learningSectionMeta = {
  eyebrow: "LEARNING",
  title: "Curated Resources",
  subtitle: "Not a list of links — the ideas that actually changed how I build.",
};

/* ── Animation helpers ─────────────────────────────────────────── */

function buildVariants(reduced: boolean | null): Variants {
  return {
    hidden: { opacity: 0, y: reduced ? 0 : 18 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };
}

const stagger: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

/* ── Scroll reveal via IntersectionObserver ────────────────────── */

function useSectionReveal() {
  React.useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>(".section-reveal");
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" },
    );

    sections.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

/* ── Page ──────────────────────────────────────────────────────── */

export default function Home() {
  const reduced = useReducedMotion();
  const item = buildVariants(reduced);

  useSectionReveal();

  const handleProjectLinkClick = React.useCallback((target: string) => {
    const el = document.getElementById(target);
    el?.scrollIntoView({ behavior: "smooth" });
  }, []);

  return (
    <main className="bg-background">
      {/* Theme toggle — top-right corner */}
      <div className="fixed top-5 right-5 z-30">
        <ThemeToggle />
      </div>

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section id="hero" className="relative flex min-h-[100svh] w-full items-center justify-center">
        <Stage className="flex h-full min-h-[100svh] w-full items-center justify-center">
          <Stage.Background className="pointer-events-none">
            <div
              aria-hidden
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 80% 55% at 50% -5%, oklch(0.22 0.015 50 / 0.7), transparent)",
              }}
            />
            <div aria-hidden className="noise-overlay absolute inset-0" />
          </Stage.Background>

          <Stage.Foreground className="relative z-10 w-full">
            <Container className="relative z-10">
              <motion.header
                className="flex flex-col items-center gap-5 py-28 text-center"
                variants={stagger}
                initial="hidden"
                animate="visible"
              >
                <motion.p
                  variants={item}
                  className="font-mono text-xs tracking-[0.2em] uppercase text-primary/70"
                >
                  {hero.eyebrow}
                </motion.p>

                <FogRevealText delay={0.15} className="max-w-2xl">
                  <h1
                    className="text-balance text-5xl font-bold leading-tight text-foreground sm:text-6xl md:text-7xl"
                    style={{ fontFamily: "var(--font-heading), ui-serif, Georgia, serif" }}
                  >
                    {hero.name}
                  </h1>
                </FogRevealText>

                <motion.p
                  variants={item}
                  className="max-w-md text-base text-muted-foreground sm:text-lg"
                >
                  {hero.tagline}
                </motion.p>

                <motion.div
                  variants={item}
                  className="mt-2 flex flex-wrap justify-center gap-3"
                >
                  {hero.ctas.map((cta) => (
                    <Button
                      key={cta.label}
                      variant={cta.variant}
                      size="lg"
                      className="min-w-[120px] cursor-pointer rounded-full font-medium"
                    >
                      {cta.label}
                    </Button>
                  ))}
                </motion.div>
              </motion.header>
            </Container>
          </Stage.Foreground>
        </Stage>
      </section>

      {/* ── Education ─────────────────────────────────────────────── */}
      <section id="education" className="section-reveal flex min-h-[100svh] w-full items-center justify-center py-20">
        <Container>
          <div className="mx-auto flex w-full max-w-4xl flex-col gap-10">
            <div className="text-center">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary/70">
                {educationTimeline.eyebrow}
              </p>
              <FogWipeReveal>
                <div className="mt-3">
                  <h2
                    className="text-balance text-4xl font-semibold"
                    style={{ fontFamily: "var(--font-heading), ui-serif, Georgia, serif" }}
                  >
                    {educationTimeline.title}
                  </h2>
                  <p className="mt-4 text-pretty text-muted-foreground">
                    {educationTimeline.subtitle}
                  </p>
                </div>
              </FogWipeReveal>
            </div>
            <EducationTimeline
              items={educationTimeline.items as EducationTimelineItem[]}
              onCta={(cta) => console.log("Education CTA:", cta)}
            />
          </div>
        </Container>
      </section>

      {/* ── Coursework ────────────────────────────────────────────── */}
      <section id="coursework" className="section-reveal flex min-h-[100svh] w-full items-center justify-center py-20">
        <Container>
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
            <div className="text-center">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary/70">
                {courseworkGrid.eyebrow}
              </p>
              <FogWipeReveal>
                <div className="mt-3">
                  <h2
                    className="text-balance text-4xl font-semibold"
                    style={{ fontFamily: "var(--font-heading), ui-serif, Georgia, serif" }}
                  >
                    {courseworkGrid.title}
                  </h2>
                  <p className="mt-4 text-pretty text-muted-foreground">
                    {courseworkGrid.subtitle}
                  </p>
                </div>
              </FogWipeReveal>
            </div>
            <CourseworkGrid
              items={courseworkGrid.items}
              onProjectLinkClick={handleProjectLinkClick}
            />
          </div>
        </Container>
      </section>

      {/* ── Learning ──────────────────────────────────────────────── */}
      <section id="learning" className="section-reveal flex min-h-[100svh] w-full items-center justify-center py-20">
        <Container>
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
            <div className="text-center">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary/70">
                {learningSectionMeta.eyebrow}
              </p>
              <FogWipeReveal>
                <div className="mt-3">
                  <h2
                    className="text-balance text-4xl font-semibold"
                    style={{ fontFamily: "var(--font-heading), ui-serif, Georgia, serif" }}
                  >
                    {learningSectionMeta.title}
                  </h2>
                  <p className="mt-4 text-pretty text-muted-foreground">
                    {learningSectionMeta.subtitle}
                  </p>
                </div>
              </FogWipeReveal>
            </div>
            <LearningSection items={learningItems} />
          </div>
        </Container>
      </section>

      {/* ── Experience ────────────────────────────────────────────── */}
      <section id="work" className="section-reveal flex min-h-[100svh] w-full items-center justify-center py-20">
        <Container>
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
            <div className="text-center">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary/70">
                {workExperience.eyebrow}
              </p>
              <FogWipeReveal>
                <div className="mt-3">
                  <h2
                    className="text-balance text-4xl font-semibold"
                    style={{ fontFamily: "var(--font-heading), ui-serif, Georgia, serif" }}
                  >
                    {workExperience.title}
                  </h2>
                  <p className="mt-4 text-pretty text-muted-foreground">
                    {workExperience.subtitle}
                  </p>
                </div>
              </FogWipeReveal>
            </div>
            <WorkExperience roles={workExperience.roles as unknown as WorkRole[]} />
          </div>
        </Container>
      </section>

      {/* ── Projects ──────────────────────────────────────────────── */}
      <section id="projects" className="section-reveal flex min-h-[100svh] w-full items-center justify-center py-20">
        <Container>
          <div className="mx-auto flex w-full max-w-5xl flex-col gap-10">
            <div className="text-center">
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-primary/70">
                {projectsMeta.eyebrow}
              </p>
              <FogWipeReveal>
                <div className="mt-3">
                  <h2
                    className="text-balance text-4xl font-semibold"
                    style={{ fontFamily: "var(--font-heading), ui-serif, Georgia, serif" }}
                  >
                    {projectsMeta.title}
                  </h2>
                  <p className="mt-4 text-pretty text-muted-foreground">
                    {projectsMeta.subtitle}
                  </p>
                </div>
              </FogWipeReveal>
            </div>
            <ProjectsCarousel items={projectsData} />
          </div>
        </Container>
      </section>

      {/* ── Footer ────────────────────────────────────────────────── */}
      <section id="footer" className="section-reveal w-full">
        <Footer />
      </section>
    </main>
  );
}
