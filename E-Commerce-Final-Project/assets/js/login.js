const form = document.getElementById("loginForm");
const emailInput = document.getElementById("loginEmail");
const passInput = document.getElementById("loginPassword");
const message = document.getElementById("loginMessage");

function readUsers() {
  const text = localStorage.getItem("users");
  if (text === null) return [];
  return JSON.parse(text);
}

function showMessage(text, isError) {
  message.textContent = text;
  message.className = isError ? "text-danger small mt-3 mb-0" : "text-success small mt-3 mb-0";
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = emailInput.value.trim().toLowerCase();
  const password = passInput.value;

  if (email === "" || password === "") {
    showMessage("Please fill all fields.", true);
    return;
  }

  const users = readUsers();

  let foundUser = null;
  for (let i = 0; i < users.length; i++) {
    if (users[i].email === email && users[i].password === password) {
      foundUser = users[i];
      break;
    }
  }

  if (foundUser === null) {
    showMessage("Wrong email or password.", true);
    return;
  }

  localStorage.setItem(
    "currentUser",
    JSON.stringify({ name: foundUser.name, email: foundUser.email })
  );

  showMessage("Login successful! Going home...", false);

  setTimeout(function () {
    window.location.href = "/index.html";
  }, 700);
});