const btnAddService = document.getElementById("btnAddService");
const serviceModal = document.getElementById("serviceModal");
const serviceForm = document.getElementById("serviceForm");
const serviceNameInput = document.getElementById("serviceNameInput");
const btnCancelService = document.getElementById("btnCancelService");
const btnSaveService = document.getElementById("btnSaveService");
const servicesTableBody = document.getElementById("servicesTableBody");
const serviceModalTitle = document.getElementById("serviceModalTitle");

// Khởi tạo danh sách lớp học mặc định nếu chưa có
let classes = JSON.parse(localStorage.getItem("classes")) || [
  { id: 1, name: "Gym" },
  { id: 2, name: "Yoga" },
  { id: 3, name: "Zumba" },
];

let currentClassId = Number(localStorage.getItem("currentClassId")) || 4;
let editClassId = null;

// Lưu dữ liệu mặc định vào localStorage khi lần đầu tiên
if (!localStorage.getItem("classes")) {
  localStorage.setItem("classes", JSON.stringify(classes));
}

// Kiểm tra quyền admin
function checkAdmin() {
  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (!currentUser || currentUser.role !== "admin") {
    window.location.href = "/asset/pages/auth/sign-in.html";
  }
}

// Đăng xuất
function logout() {
  localStorage.removeItem("currentUser");
  window.location.href = "/asset/pages/auth/sign-up.html";
}

// Lưu dữ liệu vào localStorage
const saveData = () => {
  localStorage.setItem("classes", JSON.stringify(classes));
  localStorage.setItem("currentClassId", currentClassId);
};

// Reset form
const resetForm = () => {
  serviceNameInput.value = "";
  btnSaveService.textContent = "Lưu";
  serviceModalTitle.textContent = "Thêm Dịch Vụ";
  editClassId = null;
};

// Kiểm tra dữ liệu
const validateService = () => {
  const serviceName = serviceNameInput.value.trim();

  if (!serviceName) {
    Swal.fire({
      icon: "warning",
      title: "Cảnh báo!",
      text: "Vui lòng nhập tên lớp học",
      confirmButtonText: "OK",
    });
    return false;
  }

  // Kiểm tra trùng lặp (ngoại trừ id đang sửa)
  const isDuplicate = classes.find(
    (c) =>
      c.name.toLowerCase() === serviceName.toLowerCase() &&
      c.id !== editClassId,
  );

  if (isDuplicate) {
    Swal.fire({
      icon: "warning",
      title: "Cảnh báo!",
      text: "Tên lớp học này đã tồn tại",
      confirmButtonText: "OK",
    });
    return false;
  }

  return true;
};

// Render bảng dịch vụ
const renderServices = () => {
  if (classes.length === 0) {
    servicesTableBody.innerHTML = `
      <tr>
        <td colspan="2" style="text-align: center; color: #999; padding: 20px;">
          Không có lớp học nào, hãy thêm lớp học mới
        </td>
      </tr>
    `;
    return;
  }

  servicesTableBody.innerHTML = classes
    .map(
      (classItem) => `
      <tr>
        <td>${classItem.name}</td>
        <td>
          <button class="btnEdit" data-id="${classItem.id}">Sửa</button>
          <button class="btnDelete" data-id="${classItem.id}">Xóa</button>
        </td>
      </tr>
    `,
    )
    .join("");

  attachTableEventListeners();
};

// Gắn sự kiện cho các nút trong bảng
const attachTableEventListeners = () => {
  document.querySelectorAll(".btnEdit").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.target.getAttribute("data-id"));
      const classItem = classes.find((c) => c.id === id);
      if (classItem) {
        editClassId = id;
        serviceNameInput.value = classItem.name;
        serviceModalTitle.textContent = "Sửa Lớp Học";
        btnSaveService.textContent = "Cập nhật";
        serviceModal.style.display = "flex";
      }
    });
  });

  document.querySelectorAll(".btnDelete").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.target.getAttribute("data-id"));
      Swal.fire({
        title: "Bạn chắc chắn muốn xóa lớp học này?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Dạ có",
        cancelButtonText: "Hủy",
      }).then((result) => {
        if (result.isConfirmed) {
          classes = classes.filter((c) => c.id !== id);
          saveData();
          renderServices();
          Swal.fire({
            icon: "success",
            title: "Thành công!",
            text: "Lớp học đã được xóa",
            timer: 1500,
            showConfirmButton: false,
          });
        }
      });
    });
  });
};

// Mở modal thêm dịch vụ
btnAddService.addEventListener("click", () => {
  resetForm();
  serviceModal.style.display = "flex";
});

// Đóng modal khi click Hủy
btnCancelService.addEventListener("click", () => {
  serviceModal.style.display = "none";
  resetForm();
});

// Đóng modal khi click ngoài khối nội dung
serviceModal.addEventListener("click", (e) => {
  if (e.target === serviceModal) {
    serviceModal.style.display = "none";
    resetForm();
  }
});

// Lưu dịch vụ
serviceForm.addEventListener("submit", (e) => {
  e.preventDefault();

  if (!validateService()) return;

  const serviceName = serviceNameInput.value.trim();

  if (editClassId) {
    // Cập nhật lớp học
    classes = classes.map((c) =>
      c.id === editClassId ? { ...c, name: serviceName } : c,
    );
    Swal.fire({
      icon: "success",
      title: "Thành công!",
      text: "Lớp học đã được cập nhật",
      timer: 1500,
      showConfirmButton: false,
    });
  } else {
    // Thêm lớp học mới
    const newClass = {
      id: currentClassId++,
      name: serviceName,
    };
    classes.push(newClass);
    Swal.fire({
      icon: "success",
      title: "Thành công!",
      text: "Lớp học đã được thêm",
      timer: 1500,
      showConfirmButton: false,
    });
  }

  saveData();
  renderServices();
  serviceModal.style.display = "none";
  resetForm();
});

// Khởi tạo
checkAdmin();
renderServices();
