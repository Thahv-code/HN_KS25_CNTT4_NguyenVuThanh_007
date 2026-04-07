let allMembers = JSON.parse(localStorage.getItem("members")) || [];

const filterClass = document.getElementById("filterClass");
const filterEmail = document.getElementById("filterEmail");
const filterDate = document.getElementById("filterDate");

const adminTableBody = document.getElementById("adminTableBody");
const totalGymSpan = document.getElementById("totalGym");
const totalYogaSpan = document.getElementById("totalYoga");
const totalZumbaSpan = document.getElementById("totalZumba");

const collumGym = document.getElementById("chart-column-gym");
const collumYoga = document.getElementById("chart-column-yoga");
const collumZumba = document.getElementById("chart-column-zumba");

function checkAdmin() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "/asset/pages/auth/sign-in.html";
  }
}

function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "/asset/pages/auth/sign-up.html";
}

function calculateStats() {
  const totalGym = allMembers.filter((m) => m.class === "Gym").length;
  const totalYoga = allMembers.filter((m) => m.class === "Yoga").length;
  const totalZumba = allMembers.filter((m) => m.class === "Zumba").length;

  totalGymSpan.textContent = totalGym;
  totalYogaSpan.textContent = totalYoga;
  totalZumbaSpan.textContent = totalZumba;

  const ratio = 20;
  collumGym.style.height = `${totalGym * ratio}px`;
  collumYoga.style.height = `${totalYoga * ratio}px`;
  collumZumba.style.height = `${totalZumba * ratio}px`;
}

function filterMembers() {
  const classFilter = filterClass.value;
  const emailFilter = filterEmail.value.toLowerCase().trim();
  const dateFilter = filterDate.value;

  return allMembers.filter((member) => {
    if (classFilter !== "all") {
      const classValue =
        classFilter.charAt(0).toUpperCase() + classFilter.slice(1);
      if (member.class !== classValue) return false;
    }
    if (emailFilter && !member.email.toLowerCase().includes(emailFilter)) {
      return false;
    }
    if (dateFilter && member.date !== dateFilter) {
      return false;
    }
    return true;
  });
}

function renderFilterData() {
  const filteredMembers = filterMembers();

  if (filteredMembers.length === 0) {
    adminTableBody.innerHTML = `
      <tr>
        <td colspan="6" style="text-align: center; color: #999; padding: 20px;">
          Không tìm thấy lịch tập nào phù hợp
        </td>
      </tr>
    `;
    return;
  }

  adminTableBody.innerHTML = filteredMembers
    .map(
      (member) => `
      <tr>
        <td>${member.class}</td>
        <td>${member.date}</td>
        <td>${member.time}</td>
        <td>${member.name}</td>
        <td>${member.email}</td>
        <td>
          <button class="btnEdit" data-id="${member.id}">Sửa</button>
          <button class="btnDelete" data-id="${member.id}">Xóa</button>
        </td>
      </tr>
    `,
    )
    .join("");

  attachTableEventListeners();
}

function attachTableEventListeners() {
  document.querySelectorAll(".btnDelete").forEach((btn) => {
    btn.addEventListener("click", handleDelete);
  });

  document.querySelectorAll(".btnEdit").forEach((btn) => {
    btn.addEventListener("click", handleEdit);
  });
}

function handleDelete(e) {
  const id = Number(e.target.getAttribute("data-id"));
  Swal.fire({
    title: "Bạn chắc chắn muốn xóa?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Dạ có",
    cancelButtonText: "Hủy",
  }).then((result) => {
    if (result.isConfirmed) {
      allMembers = allMembers.filter((m) => m.id !== id);
      localStorage.setItem("members", JSON.stringify(allMembers));
      calculateStats();
      renderFilterData();
      Swal.fire({
        icon: "success",
        title: "Đã xóa thành công!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}

function handleEdit(e) {
  const id = Number(e.target.getAttribute("data-id"));
  const member = allMembers.find((m) => m.id === id);
  if (!member) return;

  Swal.fire({
    title: "Sửa thông tin lịch tập",
    html: `
      <div style="text-align: left;">
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Lớp học</label>
          <select id="editClassSelect" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <option value="Gym" ${member.class === "Gym" ? "selected" : ""}>Gym</option>
            <option value="Yoga" ${member.class === "Yoga" ? "selected" : ""}>Yoga</option>
            <option value="Zumba" ${member.class === "Zumba" ? "selected" : ""}>Zumba</option>
          </select>
        </div>
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Ngày tập</label>
          <input type="date" id="editDateInput" value="${member.date}" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
        </div>
        <div style="margin-bottom: 15px;">
          <label style="display: block; margin-bottom: 5px; font-weight: 500;">Khung giờ</label>
          <select id="editTimeSelect" style="width: 100%; padding: 8px; border: 1px solid #ddd; border-radius: 4px;">
            <option value="08:00 - 10:00" ${member.time === "08:00 - 10:00" ? "selected" : ""}>08:00 - 10:00</option>
            <option value="14:00 - 16:00" ${member.time === "14:00 - 16:00" ? "selected" : ""}>14:00 - 16:00</option>
            <option value="18:00 - 20:00" ${member.time === "18:00 - 20:00" ? "selected" : ""}>18:00 - 20:00</option>
          </select>
        </div>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: "Cập nhật",
    cancelButtonText: "Hủy",
    didOpen: () => {
      const firstInput = document.getElementById("editClassSelect");
      if (firstInput) firstInput.focus();
    },
  }).then((result) => {
    if (result.isConfirmed) {
      const newClass = document.getElementById("editClassSelect").value;
      const newDate = document.getElementById("editDateInput").value;
      const newTime = document.getElementById("editTimeSelect").value;

      const updatedMember = {
        ...member,
        class: newClass,
        date: newDate,
        time: newTime,
      };

      allMembers = allMembers.map((m) => (m.id === id ? updatedMember : m));
      localStorage.setItem("members", JSON.stringify(allMembers));
      calculateStats();
      renderFilterData();

      Swal.fire({
        icon: "success",
        title: "Đã cập nhật thành công!",
        timer: 1500,
        showConfirmButton: false,
      });
    }
  });
}

function setupFilterListeners() {
  filterClass.addEventListener("change", renderFilterData);
  filterEmail.addEventListener("input", renderFilterData);
  filterDate.addEventListener("change", renderFilterData);
}

document.addEventListener("DOMContentLoaded", () => {
  checkAdmin();
  calculateStats();
  renderFilterData();
  setupFilterListeners();
});
