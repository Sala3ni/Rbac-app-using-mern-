require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const { seedDefaultData } = require("./utils/seedData");

const authRoutes = require("./routes/authRoutes");
const permissionRoutes = require("./routes/permissionRoutes");
const roleRoutes = require("./routes/roleRoutes");
const userRoutes = require("./routes/userRoutes");
const nlRoutes = require("./routes/nlRoutes");

const app = express();
app.use(cors());
app.use(express.json());

// base api path matches frontend's /api
app.use("/api/auth", authRoutes);
app.use("/api/permissions", permissionRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/nl", nlRoutes);

// health
app.get("/", (req, res) => res.send("RBAC backend is running"));

const PORT = process.env.PORT || 5000;
connectDB(process.env.MONGO_URI)
  .then(async () => {
    await seedDefaultData();
    app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
  })
  .catch(err => {
    console.error("Failed to start server:", err);
  });
