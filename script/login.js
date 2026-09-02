// Hash helper using native Web Crypto API
async function hashPassword(plainTextPassword) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plainTextPassword);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  // If user is already authenticated, send them straight to the level map
  if (sessionStorage.getItem("activeUser") || localStorage.getItem("activeUser")) {
    window.location.href = "chapters.html";
    return;
  }

  const form = document.getElementById("login-form");
  const errorBox = document.getElementById("error-box");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    errorBox.style.display = "none";
    errorBox.textContent = "";

    const usernameInput = document.getElementById("username").value.trim();
    const passwordInput = document.getElementById("password").value;

    try {
      const user = await getUser(usernameInput);

      if (!user) {
        errorBox.textContent = "User not found. Please verify your username or sign up.";
        errorBox.style.display = "block";
        return;
      }

      const inputPasswordHash = await hashPassword(passwordInput);

      // Compare password hashes
      if (user.password !== inputPasswordHash) {
        errorBox.textContent = "Incorrect password. Please try again.";
        errorBox.style.display = "block";
        return;
      }

      // Set session (picked up by index.html header dynamic state)
      sessionStorage.setItem("activeUser", user.username);

      // Redirect to story progression map
      window.location.href = "chapters.html";

    } catch (err) {
      console.error("Login transaction error:", err);
      errorBox.textContent = "Storage read error. Please ensure cookies and site data are allowed.";
      errorBox.style.display = "block";
    }
  });
});
