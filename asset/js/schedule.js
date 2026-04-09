const addBtn = document.querySelector(".btn-add");
const modalBooking = document.getElementById("modalBooking");
const form = document.getElementById("bookingForm");
const classSelect = document.getElementById("classSelect");
const dateInput = document.getElementById("dateInput");
const timeSelect = document.getElementById("timeSelect");

const btnCancel = document.getElementById("btnCancel");
const btnSave = document.getElementById("btnSave");

const bookingBody = document.getElementById("bookingBody");
const title = document.getElementById("title");

let members = JSON.parse(localStorage.getItem("members")) || [];
let currentId = Number(localStorage.getItem("currentId")) || 1;

let editId = null;

const loadClasses = () => {
  const classes = JSON.parse(localStorage.getItem("classes")) || [];
  classSelect.innerHTML = '<option value="">Chọn lớp học</option>';

  classes.forEach((cls) => {
    const option = document.createElement("option");
    option.value = cls.name;
    option.textContent = cls.name;
    classSelect.appendChild(option);
  });
};

const setError = (input, message) => {
  const inputControl = input.closest(".form-group");
  const errorMessage = inputControl.querySelector(".error-message");
  errorMessage.textContent = message;
  inputControl.style.borderColor = "red";
  errorMessage.style.color = "red";
};

const setSuccess = (input, message) => {
  const inputControl = input.closest(".form-group");
  const errorMessage = inputControl.querySelector(".error-message");
  errorMessage.textContent = "";
  inputControl.style.borderColor = "#cbd5e0";
};

const saveData = () => {
  localStorage.setItem("members", JSON.stringify(members));
  localStorage.setItem("currentId", currentId);
};

const resetData = () => {
  classSelect.value = "Chọn lớp học";
  dateInput.value = "";
  timeSelect.value = "Chọn khung giờ";
  btnSave.textContent = "Lưu";
  title.textContent = "Đặt lịch mới";
  setSuccess(classSelect);
  setSuccess(dateInput);
  setSuccess(timeSelect);
};

const loadFormLocal = () => {
  const data = JSON.parse(localStorage.getItem("currentUser"));
  return data ? data : null;
};

const validateData = () => {
  const classBooking = classSelect.value;
  const dateBooking = dateInput.value;
  const timeBooking = timeSelect.value;
  const user = loadFormLocal();

  let isValid = true;
  if (!classBooking) {
    setError(classSelect, "Hãy nhập lớp muốn học");
    isValid = false;
  } else {
    setSuccess(classSelect);
  }

  if (!dateBooking) {
    setError(dateInput, "Hãy nhập lớp muốn học");
    isValid = false;
  } else {
    setSuccess(dateInput);
  }

  if (!timeBooking) {
    setError(timeSelect, "Hãy nhập lớp muốn học");
    isValid = false;
  } else {
    setSuccess(timeSelect);
  }

  if (isValid) {
    const isDuplicate = members.find(
      (m) =>
        m.userId === user.id &&
        m.class === classBooking &&
        m.date === dateBooking &&
        m.time === timeBooking &&
        m.id !== editId,
    );
    if (isDuplicate) {
      setError(timeSelect, "Bạn đã đặt lịch này rồi, vui lòng chọn lại");
      isValid = false;
    } else {
      setSuccess(timeSelect);
    }
  }
  return isValid;
};

addBtn.addEventListener("click", () => {
  modalBooking.style.display = "flex";
});

const renderData = () => {
  const user = loadFormLocal();
  if (!user) return;
  let bookingUser = members.filter((b) => b.userId === user.id);

  bookingBody.innerHTML = bookingUser
    .map(
      (p) => `
    <tr>
        <td>${p.class}</td>
        <td>${p.date}</td>
        <td>${p.time}</td>
        <td>${p.name}</td>
        <td>${p.email}</td>
        <td>
            <button class="btnEdit" value="${p.id}">Sửa</button>
            <button class="btnDelete" value="${p.id}">Xóa</button>
        </td>
    </tr> 
    `,
    )
    .join("");
};

btnSave.addEventListener("click", (e) => {
  e.preventDefault();
  const classBooking = classSelect.value;
  const dateBooking = dateInput.value;
  const timeBooking = timeSelect.value;
  if (!validateData()) return;
  // lấy dữ liệu người dùng hiện tại
  const user = loadFormLocal();
  if (!user) {
    alert("Không tìm thấy thông tin người dùng!");
    return;
  }

  const memberData = {
    id: editId ? editId : currentId++,
    name: user.fullname,
    class: classBooking,
    date: dateBooking,
    time: timeBooking,
    email: user.email,
    userId: user.id,
  };
  if (editId) {
    members = members.map((p) => (p.id === editId ? memberData : p));
    editId = null;
  } else {
    members.push(memberData);
  }

  saveData();
  renderData();
  resetData();
  modalBooking.style.display = "none";

  Swal.fire({
    icon: "success",
    title: "Thành công!",
    timer: 1500,
    showConfirmButton: false,
  });
});

bookingBody.addEventListener("click", (e) => {
  const id = Number(e.target.value);
  if (e.target.classList.contains("btnEdit")) {
    const member = members.find((p) => p.id === id);
    if (!member) return;
    editId = id;
    classSelect.value = member.class;
    dateInput.value = member.date;
    timeSelect.value = member.time;
    modalBooking.style.display = "flex";
    btnSave.textContent = "Cập nhật";
    title.textContent = "Cập nhật lịch tập";
  }
  if (e.target.classList.contains("btnDelete")) {
    Swal.fire({
      title: "Bạn chắc chắn muốn xóa?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Dạ có",
      cancelButtonText: "Hủy",
    }).then((result) => {
      if (result.isConfirmed) {
        members = members.filter((p) => p.id !== id);
        saveData();
        renderData();
      }
    });
  }
});
btnCancel.addEventListener("click", () => {
  modalBooking.style.display = "none";
  resetData();
});

renderData();
loadClasses();
