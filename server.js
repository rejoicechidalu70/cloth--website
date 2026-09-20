const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3000;

const isVercel = !!process.env.VERCEL;
const dataDir = isVercel ? path.join("/tmp", "data") : path.join(__dirname, "data");
const ordersFile = path.join(dataDir, "orders.json");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

try {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
  if (!fs.existsSync(ordersFile)) fs.writeFileSync(ordersFile, JSON.stringify([]));
} catch(e) {}

app.get("/", (req,res) => res.sendFile(path.join(__dirname,"index.html")));
app.get("/login", (req,res) => res.sendFile(path.join(__dirname,"login.html")));

app.post("/api/login", (req,res)=>{
  const {email,password}=req.body;
  if(!email||!password) return res.status(400).json({success:false,message:"Email and password required"});
  return res.json({success:true,message:"Login successful"});
});

app.post("/api/checkout",(req,res)=>{
  const {customer,items,total}=req.body;
  let orders=[];
  if(fs.existsSync(ordersFile)) orders=JSON.parse(fs.readFileSync(ordersFile));
  const order={id:orders.length+1,orderNumber:`ORD-${Date.now()}`,customer,items,total,createdAt:new Date().toISOString()};
  orders.push(order);
  try{fs.writeFileSync(ordersFile,JSON.stringify(orders,null,2))}catch(e){}
  res.json({success:true,order});
});

app.get("/api/orders",(req,res)=>{
  try{
    if(!fs.existsSync(ordersFile)) return res.json({success:true,orders:[]});
    const orders=JSON.parse(fs.readFileSync(ordersFile));
    res.json({success:true,orders});
  }catch(e){res.json({success:true,orders:[]})}
});

if(!process.env.VERCEL){
  app.listen(PORT,()=>console.log(`Server running on http://localhost:${PORT}`));
}

module.exports = app;