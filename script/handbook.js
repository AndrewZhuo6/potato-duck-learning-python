document.addEventListener("DOMContentLoaded", () => {
  const navList = document.getElementById("handbook-nav-list");
  const content = document.getElementById("handbook-content");
  const searchInput = document.getElementById("handbook-search");
  const clearBtn = document.getElementById("handbook-search-clear");
  const emptyState = document.getElementById("handbook-empty");
  const resultCount = document.getElementById("handbook-result-count");
  const navToggle = document.getElementById("handbook-nav-toggle");
  const sidebar = document.getElementById("handbook-sidebar");
  const chipBar = document.getElementById("handbook-chips");
  const topBtn = document.getElementById("handbook-top-btn");

  const GROUPS = window.HANDBOOK_GROUPS || [];

  if (GROUPS.length === 0) {
    content.innerHTML = '<p class="handbook-error">No handbook topics registered. Check that the handbook-NN-*.js files load before handbook.js.</p>';
    return;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function searchableText(section) {
    const parts = [section.title, section.tagline || "", section.keywords || ""];
    section.blocks.forEach((block) => {
      if (block.type === "table") {
        parts.push(block.head.join(" "));
        block.rows.forEach((row) => parts.push(row.join(" ")));
      } else if (block.type === "list") {
        parts.push(block.items.join(" "));
      } else if (block.type === "compare") {
        parts.push(block.bad, block.good, block.why || "");
      } else {
        parts.push(block.value);
      }
    });
    return parts.join(" ").toLowerCase();
  }

  function codeBlock(value, label) {
    const tag = label ? `<span class="handbook-code-label">${escapeHtml(label)}</span>` : "";
    return `
      <div class="handbook-code-block">
        ${tag}
        <button type="button" class="handbook-copy-btn" aria-label="Copy code">Copy</button>
        <pre><code>${escapeHtml(value)}</code></pre>
      </div>`;
  }

  function renderBlock(block) {
    switch (block.type) {
      case "text":
        return `<p class="handbook-text">${escapeHtml(block.value)}</p>`;

      case "sub":
        return `<h3 class="handbook-subhead">${escapeHtml(block.value)}</h3>`;

      case "syntax":
        return `
          <div class="handbook-syntax">
            <span class="handbook-syntax-label">Syntax</span>
            <code>${escapeHtml(block.value)}</code>
          </div>`;

      case "code":
        return codeBlock(block.value, block.label);

      case "list":
        return `
          <ul class="handbook-list">
            ${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}
          </ul>`;

      case "compare":
        return `
          <div class="handbook-compare">
            <div class="handbook-compare-side handbook-compare-bad">
              <span class="handbook-compare-label">Avoid</span>
              <pre><code>${escapeHtml(block.bad)}</code></pre>
            </div>
            <div class="handbook-compare-side handbook-compare-good">
              <span class="handbook-compare-label">Prefer</span>
              <pre><code>${escapeHtml(block.good)}</code></pre>
            </div>
            ${block.why ? `<p class="handbook-compare-why">${escapeHtml(block.why)}</p>` : ""}
          </div>`;

      case "note":
        return `
          <aside class="handbook-callout handbook-callout-note">
            <span class="handbook-callout-label">Randy's note</span>
            <p>${escapeHtml(block.value)}</p>
          </aside>`;

      case "warn":
        return `
          <aside class="handbook-callout handbook-callout-warn">
            <span class="handbook-callout-label">Careful</span>
            <p>${escapeHtml(block.value)}</p>
          </aside>`;

      case "tip":
        return `
          <aside class="handbook-callout handbook-callout-tip">
            <span class="handbook-callout-label">Shortcut</span>
            <p>${escapeHtml(block.value)}</p>
          </aside>`;

      case "table": {
        const head = block.head.map((h) => `<th>${escapeHtml(h)}</th>`).join("");
        const rows = block.rows
          .map((row) => `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`)
          .join("");
        return `
          ${block.caption ? `<p class="handbook-table-caption">${escapeHtml(block.caption)}</p>` : ""}
          <div class="handbook-table-wrap">
            <table class="handbook-table">
              <thead><tr>${head}</tr></thead>
              <tbody>${rows}</tbody>
            </table>
          </div>`;
      }

      default:
        return "";
    }
  }

  function renderSection(section) {
    return `
      <article class="handbook-section" id="${section.id}" data-search="${escapeHtml(searchableText(section))}">
        <header class="handbook-section-head">
          <span class="handbook-section-icon" aria-hidden="true">${section.icon || "•"}</span>
          <div>
            <h2 class="handbook-section-title">${escapeHtml(section.title)}</h2>
            ${section.tagline ? `<p class="handbook-section-tagline">${escapeHtml(section.tagline)}</p>` : ""}
          </div>
        </header>
        <div class="handbook-section-body">${section.blocks.map(renderBlock).join("")}</div>
      </article>`;
  }

  function renderGroup(group) {
    return `
      <section class="handbook-group" id="group-${group.id}" data-group="${group.id}">
        <header class="handbook-group-head">
          <span class="handbook-group-icon" aria-hidden="true">${group.icon}</span>
          <div>
            <h2 class="handbook-group-title">${escapeHtml(group.title)}</h2>
            ${group.blurb ? `<p class="handbook-group-blurb">${escapeHtml(group.blurb)}</p>` : ""}
          </div>
        </header>
        ${group.sections.map(renderSection).join("")}
      </section>`;
  }

  function renderNavGroup(group) {
    const items = group.sections
      .map(
        (s) => `
        <li>
          <a href="#${s.id}" class="handbook-nav-link" data-target="${s.id}">
            ${escapeHtml(s.title)}
          </a>
        </li>`
      )
      .join("");

    return `
      <li class="handbook-nav-group" data-group="${group.id}">
        <button type="button" class="handbook-nav-group-btn is-open" data-group-toggle="${group.id}">
          <span class="handbook-nav-group-icon" aria-hidden="true">${group.icon}</span>
          <span class="handbook-nav-group-label">${escapeHtml(group.title)}</span>
          <span class="handbook-nav-chevron" aria-hidden="true">▾</span>
        </button>
        <ul class="handbook-nav-sublist is-open">${items}</ul>
      </li>`;
  }

  content.innerHTML = GROUPS.map(renderGroup).join("");
  navList.innerHTML = GROUPS.map(renderNavGroup).join("");

  if (chipBar) {
    chipBar.innerHTML = GROUPS.map(
      (g) => `<a href="#group-${g.id}" class="handbook-chip">${g.icon} ${escapeHtml(g.title)}</a>`
    ).join("");
  }

  const sectionEls = Array.from(content.querySelectorAll(".handbook-section"));
  const groupEls = Array.from(content.querySelectorAll(".handbook-group"));
  const navLinks = Array.from(navList.querySelectorAll(".handbook-nav-link"));
  const navGroupEls = Array.from(navList.querySelectorAll(".handbook-nav-group"));

  const totalSections = sectionEls.length;

  function applySearch(term) {
    const q = term.trim().toLowerCase();
    let visible = 0;

    sectionEls.forEach((el) => {
      const match = q === "" || el.dataset.search.includes(q);
      el.classList.toggle("is-hidden", !match);
      if (match) visible += 1;
    });

    groupEls.forEach((groupEl) => {
      const anyVisible = Array.from(groupEl.querySelectorAll(".handbook-section"))
        .some((el) => !el.classList.contains("is-hidden"));
      groupEl.classList.toggle("is-hidden", !anyVisible);
    });

    navLinks.forEach((link) => {
      const el = document.getElementById(link.dataset.target);
      link.parentElement.classList.toggle("is-hidden", el.classList.contains("is-hidden"));
    });

    navGroupEls.forEach((navGroupEl) => {
      const anyVisible = Array.from(navGroupEl.querySelectorAll("li"))
        .some((li) => !li.classList.contains("is-hidden"));
      navGroupEl.classList.toggle("is-hidden", !anyVisible);
    });

    emptyState.style.display = visible === 0 ? "block" : "none";
    clearBtn.style.display = q === "" ? "none" : "block";
    if (chipBar) chipBar.style.display = q === "" ? "flex" : "none";

    resultCount.textContent =
      q === ""
        ? `${totalSections} sections across ${GROUPS.length} topics`
        : `${visible} of ${totalSections} sections match "${term.trim()}"`;
  }

  searchInput.addEventListener("input", (e) => applySearch(e.target.value));

  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    applySearch("");
    searchInput.focus();
  });

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchInput.value = "";
      applySearch("");
    }
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "/" && document.activeElement !== searchInput) {
      e.preventDefault();
      searchInput.focus();
    }
  });

  navList.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-group-toggle]");
    if (!btn) return;
    const sublist = btn.nextElementSibling;
    btn.classList.toggle("is-open");
    sublist.classList.toggle("is-open");
  });

  content.addEventListener("click", (e) => {
    const btn = e.target.closest(".handbook-copy-btn");
    if (!btn) return;

    const code = btn.parentElement.querySelector("code").textContent;
    const done = () => {
      btn.textContent = "Copied";
      btn.classList.add("is-copied");
      setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("is-copied");
      }, 1500);
    };

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(code).then(done).catch(() => fallbackCopy(code, done));
    } else {
      fallbackCopy(code, done);
    }
  });

  function fallbackCopy(text, done) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "absolute";
    area.style.left = "-9999px";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
      done();
    } catch {
    }
    document.body.removeChild(area);
  }

  function scrollNavIntoView(link) {
    const linkBox = link.getBoundingClientRect();
    const navBox = sidebar.getBoundingClientRect();
    const margin = 24;

    const above = linkBox.top < navBox.top + margin;
    const below = linkBox.bottom > navBox.bottom - margin;
    if (!above && !below) return;

    const offset = linkBox.top - navBox.top - sidebar.clientHeight / 2 + linkBox.height / 2;
    sidebar.scrollTo({ top: sidebar.scrollTop + offset, behavior: "smooth" });
  }

function setActive(id) {
    navLinks.forEach((link) => {
      const on = link.dataset.target === id;
      link.classList.toggle("is-active", on);
      if (on) {
        const groupEl = link.closest(".handbook-nav-group");
        const btn = groupEl.querySelector(".handbook-nav-group-btn");
        const sublist = groupEl.querySelector(".handbook-nav-sublist");
        btn.classList.add("is-open");
        sublist.classList.add("is-open");
        scrollNavIntoView(link);
      }
    });
  }

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        const shown = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (shown.length > 0) setActive(shown[0].target.id);
      },
      { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
    );
    sectionEls.forEach((el) => observer.observe(el));
  }

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      setActive(link.dataset.target);
      sidebar.classList.remove("is-open");
    });
  });

  if (navToggle) {
    navToggle.addEventListener("click", () => {
      sidebar.classList.toggle("is-open");
    });
  }

  if (topBtn) {
    window.addEventListener("scroll", () => {
      topBtn.classList.toggle("is-visible", window.scrollY > 600);
    }, { passive: true });
    topBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  const backLink = document.getElementById("handbook-back-link");
  const from = new URLSearchParams(window.location.search).get("from");
  if (backLink && from && /^[a-z0-9_-]+\.html$/i.test(from)) {
    backLink.href = from;
    backLink.style.display = "inline-flex";
  }

  applySearch("");

  const hash = window.location.hash.replace("#", "");
  if (hash) {
    const target = document.getElementById(hash);
    if (target && (target.classList.contains("handbook-section") || target.classList.contains("handbook-group"))) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
      if (target.classList.contains("handbook-section")) setActive(hash);
      target.classList.add("is-landed");
      setTimeout(() => target.classList.remove("is-landed"), 2000);
    }
  }
});