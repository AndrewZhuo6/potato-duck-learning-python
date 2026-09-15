window.QuackbitDrafts = (function () {
  const PREFIX = "quackbit_draft_";
  const SAVE_DELAY = 600;   // ms of no typing before writing

  function keyFor(userIdentifier, chapterId) {
    return `${PREFIX}${userIdentifier}_${chapterId}`;
  }

  function read(userIdentifier, chapterId) {
    try {
      const raw = localStorage.getItem(keyFor(userIdentifier, chapterId));
      if (!raw) return null;
      const draft = JSON.parse(raw);
      return typeof draft.code === "string" ? draft : null;
    } catch {
      return null;
    }
  }

  function write(userIdentifier, chapterId, code) {
    try {
      localStorage.setItem(
        keyFor(userIdentifier, chapterId),
        JSON.stringify({ code: code, savedAt: new Date().toISOString() })
      );
      return true;
    } catch (err) {
      // Quota exceeded, or storage blocked in private browsing.
      console.warn("Could not save draft:", err);
      return false;
    }
  }

  function clear(userIdentifier, chapterId) {
    try {
      localStorage.removeItem(keyFor(userIdentifier, chapterId));
    } catch {

    }
  }

  function ensureIndicator() {
    let pill = document.getElementById("draft-status");
    if (pill) return pill;

    const host = document.querySelector(".editor-actions") ||
                 document.querySelector(".editor-footer");
    if (!host) return null;

    pill = document.createElement("span");
    pill.id = "draft-status";
    pill.className = "draft-status";
    host.insertBefore(pill, host.firstChild);
    return pill;
  }

  let hideTimer = null;

  function showStatus(text, state) {
    const pill = ensureIndicator();
    if (!pill) return;

    pill.textContent = text;
    pill.className = `draft-status is-visible ${state ? "is-" + state : ""}`;

    clearTimeout(hideTimer);
    hideTimer = setTimeout(() => {
      pill.classList.remove("is-visible");
    }, 2200);
  }


  function attach(editor, userIdentifier, chapterId, starterCode) {
    if (!editor) return null;

    const draft = read(userIdentifier, chapterId);
    const current = editor.getValue();
    const starter = starterCode || "";

    if (draft && draft.code.trim() && draft.code !== starter && draft.code !== current) {
      editor.setValue(draft.code);
      showStatus("Draft restored", "restored");
    }

    let saveTimer = null;

    function save() {
      clearTimeout(saveTimer);
      const code = editor.getValue();

      if (!code.trim() || code === starter) {
        clear(userIdentifier, chapterId);
        return;
      }

      if (write(userIdentifier, chapterId, code)) {
        showStatus("Saved", "saved");
      }
    }

    editor.on("change", () => {
      clearTimeout(saveTimer);
      saveTimer = setTimeout(save, SAVE_DELAY);
    });

    editor.on("blur", save);

    window.addEventListener("pagehide", save);
    window.addEventListener("beforeunload", save);
    document.addEventListener("visibilitychange", () => {
      if (document.visibilityState === "hidden") save();
    });

    return {
      save: save,
      clear: () => clear(userIdentifier, chapterId)
    };
  }

  return { attach, read, write, clear, showStatus };
})();