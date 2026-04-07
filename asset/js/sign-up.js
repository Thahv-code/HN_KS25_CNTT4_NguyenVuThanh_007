const form = document.getElementById("registerForm");
const fullnameInput = document.getElementById("fullname");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const confirmPasswordInput = document.getElementById("confirmPassword");

const errorFullname = document.getElementById("errorFullname");
const errorEmail = document.getElementById("errorEmail");
const errorPassword = document.getElementById("errorPassword");
const errorConfirmPassword = document.getElementById("errorConfirmPassword");

const togglePassword = document.getElementById("togglePassword");
const toggleConfirmPassword = document.getElementById("toggleConfirmPassword");

function clearErrors() {
  errorFullname.classList.remove("show");
  errorEmail.textContent = "";
  errorEmail.classList.remove("show");
  errorPassword.textContent = "";
  errorPassword.classList.remove("show");
  errorConfirmPassword.textContent = "";
  errorConfirmPassword.classList.remove("show");
}

function showError(errorElement, message) {
  errorElement.textContent = message;
  errorElement.classList.add("show");
}

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const fullname = fullnameInput.value.trim();
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  clearErrors();
  let isValid = true;

  if (fullname === "") {
    showError(errorFullname, "Họ và tên không được để trống.");
    isValid = false;
  }

  if (email === "") {
    showError(errorEmail, "Email không được để trống.");
    isValid = false;
  } else {
    const emailError = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailError.test(email)) {
      showError(errorEmail, "Email không đúng định dạng.");
      isValid = false;
    }
  }

  if (password === "") {
    showError(errorPassword, "Mật khẩu không được để trống.");
    isValid = false;
  } else if (password.length < 8) {
    showError(errorPassword, "Mật khẩu phải có ít nhất 8 ký tự.");
    isValid = false;
  }

  if (confirmPassword === "") {
    showError(errorConfirmPassword, "Xác nhận mật khẩu không được để trống.");
    isValid = false;
  } else if (password !== confirmPassword) {
    showError(errorConfirmPassword, "Mật khẩu xác nhận không khớp.");
    isValid = false;
  }

  if (isValid) {
    const userData = {
      fullname: fullname,
      email: email,
      password: password,
      role: "user",
      id: Date.now().toString(),
    };

    let users = JSON.parse(localStorage.getItem("users")) || [];

    const exists = users.some((u) => u.email === email);
    if (exists) {
      showError(errorEmail, "Email này đã được đăng ký.");
      return;
    }

    users.push(userData);
    localStorage.setItem("users", JSON.stringify(users));

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Đăng kí thành công",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      window.location.href = "/asset/pages/auth/sign-in.html";
    });
  }
});

togglePassword.addEventListener("click", function () {
  const type =
    passwordInput.getAttribute("type") === "password" ? "text" : "password";
  passwordInput.setAttribute("type", type);
  this.classList.toggle("fa-eye");
  this.classList.toggle("fa-eye-slash");
});

toggleConfirmPassword.addEventListener("click", function () {
  const type =
    confirmPasswordInput.getAttribute("type") === "password"
      ? "text"
      : "password";
  confirmPasswordInput.setAttribute("type", type);
  this.classList.toggle("fa-eye");
  this.classList.toggle("fa-eye-slash");
});
