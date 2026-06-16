import { ResumeData } from '../types';

export const templates: Record<'student' | 'swe' | 'data' | 'pm', ResumeData> = {
  student: {
    personalInfo: {
      fullName: "Alex Mercer",
      title: "Computer Science Honors Undergraduate",
      email: "alex.mercer@stanford.edu",
      phone: "+1 (650) 492-3810",
      location: "Palo Alto, CA",
      website: "https://alexmercer.dev",
      github: "github.com/merceralex",
      linkedin: "linkedin.com/in/alex-mercer-edu"
    },
    summary: "High-achieving Computer Science honors undergraduate at Stanford University with professional internship experience in full-stack engineering and cloud-native services. Proven academic team leader running open-source developer tool initiatives and mentoring junior peers. Competent across algorithmic analysis, React user interfaces, and PostgreSQL optimization, seeking to accelerate development teams via robust, well-tested codebases.",
    workExperience: [
      {
        id: "stud-exp-1",
        company: "Pioneer Tech Systems",
        role: "Software Engineering Intern",
        location: "Mountain View, CA",
        startDate: "2025-06",
        endDate: "2025-09",
        current: false,
        description: "Contributed to core development of CloudTask analytics dashboards during standard 12-week summer cohort.",
        highlights: [
          "Developed automated REST API end-points using Express and TypeScript, reducing client data fetching round-trip delays by 22%.",
          "Automated microservice integration test pipelines utilizing Jest, boosting overall test coverage margins from 72% to 94%.",
          "Presented interactive cohort analytics visualization updates to the VP of Engineering, leading to direct adoption in production releases."
        ]
      },
      {
        id: "stud-exp-2",
        company: "Stanford CS Department",
        role: "Undergraduate course assistant",
        location: "Palo Alto, CA",
        startDate: "2024-09",
        endDate: "Present",
        current: true,
        description: "Leading lab sections and grading algorithms assignments for CS106B (Data Structures).",
        highlights: [
          "Delivered biweekly technical problem-solving recitations for over 45 undergraduate students on pointer manipulation and dynamic programming.",
          "Hosted diagnostic debugging clinical hours, resolving 120+ code blockage instances for students to maintain stable lecture progress."
        ]
      }
    ],
    education: [
      {
        id: "stud-edu-1",
        institution: "Stanford University",
        degree: "B.S. in Computer Science",
        fieldOfStudy: "Systems Theory & AI Foundations",
        location: "Palo Alto, CA",
        startDate: "2022",
        endDate: "2026",
        current: true,
        gpa: "3.91 / 4.00"
      }
    ],
    projects: [
      {
        id: "stud-proj-1",
        name: "RouteOptimizer Engine",
        role: "Team Captain",
        link: "github.com/merceralex/route-optimize",
        startDate: "2024",
        endDate: "2024",
        highlights: [
          "Designed a custom heuristic path-finding algorithm that optimizes campus delivery courier cart paths in real-time.",
          "Constructed a React leaflet map canvas tracking active delivery carts to illustrate visual graph node routing decisions dynamically."
        ]
      },
      {
        id: "stud-proj-2",
        name: "MarkDown Live IDE",
        role: "Sole Author",
        link: "github.com/merceralex/markdown-live",
        startDate: "2023",
        endDate: "2023",
        highlights: [
          "Engineered a lightweight browser editor side-by-side rendering formatted markdown with integrated HTML tag sanitizer middleware."
        ]
      }
    ],
    skills: [
      {
        id: "stud-sk-1",
        name: "Languages & Runtimes",
        skills: ["C++", "Java", "Python", "TypeScript", "SQL", "Go"]
      },
      {
        id: "stud-sk-2",
        name: "Frameworks & Databases",
        skills: ["React", "Express", "Node.js", "Jest", "PostgreSQL", "Tailwind CSS"]
      }
    ],
    certifications: [
      {
        id: "stud-cert-1",
        name: "AWS Certified Cloud Practitioner",
        issuer: "Amazon Web Services",
        date: "2024"
      }
    ],
    languages: [
      {
        id: "stud-lang-1",
        name: "English",
        proficiency: "Native"
      }
    ]
  },
  swe: {
    personalInfo: {
      fullName: "Marcus Chen",
      title: "Senior Distributed Systems Engineer",
      email: "marcus.chen@example.com",
      phone: "+1 (415) 392-8012",
      location: "San Jose, CA",
      website: "https://chenmarcus.io",
      github: "github.com/chenmtech",
      linkedin: "linkedin.com/in/marcus-chen-systems"
    },
    summary: "Senior Engineering Professional with 7+ years of experience architecting high-scale distributed backends, streaming event pipelines, and serverless infrastructure pools. Specialist in Go, Rust, and Node.js core microservices. Proven success leading database migration initiatives, reducing global container deployment costs by 30% while retaining 99.99% system availability under peak query loads.",
    workExperience: [
      {
        id: "swe-exp-1",
        company: "Vertex Scale Systems",
        role: "Senior Staff Engineer",
        location: "San Francisco, CA",
        startDate: "2022-04",
        endDate: "Present",
        current: true,
        description: "Spearheaded enterprise routing systems handling multi-region container clusters.",
        highlights: [
          "Re-architected legacy monolithic billing gateways to use event-driven RabbitMQ message networks, handling 15M+ requests daily at 99.99% availability.",
          "Optimized PostgreSQL connection multiplexers and indexed slow transaction tables, accelerating search API latency response speeds by 38%.",
          "Mentored a department of 12 junior software engineers, instituting rigid Docker and Kubernetes build parameters that cut release cycles down to 10 minutes."
        ]
      },
      {
        id: "swe-exp-2",
        company: "CoreStream Solutions",
        role: "Lead Software Developer",
        location: "Seattle, WA",
        startDate: "2019-01",
        endDate: "2022-03",
        current: false,
        description: "Engineered high-throughput cloud streaming APIs and microservice endpoints.",
        highlights: [
          "Developed core features for a real-time log ingestion agent in Golang, processing 4.5TB of telemetry data daily with minimal memory footprints.",
          "Implemented robust Redis cache structures, cutting redundant relational database transaction lookups by 52% during billing peak hours.",
          "Established standardized API security blueprints utilizing OAuth2 protocols, ensuring enterprise-grade isolation boundaries across service levels."
        ]
      }
    ],
    education: [
      {
        id: "swe-edu-1",
        institution: "University of California, Berkeley",
        degree: "B.S. in Electrical Engineering & Computer Science",
        fieldOfStudy: "Distributed Systems & Database Theory",
        location: "Berkeley, CA",
        startDate: "2015",
        endDate: "2019",
        current: false,
        gpa: "3.88"
      }
    ],
    projects: [
      {
        id: "swe-proj-1",
        name: "MiniCache Go-Store",
        role: "Maintainer",
        link: "github.com/chenmtech/minicache",
        startDate: "2021",
        endDate: "Present",
        highlights: [
          "Author of open-source in-memory cache proxy written in Go, which delivers high-throughput key-value storage with optimized thread-safety primitives."
        ]
      }
    ],
    skills: [
      {
        id: "swe-sk-1",
        name: "Systems Languages",
        skills: ["Go", "TypeScript", "Rust", "C++", "Python", "SQL", "Bash"]
      },
      {
        id: "swe-sk-2",
        name: "Cloud & Devops Systems",
        skills: ["Docker", "Kubernetes", "Redis", "Apache Kafka", "PostgreSQL", "Google Cloud Platform", "AWS", "CI/CD Platforms"]
      }
    ],
    certifications: [
      {
        id: "swe-cert-1",
        name: "Google Cloud Certified Professional Cloud DevOps Engineer",
        issuer: "Google",
        date: "2024"
      }
    ],
    languages: [
      {
        id: "swe-lang-1",
        name: "English",
        proficiency: "Native"
      }
    ]
  },
  data: {
    personalInfo: {
      fullName: "Elena Rostova",
      title: "Lead Business Intelligence & Data Analyst",
      email: "elena.rostova@example.com",
      phone: "+1 (312) 805-4927",
      location: "Chicago, IL",
      website: "https://rostovadata.com",
      github: "github.com/elenadata",
      linkedin: "linkedin.com/in/elena-rostova-bi"
    },
    summary: "Analytical, results-oriented Senior Data Analyst with 6+ years of experience converting unstructured complex business telemetry into clear, action-oriented executive strategy recommendations. Expert in designing custom automated dashboard networks, building SQL ETL pipeline structures, and performing predictive audience cohort analysis, which collectively catalyzed a 22% uplift in marketing pipeline conversions.",
    workExperience: [
      {
        id: "data-exp-1",
        company: "Apex Retail Corporation",
        role: "Senior Lead Data Analyst",
        location: "Chicago, IL",
        startDate: "2021-11",
        endDate: "Present",
        current: true,
        description: "Leading business intelligence modeling and visualization pipelines for the Global Sales squad.",
        highlights: [
          "Overhauled fragmented regional sales performance dashboards using automated Tableau networks, delivering actionable insights that raised quarterly revenues by 14%.",
          "Constructed reliable SQL ETL processing routines using Python Pandas and dbt, reducing dashboard load times and data refresh cycles by 40%.",
          "Conducted rigorous A/B transaction checkout split-tests, identifying user checkout friction that led to an immediate 6.2% lift in completed orders."
        ]
      },
      {
        id: "data-exp-2",
        company: "InsightMetrics, Inc.",
        role: "Business Intelligence Analyst",
        location: "Boston, MA",
        startDate: "2018-08",
        endDate: "2021-10",
        current: false,
        description: "Created structured SaaS pipeline dashboards and analyzed user cohort metrics.",
        highlights: [
          "Slashed manual report generation overhead by 80% through developing custom scheduled automated scripts in Python.",
          "Partnered closely with Chief Marketing Officers to isolate marketing campaign attrition, saving $85,000 in inefficient ad spends.",
          "Delivered interactive technical data explanations and data visualization briefings directly to non-technical executive board members."
        ]
      }
    ],
    education: [
      {
        id: "data-edu-1",
        institution: "University of Michigan",
        degree: "M.S. in Information & Advanced Analytics",
        fieldOfStudy: "Information Visualization & Advanced Data Modeling",
        location: "Ann Arbor, MI",
        startDate: "2016",
        endDate: "2018",
        current: false,
        gpa: "3.94"
      },
      {
        id: "data-edu-2",
        institution: "State University of New York",
        degree: "B.S. in Applied Mathematics",
        fieldOfStudy: "Statistical Computing",
        location: "Buffalo, NY",
        startDate: "2012",
        endDate: "2016",
        current: false,
        gpa: "3.89"
      }
    ],
    projects: [
      {
        id: "data-proj-1",
        name: "ForecastCraft Analytics",
        role: "Solo Creator",
        link: "github.com/elenadata/forecastcraft",
        startDate: "2023",
        endDate: "Present",
        highlights: [
          "Created an open-source Python-based retail pricing simulator that models historical consumer elasticity trends to output margin maximization curves.",
          "Engineered reactive charts using custom D3.js and Tailwind dashboards to allow for seamless parameters sandboxing by visual analysts."
        ]
      }
    ],
    skills: [
      {
        id: "data-sk-1",
        name: "Data Stack Utilities",
        skills: ["SQL (PostgreSQL / BigQuery)", "Python (Pandas, NumPy, Scikit-learn)", "R", "dbt", "Git", "Tableau", "Looker Studio"]
      },
      {
        id: "data-sk-2",
        name: "Analytical Domains",
        skills: ["A/B Testing & Statistics", "ETL Pipelines", "Data Warehousing", "Cohort Retention Analysis", "Predicative Modeling"]
      }
    ],
    certifications: [
      {
        id: "data-cert-1",
        name: "Google Professional Data Engineer",
        issuer: "Google Cloud",
        date: "2024"
      }
    ],
    languages: [
      {
        id: "data-lang-1",
        name: "English",
        proficiency: "Native"
      }
    ]
  },
  pm: {
    personalInfo: {
      fullName: "Sophia Patel",
      title: "Senior Technical Product Manager",
      email: "sophia.patel@example.com",
      phone: "+1 (206) 481-9582",
      location: "Seattle, WA",
      website: "https://sophia-pm.dev",
      github: "github.com/sophiapatelpm",
      linkedin: "linkedin.com/in/sophia-patel-product"
    },
    summary: "Accomplished, user-focused Senior Technical Product Manager with 5+ years of success leading cross-functional engineering and design squads to launch and scale enterprise SaaS software. Expert in translating customer feedback profiles into detailed engineering roadmaps, defining strategic OKRs, and optimizing retention channels. Managed a multi-phase subscription billing overhaul that increased MRR by $1.2M.",
    workExperience: [
      {
        id: "pm-exp-1",
        company: "PayStream Cloud Technologies",
        role: "Senior Technical Product Manager",
        location: "Seattle, WA",
        startDate: "2022-08",
        endDate: "Present",
        current: true,
        description: "Directing the global Core Billing, Invoicing, and Subscription Lifecycle product vision.",
        highlights: [
          "Led a 14-person cross-functional scrum squad to design and deploy automated subscription renewal triggers, increasing customer lifetime value metrics by 18%.",
          "Orchestrated product roadmap priorities based on strict SQL query metrics, cohort churn signals, and user research, reducing churn by 4.2% in year one.",
          "Collaborated with executive directors to target strategic integrations with major credit cards, expanding European transaction volumes by 25%."
        ]
      },
      {
        id: "pm-exp-2",
        company: "Lumina Workspace",
        role: "Technical Product Manager",
        location: "New York, NY",
        startDate: "2019-10",
        endDate: "2022-07",
        current: false,
        description: "Defined features for Lumina’s collaborative user canvas platforms.",
        highlights: [
          "Coordinated the product overhaul of enterprise collaboration features, achieving an immediate 38% increase in weekly active user (WAU) collaboration loops.",
          "Published and synthesized detailed tech requirements documents (PRDs) for cloud migration, syncing team objectives with zero scheduled service drops.",
          "Championed continuous product discovery loops, conducting 30+ deep qualitative enterprise customer interviews to shape the year-long roadmap."
        ]
      }
    ],
    education: [
      {
        id: "pm-edu-1",
        institution: "Cornell University",
        degree: "B.S. in Operations Research & Information Engineering",
        fieldOfStudy: "Applied Statistics & Optimization Models",
        location: "Ithaca, NY",
        startDate: "2015",
        endDate: "2019",
        current: false,
        gpa: "3.82"
      }
    ],
    projects: [
      {
        id: "pm-proj-1",
        name: "PrioritizePro App",
        role: "Product Lead",
        link: "github.com/sophiapatelpm/prioritizepro",
        startDate: "2023",
        endDate: "2024",
        highlights: [
          "Pioneered a lightweight, collaborative product backlog prioritization app leveraging RICE and MoSCoW framework calculators, supporting 1200+ active users."
        ]
      }
    ],
    skills: [
      {
        id: "pm-sk-1",
        name: "Product Capabilities",
        skills: ["Agile & Scrum Methodologies", "User Behavior cohorts", "Product Roadmaps (PRDs)", "A/B Testing & analytics", "Airtable / Jira Studio", "Figma Design Mockups"]
      },
      {
        id: "pm-sk-2",
        name: "Technical Foundation",
        skills: ["SQL", "Python (API Analysis)", "SaaS Billing Architecture", "Software Development Lifecycle", "Data Warehouses"]
      }
    ],
    certifications: [
      {
        id: "pm-cert-1",
        name: "Certified Scrum Product Owner (CSPO)",
        issuer: "Scrum Alliance",
        date: "2023"
      }
    ],
    languages: [
      {
        id: "pm-lang-1",
        name: "English",
        proficiency: "Native"
      }
    ]
  }
};
