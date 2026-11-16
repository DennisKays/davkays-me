(() => {
  "use strict";

  const existingButtons = [...document.querySelectorAll(".chat-launch")];
  const launch = existingButtons.shift() || document.createElement("button");
  existingButtons.forEach(button => button.remove());
  launch.className = "chat-launch";
  launch.type = "button";
  launch.textContent = "Ask DavKays";
  launch.setAttribute("aria-expanded", "false");
  launch.setAttribute("aria-controls", "davkays-chat");
  if (!launch.isConnected) document.body.append(launch);

  const existingPanels = [...document.querySelectorAll("#davkays-chat")];
  const panel = existingPanels.shift() || document.createElement("section");
  existingPanels.forEach(item => item.remove());
  panel.id = "davkays-chat";
  panel.className = "chat-panel";
  panel.setAttribute("aria-label", "DavKays quick-answer helper");
  panel.hidden = true;

  const header = document.createElement("div");
  header.className = "chat-head";
  const title = document.createElement("h2");
  title.textContent = "DavKays quick answers";
  const close = document.createElement("button");
  close.type = "button";
  close.setAttribute("aria-label", "Close chat");
  close.textContent = "×";
  header.append(title, close);

  const log = document.createElement("div");
  log.className = "chat-log";
  log.setAttribute("role", "log");
  log.setAttribute("aria-live", "polite");
  log.setAttribute("aria-relevant", "additions text");

  const suggestions = document.createElement("div");
  suggestions.className = "chat-suggestions";
  suggestions.setAttribute("aria-label", "Common questions");
  [
    { label: "Services", question: "What services do you offer?" },
    { label: "Pricing", question: "How does pricing work?" },
    { label: "Opening hours", question: "When are you open?" },
    { label: "Contact", question: "How can I contact you?" }
  ].forEach(({ label, question }) => {
    const suggestion = document.createElement("button");
    suggestion.type = "button";
    suggestion.dataset.question = question;
    suggestion.textContent = label;
    suggestions.append(suggestion);
  });

  const form = document.createElement("form");
  form.className = "chat-form";
  const label = document.createElement("label");
  label.className = "skip";
  label.htmlFor = "chat-question";
  label.textContent = "Ask a question";
  const input = document.createElement("input");
  input.id = "chat-question";
  input.name = "question";
  input.autocomplete = "off";
  input.placeholder = "Type a question…";
  input.maxLength = 300;
  input.required = true;
  const send = document.createElement("button");
  send.type = "submit";
  send.textContent = "Send";
  form.append(label, input, send);

  panel.replaceChildren(header, log, suggestions, form);
  if (!panel.isConnected) document.body.append(panel);

  const welcome = () => window.DavKaysLocale?.helperGreeting?.() || "Welcome. Ask about services, pricing, projects, or contact options.";
  const intro = document.createElement("div");
  intro.className = "chat-msg";
  intro.textContent = welcome();
  log.append(intro);
  document.addEventListener("davkays:languagechange", () => { intro.textContent = welcome(); });

  function normalize(question) {
    return question.toLocaleLowerCase().normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/[^\p{L}\p{N}\s]/gu, " ").replace(/\s+/g, " ").trim();
  }

  function answer(question) {
    const text = normalize(question);
    const has = (...terms) => terms.some(term => text.includes(term));

    if (has("price", "pricing", "cost", "how much", "charge", "budget", "expensive")) {
      return {
        text: "Prices depend on the work you need. The Services page shows starting prices for some website and automation packages. Custom systems are priced after we understand the idea, and supplier charges such as domains or hosting are confirmed separately.",
        links: [{ label: "See services and starting prices", href: "/services.html#pricing" }, { label: "Build a quote", href: "/quote.html" }]
      };
    }
    if (has("hour", "hours", "open", "opening", "closed", "close", "available", "sunday", "saturday", "time")) {
      return {
        text: "Business hours are shown in Harare time (CAT, UTC+2): Monday to Friday, 8 am to 4 pm; Saturday, 9 am to 1 pm; Sunday, email only. The live timer on the site shows the time left before closing when calls are open.",
        links: [{ label: "See current hours and contact options", href: "/contact.html" }]
      };
    }
    if (has("pc", "computer", "laptop", "desktop")) {
      return {
        text: "DavKays can help troubleshoot computer setup and software problems. Hardware repair is reviewed case by case, so describe what is happening and we can confirm whether it is something we can help with.",
        links: [{ label: "Ask about a computer or software issue", href: "/quote.html?service=software-fix" }]
      };
    }
    if (has("repair", "fix", "fixing", "broken", "troubleshoot", "troubleshooting", "error", "crash", "slow software")) {
      return {
        text: "DavKays can review software problems, troubleshoot supported issues, and explain the next steps before paid repair work begins. Please do not share passwords or private account details.",
        links: [{ label: "Ask about software fixing", href: "/quote.html?service=software-fix" }]
      };
    }
    if (has("maintenance", "support", "update", "updates", "existing system", "keep it running")) {
      return {
        text: "Ongoing maintenance and support are available for existing systems. The work, schedule, response times, fees, and other terms are agreed in writing before a plan starts.",
        links: [{ label: "Discuss system support", href: "/quote.html?service=system-support" }]
      };
    }
    if (has("domain", "hosting", "host", "business email", "mailbox", "email forwarding")) {
      return {
        text: "Domain, hosting, and business email costs depend on the provider and billing period. Those supplier rates are checked and shown separately, so an unknown charge is not treated as free.",
        links: [{ label: "Build a website quote", href: "/quote.html?service=starter-website" }]
      };
    }
    if (has("ready made", "ready-made", "template", "already built", "buy a system", "systems for sale")) {
      return {
        text: "Ready-made systems offer a useful starting point without building everything from scratch. Ask about what is available and whether it fits your needs.",
        links: [{ label: "Ask about ready-made systems", href: "/services.html#ready" }]
      };
    }
    if (has("custom", "build me", "build for me", "from scratch", "automation", "automate", "website", "web site", "business system", "software system", "services", "service", "what do you do", "what do you offer")) {
      return {
        text: "DavKays offers ready-made systems, custom websites and software, workflow automation, software fixing, and ongoing support. Share what you want to make easier, and we can work out a sensible next step.",
        links: [{ label: "Explore all services", href: "/services.html" }, { label: "Tell us what you need", href: "/contact.html" }]
      };
    }
    if (has("project", "portfolio", "work you built", "examples", "past work", "show me your work")) {
      return {
        text: "The Work page is where DavKays shares projects that are ready to show publicly. You can check there for the latest examples.",
        links: [{ label: "View DavKays work", href: "/projects.html" }]
      };
    }
    if (has("partner", "partnership", "sponsor", "sponsorship", "donat", "collaborat")) {
      return {
        text: "Partnerships, sponsorships, donations, and other ideas are welcome. Send a short message about what you have in mind and we can discuss it.",
        links: [{ label: "Start a conversation", href: "/contact.html" }]
      };
    }
    if (has("contact", "email", "phone", "call", "whatsapp", "message", "reach you", "get in touch")) {
      return {
        text: "You can reach DavKays by email, phone, or WhatsApp. Open the Contact page and choose the contact button that works best for you.",
        links: [{ label: "Open contact options", href: "/contact.html" }]
      };
    }
    if (has("quote", "quotation", "estimate", "how do i start", "get started", "start a project", "request")) {
      return {
        text: "Start with the quote builder or send a short message. You do not need a technical brief; describe the problem and we can clarify the details together.",
        links: [{ label: "Start a quote", href: "/quote.html" }, { label: "Send a message", href: "/contact.html" }]
      };
    }
    if (/^(hi|hello|hey|good morning|good afternoon|good evening)$/.test(text)) {
      return { text: "Hello. What would you like help with: a website, a system, software fixing, pricing, or support?" };
    }
    return {
      text: "I can help with basic questions about services, pricing, opening hours, projects, software fixing, support, or contact options. Try one of the questions below, or send DavKays a message.",
      links: [{ label: "Contact DavKays", href: "/contact.html" }]
    };
  }

  function addMessage(message, kind, links = []) {
    const bubble = document.createElement("div");
    bubble.className = `chat-msg${kind === "user" ? " user" : ""}`;
    bubble.textContent = message;
    log.append(bubble);
    if (links.length) {
      const actions = document.createElement("div");
      actions.className = "chat-actions";
      links.forEach(item => {
        const link = document.createElement("a");
        link.href = item.href;
        link.textContent = item.label;
        actions.append(link);
      });
      log.append(actions);
    }
    log.scrollTop = log.scrollHeight;
  }

  function ask(question) {
    const cleanQuestion = question.trim();
    if (!cleanQuestion) return;
    addMessage(cleanQuestion, "user");
    const result = answer(cleanQuestion);
    addMessage(result.text, "bot", result.links || []);
  }

  if (launch.dataset.chatInitialized === "true") return;
  launch.dataset.chatInitialized = "true";
  launch.addEventListener("click", () => {
    panel.hidden = !panel.hidden;
    launch.setAttribute("aria-expanded", String(!panel.hidden));
    if (!panel.hidden) input.focus();
  });
  close.addEventListener("click", () => {
    panel.hidden = true;
    launch.setAttribute("aria-expanded", "false");
    launch.focus();
  });
  form.addEventListener("submit", event => {
    event.preventDefault();
    ask(input.value);
    input.value = "";
    input.focus();
  });
  suggestions.addEventListener("click", event => {
    const button = event.target.closest("button[data-question]");
    if (!button) return;
    ask(button.dataset.question);
    input.focus();
  });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && !panel.hidden) {
      panel.hidden = true;
      launch.setAttribute("aria-expanded", "false");
      launch.focus();
    }
  });
})();
