import mysql from "mysql2/promise";

if (process.env.NODE_ENV !== "development") {
  throw new Error("The development seed is disabled outside NODE_ENV=development.");
}
if (!process.env.DATABASE_URL || !process.env.OWNER_OPEN_ID) {
  throw new Error("DATABASE_URL and OWNER_OPEN_ID are required for development seed data.");
}

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const [users] = await connection.execute("SELECT id FROM users WHERE openId = ? LIMIT 1", [process.env.OWNER_OPEN_ID]);
if (!users.length) throw new Error("Sign in once before running the development seed so an owner user exists.");
const userId = users[0].id;

const [memberRows] = await connection.execute(
  "SELECT workspaceId FROM memberships WHERE userId = ? AND isActive = true LIMIT 1",
  [userId],
);
if (!memberRows.length) throw new Error("Create a workspace through the app before running the development seed.");
const workspaceId = memberRows[0].workspaceId;

await connection.execute(
  "INSERT INTO agents (workspaceId, name, purpose, status, createdById) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE purpose = VALUES(purpose), status = VALUES(status)",
  [workspaceId, "Development Analyst", "Produces non-production development analysis from seeded metrics.", "idle", userId],
);
await connection.execute(
  "INSERT INTO data_sources (workspaceId, name, type, status, createdById) VALUES (?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE status = VALUES(status)",
  [workspaceId, "Development Metrics", "Development fixture", "connected", userId],
);

const metricDate = new Date();
metricDate.setUTCHours(0, 0, 0, 0);
const metricTimestamp = metricDate.toISOString().slice(0, 19).replace("T", " ");
for (const [metricKey, value] of [["revenue", 125000], ["mrr", 10500], ["nrr", 112], ["cac", 3200], ["acv", 42000]]) {
  await connection.execute(
    "INSERT INTO business_metrics (workspaceId, metricDate, metricKey, segment, metricValue) VALUES (?, ?, ?, 'all', ?) ON DUPLICATE KEY UPDATE metricValue = VALUES(metricValue)",
    [workspaceId, metricTimestamp, metricKey, value],
  );
}
await connection.end();
console.log("Development seed completed for the owner workspace.");
