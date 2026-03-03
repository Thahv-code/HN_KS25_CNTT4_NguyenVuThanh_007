let menuFood = [
  { id: 1, name: "sushi", price: 10000, type: "món khai vị" },
  { id: 2, name: "gà nướng", price: 250000, type: "món chính" },
  { id: 3, name: "lẩu gà", price: 150000, type: "món chính" },
  { id: 4, name: "kem", price: 10000, type: "món tráng miệng" },
];

function formatFoodList(list) {
  if (!Array.isArray(list)) return [];
  return list;
}

function showFoodMenu() {
  console.log("MENU:", formatFoodList(menuFood));
  alert("Đã in MENU  ra console.");
}

function addFood(id, name, price, type) {
  if (arguments.length === 0) {
    return runMenu();
  }

  id = Number(id);
  name = String(name ?? "").trim();
  price = Number(price);
  type = String(type ?? "").trim().toLowerCase();

  if (!Number.isInteger(id) || id <= 0) {
    return "ID không hợp lệ.";
  }
  if (menuFood.some((food) => food.id === id)) {
    return "ID đã tồn tại, vui lòng chọn ID khác.";
  }
  if (!name) {
    return "Tên món ăn không được để trống.";
  }
  if (menuFood.some((food) => food.name.toLowerCase() === name.toLowerCase())) {
    return "Tên món đã có trong menu.";
  }
  if (typeof price !== "number" || Number.isNaN(price) || price <= 0) {
    return "Giá món ăn phải là số và lớn hơn 0.";
  }
  const validType = ["món khai vị", "món chính", "món tráng miệng"];
  if (!validType.includes(type)) {
    return "Loại món ăn không hợp lệ. Phải là: món khai vị, món chính, món tráng miệng.";
  }

  menuFood.push({ id, name, price, type });
  return `Đã thêm món ăn: ${name}`;
}

function deleteFood(name) {
  const foodName = String(name ?? "").trim().toLowerCase();
  const foodIndex = menuFood.findIndex(
    (f) => f.name.toLowerCase() === foodName,
  );
  if (foodIndex === -1) return "Tên món ăn không tồn tại.";

  const confirmed = confirm(
    `Bạn có chắc chắn muốn xóa món ăn "${menuFood[foodIndex].name}" không?`,
  );
  if (confirmed) {
    menuFood.splice(foodIndex, 1);
    return "Xóa món ăn thành công!";
  }
  return "Đã hủy xóa";
}

function updateFood(name, price, type) {
  const foodName = String(name ?? "").trim().toLowerCase();
  const idx = menuFood.findIndex(
    (f) => f.name.toLowerCase() === foodName,
  );
  if (idx === -1) return "Tên món ăn không tồn tại.";

  price = Number(price);
  type = String(type ?? "").trim().toLowerCase();

  if (typeof price !== "number" || Number.isNaN(price) || price <= 0) {
    return "Giá món ăn phải là số và lớn hơn 0.";
  }
  const validType = ["món khai vị", "món chính", "món tráng miệng"];
  if (!validType.includes(type)) {
    return "Loại món ăn không hợp lệ. Phải là: món khai vị, món chính, món tráng miệng.";
  }

  menuFood[idx].price = price;
  menuFood[idx].type = type;
  return `Đã cập nhật món ăn: ${menuFood[idx].name}`;
}

function searchFood(name, type) {
  const qName = String(name ?? "").trim().toLowerCase();
  const qType = String(type ?? "").trim().toLowerCase();

  let results = menuFood.slice();
  if (qName) {
    results = results.filter((f) => f.name.toLowerCase().includes(qName));
  }
  if (qType) {
    results = results.filter((f) => f.type === qType);
  }
  return results;
}

function sortFoodType(type) {
  const t = String(type ?? "").trim().toLowerCase();
  if (!t) return [];
  return menuFood.filter((food) => food.type === t);
}

function promptType() {
  const raw = prompt(
    "Chọn loại món:\n1. món khai vị\n2. món chính\n3. món tráng miệng\n",
  );
  if (raw === null) return null;
  const s = String(raw).trim();
  if (s === "1") return "món khai vị";
  if (s === "2") return "món chính";
  if (s === "3") return "món tráng miệng";
  return s.toLowerCase();
}

function runMenu() {
  while (true) {
    const choice = prompt(
      "QUẢN LÝ MENU MÓN ĂN\n" +
        "1. Thêm món ăn\n" +
        "2. Xóa món ăn\n" +
        "3. Hiển thị menu\n" +
        "4. Cập nhật món\n" +
        "5. Tìm kiếm\n" +
        "6. Lọc theo loại món\n" +
        "0. Thoát\n\n" +
        "Nhập lựa chọn của bạn:",
    );

    if (choice === null) return "Đã thoát.";
    const c = String(choice).trim();

    if (c === "0") return "Đã thoát.";

    if (c === "1") {
      const id = prompt("Nhập ID (số nguyên dương):");
      if (id === null) continue;
      const name = prompt("Nhập tên món ăn:");
      if (name === null) continue;
      const price = prompt("Nhập giá:");
      if (price === null) continue;
      const type = promptType();
      if (type === null) continue;

      const msg = addFood(id, name, price, type);
      alert(msg);
      continue;
    }

    if (c === "2") {
      const name = prompt("Nhập tên món cần xóa:");
      if (name === null) continue;
      alert(deleteFood(name));
      continue;
    }

    if (c === "3") {
      showFoodMenu();
      continue;
    }

    if (c === "4") {
      const name = prompt("Nhập tên món cần cập nhật:");
      if (name === null) continue;
      const price = prompt("Nhập giá mới:");
      if (price === null) continue;
      const type = promptType();
      if (type === null) continue;
      alert(updateFood(name, price, type));
      continue;
    }

    if (c === "5") {
      const name = prompt("Nhập tên cần tìm (có thể để trống):");
      if (name === null) continue;
      const type = promptType();
      if (type === null) continue;
      const results = searchFood(name, type);
      console.log("KẾT QUẢ TÌM KIẾM :", formatFoodList(results));
      alert("Đã in kết quả tìm kiếm  ra console.");
      continue;
    }

    if (c === "6") {
      const type = promptType();
      if (type === null) continue;
      const results = sortFoodType(type);
      console.log("DANH SÁCH THEO LOẠI :", formatFoodList(results));
      alert("Đã in danh sách theo loại  ra console.");
      continue;
    }

    alert("Lựa chọn không hợp lệ. Vui lòng nhập lại.");
  }
}

addFood();
