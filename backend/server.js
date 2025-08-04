require("dotenv").config();
const app = require("./src/app");
const sequelize = require("./src/config/database");
const client = require("prom-client");
const PORT = process.env.PORT || 3001;
client.collectDefaultMetrics();

// Ví dụ số liệu tùy chỉnh: đếm số lượng yêu cầu HTTP
const httpRequestsTotal = new client.Counter({
  name: 'http_requests_total',
  help: 'Tổng số yêu cầu HTTP',
  labelNames: ['method', 'route', 'status']
});
const cors = require('cors');
app.use(cors());
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });


// Endpoint cho Prometheus
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});
// Test database connection and sync models
const startServer = async () => {
  try {
    console.log("Starting server...");

    // Test database connection
    try {
      await sequelize.authenticate();
      console.log("Database connection established successfully.");

      // Sync database models (create tables if they don't exist)
      await sequelize.sync({ alter: true });
      console.log("Database models synchronized.");
    } catch (dbError) {
      console.warn(
        "Database connection failed, but server will continue:",
        dbError.message,
      );
      console.log("Server will run without database functionality");
    }

    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(`Health check: http://localhost:${PORT}/health`);
      console.log(`API Base URL: http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error("Unable to start server:", error);
    process.exit(1);
  }
};

startServer();
