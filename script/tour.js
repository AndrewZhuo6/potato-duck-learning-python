(function (global) {
    "use strict";

    const Account = global.QuackbitAccount;
    const PAGE = (location.pathname.split("/").pop() || "index.html").toLowerCase();
    const REDUCED_MOTION = !!(global.matchMedia && global.matchMedia("(prefers-reduced-motion: reduce)").matches);

    /* =========================================================
       Flags — tours only run for accounts created after this feature
       quackbit_tours_<owner>          = "on"   (set in register.js)
       quackbit_tour_<id>_<owner>      = "done" (after finish or skip)
       ========================================================= */
    function session() {
        return Account ? Account.getSession() : null;
    }

    function owner() {
        const user = session();
        return user && Account ? Account.ownerKey(user) : null;
    }

    function read(key) {
        try { return localStorage.getItem(key); } catch { return null; }
    }

    function write(key, value) {
        try { localStorage.setItem(key, value); } catch { }
    }

    const toursOn = () => !!owner() && read(`quackbit_tours_${owner()}`) === "on";
    const isDone = (id) => read(`quackbit_tour_${id}_${owner()}`) === "done";
    const markDone = (id) => write(`quackbit_tour_${id}_${owner()}`, "done");

    /* ---------- helpers ---------- */
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
    const $ = (selector) => document.querySelector(selector);

    async function waitFor(check, timeout = 20000, every = 250) {
        const start = Date.now();
        while (Date.now() - start < timeout) {
            try { if (check()) return true; } catch { }
            await wait(every);
        }
        return false;
    }

    function loadCss() {
        return new Promise((resolve) => {
            if ($("link[data-tour-css]")) return resolve();
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = "css/tour.css";
            link.dataset.tourCss = "1";
            link.onload = resolve;
            link.onerror = resolve;
            document.head.appendChild(link);
        });
    }

    function isVisible(el) {
        if (!el || !el.getClientRects().length) return false;
        const style = getComputedStyle(el);
        return style.visibility !== "hidden" && style.display !== "none" && Number(style.opacity) !== 0;
    }

    function shown(selector) {
        return isVisible($(selector));
    }

    function resolveTargets(step) {
        if (!step.target) return [];
        let raw;
        try { raw = typeof step.target === "function" ? step.target() : step.target; } catch { raw = null; }
        const list = raw && typeof raw.length === "number" && typeof raw !== "string" ? [...raw] : [raw];
        return list
            .map((item) => (typeof item === "string" ? $(item) : item))
            .filter(isVisible);
    }

    function unionRect(elements) {
        const rects = elements.map((el) => el.getBoundingClientRect());
        const top = Math.min(...rects.map((r) => r.top));
        const left = Math.min(...rects.map((r) => r.left));
        const right = Math.max(...rects.map((r) => r.right));
        const bottom = Math.max(...rects.map((r) => r.bottom));
        return { top, left, right, bottom, width: right - left, height: bottom - top };
    }

    const esc = (value) => (Account ? Account.escapeHtml(value) : String(value));
    const name = () => esc(Account ? Account.displayName(session()) : "Duck Coder");

    function openProfileMenu() {
        const menu = $(".user-menu-dropdown");
        const toggle = $(".user-menu-toggle");
        if (menu) menu.hidden = false;
        if (toggle) toggle.setAttribute("aria-expanded", "true");
    }

    function closeProfileMenu() {
        const menu = $(".user-menu-dropdown");
        const toggle = $(".user-menu-toggle");
        if (menu) menu.hidden = true;
        if (toggle) toggle.setAttribute("aria-expanded", "false");
    }

    const noModalOpen = () => {
        const username = $("#username-modal");
        return (!username || username.hidden) && !shown(".solution-modal-backdrop");
    };

    function confetti() {
        if (REDUCED_MOTION) return;
        const layer = document.createElement("div");
        layer.className = "qt-confetti";
        const pieces = ["🎉", "🦆", "⭐", "✨", "🐍", "💛", "🧡"];
        let html = "";
        for (let i = 0; i < 34; i++) {
            const piece = pieces[i % pieces.length];
            html += `<span style="--x:${Math.random() * 100}vw;--size:${16 + Math.random() * 18}px;--dur:${1.4 + Math.random() * 1.1}s;--delay:${Math.random() * 0.35}s;--spin:${Math.random() > 0.5 ? "" : "-"}${240 + Math.random() * 360}deg">${piece}</span>`;
        }
        layer.innerHTML = html;
        document.body.appendChild(layer);
        setTimeout(() => layer.remove(), 3000);
    }

    /* =========================================================
       Tour engine
       ========================================================= */
    class Tour {
        constructor(steps, options = {}) {
            this.allSteps = steps;
            this.options = options;
            this.index = -1;
            this.active = false;
            this.frame = null;
            this.onKey = this.onKey.bind(this);
            this.onViewportChange = this.onViewportChange.bind(this);
        }

        async start() {
            await loadCss();
            this.steps = this.allSteps.filter((step) => !step.target || step.before || resolveTargets(step).length);
            if (!this.steps.length) return false;

            this.previousFocus = document.activeElement;
            this.build();
            this.active = true;
            document.addEventListener("keydown", this.onKey, true);
            window.addEventListener("resize", this.onViewportChange);
            window.addEventListener("scroll", this.onViewportChange, { passive: true, capture: true });
            await this.show(0);
            return true;
        }

        build() {
            this.root = document.createElement("div");
            this.root.className = "qt-root";
            this.root.innerHTML = `
                <div class="qt-blocker"></div>
                <div class="qt-spot is-center"></div>
                <div class="qt-card" role="dialog" aria-modal="true" aria-labelledby="qt-title" aria-describedby="qt-body">
                    <div class="qt-head">
                        <img class="qt-guide-avatar" src="assets/images/duck-icon.png" alt="">
                        <div>
                            <div class="qt-guide-name">Quackbit Guide</div>
                            <div class="qt-guide-sub">${esc(this.options.subtitle || "Tour")}</div>
                        </div>
                        <span class="qt-count" aria-live="polite"></span>
                    </div>
                    <h3 class="qt-title" id="qt-title"></h3>
                    <div class="qt-body" id="qt-body"></div>
                    <div class="qt-dots" aria-label="Tour steps"></div>
                    <div class="qt-foot">
                        <button type="button" class="qt-skip">Skip tour</button>
                        <div class="qt-foot-right">
                            <button type="button" class="qt-btn qt-btn-ghost qt-back">Back</button>
                            <button type="button" class="qt-btn qt-btn-primary qt-next">Next</button>
                        </div>
                    </div>
                    <div class="qt-hint">Use <kbd>←</kbd> <kbd>→</kbd> to move, <kbd>Esc</kbd> to skip</div>
                </div>
            `;

            this.spot = this.root.querySelector(".qt-spot");
            this.card = this.root.querySelector(".qt-card");
            this.avatar = this.root.querySelector(".qt-guide-avatar");
            this.countEl = this.root.querySelector(".qt-count");
            this.titleEl = this.root.querySelector(".qt-title");
            this.bodyEl = this.root.querySelector(".qt-body");
            this.dotsEl = this.root.querySelector(".qt-dots");
            this.backBtn = this.root.querySelector(".qt-back");
            this.nextBtn = this.root.querySelector(".qt-next");
            this.rightEl = this.root.querySelector(".qt-foot-right");

            // Clicks inside the tour must not reach page listeners (they would close the profile menu).
            this.root.addEventListener("click", (event) => event.stopPropagation());

            this.root.querySelector(".qt-skip").addEventListener("click", () => this.end("skipped"));
            this.backBtn.addEventListener("click", () => this.show(this.index - 1));
            this.nextBtn.addEventListener("click", () => this.next());

            this.dotsEl.innerHTML = this.steps
                .map((_, i) => `<button type="button" class="qt-dot" aria-label="Go to step ${i + 1}" data-step="${i}"></button>`)
                .join("");
            this.dotsEl.addEventListener("click", (event) => {
                const dot = event.target.closest(".qt-dot");
                if (dot) this.show(Number(dot.dataset.step));
            });

            document.body.appendChild(this.root);
        }

        async show(i) {
            if (!this.active || i < 0 || i >= this.steps.length || i === this.index || this.busy) return;
            this.busy = true;

            const leaving = this.steps[this.index];
            if (leaving && leaving.after) {
                try { leaving.after(); } catch { }
            }

            this.index = i;
            const step = this.steps[i];
            this.card.classList.remove("is-visible");

            if (step.before) {
                try { await step.before(); } catch { }
                await wait(60);
            }

            const targets = resolveTargets(step);
            if (targets.length && step.scroll !== false) {
                const rect = unionRect(targets);
                const header = $(".header");
                const topLimit = header && getComputedStyle(header).position === "sticky" ? header.offsetHeight + 10 : 10;
                if (rect.top < topLimit || rect.bottom > window.innerHeight - 20) {
                    targets[0].scrollIntoView({ block: "center", behavior: REDUCED_MOTION ? "auto" : "smooth" });
                    await wait(REDUCED_MOTION ? 60 : 480);
                }
            }

            const total = this.steps.length;
            const isLast = i === total - 1;

            this.countEl.textContent = `${i + 1} of ${total}`;
            this.titleEl.textContent = typeof step.title === "function" ? step.title() : step.title;
            this.bodyEl.innerHTML = typeof step.body === "function" ? step.body() : step.body;

            this.backBtn.style.visibility = i === 0 ? "hidden" : "visible";
            this.nextBtn.textContent = step.nextLabel || (isLast ? "Finish" : "Next");

            this.rightEl.querySelectorAll(".qt-cta").forEach((el) => el.remove());
            (step.cta ? [].concat(step.cta) : []).forEach((cta) => {
                const link = document.createElement("a");
                link.className = "qt-btn qt-btn-gold qt-cta";
                link.href = cta.href;
                link.textContent = cta.label;
                link.addEventListener("click", () => this.end("finished"));
                this.nextBtn.before(link);
            });

            this.dotsEl.querySelectorAll(".qt-dot").forEach((dot, n) => {
                dot.classList.toggle("is-active", n === i);
                dot.classList.toggle("is-done", n < i);
            });

            this.position();

            // restart the entrance + duck wiggle animations
            void this.card.offsetWidth;
            this.card.classList.add("is-visible");
            this.avatar.classList.remove("is-quacking");
            void this.avatar.offsetWidth;
            this.avatar.classList.add("is-quacking");

            if (step.confetti) confetti();
            this.nextBtn.focus({ preventScroll: true });
            this.busy = false;
        }

        next() {
            if (this.index >= this.steps.length - 1) this.end("finished");
            else this.show(this.index + 1);
        }

        position() {
            if (!this.active) return;
            const step = this.steps[this.index];
            const targets = resolveTargets(step);
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const margin = 12;
            const gap = 16;

            this.card.classList.toggle("is-center", !targets.length);
            this.spot.classList.toggle("is-center", !targets.length);

            const cw = this.card.offsetWidth;
            const ch = this.card.offsetHeight;

            if (!targets.length) {
                Object.assign(this.spot.style, { top: "50%", left: "50%", width: "0px", height: "0px" });
                this.card.removeAttribute("data-side");
                this.card.style.left = `${Math.max(margin, (vw - cw) / 2)}px`;
                this.card.style.top = `${Math.max(margin, (vh - ch) / 2)}px`;
                return;
            }

            const pad = step.padding ?? 8;
            const r = unionRect(targets);
            const spot = { top: r.top - pad, left: r.left - pad, width: r.width + pad * 2, height: r.height + pad * 2 };

            Object.assign(this.spot.style, {
                top: `${spot.top}px`,
                left: `${spot.left}px`,
                width: `${spot.width}px`,
                height: `${spot.height}px`,
                borderRadius: `${step.radius ?? 12}px`
            });

            const space = {
                bottom: vh - (spot.top + spot.height),
                top: spot.top,
                right: vw - (spot.left + spot.width),
                left: spot.left
            };
            const fits = {
                bottom: space.bottom >= ch + gap + margin,
                top: space.top >= ch + gap + margin,
                right: space.right >= cw + gap + margin,
                left: space.left >= cw + gap + margin
            };

            const order = [step.side, "bottom", "top", "right", "left"].filter(Boolean);
            let side = order.find((s) => fits[s]) || Object.keys(space).sort((a, b) => space[b] - space[a])[0];

            const centerX = spot.left + spot.width / 2;
            const centerY = spot.top + spot.height / 2;
            let left;
            let top;

            if (side === "bottom" || side === "top") {
                left = centerX - cw / 2;
                top = side === "bottom" ? spot.top + spot.height + gap : spot.top - ch - gap;
            } else {
                top = centerY - ch / 2;
                left = side === "right" ? spot.left + spot.width + gap : spot.left - cw - gap;
            }

            left = Math.min(Math.max(margin, left), vw - cw - margin);
            top = Math.min(Math.max(margin, top), vh - ch - margin);

            this.card.dataset.side = side;
            this.card.style.left = `${left}px`;
            this.card.style.top = `${top}px`;

            const arrow = side === "bottom" || side === "top"
                ? Math.min(Math.max(22, centerX - left), cw - 22)
                : Math.min(Math.max(22, centerY - top), ch - 22);
            this.card.style.setProperty("--qt-arrow", `${arrow}px`);
        }

        onViewportChange() {
            if (this.frame) return;
            this.frame = requestAnimationFrame(() => {
                this.frame = null;
                this.position();
            });
        }

        onKey(event) {
            if (!this.active) return;

            if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                this.end("skipped");
            } else if (event.key === "ArrowRight") {
                event.preventDefault();
                this.next();
            } else if (event.key === "ArrowLeft") {
                event.preventDefault();
                this.show(this.index - 1);
            } else if (event.key === "Tab") {
                const focusables = [...this.card.querySelectorAll("button, a[href]")].filter((el) => el.style.visibility !== "hidden");
                if (!focusables.length) return;
                const first = focusables[0];
                const last = focusables[focusables.length - 1];
                if (!this.card.contains(document.activeElement)) {
                    event.preventDefault();
                    first.focus();
                } else if (event.shiftKey && document.activeElement === first) {
                    event.preventDefault();
                    last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                    event.preventDefault();
                    first.focus();
                }
            }
        }

        end(reason) {
            if (!this.active) return;
            this.active = false;

            const step = this.steps[this.index];
            if (step && step.after) {
                try { step.after(); } catch { }
            }

            document.removeEventListener("keydown", this.onKey, true);
            window.removeEventListener("resize", this.onViewportChange);
            window.removeEventListener("scroll", this.onViewportChange, { capture: true });
            if (this.frame) cancelAnimationFrame(this.frame);
            this.root.remove();

            if (this.previousFocus && this.previousFocus.focus) {
                try { this.previousFocus.focus({ preventScroll: true }); } catch { }
            }

            if (this.options.onEnd) this.options.onEnd(reason);
        }
    }

    /* =========================================================
       Shared steps
       ========================================================= */
    const profileMenuStep = (extra) => ({
        target: [".user-menu", ".user-menu-dropdown"],
        before: openProfileMenu,
        after: closeProfileMenu,
        side: "left",
        title: "Your secret duck pocket 👝",
        body: `
            <p>Click your name or picture (top right) to open this menu:</p>
            <ul>
                <li><strong>Stats</strong>: your profile, username, photo, badges and progress</li>
                <li><strong>Guidebook</strong>: Randy's Handbook, the Python cheat sheet</li>
                <li><strong>Lock Out</strong>: log out (the ducks will miss you)</li>
            </ul>
            ${extra || ""}
        `
    });

    /* =========================================================
       Tours
       ========================================================= */
    const TOURS = {
        /* ---------------- HOME ---------------- */
        home: {
            page: "index.html",
            subtitle: "🏠 Home",
            ready: () => $(".user-menu") && $(".start-container .start-btn"),
            steps: () => [
                {
                    title: `Quack quack, ${name()}! 🦆`,
                    body: `
                        <p>Welcome to <strong>Quackbit</strong>! I'm your guide. Think of me as a duck with a clipboard.</p>
                        <p>Bad news: a giant serpent called <strong>PyThorn</strong> wants to eat Potato Village. Good news: he is <em>terrible</em> at Python, and you are about to be great at it.</p>
                        <p>Let me show you around. Every page you open for the first time gets its own short tour.</p>
                    `,
                    nextLabel: "Show me around"
                },
                {
                    target: ".logo",
                    title: "Lost? Tap the logo",
                    body: `<p>The Quackbit logo brings you back Home from <strong>any</strong> page. It's the duck equivalent of clicking your heels three times.</p>`
                },
                {
                    target: '.nav-links a[href="story.html"]',
                    title: "Courses 🗺️",
                    body: `
                        <p>All <strong>16 chapters</strong> of your Python adventure:</p>
                        <ul>
                            <li>🏡 <strong>Village 1–5</strong>: training in Potato Village</li>
                            <li>⚔️ <strong>Guardian 1–10</strong>: trials on the road</li>
                            <li>🔥 <strong>The Boss</strong>: PyThorn himself</li>
                        </ul>
                        <p>Chapters unlock one by one as you pass them.</p>
                    `
                },
                {
                    target: '.nav-links a[href="history.html"]',
                    title: "My Code 💾",
                    body: `<p>Every time you pass a challenge, your winning code is saved here automatically. Like a trophy shelf, but for code.</p>`
                },
                {
                    target: '.nav-links a[href="team.html"]',
                    title: "About Us 👋",
                    body: `<p>Meet <strong>Team Potato Duck</strong>, the six humans who built this place (with a lot of coffee).</p>`
                },
                profileMenuStep(`<p>Tip: go to <strong>Stats</strong> to pick your username and add a profile photo.</p>`),
                {
                    target: ".start-container",
                    before: () => window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? "auto" : "smooth" }),
                    title: "The big shiny button ✨",
                    body: `<p><strong>Start My Journey</strong> jumps straight into the chapter you're on. Later it becomes <strong>Continue Adventure</strong>, so you never have to hunt for where you left off. <strong>View All Stories</strong> opens Courses.</p>`
                },
                {
                    target: ".features-grid",
                    title: "What Quackbit is about",
                    body: `
                        <ul>
                            <li>🎯 <strong>Guided Learning</strong>: one topic at a time</li>
                            <li>📖 <strong>Game Story</strong>: every lesson is part of the adventure</li>
                            <li>🧩 <strong>Challenges</strong>: real Python you write and test yourself</li>
                        </ul>
                    `
                },
                {
                    target: ".story-card1",
                    title: "The lore 🐍",
                    body: `<p>Scroll down for the story of Quackbit and PyThorn. Watch the snakes move as you scroll. Yes, they're following you. No, they don't bite (yet).</p><p>🎵 Background music starts when you scroll, too.</p>`
                },
                {
                    title: "You're all set! 🎉",
                    body: `
                        <p>Two good places to go next:</p>
                        <ul>
                            <li><strong>Pick a username</strong> so the village knows your name</li>
                            <li><strong>Start Village 1</strong> and write your first line of Python</li>
                        </ul>
                        <p>Need this again? Press <strong>🧭 Tour</strong> in the bottom-left corner.</p>
                    `,
                    cta: [
                        { label: "Pick a username", href: "stats.html?setup=1" },
                        { label: "Start Village 1", href: "v1.html" }
                    ],
                    nextLabel: "Finish",
                    confetti: true
                }
            ]
        },

        /* ---------------- COURSES ---------------- */
        courses: {
            page: "story.html",
            subtitle: "🗺️ Courses",
            ready: () => $("#story-grid .story-card"),
            steps: () => [
                {
                    title: "The Map of Doom 🗺️",
                    body: `<p>Welcome to <strong>Courses</strong>! This is where all your chapters live. Don't worry, it's only doom for PyThorn.</p>`,
                    nextLabel: "Let's look"
                },
                {
                    target: ".progress-tracker-card",
                    title: "Journey progress",
                    body: `<p>Shows how many of the <strong>16 chapters</strong> you've unlocked. The bar fills up as you win. Watching it grow is weirdly satisfying.</p>`
                },
                {
                    target: ".story-filter-nav",
                    title: "Filter the chapters",
                    body: `
                        <ul>
                            <li>🗺️ <strong>All Stories</strong>: everything</li>
                            <li>🏡 <strong>Village Training</strong>: the 5 starter chapters</li>
                            <li>⚔️ <strong>Guardian Trials</strong>: the 10 harder ones</li>
                            <li>🔥 <strong>Final Boss</strong>: the big snake fight</li>
                        </ul>
                    `
                },
                {
                    target: () => {
                        const badge = $(".card-status-badge.current");
                        return badge ? badge.closest(".story-card") : $(".story-card.unlocked");
                    },
                    title: "Your current chapter ⭐",
                    body: `
                        <p>Each card shows the chapter's <strong>topic</strong>, a short description and a status:</p>
                        <ul>
                            <li>⭐ <strong>Current</strong>: the one you're on</li>
                            <li>✓ <strong>Completed</strong>: already beaten</li>
                            <li>🔒 <strong>Locked</strong>: not yet</li>
                        </ul>
                        <p>Press <strong>Play Story</strong> on a card to start it.</p>
                    `
                },
                {
                    target: ".story-card.locked",
                    title: "Locked chapters 🔒",
                    body: `<p>These open up when you pass the chapter before them. No skipping ahead. Even ducks have rules.</p>`
                },
                {
                    title: "Pick your first quest!",
                    body: `<p>Everyone starts at <strong>Village 1: The Decision</strong>. When you open it, I'll show you how the code editor works.</p>`,
                    cta: { label: "Start Village 1", href: "v1.html" },
                    nextLabel: "Finish",
                    confetti: true
                }
            ]
        },

        /* ---------------- MY CODE ---------------- */
        mycode: {
            page: "history.html",
            subtitle: "💾 My Code",
            ready: () => $("#history-count") && !/loading/i.test($("#history-count").textContent),
            steps: () => [
                {
                    title: "The Trophy Shelf 🏆",
                    body: `<p>This is <strong>My Code</strong>. Every challenge you pass saves the exact code that won, so you can look back and admire your genius.</p>`,
                    nextLabel: "Show me"
                },
                {
                    target: "#history-count",
                    title: "Your collection",
                    body: `<p>How many solutions you have saved so far.</p>`
                },
                {
                    target: ".history-filter-nav",
                    title: "Filter by area",
                    body: `<p>Show only <strong>Village</strong>, <strong>Guardian</strong> or <strong>Final Boss</strong> solutions. <strong>Clear Archive</strong> appears here once you have saved code, and deletes everything, so maybe don't press it for fun.</p>`
                },
                {
                    target: "#history-empty",
                    title: "It's a bit empty… for now",
                    body: `<p>No saved code yet. Pass your first challenge and it shows up here automatically. No save button needed.</p>`
                },
                {
                    target: ".history-card",
                    title: "A saved solution",
                    body: `<p>Each card shows the chapter, when you saved it, and a preview of your code. If you passed a chapter more than once, the older versions are kept too.</p>`
                },
                {
                    target: ".history-card-actions",
                    title: "What you can do",
                    body: `
                        <ul>
                            <li><strong>View Code</strong>: open the full code (and older versions)</li>
                            <li><strong>Copy</strong>: copy it to your clipboard</li>
                            <li><strong>Replay ↩</strong>: go back to that chapter</li>
                            <li><strong>🗑</strong>: delete this one solution</li>
                        </ul>
                    `
                },
                {
                    title: "That's My Code!",
                    body: `<p>Tip: inside a chapter you've already passed, a green <strong>Solution saved</strong> banner lets you load your old code straight back into the editor.</p>`,
                    nextLabel: "Got it",
                    confetti: true
                }
            ]
        },

        /* ---------------- GUIDEBOOK ---------------- */
        guidebook: {
            page: "handbook.html",
            subtitle: "📖 Guidebook",
            ready: () => $(".handbook-section"),
            steps: () => [
                {
                    title: "Randy's Handbook 📖",
                    body: `<p>This is the <strong>Guidebook</strong>. Randy wrote down everything a young coder needs to know about Python. Randy is very organised. Be like Randy.</p>`,
                    nextLabel: "Open it"
                },
                {
                    target: "#handbook-back-link",
                    title: "Back to your chapter",
                    body: `<p>You came here from a chapter, so this link takes you straight back to it. Your code will be waiting.</p>`
                },
                {
                    target: ".handbook-searchbar",
                    title: "Search anything 🔍",
                    body: `<p>Type a word like <code>loop</code>, <code>list</code> or <code>if</code> and only the matching topics stay on screen. Faster than asking a duck.</p>`
                },
                {
                    target: "#handbook-chips",
                    title: "Jump to a topic",
                    body: `<p>Tap a chip to jump straight to that group of topics.</p>`
                },
                {
                    target: "#handbook-sidebar",
                    side: "right",
                    title: "Table of contents",
                    body: `<p>The full list of topics. It highlights where you are while you scroll.</p>`
                },
                {
                    target: "#handbook-nav-toggle",
                    title: "Table of contents",
                    body: `<p>On small screens, open the full topic list with this button.</p>`
                },
                {
                    target: ".handbook-section-head",
                    title: "A topic",
                    body: `<p>Each topic explains one idea in plain words, with syntax, examples, tables and tips.</p>`
                },
                {
                    target: ".handbook-copy-btn",
                    padding: 6,
                    title: "Copy examples",
                    body: `<p>Every code example has a <strong>Copy</strong> button. Copy it, paste it into the editor, play with it.</p>`
                },
                {
                    target: ".handbook-callout",
                    title: "Randy's notes",
                    body: `<p>Coloured boxes are extra advice: <strong>Randy's note</strong>, <strong>Careful</strong> (common mistakes) and <strong>Shortcut</strong> (neat tricks).</p>`
                },
                {
                    title: "Happy reading! 🤓",
                    body: `<p>You can open the Guidebook any time from your <strong>profile menu</strong>. When you scroll far down, a <strong>↑</strong> button appears to fly back to the top.</p>`,
                    nextLabel: "Finish",
                    confetti: true
                }
            ]
        },

        /* ---------------- ABOUT US ---------------- */
        about: {
            page: "team.html",
            subtitle: "👋 About Us",
            ready: () => $(".member-card"),
            steps: () => [
                {
                    title: "Meet the flock 🦆",
                    body: `<p>These are the humans of <strong>Team Potato Duck</strong> who built Quackbit. They're mostly harmless.</p>`,
                    nextLabel: "Say hi"
                },
                {
                    target: ".team-row",
                    title: "The team",
                    body: `<p>Each card shows a team member's photo, name and role.</p>`
                },
                {
                    target: ".member-card",
                    padding: 6,
                    title: "Open a profile",
                    body: `<p>For example, click this card to open that person's profile page: what they study, their skills and what they worked on. Every card works the same way.</p>`
                },
                {
                    title: "That's the crew!",
                    body: `<p>Go ahead and snoop around their profiles. They said it's fine. Probably.</p>`,
                    nextLabel: "Finish",
                    confetti: true
                }
            ]
        },

        stats: {
            page: "stats.html",
            subtitle: "📊 Stats",
            ready: () => $("#accomplishment-list li") && $(".user-menu"),
            steps: () => [
                {
                    title: `This is you, ${name()}! 🪞`,
                    body: `<p>Welcome to <strong>Stats</strong>, your profile page. Let's make it look good and learn how to read your progress.</p>`,
                    nextLabel: "Show me"
                },
                {
                    target: "#stats-avatar",
                    padding: 6,
                    radius: 999,
                    title: "Change your photo 📸",
                    body: `<p>Click your picture to upload any image. It's cropped into a circle and shows in the top bar on every page. <strong>Remove photo</strong> appears below if you change your mind.</p>`
                },
                {
                    target: "#rename-btn",
                    padding: 6,
                    radius: 999,
                    title: "Change your username ✎",
                    body: `<p>Click the pencil to pick a new name (3–20 letters, numbers, spaces, <code>_</code> or <code>-</code>). Your progress stays safe when you rename.</p>`
                },
                {
                    target: "#stats-rank",
                    title: "Your rank",
                    body: `<p>It levels up as you clear chapters: <strong>Novice Duck</strong> → <strong>Village Duck</strong> → <strong>Guardian Duck</strong> → <strong>Legendary Duck</strong>. No pressure.</p>`
                },
                {
                    target: "#ongoing-card",
                    title: "On Going",
                    body: `<p>The green bar is your course progress, and the text is your next chapter. Click the card to jump straight in.</p>`
                },
                {
                    target: () => document.querySelectorAll(".stats-number"),
                    title: "Fly Hour & Challenges Done",
                    body: `
                        <ul>
                            <li>⏱️ <strong>Fly Hour</strong>: hours spent in chapter pages (only while the tab is open and on screen)</li>
                            <li>✅ <strong>Challenges Done</strong>: chapters passed, out of 16</li>
                        </ul>
                    `
                },
                {
                    target: () => { const l = $("#badge-list"); return l && l.closest(".stats-block"); },
                    title: "Badges 🏅",
                    body: `
                        <ul>
                            <li>🥚 <strong>First Quack</strong>: clear 1 chapter</li>
                            <li>🏡 <strong>Village Graduate</strong>: clear all 5 villages</li>
                            <li>🛡️ <strong>Guardian Breaker</strong>: beat 5 guardians</li>
                            <li>🗺️ <strong>Road Conqueror</strong>: beat all 10 guardians</li>
                            <li>🐍 <strong>PyThorn Slayer</strong>: defeat the boss</li>
                        </ul>
                    `
                },
                {
                    target: () => { const l = $("#accomplishment-list"); return l && l.closest(".stats-block"); },
                    title: "Accomplishments 📜",
                    body: `<p>Your hall of fame: every chapter you've cleared and the date you did it.</p>`
                },
                {
                    title: "Looking sharp! 😎",
                    body: `<p>Now go earn that <strong>First Quack</strong> badge.</p>`,
                    cta: { label: "Start Village 1", href: "v1.html" },
                    nextLabel: "Finish",
                    confetti: true
                }
            ]
        },

        cutscene: {
            page: "v1.html",
            subtitle: "🎬 Story cutscene",
            ready: () => {
                const cut = $("#cutscene-container");
                const ws = $("#workspace-container");
                return isVisible(cut) && (!ws || getComputedStyle(ws).display === "none");
            },
            steps: () => [
                {
                    before: () => {
                        const video = $("#story-video");
                        if (video && !video.paused) video.pause();
                    },
                    title: "Every chapter starts with a story 🎬",
                    body: `
                        <p>This is the <strong>cutscene</strong>. Quackbit gets into trouble here, and the trouble is always solved with Python.</p>
                        <p>I paused it so I can point out a few things. Two seconds, promise.</p>
                    `,
                    nextLabel: "Go on then"
                },
                {
                    target: ".cutscene-header",
                    title: "Where you are",
                    body: `<p>The badge shows the chapter (<strong>Village 1 Story</strong>) and the title of this part of the adventure.</p>`
                },
                {
                    target: ".video-wrapper",
                    title: "The scene 🍿",
                    body: `<p>It plays by itself with sound. Use the video controls to pause, rewind or go full screen. When it ends, you go to the challenge <strong>automatically</strong>.</p>`
                },
                {
                    target: ".cutscene-narrative",
                    title: "The lesson hidden in the story 📜",
                    body: `<p>The text under the video explains the Python idea behind this chapter in plain words. Read it, it's basically the answer's cousin.</p>`
                },
                {
                    target: "#skip-video-btn",
                    title: "In a hurry? Skip ⏭",
                    body: `<p><strong>Skip Cutscene</strong> jumps straight to the challenge. You can always rewatch the scene from the problem page.</p>`
                },
                {
                    after: () => {
                        const video = $("#story-video");
                        if (video && video.paused) video.play().catch(() => {});
                    },
                    title: "Enjoy the show! 🦆🍿",
                    body: `<p>I'll be waiting on the other side to show you the code editor.</p>`,
                    nextLabel: "Play the scene",
                    confetti: true
                }
            ]
        },

        chapter: {
            page: "v1.html",
            subtitle: "⚔️ How chapters work",
            ready: () => {
                const ws = $("#workspace-container");
                const outcome = $("#outcome-cutscene-container");
                return ws && getComputedStyle(ws).display !== "none" && $(".CodeMirror") && !isVisible(outcome);
            },
            steps: () => [
                {
                    title: "Your first challenge! ⚔️",
                    body: `
                        <p>Every chapter works the same way:</p>
                        <ul>
                            <li><strong>1.</strong> Watch the story</li>
                            <li><strong>2.</strong> Read the task</li>
                            <li><strong>3.</strong> Write Python code</li>
                            <li><strong>4.</strong> Submit and see what happens</li>
                        </ul>
                        <p>I'll only show this once, so pay attention. (I'm kidding, there's a replay button.)</p>
                    `,
                    nextLabel: "Show me"
                },
                {
                    target: ".go-back-link",
                    title: "Go Back",
                    body: `<p>Returns to <strong>Courses</strong>. Your progress and unfinished code are kept, so you can leave and come back.</p>`
                },
                {
                    target: ".video-scene",
                    title: "Rewatch the story 🎬",
                    body: `<p>The cutscene is here if you want to watch it again while you work.</p>`
                },
                {
                    target: ".chapter-tag",
                    title: "Chapter and topic",
                    body: `<p>Where you are on the map and which Python topic you're learning. This one is <strong>Conditionals</strong>: making decisions with <code>if</code>.</p>`
                },
                {
                    target: ".story-quote",
                    title: "The situation",
                    body: `<p>The story behind the problem. Spoiler: bandits are bad.</p>`
                },
                {
                    target: () => {
                        const task = [...document.querySelectorAll(".problem-panel h3")].find((h) => /task/i.test(h.textContent));
                        if (!task) return null;
                        const parts = [task];
                        let el = task.nextElementSibling;
                        while (el && el.tagName !== "H3") { parts.push(el); el = el.nextElementSibling; }
                        return parts;
                    },
                    title: "The task 🎯",
                    body: `<p>The most important part. It says <strong>exactly</strong> what your code must do: the function name, what it receives, and what it returns. Read it twice.</p>`
                },
                {
                    target: ".code-example-box",
                    title: "Examples & guidelines",
                    body: `<p>Examples show the answer your function should give for an input. The <strong>Guidelines</strong> under them hint at which Python tools to use.</p>`
                },
                {
                    target: ".CodeMirror",
                    side: "left",
                    title: "The code editor ⌨️",
                    body: `
                        <ul>
                            <li>Write your Python here</li>
                            <li>Colours highlight keywords, text and numbers</li>
                            <li>Indentation matters in Python, so use <kbd>Tab</kbd> inside <code>def</code>, <code>if</code> and loops</li>
                        </ul>
                    `
                },
                {
                    target: () => $("#draft-status") || $(".editor-actions"),
                    title: "Auto-save drafts 💾",
                    body: `<p>Your code <strong>saves as a draft automatically</strong> while you type. Close the tab, come back tomorrow, it's still there. A small status here shows when it's saved.</p>`
                },
                {
                    target: "#engine-pill",
                    title: "The Python engine 🐍",
                    body: `<p>Quackbit runs real <strong>Python 3.11</strong> inside your browser. The first load takes a few seconds. Wait for <strong>🟢 Python 3.11 Ready</strong> before submitting.</p>`
                },
                {
                    target: "#reset-code-btn",
                    title: "Reset Code",
                    body: `<p>Code turned into spaghetti? This puts the starting code back. It asks first, so no accidents.</p>`
                },
                {
                    target: "#submit-btn",
                    title: "Submit Code 🚀",
                    body: `<p>Runs your code against hidden tests.</p><ul><li>✅ <strong>Pass</strong>: victory scene, code saved, next chapter unlocked</li><li>💥 <strong>Fail</strong>: you see what went wrong and try again, as many times as you want</li></ul>`
                },
                {
                    target: "#saved-solution-banner",
                    title: "Your saved solution",
                    body: `<p>You already passed this chapter, so your code is saved. Use this banner to view it or load it back into the editor.</p>`
                },
                profileMenuStep(`<p><strong>Stuck?</strong> Open the <strong>Guidebook</strong> from here. Its back link brings you right back to this chapter.</p>`),
                {
                    title: "Go get 'em! 🦆⚔️",
                    body: `<p>Write your code and press <strong>Submit</strong>. Win or lose, I'll pop up once more to explain what you see.</p>`,
                    nextLabel: "Start coding",
                    confetti: true
                }
            ]
        },

        /* ---------------- V1: FAILED ATTEMPT ---------------- */
        fail: {
            page: "v1.html",
            subtitle: "💥 Attempt failed",
            ready: () => outcomeReady("badge-fail"),
            steps: () => [
                {
                    target: ".outcome-title-badge",
                    title: "Oops, not quite! 💥",
                    body: `<p>Your code didn't pass every test <em>yet</em>. That's completely normal. Even PyThorn failed his first coding test (that's why he's so grumpy).</p>`
                },
                {
                    target: ".outcome-video-wrapper",
                    title: "The fail scene",
                    body: `<p>A short scene plays when you don't pass. Next time you can press <strong>Skip Cutscene ⏭</strong> to jump straight to the feedback.</p>`
                },
                {
                    target: ".outcome-narrative",
                    title: "Read the feedback 🔍",
                    body: `<p>This tells you <strong>what went wrong</strong>, like which input gave the wrong answer or which error appeared. It's the most useful clue you'll get.</p>`
                },
                {
                    target: "#outcome-retry-btn",
                    title: "Try again ↩",
                    body: `<p>Takes you back to the editor. <strong>Your code is still there</strong>, so you only need to fix the mistake, not start over.</p>`
                },
                {
                    title: "Tips for next try 💡",
                    body: `
                        <ul>
                            <li>Check the spelling of the function name and the returned text</li>
                            <li>Check <code>==</code> vs <code>=</code>, and your indentation</li>
                            <li>Open the <strong>Guidebook</strong> from your profile menu if you're stuck</li>
                        </ul>
                        <p>You've got this. Quack on! 🦆</p>
                    `,
                    nextLabel: "I'll try again"
                }
            ]
        },

        pass: {
            page: "v1.html",
            subtitle: "🎉 Victory",
            ready: () => outcomeReady("badge-pass"),
            steps: () => [
                {
                    target: ".outcome-title-badge",
                    title: "YOU DID IT! 🎉",
                    body: `<p>All tests passed! Potato Village is one step safer. PyThorn just felt a chill.</p>`,
                    confetti: true
                },
                {
                    target: ".outcome-narrative",
                    title: "Your result",
                    body: `<p>Confirms that every test case passed. Behind the scenes, three things just happened:</p><ul><li>💾 Your code was <strong>saved</strong></li><li>🔓 The <strong>next chapter unlocked</strong></li><li>🏅 Your <strong>Stats</strong> and badges updated</li></ul>`
                },
                {
                    target: ".btn-outcome-next",
                    title: "Next Story →",
                    body: `<p>Continue to the next chapter of the adventure.</p>`
                },
                {
                    target: "#outcome-review-btn",
                    title: "Review Code ↩",
                    body: `<p>Go back to the editor to look at your winning code again, or try a different solution. If you pass again, the new version is saved too.</p>`
                },
                {
                    target: "#outcome-saved-btn",
                    title: "💾 Saved Code",
                    body: `<p>Opens your saved solution in a popup where you can <strong>copy</strong> it and see <strong>older versions</strong>. All of them also live in <strong>My Code</strong>.</p>`
                },
                {
                    title: "First Quack earned! 🥚",
                    body: `<p>Check your <strong>Stats</strong> page later: you just unlocked your first badge. Onwards!</p>`,
                    nextLabel: "Awesome",
                    confetti: true
                }
            ]
        },

        saved: {
            page: "v1.html",
            subtitle: "💾 Saved code",
            ready: () => isDone("pass") && TOURS.chapter.ready() && shown("#saved-solution-banner"),
            steps: () => [
                {
                    target: "#saved-solution-banner",
                    title: "Your code is saved ✅",
                    body: `<p>Because you passed this chapter, this banner appears at the top whenever you come back.</p>`
                },
                {
                    target: "#view-saved-btn",
                    title: "View Saved Code",
                    body: `<p>Opens your accepted code in a popup, with a <strong>Copy</strong> button and any older versions.</p>`
                },
                {
                    target: "#load-saved-btn",
                    title: "Load into Editor",
                    body: `<p>Puts your saved code back into the editor. Handy if you changed things and want your winning version back. It asks before replacing anything.</p>`
                },
                {
                    target: ".btn-saved-all",
                    title: "All Saved Code →",
                    body: `<p>Opens <strong>My Code</strong>, where every chapter you've passed is collected.</p>`,
                    nextLabel: "Finish"
                }
            ]
        }
    };

    function outcomeReady(badgeClass) {
        const container = $("#outcome-cutscene-container");
        const actions = $("#outcome-final-actions");
        return isVisible(container) && $(`.outcome-title-badge.${badgeClass}`) && isVisible(actions);
    }

    let running = false;

    async function run(id) {
        const def = TOURS[id];
        if (!def || running || !session()) return;
        running = true;

        const tour = new Tour(def.steps(), {
            subtitle: def.subtitle,
            onEnd: () => {
                markDone(id);
                running = false;
                if (id === "chapter" || id === "saved") {
                    const cm = $(".CodeMirror");
                    if (cm && cm.CodeMirror) cm.CodeMirror.focus();
                }
            }
        });

        const started = await tour.start();
        if (!started) running = false;
    }

    function currentTourId() {
        return Object.keys(TOURS)
            .filter((id) => TOURS[id].page === PAGE)
            .reverse()
            .find((id) => {
                if (id === "saved") return TOURS.chapter.ready() && shown("#saved-solution-banner");
                try { return !!TOURS[id].ready(); } catch { return false; }
            });
    }

    async function addLaunchButton() {
        await loadCss();
        const button = document.createElement("button");
        button.type = "button";
        button.className = "qt-launch";
        button.innerHTML = "🧭 Tour";
        button.title = "Show the tour for this page";
        button.hidden = true;
        button.addEventListener("click", () => {
            const id = currentTourId();
            if (id) run(id);
        });
        document.body.appendChild(button);

        const update = () => {
            button.hidden = running || !currentTourId();
        };
        update();
        setInterval(update, 800);
    }

    async function autoRun(ids) {
        const pending = () => ids.filter((id) => !isDone(id));
        while (pending().length) {
            if (!running && noModalOpen()) {
                const id = pending().find((tourId) => {
                    try { return TOURS[tourId].ready(); } catch { return false; }
                });
                if (id) {
                    await wait(650);
                    let stillReady = false;
                    try { stillReady = TOURS[id].ready() && noModalOpen(); } catch { }
                    if (stillReady && !running) await run(id);
                }
            }
            await wait(500);
        }
    }

    function init() {
        if (!session()) return;

        const ids = Object.keys(TOURS).filter((id) => TOURS[id].page === PAGE);
        if (!ids.length) return;

        addLaunchButton();
        if (toursOn()) autoRun(ids);
    }

    global.QuackbitTour = {
        start: run,
        enable() {
            if (!owner()) return "Log in first.";
            write(`quackbit_tours_${owner()}`, "on");
            Object.keys(TOURS).forEach((id) => {
                try { localStorage.removeItem(`quackbit_tour_${id}_${owner()}`); } catch { }
            });
            return "Tours reset. Refresh the page.";
        }
    };

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", init);
    } else {
        init();
    }
})(window);
