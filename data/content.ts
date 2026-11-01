export type Project = {
  id: string;
  title: string;
  type: string;
  year: string;
  description: string;
  stack: string[];
  summary: string;
  problem: string;
  part: string;
  outcome: string;
  stats: { label: string; value: string }[];
  color: string;
  href: string;
};

export const content = {
  name: {
    first: "YOUR",
    last: "NAME",
    role: "Independent designer & developer",
    tagline: "I make thoughtful digital things for people doing good work.",
    location: "Your city, your country",
    currently: "Your current project",
    daysSinceContribution: "N days",
  },
  email: "hello@example.com",
  githubUsername: "YOUR_GITHUB_USERNAME",
  portraitAlt: "Placeholder portrait artwork. Replace with your own portrait.",
  story: [
    "A short paragraph about where you started, what you noticed, and the kind of work that keeps you curious.",
    "A second paragraph about the people you like working with and what you hope to make next.",
  ],
  projects: [
    {
      id: "01",
      title: "PROJECT TITLE",
      type: "Digital product",
      year: "20XX",
      description: "Replace with one clear sentence about the project and the people it was made for.",
      stack: ["Next.js", "TypeScript", "Design"],
      summary: "A one-line summary of the project and its intended impact.",
      problem: "Describe the user or business problem without inventing performance claims.",
      part: "Describe your role, decisions, and the pieces you personally delivered.",
      outcome: "Add the outcome when you have a verified result to share.",
      stats: ["Commits", "Lines", "Formats", "Platforms"].map((label) => ({ label, value: "--" })),
      color: "#0f2a24",
      href: "#contact",
    },
    {
      id: "02",
      title: "ANOTHER IDEA",
      type: "Web experience",
      year: "20XX",
      description: "Replace with a concise description of a second selected project.",
      stack: ["React", "Motion", "Research"],
      summary: "A one-line summary of this project.",
      problem: "Describe the problem this project set out to solve.",
      part: "Describe what you owned and how you worked with others.",
      outcome: "Add a measured result or a specific qualitative outcome.",
      stats: ["Commits", "Lines", "Formats", "Platforms"].map((label) => ({ label, value: "--" })),
      color: "#2a2200",
      href: "#contact",
    },
  ] satisfies Project[],
  alsoBuilt: [
    { title: "Add a smaller project", description: "A short line about what it does.", href: "#contact" },
    { title: "Add another experiment", description: "A short line about what you learned.", href: "#contact" },
  ],
  jobs: [
    { employer: "Your employer", role: "Your role", start: "20XX", end: "Now", duration: "Add duration", current: true },
    { employer: "Previous employer", role: "Previous role", start: "20XX", end: "20XX", duration: "Add duration", current: false },
  ],
  rules: [
    { lead: "Start with the", crossed: "happy path", accent: "failure", tail: "states.", body: "Good work accounts for the awkward edge case before it becomes somebody else's bad afternoon.", example: "Example from my work: replace with a verified detail." },
    { lead: "Make the", crossed: "clever", accent: "useful", tail: "thing.", body: "Clarity is a feature. Give the important action room to be understood and used.", example: "Example from my work: replace with a verified detail." },
    { lead: "Leave room for", crossed: "more", accent: "better", tail: "questions.", body: "A good first answer should make the next conversation easier, not close it down.", example: "Example from my work: replace with a verified detail." },
    { lead: "Ship with", crossed: "noise", accent: "care", tail: ".", body: "Details matter most when they help someone move through the work with confidence.", example: "Example from my work: replace with a verified detail." },
  ],
  openTo: ["Interesting collaborations", "Product teams with care", "Good questions"],
  links: [
    { label: "GitHub", href: "https://github.com/YOUR_GITHUB_USERNAME" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/YOUR_PROFILE" },
    { label: "Are.na", href: "https://www.are.na/YOUR_USERNAME" },
  ],
};