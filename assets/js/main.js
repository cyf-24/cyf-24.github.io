(function () {
  const root = document.documentElement;
  const storedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const initialTheme = storedTheme || (prefersDark ? "dark" : "light");
  root.dataset.theme = initialTheme;

  const themeButton = document.querySelector(".theme-toggle");
  const themeIcon = document.querySelector(".theme-icon");
  const setThemeIcon = () => {
    if (themeIcon) {
      themeIcon.textContent = root.dataset.theme === "dark" ? "L" : "D";
    }
  };
  setThemeIcon();

  themeButton?.addEventListener("click", () => {
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    localStorage.setItem("theme", next);
    setThemeIcon();
  });

  const menuButton = document.querySelector(".menu-button");
  const navLinks = document.querySelector(".nav-links");
  menuButton?.addEventListener("click", () => {
    const isOpen = navLinks?.classList.toggle("open");
    menuButton.setAttribute("aria-expanded", String(Boolean(isOpen)));
  });

  navLinks?.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuButton?.setAttribute("aria-expanded", "false");
    });
  });

  const newsList = document.querySelector("#news-list");
  const newsToggle = document.querySelector("#news-toggle");
  const newsItems = Array.from(newsList?.querySelectorAll("li") || []);
  const collapsedCount = 4;

  if (newsItems.length > collapsedCount && newsToggle) {
    const collapse = () => {
      newsItems.forEach((item, index) => {
        item.hidden = index >= collapsedCount;
      });
      newsToggle.textContent = "Show more";
      newsToggle.dataset.expanded = "false";
      newsToggle.hidden = false;
    };

    const expand = () => {
      newsItems.forEach((item) => {
        item.hidden = false;
      });
      newsToggle.textContent = "Show less";
      newsToggle.dataset.expanded = "true";
    };

    collapse();
    newsToggle.addEventListener("click", () => {
      if (newsToggle.dataset.expanded === "true") {
        collapse();
      } else {
        expand();
      }
    });
  }

  const navAnchors = Array.from(document.querySelectorAll(".nav-links a[href^='#']"));
  const sections = navAnchors
    .map((anchor) => document.querySelector(anchor.getAttribute("href")))
    .filter(Boolean);

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (!visible) {
        return;
      }

      navAnchors.forEach((anchor) => {
        anchor.classList.toggle("active", anchor.getAttribute("href") === `#${visible.target.id}`);
      });
    },
    { rootMargin: "-20% 0px -65% 0px", threshold: [0.1, 0.4, 0.8] }
  );

  sections.forEach((section) => observer.observe(section));
})();
