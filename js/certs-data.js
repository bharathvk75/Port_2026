// 25 Verified Certifications Data Catalog
const CERTIFICATIONS_DATA = [
  {
    id: 1,
    title: "Model Context Protocol (MCP) Developer",
    issuer: "Anthropic",
    category: "genai",
    year: "2026",
    badge: "MCP",
    color: "#8b5cf6",
    file: "Introduction to Model Context Protocol.pdf"
  },
  {
    id: 2,
    title: "Deep Agents & Multi-Agent Architecture",
    issuer: "LangChain Academy",
    category: "genai",
    year: "2026",
    badge: "LangChain",
    color: "#06b6d4",
    file: "Deep Agents - Langchain Academy.pdf"
  },
  {
    id: 3,
    title: "Deep Research with LangGraph",
    issuer: "LangChain Academy",
    category: "genai",
    year: "2026",
    badge: "LangGraph",
    color: "#3b82f6",
    file: "Deep Research with LangGraph.pdf"
  },
  {
    id: 4,
    title: "Building with the Claude API",
    issuer: "Anthropic",
    category: "genai",
    year: "2026",
    badge: "Anthropic",
    color: "#d97706",
    file: "Building with the Claude API.pdf"
  },
  {
    id: 5,
    title: "Claude: Introduction to Subagents",
    issuer: "Anthropic",
    category: "genai",
    year: "2026",
    badge: "Anthropic",
    color: "#ec4899",
    file: "Claude Introduction to subagents.pdf"
  },
  {
    id: 6,
    title: "Customising Models in TensorFlow",
    issuer: "Imperial College London",
    category: "ml",
    year: "2025",
    badge: "Imperial",
    color: "#f59e0b",
    file: "Imperial - Customising Model Tensor Flow.pdf"
  },
  {
    id: 7,
    title: "Python PCAP: Certified Associate",
    issuer: "Cisco Networking Academy",
    category: "python",
    year: "2025",
    badge: "Cisco",
    color: "#10b981",
    file: "Cisco Networking - PCAP.pdf"
  },
  {
    id: 8,
    title: "AWS Solutions Architecture Simulation",
    issuer: "AWS (Forage)",
    category: "cloud",
    year: "2025",
    badge: "AWS",
    color: "#ff9900",
    file: "AWS (Forage) - Solution Architecture Job Simulation.pdf"
  },
  {
    id: 9,
    title: "Claude Code in Action",
    issuer: "Anthropic",
    category: "genai",
    year: "2026",
    badge: "Anthropic",
    color: "#8b5cf6",
    file: "Claude Code in Action.pdf"
  },
  {
    id: 10,
    title: "Claude 101 AI Foundations",
    issuer: "Anthropic",
    category: "genai",
    year: "2026",
    badge: "Anthropic",
    color: "#3b82f6",
    file: "Claude 101.pdf"
  },
  {
    id: 11,
    title: "Python Concurrent & Multiprocessing",
    issuer: "Infosys",
    category: "python",
    year: "2025",
    badge: "Infosys",
    color: "#0284c7",
    file: "Infosys - Python Concurrent Programming Multiprocessing.pdf"
  },
  {
    id: 12,
    title: "Python Automation Testing",
    issuer: "Infosys",
    category: "python",
    year: "2025",
    badge: "Infosys",
    color: "#0ea5e9",
    file: "Infosys - Python Automation Testing.pdf"
  },
  {
    id: 13,
    title: "Mastering Big Data Analysis",
    issuer: "Infosys",
    category: "data",
    year: "2025",
    badge: "Infosys",
    color: "#6366f1",
    file: "Infosys - Mastering Big Data Analysis.pdf"
  },
  {
    id: 14,
    title: "Hadoop Big Data Architecture",
    issuer: "Infosys",
    category: "data",
    year: "2025",
    badge: "Infosys",
    color: "#8b5cf6",
    file: "Infosys - Hadoop.pdf"
  },
  {
    id: 15,
    title: "GenAI Job Simulation",
    issuer: "BCGX (Forage)",
    category: "genai",
    year: "2025",
    badge: "BCGX",
    color: "#10b981",
    file: "BCGX GenAI Job Simulation - Forage.pdf"
  },
  {
    id: 16,
    title: "Software Engineering Simulation",
    issuer: "Hewlett Packard Enterprise",
    category: "software",
    year: "2025",
    badge: "HPE",
    color: "#059669",
    file: "Hewlett Packard Enterprises (Forage) - Software Engineer Job Simulation.pdf"
  },
  {
    id: 17,
    title: "Software Engineering Simulation",
    issuer: "BlackBird (Forage)",
    category: "software",
    year: "2025",
    badge: "Forage",
    color: "#475569",
    file: "BlackBird (Forage) - Software Engineering Job Simulation.pdf"
  },
  {
    id: 18,
    title: "Data Analytics Simulation",
    issuer: "Deloitte",
    category: "data",
    year: "2025",
    badge: "Deloitte",
    color: "#84cc16",
    file: "Deloitte - Data Analysis Certificate.pdf"
  },
  {
    id: 19,
    title: "Python Essentials 1",
    issuer: "Cisco Networking Academy",
    category: "python",
    year: "2025",
    badge: "Cisco",
    color: "#06b6d4",
    file: "Cisco - Python Essential 1.pdf"
  },
  {
    id: 20,
    title: "Python Essentials 2",
    issuer: "Cisco Networking Academy",
    category: "python",
    year: "2025",
    badge: "Cisco",
    color: "#0ea5e9",
    file: "Cisco - Python Essential 2.pdf"
  },
  {
    id: 21,
    title: "NDG Linux Unhatched",
    issuer: "Cisco / NDG",
    category: "systems",
    year: "2025",
    badge: "Linux",
    color: "#f97316",
    file: "Cisco Networking -NDG Linux Unhatched.pdf"
  },
  {
    id: 22,
    title: "AI Fluency Framework & Foundations",
    issuer: "AI Foundations",
    category: "genai",
    year: "2025",
    badge: "AI",
    color: "#6366f1",
    file: "AI Fluency Framework & Foundations.pdf"
  },
  {
    id: 23,
    title: "AI Capabilities & Limitations",
    issuer: "AI Literacy",
    category: "genai",
    year: "2025",
    badge: "AI",
    color: "#a855f7",
    file: "AI Capabilities and Limitations.pdf"
  },
  {
    id: 24,
    title: "AI Fluency for Nonprofits",
    issuer: "AI Social Impact",
    category: "genai",
    year: "2025",
    badge: "AI",
    color: "#14b8a6",
    file: "AI Fluency for nonprofits.pdf"
  },
  {
    id: 25,
    title: "M&A for AI Innovation",
    issuer: "Forage",
    category: "business",
    year: "2025",
    badge: "Business",
    color: "#ec4899",
    file: "Mergers and Acquisitions for AI Innovation - Forage.pdf"
  }
];
