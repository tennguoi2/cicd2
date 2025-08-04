const { Sequelize } = require("sequelize");

const PORT = process.env.PORT || 3333;

// Cấu hình Sequelize với biến môi trường
const sequelize = new Sequelize(
  process.env.DB_NAME || "todo_app", // Tên database từ biến môi trường
  process.env.DB_USER || "root",     // Username từ biến môi trường
  process.env.DB_PASSWORD || "minh152005minh", // Mật khẩu từ biến môi trường
  {
    host: process.env.DB_HOST , // Dùng tên dịch vụ MySQL trong Docker Compose
    port: process.env.DB_PORT || 3306,
    dialect: "mysql",
    logging: console.log, // Hiện log truy vấn (có thể tắt bằng cách đặt false)
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    define: {
      timestamps: true,
      underscored: false,
      createdAt: "created_at",
      updatedAt: "updated_at",
    },
  }
);

// Kiểm tra kết nối
sequelize
  .authenticate()
  .then(() => {
    console.log("✅ Kết nối DB thành công!");
  })
  .catch((err) => {
    console.error("❌ Lỗi kết nối DB:", err.message);
    // Tiếp tục chạy server dù kết nối DB thất bại
  });

module.exports = sequelize;

module.exports = sequelize;
