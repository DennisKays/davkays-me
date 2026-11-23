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
    { label: "Website prices", question: "What are your website prices?" },
    { label: "Build a quote", question: "I would like a project quote." },
    { label: "Request a meeting", question: "I would like to request a meeting." },
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

  function catalogItem(id) {
    return window.DAVKAYS_PRICING?.catalog?.find(item => item.id === id);
  }

  function money(value) {
    const currency = window.DAVKAYS_PRICING?.currency || "USD";
    return new Intl.NumberFormat("en-US", { style: "currency", currency, maximumFractionDigits: 2 }).format(value);
  }

  function priceLabel(item) {
    if (!item || item.min == null) return "custom quotation after requirements review";
    if (item.max == null) return `from ${money(item.min)}`;
    return `${money(item.min)}–${money(item.max)}`;
  }

  function requestedPackage(text) {
    const matches = [
      [["personal portfolio", "portfolio site"], "personal-portfolio"],
      [["landing page", "personal landing"], "personal-landing"],
      [["business website", "company website"], "business-website"],
      [["starter website", "small business website"], "starter-website"],
      [["online store", "ecommerce", "e commerce", "online shop"], "online-store"],
      [["blog"], "personal-blog"],
      [["cv website", "resume website", "personal website", "personal site"], "cv-site"],
      [["database app", "database application", "web application"], "database-app"],
      [["management system", "school system", "booking system", "custom system"], "management-system"],
      [["spreadsheet automation", "forms and sheets", "forms and spreadsheet"], "forms-sheets"],
      [["workflow integration", "integrate workflows"], "workflow-integration"],
      [["automation", "automate"], "simple-automation"],
      [["software fix", "software repair", "fix my software", "troubleshoot"], "software-fix"],
      [["maintenance", "support plan", "system support"], "system-support"],
      [["business tool", "simple tool"], "simple-tool"]
    ];
    for (const [phrases, id] of matches) {
      if (phrases.some(phrase => text.includes(phrase))) return catalogItem(id);
    }
    if (text === "cv" || text.includes("resume") || text.includes("curriculum vitae")) return catalogItem("cv-site");
    return null;
  }

  function quoteLink(item) {
    return { label: `Build a ${item?.name || "project"} quote`, href: item ? `/quote.html?service=${encodeURIComponent(item.id)}` : "/quote.html" };
  }

  function answer(question) {
    const text = normalize(question);
    const has = (...terms) => terms.some(term => text.includes(term));
    const item = requestedPackage(text);
    const asksForPrice = has("price", "pricing", "cost", "how much", "charge", "budget", "expensive", "rate", "rates");
    const asksForQuote = has("quote", "quotation", "estimate", "how do i start", "get started", "start a project", "request", "build a quote");

    if (has("meeting", "appointment", "schedule a call", "book a call", "book a meeting", "schedule a meeting", "consultation", "calendar", "set up a call")) {
      const preferredTime = question.trim().slice(0, 300);
      const requestText = encodeURIComponent(`Hello DavKays, I would like to request a meeting. My preferred date, time, and time zone are: ${preferredTime}. Please confirm availability.`);
      return {
        text: "I can help send a meeting request, but I cannot see a live calendar or confirm a slot. Include your preferred date, time, time zone, and a backup option; DavKays will confirm manually.",
        links: [{ label: "Request a time on WhatsApp", href: `https://wa.me/263711881780?text=${requestText}` }, { label: "Use the contact page", href: "/contact.html" }]
      };
    }

    if (asksForQuote && item) {
      return {
        text: `I can start a preliminary ${item.name} estimate at ${priceLabel(item)} USD for the listed scope. The quote builder will ask what you need and prepare an itemised estimate. Supplier costs, final scope, and timing are confirmed separately; the estimate is not a formal quotation.`,
        links: [quoteLink(item), { label: "Ask a question first", href: "/contact.html" }]
      };
    }

    if (asksForPrice && item) {
      return {
        text: `${item.name} is ${priceLabel(item)} USD for the listed development scope. Custom work, supplier costs, and timing need confirmation. You can build a preliminary itemised estimate below; it is not a formal quotation.`,
        links: [quoteLink(item), { label: "See all prices", href: "/services.html#pricing" }]
      };
    }

    if (asksForPrice && (has("maintenance", "monthly", "care plan", "support plan"))) {
      const plans = window.DAVKAYS_PRICING?.maintenance || [];
      const rates = plans.map(plan => `${plan.name}: ${plan.monthly == null ? "price to be confirmed" : `${money(plan.monthly)}/month`}`).join("; ");
      return {
        text: `Published maintenance starting rates are ${rates}. Work limits, schedule, response times, and terms must still be reviewed and agreed in writing.`,
        links: [{ label: "Discuss a support quote", href: "/quote.html?service=system-support" }, { label: "Read support details", href: "/services.html#support" }]
      };
    }

    if (asksForPrice) {
      const ids = ["cv-site", "starter-website", "business-website", "online-store", "simple-automation", "simple-tool"];
      const examples = ids.map(id => catalogItem(id)).filter(Boolean).map(entry => `${entry.name}: ${priceLabel(entry)}`).join("; ");
      return {
        text: `Published development examples (USD): ${examples}. Custom systems and any unlisted work need a scope review. Domain, hosting, email, and other supplier charges are confirmed separately.`,
        links: [quoteLink(), { label: "See all prices", href: "/services.html#pricing" }]
      };
    }

    if (has("deposit", "payment", "pay", "installment", "instalment", "when do i pay")) {
      const terms = window.DAVKAYS_PRICING?.paymentTerms || "Payment terms are confirmed in writing before work begins.";
      return { text: `${terms} A browser-generated estimate is preliminary; final scope and payment terms are confirmed in writing.`, links: [quoteLink(item), { label: "Ask about payment", href: "/contact.html" }] };
    }

    if (has("how long", "delivery time", "turnaround", "when will", "deadline", "how soon")) {
      return {
        text: "Timing depends on the agreed scope, content, and availability. The quote builder does not promise a delivery date; DavKays confirms a schedule after reviewing your requirements.",
        links: [quoteLink(item), { label: "Discuss a project timeline", href: "/contact.html" }]
      };
    }

    if (has("hour", "hours", "open", "opening", "closed", "close", "available", "sunday", "saturday")) {
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
        text: "DavKays offers ready-made systems, custom websites and software, workflow automation, software fixing, and ongoing support. What are you trying to make easier, who will use it, and which features matter most? A target date or budget can help too.",
        links: [quoteLink(item), { label: "Explore all services", href: "/services.html" }, { label: "Tell us what you need", href: "/contact.html" }]
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
    if (asksForQuote) {
      return {
        text: "Tell me what you want to make easier, who will use it, the features you need, and any target date or budget. The quote builder can turn your selected service and details into a preliminary itemised estimate for you to review.",
        links: [quoteLink(item), { label: "Send a message", href: "/contact.html" }]
      };
    }
    if (/^(hi|hello|hey|good morning|good afternoon|good evening)$/.test(text)) {
      return { text: "Hello. What would you like help with: a website, a system, software fixing, pricing, or support?" };
    }
    return {
      text: "Ask me about services, published prices, project quotes, meeting requests, opening hours, software fixing, or support. For a tailored estimate, tell me what you need and who will use it; for a meeting, share your preferred time and time zone.",
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
