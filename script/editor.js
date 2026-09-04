const editor = CodeMirror.fromTextArea(document.getElementById("code-input"), {
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

const submitBtn = document.getElementById("submit-btn");
const statusMsg = document.getElementById("status-msg");

let pyodide = null;
let pyodideReady = false;

statusMsg.style.color = "#64748b";
statusMsg.textContent = "Initializing Python environment...";
submitBtn.disabled = true;

loadPyodide({indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"})
.then((py) => {
    pyodide = py;
    pyodideReady = true;
    statusMsg.textContent = "";
    submitBtn.disabled = false;
})
.catch((err) => {
    statusMsg.style.color = "#dc2626";
    statusMsg.textContent = "Failed to load Python engine.";
    console.error(err);
});

submitBtn.addEventListener("click", async () => {
    if (!pyodideReady) return;

    const userCode = editor.getValue();
    submitBtn.disabled = true;
    statusMsg.style.color = "#2563eb";
    statusMsg.textContent = "Running test cases...";

  const testSuite = `${userCode}
assert "solve_gate" in globals(), "Function 'solve_gate' is not defined."
assert solve_gate(1234) == "UNLOCKED", "Failed on passcode 1234: Expected 'UNLOCKED'"
assert solve_gate(9999) == "LOCKED", "Failed on wrong passcode 9999: Expected 'LOCKED'"
assert solve_gate(0) == "LOCKED", "Failed on passcode 0: Expected 'LOCKED'"
`;

    try {
        await pyodide.runPythonAsync(testSuite);
        statusMsg.style.color = "#16a34a";
        statusMsg.textContent = "✓ Accepted! Unlocking the next chapter...";
    } catch (err) {
        statusMsg.style.color = "#dc2626";
        // Show only the final Python error line (AssertionError, SyntaxError, etc.)
        const errLines = err.message.trim().split("\n");
        statusMsg.textContent = `✗ ${errLines[errLines.length - 1]}`;
    } finally {
        submitBtn.disabled = false;
    }
});