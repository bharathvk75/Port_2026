// ==========================================================================
// INTERACTIVE AI AGENT TERMINAL SIMULATOR
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {
  const terminalBody = document.getElementById('terminal-body');
  const terminalInput = document.getElementById('terminal-input');
  const chipButtons = document.querySelectorAll('.chip-btn');

  if (!terminalBody || !terminalInput) return;

  const commandHistory = [];
  let historyIndex = -1;

  const COMMANDS = {
    help: () => `
Available Commands:
  • <span style="color:#38bdf8">whoami</span>        : Overview of Bharath Abhinesh A
  • <span style="color:#38bdf8">skills</span>        : Core AI/ML, Backend, and Systems stack
  • <span style="color:#38bdf8">projects</span>      : Key production & edge AI systems
  • <span style="color:#38bdf8">certs</span>         : 25 verified certifications catalog
  • <span style="color:#38bdf8">agent-run [name]</span>: Execute multi-agent orchestration demo (e.g. agent-run synapse)
  • <span style="color:#38bdf8">experience</span>    : Industry experience at Induspic Engineers
  • <span style="color:#38bdf8">contact</span>       : Reach out directly via email, phone, or LinkedIn
  • <span style="color:#38bdf8">resume</span>        : Open Bharath's verified resume PDF
  • <span style="color:#38bdf8">clear</span>         : Clear terminal buffer
    `,

    whoami: () => `
<strong style="color:#38bdf8">Bharath Abhinesh A</strong>
🎓 B.Tech in Computer Science & Engineering (AI & ML) — Garden City University (CGPA: 8.4/10.0)
📍 Bengaluru, Karnataka, India
💼 AI Engineering Intern at Induspic Engineers
🎯 Specialization: Multi-Agent Systems, LangGraph, RAG Workflows, Model Context Protocol (MCP), Computer Vision, and Full-Stack AI Services.
    `,

    skills: () => `
<span style="color:#a78bfa">⚡ AI & Multi-Agent:</span> LangGraph, LangChain, MCP (Anthropic), RAG, Vector DBs, Prompt Orchestration
<span style="color:#38bdf8">🧠 ML & Vision:</span> PyTorch, TensorFlow, OpenCV, Scikit-learn, OCR Pipelines
<span style="color:#10b981">⚙️ Backend & DB:</span> FastAPI, Node.js, Express.js, PostgreSQL, MySQL, REST APIs
<span style="color:#f59e0b">☁️ Cloud & DevOps:</span> Docker, Kubernetes, GitHub Actions, AWS Fundamentals, Linux
    `,

    projects: () => `
1. <strong style="color:#38bdf8">SYNAPSE</strong> — Multi-Agent Autonomous Code Reviewer
   • Architecture: Parallel agent orchestration, AST security analyzer, automated Markdown triage.
   
2. <strong style="color:#10b981">DeepXMed</strong> — AI Medicine Discovery & Verification Platform
   • Architecture: Prescription OCR pipeline, semantic medicine RAG, real-time pharmacy search.

3. <strong style="color:#a78bfa">AEGIS</strong> — Real-Time Edge Video Analytics System
   • Architecture: Low-latency CV object detection, edge event streaming, optimized inference loops.

4. <strong style="color:#f59e0b">CabLog AI</strong> — Agentic Document Processing & Fleet Operations
   • Architecture: Vision LLMs (Gemini Flash), CDP browser automation, automated trip reconciliation.
    `,

    experience: () => `
<strong style="color:#38bdf8">AI Engineering Intern — Induspic Engineers</strong> [Dec 2025 – Present]
• Deployed enterprise RAG pipelines and vector database retrieval systems.
• Engineered quotation automation workflows integrating AI agents, document processing, and approval loops.
• Built centralized FastAPI backend services and automated customer interaction pipelines.
    `,

    certs: () => {
      setTimeout(() => {
        if (window.openCertModal) window.openCertModal();
      }, 500);
      return `
🏆 Loaded <strong style="color:#10b981">25 verified industry certifications</strong> across:
   • Anthropic (Model Context Protocol, Building with Claude API, Claude Subagents, Claude 101)
   • LangChain Academy (Deep Agents, Deep Research with LangGraph)
   • Imperial College London (Customising TensorFlow Models)
   • Cisco Networking Academy (Python PCAP, Python Essentials 1 & 2, NDG Linux)
   • AWS & Industry (AWS Solutions Architecture, BCGX GenAI, HPE, Deloitte, Infosys)
Opening certificate explorer modal...
      `;
    },

    resume: () => {
      window.open('Bharath_Abhinesh_A_Resume_Induspic_Engineers.pdf', '_blank');
      return `📄 Opening Bharath_Abhinesh_A_Resume_Induspic_Engineers.pdf in a new tab...`;
    },

    contact: () => `
📬 <strong style="color:#38bdf8">Get In Touch:</strong>
• Email    : <a href="mailto:bharathvk75@gmail.com" style="color:#38bdf8;text-decoration:underline;">bharathvk75@gmail.com</a>
• Phone    : <a href="tel:+916363447946" style="color:#38bdf8;text-decoration:underline;">+91 6363447946</a>
• LinkedIn : <a href="https://linkedin.com/in/bharathvk75" target="_blank" style="color:#38bdf8;text-decoration:underline;">linkedin.com/in/bharathvk75</a>
• GitHub   : <a href="https://github.com/bharathvk75" target="_blank" style="color:#38bdf8;text-decoration:underline;">github.com/bharathvk75</a>
• Location : Bengaluru, Karnataka, India
    `
  };

  function simulateAgentRun(target) {
    const projectName = target || 'synapse';
    return `
<span style="color:#a78bfa">⚡ Initializing Multi-Agent Orchestrator [${projectName.toUpperCase()}]...</span>
[0.02s] 🤖 Agent 1 (Planner): Decomposing input repository AST & dependencies...
[0.15s] 🔍 Agent 2 (Security Auditor): Scanning CWE vulnerabilities & prompt injection risks...
[0.28s] ⚡ Agent 3 (Performance Critic): Benchmarking algorithmic complexity & bottlenecks...
[0.42s] 📝 Agent 4 (Synthesizer): Aggregating parallel consensus into Markdown report...
<span style="color:#10b981">✔ Review Completed! Status: 0 Critical Flaws, 3 Optimization Suggestions Generated.</span>
    `;
  }

  function printLine(html, isPrompt = false, promptCommand = '') {
    const lineEl = document.createElement('div');
    lineEl.className = 'terminal-line';

    if (isPrompt) {
      lineEl.innerHTML = `
        <div class="terminal-prompt-line">
          <span>bharath@portfolio:~$</span>
          <span style="color:#f8fafc">${promptCommand}</span>
        </div>
      `;
    }

    if (html) {
      const outEl = document.createElement('div');
      outEl.className = 'terminal-output';
      outEl.innerHTML = html;
      lineEl.appendChild(outEl);
    }

    terminalBody.appendChild(lineEl);
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  function executeCommand(rawCmd) {
    const cmdTrimmed = rawCmd.trim();
    if (!cmdTrimmed) return;

    commandHistory.push(cmdTrimmed);
    historyIndex = commandHistory.length;

    const parts = cmdTrimmed.split(' ');
    const mainCmd = parts[0].toLowerCase();
    const arg = parts.slice(1).join(' ');

    printLine('', true, cmdTrimmed);

    if (mainCmd === 'clear') {
      terminalBody.innerHTML = '';
      return;
    }

    if (mainCmd === 'agent-run') {
      const output = simulateAgentRun(arg);
      printLine(output);
      return;
    }

    if (COMMANDS[mainCmd]) {
      const res = COMMANDS[mainCmd]();
      printLine(res);
    } else {
      printLine(`<span style="color:#ef4444">Command not found: "${mainCmd}". Type <strong style="color:#38bdf8">help</strong> to see available commands.</span>`);
    }
  }

  // Handle Input submission
  terminalInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const val = terminalInput.value;
      terminalInput.value = '';
      executeCommand(val);
    } else if (e.key === 'ArrowUp') {
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
    } else if (e.key === 'ArrowDown') {
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
    }
  });

  // Handle Quick Chips
  chipButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      const cmd = btn.getAttribute('data-cmd');
      if (cmd) {
        terminalInput.value = cmd;
        executeCommand(cmd);
      }
    });
  });

  // Print initial welcome message
  printLine(`
<span style="color:#10b981">● AI Terminal Online</span> — LangGraph & Multi-Agent Console v2.6.0
Type <strong style="color:#38bdf8">help</strong> or click any chip above to test simulated agent workflows.
  `);
});
