let db;
const errorBox = document.getElementById("error-box");
const form = document.getElementById("register-form");

const request = indexedDB.open("userDatabase", 1);

request.onupgradeneeded = (event) => {
    const localDb = event.target.result;
    const userStore = localDb.createObjectStore("users", {keyPath: "id", autoIncrement: true});
    userStore.createIndex("emailIndex", "email", {unique: true});
};

request.onsuccess = (event) => {
    db = event.target.result;
};

request.onerror = (event) => {
    showError("Failed to open local database.");
    console.error("IndexedDB error:", event.target.error);
};

form.addEventListener("submit", (e) => {
    e.preventDefault();
    clearError();

    if (!db) {
        showError("Database is still loading. Please try again in a moment.");
        return;
    }

    const email = document.getElementById("email").value.trim().toLowerCase();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm-password").value;

    if (password !== confirmPassword) {
        showError("Passwords do not match.");
        return;
    }

    if (password.length < 8) {
        showError("Password must be at least 8 characters long.");
        return;
    }

    const transaction = db.transaction(["users"], "readwrite");
    const store = transaction.objectStore("users");

    const newUser = {
        email: email,
        password: password,
        createdAt: new Date().toISOString(),
    };

    const addRequest = store.add(newUser);

    addRequest.onsuccess = () => {
        window.location.href = "login.html";
    };

    addRequest.onerror = (event) => {
        if (event.target.error.name === "ConstraintError") {
            showError("An account with this email already exists.");
        } else {
            showError("Registration failed. Please try again.");
        }
        event.preventDefault();
    };
});

function showError(message) {
    errorBox.textContent = message;
    errorBox.style.display = "block";
}

function clearError() {
    errorBox.textContent = "";
    errorBox.style.display = "none";
}
