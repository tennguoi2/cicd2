const mysql = require('mysql2');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

async function connectWithRetry() {
  let retries = 5;
  while (retries > 0) {
    try {
      const connection = mysql.createConnection({
        host: process.env.DB_HOST ,
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || 'minh152005minh',
        database: process.env.DB_NAME || 'todo_app',
      });

      connection.connect(err => {
        if (err) throw err;
        console.log("✅ Connected to MySQL!");
      });
      break;
    } catch (err) {
      console.error("❌ DB connection failed. Retrying in 3s...", err.message);
      retries--;
      await sleep(3000);
    }
  }

  if (retries === 0) {
    console.error("❌ Could not connect to DB after multiple attempts.");
    process.exit(1);
  }
}

connectWithRetry();
