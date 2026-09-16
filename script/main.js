document.addEventListener("DOMContentLoaded", () => {
    const authContainer = document.querySelector(".auth-buttons");
    const startContainer = document.querySelector(".start-container");

    const sessionRaw = sessionStorage.getItem("currentUser") || sessionStorage.getItem("activeUser") || localStorage.getItem("currentUser");
    let currentUser = null;

    if (sessionRaw) {
        try {
            currentUser = JSON.parse(sessionRaw);
        } catch {
            currentUser = { email: sessionRaw };
        }
    }

    if (authContainer) {
        if (currentUser) {
            const displayName = (currentUser.email || currentUser.username || "Duck Coder").split("@")[0];
            authContainer.innerHTML = `
                <span class="user-badge" title="${currentUser.email || ''}">${displayName}</span>
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
            authContainer.innerHTML = `<a href="login.html" class="login-text">Lock In!</a>`;
        }
    }

    if (startContainer) {
        if (currentUser) {
            const userIdentifier = (currentUser.email || currentUser.username || (currentUser.id ? `id_${currentUser.id}` : "guest")).trim().toLowerCase();
            const progressKey = `quackbit_progress_${userIdentifier}`;
            const currentLevel = parseInt(localStorage.getItem(progressKey) || "1", 10);
            
            function getStoryPage(lvl) {
                if (lvl <= 5) return `v${Math.max(1, lvl)}.html`;
                if (lvl <= 15) return `g${lvl - 5}.html`;
                return "boss.html";
            }

            const targetPage = getStoryPage(currentLevel);
            const buttonText = currentLevel > 1 ? `Continue Adventure &rarr;` : `Start My Journey &rarr;`;

            startContainer.innerHTML = `
                <p style="color: var(--text-muted); margin-bottom: 0.75rem; font-weight: 500;">Ready for the adventure, <strong>${(currentUser.email || "Coder").split("@")[0]}</strong>?</p>
                <div style="display: flex; gap: 0.75rem; justify-content: center; flex-wrap: wrap;">
                    <a href="${targetPage}" class="start-btn">${buttonText}</a>
                    <a href="story.html" class="start-btn" style="background: var(--main-bg); color: var(--text-main); border: 2px solid var(--border-color); box-shadow: none;">View All Stories</a>
                </div>
            `;
        } else {
            startContainer.innerHTML = `
                <p style="color: var(--text-muted-2); margin-bottom: 0.5rem; font-weight: 500;">Lock In, Play, Code</p>
                <a href="login.html" class="start-btn">To Adventure!</a>
            `;
        }
    }

    document.addEventListener('scroll', () => {
        const audio = document.getElementById('bg-music');
        if (audio && audio.paused) {
            audio.play().catch(error => {
                console.log("Browser blocks it:", error);
            });
        }
    }, { once: true });

    const header = document.querySelector('.header');
    const targetSection = document.querySelector('.hero-main');
    
    if (header && targetSection) {
        const options = {
            rootMargin: "-50px 0px 0px 0px",
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    header.classList.add('header-alt');
                } else {
                    header.classList.remove('header-alt');
                }
            });
        }, options);

        observer.observe(targetSection);
    }
});

