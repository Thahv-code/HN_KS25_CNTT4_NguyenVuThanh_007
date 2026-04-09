function updateNavigation() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  const navMenu = document.getElementById("navMenu");

  if (currentUser) {
    if (currentUser.role === "user") {
      navMenu.innerHTML = `
      <span style="color: white; margin-right: auto;">Xin chào, ${currentUser.fullname}</span>
      <a href="/asset/pages/home-page.html">Trang chủ</a>
      <a href="/asset/pages/booking/schedule.html">Lịch tập</a>
      <a href="#" onclick="logout(event)">Đăng xuất</a>
    `;
    } else if (currentUser.role === "admin") {
      navMenu.innerHTML = `
      <span style="color: white; margin-right: auto;">Xin chào, ${currentUser.fullname}</span>
      <a href="/asset/pages/home-page.html">Trang chủ</a>
      <a href="/asset/pages/admin/dashboard.html">Quản lý</a>
      <a href="#" onclick="logout(event)">Đăng xuất</a>
    `;
    }
  } else {
    navMenu.innerHTML = `
    <a href="/asset/pages/home-page.html">Trang chủ</a>
    <a href="/asset/pages/booking/schedule.html">Lịch tập</a>
    <a href="/asset/pages/auth/sign-in.html">Đăng nhập</a>
  `;
  }
}

function logout(event) {
  event.preventDefault();
  localStorage.removeItem("currentUser");
  window.location.href = "/asset/pages/home-page.html";
}

document.addEventListener("DOMContentLoaded", updateNavigation);
