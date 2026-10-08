(function () {
  const root = document.documentElement;
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  let storedTheme;
  try { storedTheme = localStorage.getItem("theme"); } catch (_) { /* Storage may be disabled. */ }
  root.dataset.theme = ["light", "dark"].includes(storedTheme) ? storedTheme : (prefersDark ? "dark" : "light");
  const drawIcons = () => window.lucide?.createIcons();
  const themeButton = document.querySelector(".theme-toggle");
  const updateTheme = () => {
    const dark = root.dataset.theme === "dark";
    const label = `Switch to ${dark ? "light" : "dark"} theme`;
    themeButton.setAttribute("aria-label", label);
    themeButton.title = label;
    themeButton.innerHTML = `<i data-lucide="${dark ? "sun" : "moon"}" aria-hidden="true"></i>`;
    document.querySelector('meta[name="theme-color"]').content = dark ? "#191b1d" : "#ffffff";
    drawIcons();
  };
  themeButton.addEventListener("click", () => {
    root.dataset.theme = root.dataset.theme === "dark" ? "light" : "dark";
    try { localStorage.setItem("theme", root.dataset.theme); } catch (_) { /* Keep the in-memory choice. */ }
    updateTheme();
  });
  updateTheme();
  const menuButton = document.querySelector(".menu-button");
  const navLinks = document.querySelector(".nav-links");
  const setMenu = (open) => {
    navLinks.classList.toggle("open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
    menuButton.title = open ? "Close navigation" : "Open navigation";
    menuButton.innerHTML = `<i data-lucide="${open ? "x" : "menu"}" aria-hidden="true"></i>`;
    drawIcons();
  };
  menuButton.addEventListener("click", () => setMenu(menuButton.getAttribute("aria-expanded") !== "true"));
  navLinks.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuButton.getAttribute("aria-expanded") === "true") { setMenu(false); menuButton.focus(); }
  });
  document.addEventListener("click", (event) => {
    if (!event.composedPath().includes(document.querySelector(".nav-actions")) && menuButton.getAttribute("aria-expanded") === "true") setMenu(false);
  });
  window.matchMedia("(min-width: 761px)").addEventListener("change", (event) => { if (event.matches) setMenu(false); });
  const items = Array.from(document.querySelectorAll("#news-list li"));
  const newsToggle = document.querySelector("#news-toggle");
  if (items.length > 3) {
    const setNews = (expanded) => {
      items.forEach((item, i) => { item.hidden = !expanded && i >= 3; });
      newsToggle.hidden = false;
      newsToggle.setAttribute("aria-expanded", String(expanded));
      newsToggle.innerHTML = `${expanded ? "Less news" : "Earlier news"} <i data-lucide="${expanded ? "chevron-up" : "chevron-down"}" aria-hidden="true"></i>`;
      drawIcons();
    };
    setNews(false);
    newsToggle.addEventListener("click", () => setNews(newsToggle.getAttribute("aria-expanded") !== "true"));
  }
  const navAnchors = Array.from(document.querySelectorAll(".nav-links a"));
  const sections = navAnchors.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries) => {
      const visible = entries.find((entry) => entry.isIntersecting);
      if (!visible) return;
      navAnchors.forEach((link) => {
        const active = link.getAttribute("href") === `#${visible.target.id}`;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "location"); else link.removeAttribute("aria-current");
      });
    }, { rootMargin: "-15% 0px -60% 0px", threshold: 0 });
    sections.forEach((section) => observer.observe(section));
  }
})();
