document.addEventListener("DOMContentLoaded", () => {
    const authContainer = document.querySelector(".auth-buttons");
    if (!authContainer) return;

    const sessionData = sessionStorage.getItem("currentUser");

    if (sessionData) {
        const user = JSON.parse(sessionData);

        authContainer.innerHTML = `<button id="logout-btn" class="logout-text">Log Out</button>`;

        document.getElementById("logout-btn").addEventListener("click", () => {
            sessionStorage.removeItem("currentUser");
            window.location.href = "login.html";
        });
    }
});
