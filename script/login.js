let db;
const errorBox = document.getElementById("error-box");
const form = document.getElementById("login-form");

const request = indexedDB.open("userDatabase", 1);

request.onupgradeneeded = (event) => {
	const localDb = event.target.result;
	const userStore = localDb.createObjectStore("users", {keyPath: "id", autoIncrement: true});
	userStore.createIndex("emailIndex", "email", { unique: true });
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
    	showError("Database is still loading. Please try again.");
    	return;
  	}

	const email = document.getElementById("email").value.trim().toLowerCase();
	const password = document.getElementById("password").value;

	const transaction = db.transaction(["users"], "readonly");
	const store = transaction.objectStore("users");
	const index = store.index("emailIndex");

	const getRequest = index.get(email);

	getRequest.onsuccess = () => {
		const user = getRequest.result;

		if (!user || user.password !== password) {
			showError("Invalid email or password.");
			return;
		}

    	sessionStorage.setItem("currentUser", JSON.stringify({ email: user.email, id: user.id }));

    	window.location.href = "index.html";
  	};

	getRequest.onerror = () => {
		showError("An error occurred while logging in. Please try again.");
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
