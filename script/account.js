(function (global) {
    "use strict";

    const USER_DB = "userDatabase";
    const USER_DB_VERSION = 1;
    let dbPromise = null;

    function openUserDB() {
        if (dbPromise) return dbPromise;

        dbPromise = new Promise((resolve, reject) => {
            const request = indexedDB.open(USER_DB, USER_DB_VERSION);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains("users")) {
                    const store = db.createObjectStore("users", { keyPath: "id", autoIncrement: true });
                    store.createIndex("emailIndex", "email", { unique: true });
                }
            };

            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });

        return dbPromise;
    }

    function getUserByEmail(email) {
        return openUserDB().then(
            (db) =>
                new Promise((resolve, reject) => {
                    const tx = db.transaction(["users"], "readonly");
                    const req = tx.objectStore("users").index("emailIndex").get(String(email || "").toLowerCase());
                    req.onsuccess = () => resolve(req.result || null);
                    req.onerror = () => reject(req.error);
                })
        );
    }

    function getSession() {
        const raw = sessionStorage.getItem("currentUser") ||
                    sessionStorage.getItem("activeUser") ||
                    localStorage.getItem("currentUser");
        if (!raw) return null;
        try {
            return JSON.parse(raw);
        } catch {
            return { email: raw };
        }
    }

    function saveSession(user) {
        sessionStorage.setItem("currentUser", JSON.stringify({
            email: user.email,
            id: user.id,
            username: user.username || "",
            avatar: user.avatar || ""
        }));
    }

    function clearSession() {
        sessionStorage.removeItem("currentUser");
        sessionStorage.removeItem("activeUser");
        localStorage.removeItem("currentUser");
    }

    function ownerKey(user) {
        if (!user) return "guest";
        return (user.email || user.username || (user.id ? `id_${user.id}` : "guest")).trim().toLowerCase();
    }

    function displayName(user) {
        if (!user) return "Duck Coder";
        return user.username || (user.email || "Duck Coder").split("@")[0];
    }

    function normalizeUsername(name) {
        return String(name || "").trim().replace(/\s+/g, " ");
    }

    function validateUsername(name) {
        if (name.length < 3) return "Username needs at least 3 characters.";
        if (name.length > 20) return "Username can be at most 20 characters.";
        if (!/^[A-Za-z0-9 _-]+$/.test(name)) return "Only letters, numbers, spaces, _ and - are allowed.";
        return "";
    }

    async function setUsername(email, rawName) {
        const name = normalizeUsername(rawName);
        const problem = validateUsername(name);
        if (problem) throw new Error(problem);

        const db = await openUserDB();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(["users"], "readwrite");
            const store = tx.objectStore("users");
            let failMessage = "Could not save your username. Please try again.";
            let updated = null;

            const allReq = store.getAll();
            allReq.onsuccess = () => {
                const users = allReq.result || [];
                const me = users.find((u) => u.email === String(email).toLowerCase());

                if (!me) {
                    failMessage = "Account not found. Please log in again.";
                    tx.abort();
                    return;
                }

                const lower = name.toLowerCase();
                const taken = users.some((u) => u.email !== me.email && (u.username || "").toLowerCase() === lower);
                if (taken) {
                    failMessage = "That username is already taken.";
                    tx.abort();
                    return;
                }

                me.username = name;
                me.usernameUpdatedAt = new Date().toISOString();
                store.put(me);
                updated = me;
            };

            tx.oncomplete = () => {
                saveSession(updated);
                resolve(updated);
            };
            tx.onabort = () => reject(new Error(failMessage));
        });
    }

    async function setAvatar(email, dataUrl) {
        const db = await openUserDB();

        return new Promise((resolve, reject) => {
            const tx = db.transaction(["users"], "readwrite");
            const store = tx.objectStore("users");
            let updated = null;

            const req = store.index("emailIndex").get(String(email).toLowerCase());
            req.onsuccess = () => {
                const me = req.result;
                if (!me) {
                    tx.abort();
                    return;
                }
                me.avatar = dataUrl || "";
                store.put(me);
                updated = me;
            };

            tx.oncomplete = () => {
                saveSession(updated);
                resolve(updated);
            };
            tx.onabort = () => reject(new Error("Could not save your picture. Please log in again."));
        });
    }

    function resizeImageFile(file, size = 256) {
        return new Promise((resolve, reject) => {
            if (!file || !file.type.startsWith("image/")) {
                reject(new Error("Please choose an image file."));
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                reject(new Error("That image is too big (max 10 MB)."));
                return;
            }

            const reader = new FileReader();
            reader.onerror = () => reject(new Error("Could not read that file."));
            reader.onload = () => {
                const img = new Image();
                img.onerror = () => reject(new Error("Could not open that image."));
                img.onload = () => {
                    const side = Math.min(img.width, img.height);
                    const canvas = document.createElement("canvas");
                    canvas.width = size;
                    canvas.height = size;
                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, (img.width - side) / 2, (img.height - side) / 2, side, side, 0, 0, size, size);
                    resolve(canvas.toDataURL("image/jpeg", 0.85));
                };
                img.src = reader.result;
            };
            reader.readAsDataURL(file);
        });
    }

    function avatarHtml(user) {
        if (user && user.avatar && user.avatar.startsWith("data:image/")) {
            return `<img src="${user.avatar}" alt="">`;
        }
        return AVATAR_SVG;
    }

    function flyKey(user) {
        return `quackbit_flytime_${ownerKey(user)}`;
    }

    function startFlyTimer(user) {
        if (!user || global.__quackbitFlyTimer) return;
        global.__quackbitFlyTimer = setInterval(() => {
            if (document.visibilityState !== "visible") return;
            const current = parseInt(localStorage.getItem(flyKey(user)) || "0", 10);
            localStorage.setItem(flyKey(user), String(current + FLY_TICK_SECONDS));
        }, FLY_TICK_SECONDS * 1000);
    }

    function getFlySeconds(user) {
        return parseInt(localStorage.getItem(flyKey(user)) || "0", 10);
    }

    function escapeHtml(value) {
        return String(value).replace(/[&<>"']/g, (c) => ({
            "&": "&amp;", "<": "&lt;", ">": "&gt;", "\"": "&quot;", "'": "&#39;"
        }[c]));
    }

    const AVATAR_SVG = `
        <svg viewBox="0 0 64 64" aria-hidden="true">
            <circle cx="32" cy="32" r="32" fill="#56607F"/>
            <ellipse cx="32" cy="24" rx="10" ry="12" fill="#E8EEF0"/>
            <path d="M10 58c1-12 9-19 22-19s21 7 22 19a32 32 0 0 1-44 0z" fill="#E8EEF0"/>
        </svg>`;

    let outsideListenerAdded = false;

    function renderUserMenu(container, user) {
        document.querySelectorAll(".nav-auth-only").forEach((item) => { item.hidden = !user; });

        if (!container) return;

        const renderKey = user ? `${ownerKey(user)}|${displayName(user)}|${(user.avatar || "").length}` : "guest";
        if (container.dataset.rendered === renderKey) return;
        container.dataset.rendered = renderKey;

        if (!user) {
            container.innerHTML = `<a href="login.html" class="login-text">Lock In!</a>`;
            return;
        }

        const page = location.pathname.split("/").pop() || "index.html";
        const name = escapeHtml(displayName(user));
        const isChapter = /^(v\d+|g\d+|boss)\.html$/i.test(page);
        const guidebookHref = isChapter ? `handbook.html?from=${page}` : "handbook.html";

        container.innerHTML = `
            <div class="user-menu">
                <button type="button" class="user-menu-toggle" aria-haspopup="true" aria-expanded="false">
                    <span class="user-menu-name">${name}</span>
                    <span class="user-avatar">${avatarHtml(user)}</span>
                </button>
                <div class="user-menu-dropdown" role="menu" hidden>
                    <a href="stats.html" role="menuitem" class="${page === "stats.html" ? "active" : ""}">Stats</a>
                    <a href="${guidebookHref}" role="menuitem" class="${page === "handbook.html" ? "active" : ""}">Guidebook</a>
                    <button type="button" role="menuitem" class="user-menu-logout">Lock Out</button>
                </div>
            </div>
        `;

        const toggle = container.querySelector(".user-menu-toggle");
        const dropdown = container.querySelector(".user-menu-dropdown");

        toggle.addEventListener("click", (event) => {
            event.stopPropagation();
            const open = dropdown.hidden;
            closeAllMenus();
            dropdown.hidden = !open;
            toggle.setAttribute("aria-expanded", String(open));
        });

        container.querySelector(".user-menu-logout").addEventListener("click", () => {
            clearSession();
            window.location.href = "login.html";
        });

        if (!outsideListenerAdded) {
            document.addEventListener("click", (event) => {
                if (!event.target.closest(".user-menu")) closeAllMenus();
            });
            document.addEventListener("keydown", (event) => {
                if (event.key === "Escape") closeAllMenus();
            });
            outsideListenerAdded = true;
        }
    }

    function closeAllMenus() {
        document.querySelectorAll(".user-menu-dropdown").forEach((d) => { d.hidden = true; });
        document.querySelectorAll(".user-menu-toggle").forEach((t) => t.setAttribute("aria-expanded", "false"));
    }

    function renderHeader() {
        renderUserMenu(document.querySelector(".auth-buttons"), getSession());
    }

    global.QuackbitAccount = {
        getSession, saveSession, clearSession, ownerKey, displayName,
        getUserByEmail, setUsername, validateUsername, normalizeUsername,
        startFlyTimer, getFlySeconds, renderUserMenu, renderHeader, escapeHtml, AVATAR_SVG,
        setAvatar, resizeImageFile, avatarHtml
    };
})(window);