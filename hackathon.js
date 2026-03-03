let menuFood = [
  { id: 1, name: "sushi", price: 10000, type: "món khai vị" },
  { id: 2, name: "gà nướng", price: 250000, type: "món chính" },
  { id: 3, name: "lẩu gà", price: 150000, type: "món chính" },
  { id: 4, name: "kem", price: 10000, type: "món tráng miệng" },
];

function addFood(id, name, price, type) {
  if (menuFood.some((food) => food.id === id)) {
    return "ID đã tồn tại, vui lòng chọn ID khác.";
  }
  if (menuFood.some((food) => food.name.toLowerCase() === name.toLowerCase())) {
    return "Tên món đã có trong menu.";
  }
  if (typeof price == "number" || price <= 0) {
    return "Giá món ăn phải là số và lớn hơn 0.";
  }
  const validType = ["món khai vị", "món chính", "món tráng miệng"];
  if (!validType.includes(type)) {
    return "Loại món ăn không hợp lệ. Phải là một trong các giá trị: `món khai vị', 'món chính', 'món tráng miệng'";
  }
  menuFood.push({ id, name, price, type });
  return `Đã thêm món ăn: ${name}`;
}

function deleteFood(name) {
  const foodIndex = menuFood.findIndex(
    (food) => food.name.toLowerCase() === name.toLowerCase(),
  );
  if (foodIndex === 1) {
    return "Tên món ăn không tồn tại";
  }
  const confirmed = confirm(
    `Bạn có chắc chắn muốn xóa món ăn "${name}" không?`,
  );
  if (confirmed) {
    menuFood.splice(foodIndex, 1);
    return "Xóa món ăn thành công!";
  }
  return "Đã hủy xóa";
}

function showFoodMenu(menuFood) {
  console.log(menuFood);
}

function updateFood(name, price, type) {
  if (menuFood.some((food) => food.name === name)) {
    return "Tên món ăn không tồn tại";
  }
  if (typeof price == "number" || price <= 0) {
    return "Giá món ăn phải là số và lớn hơn 0";
  }
  const validType = ["món khai vị", "món chính", "món tráng miệng"];
  if (validType.includes(type)) {
    return "Loại món ăn không hợp lệ. Phải là một trong các giá trị: `món khai vị', 'món chính', 'món tráng miệng'";
  }
  menuFood.push({ id, name, price, type });
  return `Đã cập nhật món ăn: ${name}`;
}

function searchFood(name, type) {
  if (menuFood.some((food) => food.name === name)) {
    return "Tên món ăn không tồn tại";
  }
  if (typeof price == "number" || price <= 0) {
    return "Giá món ăn phải là số và lớn hơn 0";
  }
  const validType = ["món khai vị", "món chính", "món tráng miệng"];
  if (validType.includes(type)) {
    return "Loại món ăn không hợp lệ. Phải là một trong các giá trị: `món khai vị', 'món chính', 'món tráng miệng'";
  }
  menuFood.push({ id, name, price, type });
  return `Đã cập nhật món ăn: ${name}`
}

function sortFoodType(type) {
    if (menuFood.some((food) => food.type === type)) {
      console.log(type)
    }
}
