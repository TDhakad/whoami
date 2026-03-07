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
  eyebrow: "Building reliable data systems and AI features with craftsmanship.",
  name: "Tushar Dhakad",
  tagline: "Software Developer • Data Engineering • AI Systems",
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
    "Two degrees that built the foundation: computer science fundamentals in India, then graduate specialisation in data science at ASU.",
  items: [
    {
      id: "bachelors",
      label: "Bachelors",
      title: "Bachelor of Technology in Computer Science",
      org: "Rajiv Gandhi Proudyogiki Vishwavidyalaya",
      meta: "Aug 2018 – May 2022  •  GPA 3.70 / 4.00  •  Bhopal, India",
      description:
        "Four years of rigorous computer science fundamentals — data structures, algorithms, systems programming, and database design. Built a strong foundation in Python, Java, and SQL that would underpin every production system I would later build.",
      bullets: [
        "GPA 3.70 / 4.00 — consistent academic performance across all four years",
        "Focused on distributed systems, database design, and software engineering principles",
        "Developed Python and Java projects spanning web services, data processing, and automation",
        "Final year projects included real-time data pipeline prototypes and REST API services",
      ],
    },
    {
      id: "masters",
      label: "Masters",
      title: "Master of Science in Data Science",
      org: "Arizona State University",
      meta: "Aug 2024 – May 2026  •  GPA 3.50 / 4.00  •  Tempe, AZ, USA",
      description:
        "Graduate programme at ASU's Ira A. Fulton Schools of Engineering, concentrating on machine learning, data engineering, and applied statistics. Awarded the NAMu University Scholarship. Coursework spans deep learning, time series analysis, cloud MLOps, and large-scale database modelling.",
      bullets: [
        "Awarded NAMu University Scholarship for academic merit",
        "GPA 3.50 / 4.00 — consistent graduate-level performance",
        "Applied ML capstone: statistical modelling of wine quality using hypothesis testing and feature selection",
        "Research topics include time series forecasting (ARIMA/SARIMA), RAG-based AI tooling, and ETL orchestration",
        "Active in the ASU Statistics Department as a Computer Support specialist, bridging IT and academic systems",
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
  title: "Disciplines in Focus",
  subtitle:
    "Six areas I'm actively building expertise in — click a card to see what I've applied and learned.",
  items: [
    {
      id: "data-engineering",
      title: "Data Engineering",
      summary: "Building scalable ETL pipelines that move terabytes reliably, every day.",
      content:
        "Designed and deployed Spark and SQL-based ETL pipelines processing terabytes of structured data daily. Engineered orchestration workflows with Apache Airflow, AWS Step Functions, and AWS Lambda. Automated batch and streaming ingestion using AWS Glue and S3, reducing manual intervention and operational failures across distributed systems.",
      skills: ["Apache Spark", "SQL", "Apache Airflow", "AWS Glue", "AWS Lambda", "S3", "dbt", "Kafka"],
    },
    {
      id: "machine-learning",
      title: "Machine Learning",
      summary: "From hypothesis testing to production models — statistical rigour throughout.",
      content:
        "Applied feature selection, correlation analysis, and model evaluation to real-world datasets. Built classification and regression models using scikit-learn, optimised hyperparameters, and evaluated performance with residual diagnostics and error metrics. Focused on interpretability and reproducibility.",
      skills: ["scikit-learn", "Pandas", "NumPy", "Feature Engineering", "Hypothesis Testing", "Model Evaluation", "Python"],
      projectLink: { label: "See related project", target: "projects" },
    },
    {
      id: "deep-learning",
      title: "Deep Learning",
      summary: "Neural networks from fraud detection pipelines to real-time anomaly scoring.",
      content:
        "Architected real-time fraud detection pipelines using PyTorch and scikit-learn, achieving 95% accuracy on high-frequency financial streams. Deployed Django REST APIs to deliver sub-millisecond anomaly scores to core banking systems. Applied distributed feature engineering and anomaly detection at scale using PySpark within Databricks.",
      skills: ["PyTorch", "TensorFlow", "scikit-learn", "Databricks", "PySpark", "Django REST", "Anomaly Detection"],
    },
    {
      id: "time-series",
      title: "Time Series Analysis",
      summary: "Modelling seasonality, volatility, and long-term trends in sequential data.",
      content:
        "Modelled Bitcoin price trends using ARIMA and SARIMA to capture seasonality, volatility, and long-term patterns. Evaluated forecasting performance using residual diagnostics, AIC, and error metrics to assess model stability. Applied statistical tests for stationarity and structural breaks.",
      skills: ["ARIMA", "SARIMA", "JMP", "Python", "Residual Diagnostics", "AIC", "Stationarity Testing"],
      projectLink: { label: "See related project", target: "projects" },
    },
    {
      id: "databases",
      title: "Databases & Modelling",
      summary: "Normalised schemas, complex joins, and indexing strategies that scale.",
      content:
        "Designed normalised relational schemas for high-volume transactional systems. Optimised complex SQL queries and indexing strategies, reducing query latency by 30% in production. Worked with PostgreSQL, MySQL, MongoDB, and DynamoDB for both OLTP and analytical workloads.",
      skills: ["PostgreSQL", "MySQL", "MongoDB", "DynamoDB", "SQL Indexing", "Schema Design", "Query Optimisation"],
      projectLink: { label: "See related project", target: "projects" },
    },
    {
      id: "cloud-mlops",
      title: "Cloud & MLOps",
      summary: "From local script to production-grade containerised service on AWS.",
      content:
        "Deployed containerised FastAPI and Django microservices on Kubernetes clusters with automated CI/CD pipelines. Worked across AWS services including S3, Lambda, SageMaker, Bedrock, API Gateway, Glue, ECS/EKS, and VPC. Used Terraform and HashiCorp Vault for infrastructure-as-code and secrets management.",
      skills: ["AWS", "Docker", "Kubernetes", "Terraform", "GitHub Actions", "Snowflake", "Databricks", "HashiCorp Vault"],
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
    "Three roles spanning data engineering, AI tooling, and academic systems — each one sharpening a different edge.",
  roles: [
    {
      id: "asu-computer-support",
      type: "Full-time" as WorkRoleType,
      title: "Computer Support — Statistics Department",
      company: "Arizona State University",
      dates: "March 2025 – Present",
      hook: "Managing Python apps and SQL systems for faculty — then building an AI ticketing assistant on the side.",
      techBullets: [
        "Managed Python-based enterprise applications, SQL databases, and automation workflows that underpin academic system reliability for the Statistics Department.",
        "Spearheaded an intelligent IT ticketing system using RAG-based recommendations and semantic search — AI-driven troubleshooting surfacing relevant resolutions before a ticket is even submitted.",
        "Maintained and optimised SQL-backed administrative databases, improving query performance and data consistency for departmental operations.",
      ],
      businessBullets: [
        "Automation workflows reduced manual overhead for faculty-facing systems, improving operational efficiency across the department.",
        "RAG-powered ticketing assistant significantly cut time-to-resolution and reduced repetitive support load on the team.",
      ],
      skills: ["Python", "SQL", "PostgreSQL", "RAG", "Semantic Search", "Automation"],
    },
    {
      id: "consultadd-swe",
      type: "Full-time" as WorkRoleType,
      title: "Software Developer",
      company: "Consultadd Services",
      dates: "Jul 2022 – Jul 2024",
      hook: "ETL pipelines processing terabytes daily, 30 % query latency reduction, and containerised microservices in production.",
      techBullets: [
        "Designed and developed scalable Spark and SQL-based ETL pipelines to process terabytes of structured data daily, enabling reliable analytics across distributed systems used by multiple downstream business teams.",
        "Optimised complex SQL queries, indexing strategies, and data models for high-volume transactional systems, reducing query latency by 30 % and significantly improving application responsiveness in production.",
        "Engineered orchestration workflows using AWS Step Functions, Apache Airflow, and AWS Lambda, managing complex ETL dependencies, scheduling, and fault-tolerant execution of distributed data pipelines.",
        "Developed containerised FastAPI and Django microservices deployed on Kubernetes clusters, implementing automated CI/CD pipelines to stream real-time Kafka data into production environments.",
        "Automated batch and streaming data ingestion workflows using AWS Glue and S3, processing millions of records per day while reducing manual intervention and operational failures across pipelines.",
        "Participated in agile development cycles including sprint planning, code reviews, and CI/CD workflows; resolved production incidents during on-call rotations to maintain service availability.",
      ],
      businessBullets: [
        "30 % reduction in query latency directly improved user-facing application responsiveness for production systems.",
        "Automated ingestion workflows eliminated manual intervention across pipelines, reducing data inconsistencies and operational failures.",
        "ETL pipeline reliability enabled multiple downstream teams to depend on real-time analytics for business decisions.",
      ],
      skills: [
        "Python", "Apache Spark", "SQL", "AWS Glue", "FastAPI", "Terraform",
        "Docker", "Kubernetes", "Apache Airflow", "Kafka", "PostgreSQL",
      ],
    },
    {
      id: "consultadd-intern",
      type: "Intern" as WorkRoleType,
      title: "Software Developer Intern",
      company: "Consultadd Services",
      dates: "Jan 2022 – Jul 2022",
      hook: "Built a 95%-accurate fraud detection pipeline and cut microservice troubleshooting time by 40 %.",
      techBullets: [
        "Architected real-time fraud detection pipelines using PyTorch and scikit-learn, achieving 95 % accuracy on high-frequency financial streams. Deployed Django REST APIs to deliver sub-millisecond anomaly scores to core banking systems.",
        "Developed Python-based data processing frameworks leveraging Pandas, NumPy, and PySpark within Databricks to perform distributed data transformations, feature engineering, and anomaly detection at scale.",
        "Implemented an ELK-based logging framework for a microservices architecture, centralising 500 GB of daily logs and enabling advanced Kibana visualisations for operational monitoring.",
      ],
      businessBullets: [
        "95 % fraud detection accuracy on live financial streams delivered actionable anomaly scores directly into core banking workflows.",
        "ELK logging framework reduced troubleshooting time by 40 % through centralised observability and structured log analytics.",
      ],
      skills: [
        "Python", "PyTorch", "scikit-learn", "PySpark", "Databricks",
        "Pandas", "NumPy", "Django", "Elasticsearch", "Kibana",
      ],
    },
  ] satisfies WorkRoleData[],
};

// ─── Projects ─────────────────────────────────────────────────────────────────

export const projectsMeta = {
  eyebrow: "PROJECTS",
  title: "The Main Show",
  subtitle: "Three projects spanning statistical modelling, time series forecasting, and database design.",
} as const;

export const projectsData = [
  {
    id: "wine-quality",
    title: "Wine Quality Statistical Modeling",
    oneLiner:
      "Identified key chemical factors impacting wine quality using ML models and statistical hypothesis testing.",
    outcome: "Improved prediction accuracy through systematic feature selection and correlation analysis.",
    tags: ["Python", "Pandas", "Scikit-learn", "Statistics"],
    role: "Data Science",
    year: "2025",
    highlights: [
      "Built machine learning models to identify key chemical factors impacting wine quality using statistical hypothesis testing.",
      "Applied feature selection, correlation analysis, and model evaluation to improve prediction accuracy and interpretability.",
      "Evaluated multiple classifiers and regression models; selected the best-performing approach based on cross-validated metrics.",
    ],
  },
  {
    id: "bitcoin-forecasting",
    title: "Bitcoin Time Series Forecasting",
    oneLiner:
      "Modelled Bitcoin price trends using ARIMA and SARIMA to capture seasonality, volatility, and long-term patterns.",
    outcome: "Validated model stability using residual diagnostics, AIC, and error metrics.",
    tags: ["Python", "ARIMA", "SARIMA", "JMP"],
    role: "Data Science",
    year: "2025",
    highlights: [
      "Modelled Bitcoin price trends using ARIMA and SARIMA to capture seasonality, volatility, and long-term patterns.",
      "Evaluated forecasting performance using residual diagnostics, AIC, and error metrics to assess model stability.",
      "Applied stationarity tests and differencing to prepare the time series for classical forecasting methods.",
    ],
  },
  {
    id: "social-media-db",
    title: "Social Media Database Modeling",
    oneLiner:
      "Designed and queried a normalised relational schema for a social media platform supporting users, posts, and interactions.",
    outcome: "Efficient data retrieval via complex joins and strategic indexing at scale.",
    tags: ["Python", "Tableau", "SQL"],
    role: "Data Engineering",
    year: "2024",
    highlights: [
      "Designed normalised relational database schema for social media applications supporting users, posts, and interactions.",
      "Implemented complex SQL queries with joins and indexing to ensure efficient data retrieval and scalability.",
      "Visualised usage patterns and query performance using Tableau dashboards for analytical review.",
    ],
  },
];
