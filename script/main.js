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

    if (startContainer) {
        if (currentUser) {
            const currentLevel = localStorage.getItem("unlockedPreparation") || 1;
            const targetPage = `preparation${currentLevel}.html`;
            const buttonText = currentLevel > 1 ? `Continue Chapter ${currentLevel} &rarr;` : `Start My Journey &rarr;`;

            startContainer.innerHTML = `
                <p style="color: var(--text-muted); margin-bottom: 0.75rem; font-weight: 500;">Ready for the adventure, <strong>${(currentUser.email || "Coder").split("@")[0]}</strong>?</p>
                <a href="${targetPage}" class="start-btn">${buttonText}</a>
            `;
        } else {
            startContainer.innerHTML = `
                <p style="color: var(--text-muted); margin-bottom: 0.75rem; font-weight: 500;">Log in to unlock the story cutscenes and Python coding challenges.</p>
                <a href="login.html" class="start-btn">Log In to Play</a>
            `;
        }
    }
});

