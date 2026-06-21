export type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  workType: "Remote" | "Hybrid" | "Onsite";
  match: number;
  salary: string;
  tags: string[];
};

export const mockResumeAnalysis = {
  currentRole: "Senior Frontend Engineer",
  yearsExperience: 6,
  topSkills: ["React", "TypeScript", "Node.js", "GraphQL", "Tailwind CSS", "AWS"],
  preferredRoles: ["Staff Frontend Engineer", "Full-Stack Engineer", "Engineering Manager"],
};

export const mockJobs: Job[] = [
  { id: "1", title: "Staff Frontend Engineer", company: "Linear", location: "Remote · US", workType: "Remote", match: 96, salary: "$210k – $260k", tags: ["React", "TS", "Design Systems"] },
  { id: "2", title: "Senior Full-Stack Engineer", company: "Vercel", location: "San Francisco, CA", workType: "Hybrid", match: 92, salary: "$190k – $240k", tags: ["Next.js", "Edge", "Node"] },
  { id: "3", title: "Frontend Platform Lead", company: "Stripe", location: "New York, NY", workType: "Hybrid", match: 89, salary: "$220k – $280k", tags: ["React", "Infra", "DX"] },
  { id: "4", title: "Senior Software Engineer", company: "Figma", location: "Remote · Global", workType: "Remote", match: 87, salary: "$180k – $230k", tags: ["TypeScript", "Canvas", "Perf"] },
  { id: "5", title: "Engineering Manager, Web", company: "Notion", location: "San Francisco, CA", workType: "Onsite", match: 81, salary: "$240k – $310k", tags: ["Leadership", "React", "Hiring"] },
  { id: "6", title: "Senior Product Engineer", company: "Raycast", location: "Remote · EU", workType: "Remote", match: 78, salary: "€110k – €150k", tags: ["Swift", "TS", "Product"] },
];

export const mockSkillGaps = {
  missing: ["Rust", "WebAssembly", "Kubernetes", "System Design at Scale"],
  recommended: ["Advanced React Server Components", "LLM Engineering", "Observability (OpenTelemetry)"],
  priority: [
    { skill: "System Design at Scale", level: 85, tag: "High" as const },
    { skill: "LLM Engineering", level: 72, tag: "High" as const },
    { skill: "Kubernetes", level: 58, tag: "Medium" as const },
    { skill: "Rust", level: 35, tag: "Low" as const },
  ],
};

export const mockCoverLetter = `Dear Hiring Team at Linear,

I'm excited to apply for the Staff Frontend Engineer role. Over the past six years I've shipped high-craft product surfaces in React and TypeScript, led design system work that cut UI defects by 40%, and partnered closely with designers to push the bar on motion, accessibility, and performance.

What draws me to Linear is your obsession with speed and taste — the same values that shape how I approach every PR. I'd love to bring that energy to your web platform, deepen the keyboard-first experience, and help scale the foundations as the team grows.

I'd welcome the chance to walk you through recent work on a real-time collaborative editor and a zero-runtime CSS migration.

Warm regards,
Alex Rivera`;

export const mockInterview = {
  technical: [
    "Walk me through how you'd design a real-time collaborative text editor.",
    "Explain React Server Components vs. traditional SSR. When would you reach for each?",
    "How would you debug a memory leak in a long-lived single-page app?",
    "Design a rate limiter for a public API used by 10M clients.",
  ],
  behavioral: [
    "Tell me about a time you disagreed with a senior engineer. How did it resolve?",
    "Describe a project that failed. What would you do differently?",
    "How do you give feedback to a peer who's underperforming?",
    "What's the most ambiguous problem you've owned end-to-end?",
  ],
};
