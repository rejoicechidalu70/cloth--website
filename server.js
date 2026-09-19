const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;
const dataDir = path.join(__dirname, "data");
const ordersFile = path.join(dataDir, "orders.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname)));

// Ensure data directory exists
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir);
}

if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, JSON.stringify([]));
}

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "login.html"));
});

app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ success: false, message: "Email and password are required." });
  }
  if (password.length < 6) {
    return res.status(400).json({ success: false, message: "Password must be at least 6 characters." });
  }
  return res.json({ success: true, message: "Login successful.", user: { email } });
});

app.post("/api/checkout", (req, res) => {
  const { customer, items, total } = req.body;
  if (!customer || !items || !Array.isArray(items) || items.length === 0 || !total) {
    return res.status(400).json({ success: false, message: "Missing checkout data." });
  }
  const orders = JSON.parse(fs.readFileSync(ordersFile));
  const order = {
    id: orders.length + 1,
    orderNumber: `ORD-${Date.now()}`,
    customer,
    items,
    total,
    createdAt: new Date().toISOString(),
  };
  orders.push(order);
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  res.json({ success: true, order });
});

app.get("/api/orders", (req, res) => {
  const orders = JSON.parse(fs.readFileSync(ordersFile));
  res.json({ success: true, orders });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
