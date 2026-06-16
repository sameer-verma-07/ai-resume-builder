import { ResumeData } from '../types';

export const sampleResume: ResumeData = {
  personalInfo: {
    fullName: "Sameer Verma",
    title: "Senior Full-Stack Product Architect",
    email: "sameer.verma@example.com",
    phone: "+1 (555) 743-8592",
    location: "San Francisco, CA",
    website: "https://sameerverma.dev",
    github: "github.com/sameerverma",
    linkedin: "linkedin.com/in/sameer-verma"
  },
  summary: "Accomplished, performance-driven Lead Software Developer with 8+ years of enterprise experience specializing in react-based frontends, fast Node.js microservices, and modern cloud deployment configurations. Proven record of migrating monolithic workspaces to serverless pipelines, reducing delivery cycles by 35% and cloud infrastructure latency by 45%. Strong communicator dedicated to robust engineering standards and developer enablement.",
  workExperience: [
    {
      id: "exp-1",
      company: "SynthLabs AI",
      role: "Lead Full-Stack Architect",
      location: "San Francisco, CA",
      startDate: "2023-03",
      endDate: "Present",
      current: true,
      description: "Spearheading development of real-time synthetic feedback and generative prompt sandbox platforms utilizing Gemini models.",
      highlights: [
        "Architected an enterprise Express-Vite full-stack system processing over 15M+ generative requests monthly, scaling pipeline capacity by 150% while retaining a 99.99% system availability rate.",
        "Engineered real-time prompt telemetry and stream-buffering protocols, reducing end-to-end interface latency by 42% and eliminating client flicker overhead.",
        "Spearheaded containerized sandbox compilation runtimes for secure, real-time code evaluation, saving $75,000 annually in proprietary cloud infrastructure expenses."
      ]
    },
    {
      id: "exp-2",
      company: "Vortex Digital",
      role: "Senior Software Engineer",
      location: "Austin, TX",
      startDate: "2020-05",
      endDate: "2023-02",
      current: false,
      description: "Led core React 18 product lines for Vortex’s cloud analytics dashboards.",
      highlights: [
        "Overhauled laggy data visualization components using highly-optimized custom D3.js and Recharts pipelines, boosting visual render rates by 65% and keeping interface load times under 150ms.",
        "Established automated Docker-based CI/CD orchestration workflows, reducing production delivery errors by 30% and lowering release cycles to under 5 minutes.",
        "Guided a team of 4 front-end engineers, instituting code auditing guidelines that reduced pull-request review stagnation by 48% and improved feature velocity."
      ]
    },
    {
      id: "exp-3",
      company: "BriteCore Systems",
      role: "Core Platform Developer",
      location: "Chicago, IL",
      startDate: "2018-06",
      endDate: "2020-04",
      current: false,
      description: "Designed core back-end server routing and microservices API pipelines.",
      highlights: [
        "Refactored high-traffic payment processing microservice with asynchronous caching layers, increasing transaction-handling throughput by 2.4x without single-point failures.",
        "Optimized long-running relational database query plans and indexed strategic table schemas, reducing memory locks by 55% and speeding up search query execute times by 40% during peak billing cycles.",
        "Developed comprehensive OpenAPI technical documentation, shaving developer onboarding ramp-up times from weeks to under 4 days across global engineering squads."
      ]
    }
  ],
  education: [
    {
      id: "edu-1",
      institution: "Northwestern University",
      degree: "M.S. in Computer Science",
      fieldOfStudy: "Software Engineering & Interactive Systems",
      location: "Evanston, IL",
      startDate: "2016",
      endDate: "2018",
      current: false,
      gpa: "3.92"
    },
    {
      id: "edu-2",
      institution: "University of Illinois",
      degree: "B.S. in Computer Science",
      fieldOfStudy: "Systems Programming",
      location: "Urbana-Champaign, IL",
      startDate: "2012",
      endDate: "2016",
      current: false,
      gpa: "3.85"
    }
  ],
  projects: [
    {
      id: "proj-1",
      name: "PromptCraft Playground",
      role: "Solo Creator",
      link: "https://promptcraft.sandbox",
      startDate: "2024",
      endDate: "Present",
      highlights: [
        "Created an open-source system instruction IDE for LLM prompt tuning and regression testing.",
        "Built responsive interactive terminal shells rendering inline UI charts for latency analytics."
      ]
    },
    {
      id: "proj-2",
      name: "ElasticFlow Database",
      role: "Core Contributor",
      link: "github.com/vancesv/elasticflow",
      startDate: "2019",
      endDate: "2021",
      highlights: [
        "Injected type-stripping support for TypeScript middleware into an open-source decentralized data layer.",
        "Contributed to database node replication algorithms to optimize connection pooling in slow server frameworks."
      ]
    }
  ],
  skills: [
    {
      id: "sk-1",
      name: "Core Languages",
      skills: ["TypeScript", "JavaScript (ES6+)", "Python", "SQL", "Go", "HTML5 & CSS3"]
    },
    {
      id: "sk-2",
      name: "Frameworks & Runtimes",
      skills: ["React", "Next.js", "Express", "Node.js", "Vite", "D3.js", "Tailwind CSS"]
    },
    {
      id: "sk-3",
      name: "Cloud & Devops",
      skills: ["Docker / Containers", "Google Cloud Platform", "Cloud Run", "CI/CD Orchestration", "Git", "Firestore / SQL Databases"]
    }
  ],
  certifications: [
    {
      id: "cert-1",
      name: "Google Cloud Certified Professional Cloud Architect",
      issuer: "Google",
      date: "2024"
    },
    {
      id: "cert-2",
      name: "Advanced React Security & Infrastructure Blueprint certificate",
      issuer: "Frontend Masters",
      date: "2022"
    }
  ],
  languages: [
    {
      id: "lang-1",
      name: "English",
      proficiency: "Native"
    },
    {
      id: "lang-2",
      name: "Spanish",
      proficiency: "Professional Working"
    }
  ]
};
