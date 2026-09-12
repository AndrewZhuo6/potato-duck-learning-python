document.addEventListener("DOMContentLoaded", () => {
    const STORIES = [
        {
            id: "v1",
            level: 1,
            category: "village",
            categoryName: "Village 1",
            topic: "Conditionals",
            title: "The Decision",
            desc: "Learn to make decisions at the crossroad based on the magical signs before you.",
            url: "v1.html",
            cover: "v1_cover.png",
            icon: "🏡"
        },
        {
            id: "v2",
            level: 2,
            category: "village",
            categoryName: "Village 2",
            topic: "Loops",
            title: "Something Redundant",
            desc: "Escape the enchanted cave by checking for monsters without breaking the cave's curse.",
            url: "v2.html",
            cover: "v2_cover.png",
            icon: "🔄"
        },
        {
            id: "v3",
            level: 3,
            category: "village",
            categoryName: "Village 3",
            topic: "List & Dictionary",
            title: "Our Inventory",
            desc: "Master key-value dictionaries to instantly counter monsters with weapons.",
            url: "v3.html",
            cover: "v3_cover.png",
            icon: "🎒"
        },
        {
            id: "v4",
            level: 4,
            category: "village",
            categoryName: "Village 4",
            topic: "Functions",
            title: "Existing Spell",
            desc: "Create custom sorting spells to tidy up your crowded backpack inventory.",
            url: "v4.html",
            cover: "v4_cover.png",
            icon: "✨"
        },
        {
            id: "v5",
            level: 5,
            category: "village",
            categoryName: "Village 5",
            topic: "Time & Memory",
            title: "Your Consideration",
            desc: "Fuse resonance crystals while respecting duration and body mana capacity limits.",
            url: "v5.html",
            cover: "v5_cover.png",
            icon: "⏱️"
        },
        {
            id: "g1",
            level: 6,
            category: "guardian",
            categoryName: "Guardian 1",
            topic: "Conditionals",
            title: "Jumping River",
            desc: "Cross the roaring river with calculated leaps and careful decision making.",
            url: "g1.html",
            cover: "g1_cover.png",
            icon: "🌊"
        },
        {
            id: "g2",
            level: 7,
            category: "guardian",
            categoryName: "Guardian 2",
            topic: "Strings",
            title: "Endless Doubts",
            desc: "Decipher mystical words and conquer inner doubts guarding the ancient trail.",
            url: "g2.html",
            cover: "g2_cover.png",
            icon: "💭"
        },
        {
            id: "g3",
            level: 8,
            category: "guardian",
            categoryName: "Guardian 3",
            topic: "Conditionals",
            title: "7 Floating Alphabet",
            desc: "Align the 7 floating alphabetic runes in the guardian's sanctum.",
            url: "g3.html",
            cover: "g3_cover.png",
            icon: "🔤"
        },
        {
            id: "g4",
            level: 9,
            category: "guardian",
            categoryName: "Guardian 4",
            topic: "String Manipulation",
            title: "Fuzzy Talking Wall",
            desc: "Parse riddles whispered from the fuzzy living wall blocking your path.",
            url: "g4.html",
            cover: "g4_cover.png",
            icon: "🧱"
        },
        {
            id: "g5",
            level: 10,
            category: "guardian",
            categoryName: "Guardian 5",
            topic: "Strings & Palindromes",
            title: "Palindoom",
            desc: "Defeat the guardian that mirrors every attack back at you.",
            url: "g5.html",
            cover: "g5_cover.png",
            icon: "🪞"
        },
        {
            id: "g6",
            level: 11,
            category: "guardian",
            categoryName: "Guardian 6",
            topic: "Math & Primes",
            title: "SuPrime",
            desc: "Calculate prime numerical spells under strict time and memory limits.",
            url: "g6.html",
            cover: "g6_cover.png",
            icon: "🔢"
        },
        {
            id: "g7",
            level: 12,
            category: "guardian",
            categoryName: "Guardian 7",
            topic: "Loops & Functions",
            title: "The Echoing Gate",
            desc: "Unravel recursive chants echoing across the ancient archway.",
            url: "g7.html",
            cover: "g7_cover.png",
            icon: "⛩️"
        },
        {
            id: "g8",
            level: 13,
            category: "guardian",
            categoryName: "Guardian 8",
            topic: "Hash Maps & Time",
            title: "The Decision",
            desc: "Execute high-speed hash lookups to outpace the swift guardian.",
            url: "g8.html",
            cover: "g8_cover.png",
            icon: "⚡"
        },
        {
            id: "g9",
            level: 14,
            category: "guardian",
            categoryName: "Guardian 9",
            topic: "Time Efficiency",
            title: "The Hungry Cobra",
            desc: "Outmaneuver the venomous cobra with optimal algorithmic speed.",
            url: "g9.html",
            cover: "g9_cover.png",
            icon: "🐍"
        },
        {
            id: "g10",
            level: 15,
            category: "guardian",
            categoryName: "Guardian 10",
            topic: "2D Binary Search",
            title: "Fast, We're Running Out of Time!",
            desc: "Search the two-dimensional realm before the hourglass runs out.",
            url: "g10.html",
            cover: "g10_cover.png",
            icon: "⌛"
        },
        {
            id: "boss",
            level: 16,
            category: "boss",
            categoryName: "Final Boss",
            topic: "Master Challenge",
            title: "The Pythorn",
            desc: "The ultimate showdown against the great serpent PyThorn! Combine all your spells to save the village.",
            url: "boss.html",
            cover: "boss.png",
            icon: "🐉"
        }
    ];

    const sessionRaw = sessionStorage.getItem("currentUser") || 
                       sessionStorage.getItem("activeUser") || 
                       localStorage.getItem("currentUser");
    let currentUser = null;
    if (sessionRaw) {
        try {
            currentUser = JSON.parse(sessionRaw);
        } catch {
            currentUser = { email: sessionRaw };
        }
    }

    const authContainer = document.querySelector(".auth-buttons");
    if (authContainer) {
        if (currentUser) {
            const displayName = (currentUser.email || currentUser.username || "Duck Coder").split("@")[0];
            authContainer.innerHTML = `
                <span class="user-badge" title="${currentUser.email || ''}">🦆 ${displayName}</span>
                <button id="logout-btn" class="logout-text">Log Out</button>
            `;
            const logoutBtn = document.getElementById("logout-btn");
            if (logoutBtn) {
                logoutBtn.addEventListener("click", () => {
                    sessionStorage.removeItem("currentUser");
                    sessionStorage.removeItem("activeUser");
                    localStorage.removeItem("currentUser");
                    window.location.href = "login.html";
                });
            }
        } else {
            authContainer.innerHTML = `<a href="login.html" class="login-text">Log In</a>`;
        }
    }

    const userIdentifier = currentUser ? (currentUser.email || currentUser.username || (currentUser.id ? `id_${currentUser.id}` : "guest")).trim().toLowerCase() : "guest";
    const progressKey = `quackbit_progress_${userIdentifier}`;
    
    function getUnlockedLevel() {
        return parseInt(localStorage.getItem(progressKey) || "1", 10);
    }

    const gridContainer = document.getElementById("story-grid");
    const progressCountEl = document.getElementById("progress-count");
    const progressBarFillEl = document.getElementById("progress-bar-fill");
    const filterButtons = document.querySelectorAll(".filter-btn");

    let currentCategory = "all";

    function updateProgressDisplay() {
        const unlocked = getUnlockedLevel();
        const clampedUnlocked = Math.min(unlocked, STORIES.length);
        const percent = Math.round((clampedUnlocked / STORIES.length) * 100);

        if (progressCountEl) {
            progressCountEl.textContent = `${clampedUnlocked} / ${STORIES.length} Unlocked (${percent}%)`;
        }
        if (progressBarFillEl) {
            progressBarFillEl.style.width = `${percent}%`;
        }
    }

    function renderStories() {
        if (!gridContainer) return;
        const unlockedMax = getUnlockedLevel();

        const filteredStories = currentCategory === "all" 
            ? STORIES 
            : STORIES.filter(s => s.category === currentCategory);

        gridContainer.innerHTML = filteredStories.map(story => {
            const isUnlocked = story.level <= unlockedMax;
            const isCompleted = story.level < unlockedMax;
            const isCurrent = story.level === unlockedMax;

            let statusBadge = "";
            if (isCompleted) {
                statusBadge = `<span class="card-status-badge completed">✓ Completed</span>`;
            } else if (isCurrent) {
                statusBadge = `<span class="card-status-badge current">⭐ Current</span>`;
            } else {
                statusBadge = `<span class="card-status-badge locked">🔒 Locked</span>`;
            }

            let coverContent = "";
            if (isUnlocked) {
                coverContent = `
                    <div class="story-cover-wrap">
                        <img 
                            src="assets/images/${story.cover}" 
                            alt="${story.title}" 
                            class="story-cover-img"
                            onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                        >
                        <div class="story-cover-fallback fallback-${story.category}" style="display: none;">
                            <span class="fallback-icon">${story.icon}</span>
                            <span class="fallback-title">${story.title}</span>
                            <span class="fallback-tag">${story.categoryName} • ${story.topic}</span>
                        </div>
                    </div>
                `;
            } else {
                coverContent = `
                    <div class="story-cover-wrap is-locked">
                        <img src="assets/images/lock.png" alt="Locked" class="story-lock-img" onerror="this.src='assets/images/lock.png'">
                        <span class="lock-label">Locked Story</span>
                    </div>
                `;
            }

            let actionBtn = "";
            if (isUnlocked) {
                actionBtn = `
                    <a href="${story.url}" class="btn-play-story">
                        ${isCompleted ? "Replay Story ↩" : "Play Story &rarr;"}
                    </a>
                `;
            } else {
                const prevStory = STORIES.find(s => s.level === story.level - 1);
                const reqText = prevStory ? `Complete ${prevStory.categoryName}` : "Locked";
                actionBtn = `
                    <button type="button" class="btn-locked-story" onclick="alert('This story is locked! Complete earlier chapters first to unlock it.')">
                        🔒 ${reqText}
                    </button>
                `;
            }

            return `
                <div class="story-card ${isUnlocked ? 'unlocked' : 'locked'}" data-story-id="${story.id}">
                    ${coverContent}
                    <div class="story-card-body">
                        <div class="story-card-header">
                            <span class="card-category-tag">${story.categoryName} • ${story.topic}</span>
                            ${statusBadge}
                        </div>
                        <h3 class="story-card-title">${story.title}</h3>
                        <p class="story-card-desc">${story.desc}</p>
                        <div class="story-card-footer">
                            ${actionBtn}
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    }

    filterButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            filterButtons.forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            currentCategory = btn.getAttribute("data-category") || "all";
            renderStories();
        });
    });

    // Dev / Testing Controls
    const resetProgressBtn = document.getElementById("dev-reset-progress");
    const unlockAllBtn = document.getElementById("dev-unlock-all");

    if (resetProgressBtn) {
        resetProgressBtn.addEventListener("click", () => {
            localStorage.setItem(progressKey, "1");
            updateProgressDisplay();
            renderStories();
        });
    }

    if (unlockAllBtn) {
        unlockAllBtn.addEventListener("click", () => {
            localStorage.setItem(progressKey, STORIES.length.toString());
            updateProgressDisplay();
            renderStories();
        });
    }

    updateProgressDisplay();
    renderStories();
});
