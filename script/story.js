window.initPreparationChapter = function (config) {
    const {
        chapterNumber,
        chapterTitle,
        nextChapterUrl,
        starterCode,
        testHarness
    } = config;

    document.addEventListener("DOMContentLoaded", async () => {
        const sessionRaw = sessionStorage.getItem("currentUser") || 
                           sessionStorage.getItem("activeUser") || 
                           localStorage.getItem("currentUser");

        if (!sessionRaw) {
            window.location.href = "login.html";
            return;
        }

        let currentUser = null;
        try {
            currentUser = JSON.parse(sessionRaw);
        } catch {
            currentUser = { email: sessionRaw };
        }

        const authContainer = document.querySelector(".auth-buttons");
        if (authContainer) {
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
        }

        const userIdentifier = (currentUser.email || currentUser.username || (currentUser.id ? `id_${currentUser.id}` : "guest")).trim().toLowerCase();
        const progressKey = `quackbit_progress_${userIdentifier}`;
        const unlockedMax = parseInt(localStorage.getItem(progressKey) || "1", 10);

        if (chapterNumber > unlockedMax) {
            alert(`Chapter ${chapterNumber} is locked! You must complete Chapter ${unlockedMax} first.`);
            window.location.href = `preparation${unlockedMax}.html`;
            return;
        }

        function updateProgressPills(currentUnlockedLevel) {
            const progressPills = document.querySelectorAll(".chapter-step-pill");
            progressPills.forEach((pill) => {
                const pillChapter = parseInt(pill.getAttribute("data-chapter") || "0", 10);
                const rawText = pill.textContent.replace(/^([🔒✓⭐\s\d\.]+)/, "").trim();
                const cleanName = rawText || `Chapter ${pillChapter}`;

                pill.onclick = null;

                if (pillChapter < chapterNumber) {
                    pill.className = "chapter-step-pill completed";
                    pill.innerHTML = `✓ ${pillChapter}. ${cleanName}`;
                    pill.href = `preparation${pillChapter}.html`;
                    pill.title = `Chapter ${pillChapter} (Completed - Click to review)`;
                } else if (pillChapter === chapterNumber) {
                    pill.className = "chapter-step-pill active";
                    pill.innerHTML = `⭐ ${pillChapter}. ${cleanName}`;
                    pill.href = `preparation${pillChapter}.html`;
                    pill.title = `Chapter ${pillChapter} (Current Challenge)`;
                } else if (pillChapter <= currentUnlockedLevel) {
                    pill.className = "chapter-step-pill unlocked";
                    pill.innerHTML = `${pillChapter}. ${cleanName}`;
                    pill.href = `preparation${pillChapter}.html`;
                    pill.title = `Chapter ${pillChapter} (Unlocked)`;
                } else {
                    pill.className = "chapter-step-pill locked";
                    pill.innerHTML = `🔒 ${pillChapter}. ${cleanName}`;
                    pill.removeAttribute("href");
                    pill.title = `Chapter ${pillChapter} is locked. Complete Chapter ${currentUnlockedLevel} first.`;
                    pill.onclick = (e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        alert(`Chapter ${pillChapter} is locked! You must complete Chapter ${currentUnlockedLevel} first.`);
                        return false;
                    };
                }
            });
        }

        updateProgressPills(unlockedMax);

        const video = document.getElementById("story-video");
        const skipBtn = document.getElementById("skip-video-btn");
        const cutsceneContainer = document.getElementById("cutscene-container");
        const workspaceContainer = document.getElementById("workspace-container");
        const submitBtn = document.getElementById("submit-btn");
        const resetBtn = document.getElementById("reset-code-btn");
        const nextBtn = document.getElementById("next-chapter-btn");
        const statusMsg = document.getElementById("status-msg");
        const enginePill = document.getElementById("engine-pill");

        const textarea = document.getElementById("code-input");
        if (starterCode && !textarea.value.trim()) {
            textarea.value = starterCode;
        }

        const editor = CodeMirror.fromTextArea(textarea, {
            mode: "python",
            theme: "dracula",
            lineNumbers: true,
            indentUnit: 4,
            tabSize: 4,
            indentWithTabs: false,
            lineWrapping: true,
            extraKeys: {
                Tab: (cm) => cm.replaceSelection("    ", "end")
            }
        });

        window.addEventListener("resize", () => {
            if (editor) {
                editor.refresh();
            }
        });

        if (resetBtn) {
            resetBtn.addEventListener("click", () => {
                if (confirm("Reset code to starter template?")) {
                    editor.setValue(starterCode || "");
                }
            });
        }

        function transitionToChallenge() {
            if (video && !video.paused) {
                video.pause();
            }
            if (cutsceneContainer) cutsceneContainer.style.display = "none";
            if (workspaceContainer) workspaceContainer.style.display = "flex";
            setTimeout(() => {
                editor.refresh();
                editor.focus();
            }, 60);
        }

        if (video) {
            video.addEventListener("ended", transitionToChallenge);
            video.addEventListener("error", () => {
                console.warn("Video asset not found or unplayable; skip enabled.");
            });
        }

        if (skipBtn) {
            skipBtn.addEventListener("click", transitionToChallenge);
        }

        let pyodide = null;
        if (submitBtn) submitBtn.disabled = true;

        if (enginePill) {
            enginePill.className = "engine-status-pill busy";
            enginePill.innerHTML = `<span>⏳</span> Loading Python Engine...`;
        }

        try {
            pyodide = await loadPyodide({
                indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.2/full/"
            });

            if (enginePill) {
                enginePill.className = "engine-status-pill ready";
                enginePill.innerHTML = `<span>🟢</span> Python 3.11 Ready`;
            }

            if (submitBtn) submitBtn.disabled = false;
        } catch (err) {
            console.error("Pyodide loading error:", err);
            if (enginePill) {
                enginePill.className = "engine-status-pill error";
                enginePill.innerHTML = `<span>🔴</span> Python Engine Failed`;
            }
            if (statusMsg) {
                statusMsg.style.color = "#dc2626";
                statusMsg.textContent = "Failed to load Python environment. Please refresh the page.";
            }
        }

        if (submitBtn) {
            submitBtn.addEventListener("click", async () => {
                if (!pyodide) return;

                const userCode = editor.getValue();
                submitBtn.disabled = true;
                if (statusMsg) {
                    statusMsg.style.color = "#2563eb";
                    statusMsg.innerHTML = `<span>🔄</span> Validating answer...`;
                }

                const runnerScript = testHarness(userCode);

                try {
                    const pyResult = await pyodide.runPythonAsync(runnerScript);
                    const result = pyResult && pyResult.toJs ? pyResult.toJs() : pyResult;
                    if (pyResult && pyResult.destroy) {
                        pyResult.destroy();
                    }

                    const passed = result ? (result.get ? result.get("passed") : result.passed) : false;
                    const message = result ? (result.get ? result.get("msg") : result.msg) : "Unknown result";

                    if (passed) {
                        if (statusMsg) {
                            statusMsg.style.color = "#16a34a";
                            statusMsg.innerHTML = `<span>✓</span> <strong>Success!</strong> ${message}`;
                        }
                        submitBtn.style.display = "none";

                        // Save unlocked progress specifically for this user account
                        const currentUnlocked = parseInt(localStorage.getItem(progressKey) || "1", 10);
                        const newUnlocked = Math.max(currentUnlocked, chapterNumber + 1);
                        localStorage.setItem(progressKey, newUnlocked.toString());

                        // Refresh navigation pills so the newly unlocked chapter is immediately accessible
                        updateProgressPills(newUnlocked);

                        if (nextBtn) {
                            nextBtn.style.display = "inline-flex";
                        }
                    } else {
                        if (statusMsg) {
                            statusMsg.style.color = "#dc2626";
                            statusMsg.innerHTML = `<span>✗</span> ${message}`;
                        }
                        submitBtn.disabled = false;
                    }
                } catch (err) {
                    const lines = (err.message || "").trim().split("\n");
                    const cleanError = lines.slice(-2).join(" ");
                    if (statusMsg) {
                        statusMsg.style.color = "#dc2626";
                        statusMsg.innerHTML = `<span>✗</span> Error: ${cleanError}`;
                    }
                    submitBtn.disabled = false;
                }
            });
        }
    });
};
