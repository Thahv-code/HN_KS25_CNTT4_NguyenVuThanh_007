const form = document.getElementById("loginForm");
const errorMsg = document.getElementById("errorMsg");

const adminData = {
  fullname: "Admin",
  email: "admin@gmail.com",
  password: "admin123",
  role: "admin",
  id:"0"
};

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  errorMsg.textContent = "";

  if (email === "") {
    errorMsg.textContent = "Email không được để trống.";
    return;
  }

  if (password === "") {
    errorMsg.textContent = "Mật khẩu không được để trống.";
    return;
  }

  // Kiểm tra admin
  if (email === adminData.email && password === adminData.password) {
    // Lưu thông tin admin vào localStorage
    localStorage.setItem("currentUser", JSON.stringify(adminData));
    window.location.href = "/asset/pages/home-page.html";
    return;
  }

  // Nếu không phải admin thì kiểm tra trong localStorage
  const users = JSON.parse(localStorage.getItem("users")) || [];
  const user = users.find((u) => u.email === email && u.password === password);

  if (!user) {
    errorMsg.textContent = "Email hoặc mật khẩu không chính xác.";
    return;
  }

  // Kiểm tra role
  if (user.role === "user") {
    // Lưu thông tin người dùng vào localStorage
    localStorage.setItem("currentUser", JSON.stringify(user));

    Swal.fire({
      position: "top-end",
      icon: "success",
      title: "Đăng nhập thành công",
      showConfirmButton: false,
      timer: 1500,
    }).then(() => {
      window.location.href = "/asset/pages/home-page.html";
    });
  } else {
    errorMsg.textContent = "Không xác định được quyền đăng nhập.";
  }
});
