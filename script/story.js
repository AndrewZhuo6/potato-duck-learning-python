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

        function showOutcomeCutscene(passed, message) {
            let outcomeContainer = document.getElementById("outcome-cutscene-container");
            if (!outcomeContainer) {
                outcomeContainer = document.createElement("section");
                outcomeContainer.id = "outcome-cutscene-container";
                const main = document.querySelector("main.preparation-main") || document.querySelector(".preparation-main") || document.body;
                main.appendChild(outcomeContainer);
            }

            const videoSrc = `assets/videos/preparation${chapterNumber}_${passed ? "pass" : "fail"}.mp4`;
            const nextTarget = nextChapterUrl || (nextBtn ? nextBtn.getAttribute("href") : (chapterNumber === 5 ? "index.html" : `preparation${chapterNumber + 1}.html`));
            const nextText = nextBtn ? nextBtn.textContent.trim() : (chapterNumber === 5 ? "Complete Journey 🏆" : "Next Story &rarr;");

            outcomeContainer.innerHTML = `
                <div class="outcome-header">
                    <span class="outcome-title-badge ${passed ? 'badge-pass' : 'badge-fail'}">
                        ${passed ? '🎉 Victory' : '💥 Attempt Failed'}
                    </span>
                    <h2 class="outcome-heading">
                        ${passed ? `${chapterTitle || `Chapter ${chapterNumber}`} Conquered!` : `${chapterTitle || `Chapter ${chapterNumber}`} - Try Again!`}
                    </h2>
                </div>
                <div class="outcome-video-wrapper">
                    <video id="outcome-video" playsinline controls autoplay>
                        <source src="${videoSrc}" type="video/mp4">
                        Your browser does not support HTML video.
                    </video>
                    <div id="outcome-fallback" class="outcome-fallback-card" style="display: none;">
                        <div class="outcome-fallback-icon">${passed ? '🦆✨' : '🦆💭'}</div>
                        <div class="outcome-fallback-title">${passed ? 'Chapter Challenge Completed!' : 'Keep Going, Coder!'}</div>
                        <p class="outcome-fallback-desc">
                            ${passed 
                                ? 'Great job! The cutscene animation for this milestone is currently in production.' 
                                : 'Your code did not pass all tests yet. Review the test feedback below and try again.'}
                        </p>
                        <span class="outcome-fallback-tag">Asset: preparation${chapterNumber}_${passed ? 'pass' : 'fail'}.mp4</span>
                    </div>
                </div>
                <div class="outcome-footer">
                    <div class="outcome-narrative ${passed ? 'pass-narrative' : 'fail-narrative'}">
                        ${passed 
                            ? `<strong>Success!</strong> ${message || 'All test cases passed.'}`
                            : `<strong>Feedback:</strong> ${message || 'Some test cases failed.'}`}
                    </div>
                    <div class="outcome-actions">
                        <button type="button" id="outcome-skip-btn" class="btn-outcome-skip">Skip Cutscene ⏭</button>
                        <div id="outcome-final-actions" style="display: none; align-items: center; gap: 0.75rem; flex-wrap: wrap;">
                            ${passed ? `
                                <a href="${nextTarget}" class="btn-outcome-next">${nextText} &rarr;</a>
                                <button type="button" id="outcome-review-btn" class="btn-outcome-review">Review Code ↩</button>
                            ` : `
                                <button type="button" id="outcome-retry-btn" class="btn-outcome-retry">Back to Editor & Try Again ↩</button>
                            `}
                        </div>
                    </div>
                </div>
            `;

            if (workspaceContainer) workspaceContainer.style.display = "none";
            outcomeContainer.style.display = "block";

            const outcomeVideo = document.getElementById("outcome-video");
            const outcomeFallback = document.getElementById("outcome-fallback");
            const outcomeSkipBtn = document.getElementById("outcome-skip-btn");
            const outcomeFinalActions = document.getElementById("outcome-final-actions");
            const outcomeReviewBtn = document.getElementById("outcome-review-btn");
            const outcomeRetryBtn = document.getElementById("outcome-retry-btn");

            let actionsRevealed = false;
            function revealOutcomeActions() {
                if (actionsRevealed) return;
                actionsRevealed = true;
                if (outcomeSkipBtn) outcomeSkipBtn.style.display = "none";
                if (outcomeFinalActions) {
                    outcomeFinalActions.style.display = "inline-flex";
                }
            }

            function handleVideoFallback() {
                if (outcomeVideo) {
                    outcomeVideo.style.display = "none";
                }
                if (outcomeFallback) {
                    outcomeFallback.style.display = "flex";
                }
                revealOutcomeActions();
            }

            function returnToEditor() {
                if (outcomeVideo && !outcomeVideo.paused) {
                    outcomeVideo.pause();
                }
                outcomeContainer.style.display = "none";
                if (workspaceContainer) {
                    workspaceContainer.style.display = "flex";
                }
                setTimeout(() => {
                    editor.refresh();
                    editor.focus();
                }, 60);
            }

            if (outcomeVideo) {
                outcomeVideo.addEventListener("ended", revealOutcomeActions);
                outcomeVideo.addEventListener("error", handleVideoFallback);
                const source = outcomeVideo.querySelector("source");
                if (source) {
                    source.addEventListener("error", handleVideoFallback);
                }

                const fallbackTimeout = setTimeout(() => {
                    if (outcomeVideo.networkState === HTMLMediaElement.NETWORK_NO_SOURCE || outcomeVideo.error || outcomeVideo.readyState === 0) {
                        handleVideoFallback();
                    }
                }, 1200);

                outcomeVideo.addEventListener("loadeddata", () => {
                    clearTimeout(fallbackTimeout);
                });

                const playPromise = outcomeVideo.play();
                if (playPromise !== undefined) {
                    playPromise.catch((err) => {
                        console.warn("Outcome video playback interrupted or not allowed:", err);
                        if (outcomeVideo.networkState === HTMLMediaElement.NETWORK_NO_SOURCE || outcomeVideo.error) {
                            clearTimeout(fallbackTimeout);
                            handleVideoFallback();
                        }
                    });
                }
            } else {
                revealOutcomeActions();
            }

            if (outcomeSkipBtn) {
                outcomeSkipBtn.addEventListener("click", () => {
                    if (outcomeVideo && !outcomeVideo.paused) {
                        outcomeVideo.pause();
                    }
                    revealOutcomeActions();
                });
            }

            if (outcomeRetryBtn) {
                outcomeRetryBtn.addEventListener("click", returnToEditor);
            }

            if (outcomeReviewBtn) {
                outcomeReviewBtn.addEventListener("click", returnToEditor);
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

                        const currentUnlocked = parseInt(localStorage.getItem(progressKey) || "1", 10);
                        const newUnlocked = Math.max(currentUnlocked, chapterNumber + 1);
                        localStorage.setItem(progressKey, newUnlocked.toString());

                        updateProgressPills(newUnlocked);

                        if (nextBtn) {
                            nextBtn.style.display = "inline-flex";
                        }

                        showOutcomeCutscene(true, message);
                    } else {
                        if (statusMsg) {
                            statusMsg.style.color = "#dc2626";
                            statusMsg.innerHTML = `<span>✗</span> ${message}`;
                        }
                        submitBtn.disabled = false;
                        showOutcomeCutscene(false, message);
                    }
                } catch (err) {
                    const lines = (err.message || "").trim().split("\n");
                    const cleanError = lines.slice(-2).join(" ");
                    if (statusMsg) {
                        statusMsg.style.color = "#dc2626";
                        statusMsg.innerHTML = `<span>✗</span> Error: ${cleanError}`;
                    }
                    submitBtn.disabled = false;
                    showOutcomeCutscene(false, `Error: ${cleanError}`);
                }
            });
        }
    });
};
