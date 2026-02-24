const form = document.getElementById("registerForm");
const nameInput = document.getElementById("regName");
const emailInput = document.getElementById("regEmail");
const passInput = document.getElementById("regPassword");
const confirmInput = document.getElementById("regConfirm");
const message = document.getElementById("regMessage");

function readUsers() {
  const text = localStorage.getItem("users");
  if (text === null) return [];
  return JSON.parse(text);
}

function saveUsers(users) {
  localStorage.setItem("users", JSON.stringify(users));
}

function showMessage(text, isError) {
  message.textContent = text;
  message.className = isError ? "text-danger small mt-3 mb-0" : "text-success small mt-3 mb-0";
}

function emailLooksValid(email) {
  return email.includes("@") && email.includes(".");
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const name = nameInput.value.trim();
  const email = emailInput.value.trim().toLowerCase();
  const password = passInput.value;
  const confirm = confirmInput.value;

  if (name.length < 2) {
    showMessage("Name is too short.", true);
    return;
  }

  if (!emailLooksValid(email)) {
    showMessage("Please enter a valid email.", true);
    return;
  }

  if (password.length < 6) {
    showMessage("Password must be at least 6 characters.", true);
    return;
  }

  if (password !== confirm) {
    showMessage("Passwords do not match.", true);
    return;
  }

  const users = readUsers();

  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email) {
      showMessage("This email is already registered.", true);
      return;
    }
  }

  users.push({ name: name, email: email, password: password });
  saveUsers(users);

  showMessage("Account created! Redirecting to login...", false);

  setTimeout(function () {
    window.location.href = "/pages/login.html";
  }, 900);
});