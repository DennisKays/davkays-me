(() => {
  const body = document.body;
  if (!body.classList.contains("landing-app")) return;

  const panels = [...document.querySelectorAll("[data-screen]")];
  const nav = document.querySelector(".navlinks");
  const aliases = {
    home: "home",
    capabilities: "home",
    innovation: "innovation",
    process: "innovation",
    services: "services",
    work: "projects",
    projects: "projects",
    about: "about",
    contact: "contact"
  };
  const canonicalHash = {
    home: "#home",
    innovation: "#innovation",
    services: "#services",
    projects: "#work",
    about: "#about",
    contact: "#contact"
  };

  function screenFromHash(hash) {
    const key = decodeURIComponent((hash || "").replace(/^#/, "")).toLowerCase();
    return aliases[key] || "home";
  }

  function activate(name, { push = false, replace = false } = {}) {
    const screen = aliases[name] || name;
    if (!canonicalHash[screen]) return;

    body.dataset.activeScreen = screen;
    panels.forEach(panel => {
      const active = panel.dataset.screen === screen;
      panel.classList.toggle("is-active", active);
      panel.setAttribute("aria-hidden", String(!active));
    });

    nav?.querySelectorAll('a[href^="#"]').forEach(link => {
      const active = screenFromHash(link.getAttribute("href")) === screen;
      if (active) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });

    const hash = canonicalHash[screen];
    if (push && location.hash !== hash) history.pushState({ screen }, "", hash);
    else if (replace && location.hash !== hash) history.replaceState({ screen }, "", hash);
  }

  nav?.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const key = link.getAttribute("href").slice(1);
    const screen = aliases[key];
    if (!screen) return;
    event.preventDefault();
    activate(screen, { push: true });
  });

  document.querySelector("main")?.addEventListener("click", event => {
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const key = link.getAttribute("href").slice(1);
    const screen = aliases[key];
    if (!screen) return;
    event.preventDefault();
    activate(screen, { push: true });
  });

  function restoreFromHistory() {
    activate(screenFromHash(location.hash));
  }
  window.addEventListener("popstate", restoreFromHistory);
  window.addEventListener("hashchange", restoreFromHistory);

  activate(screenFromHash(location.hash));
  body.classList.add("screens-ready");
  document.documentElement.classList.add("screen-app-ready");
})();
