//* Server Entry File
require("dotenv").config();

const cors = require("cors");
const express = require("express");
const app = express();

const connection = require("./connection");
const authRoutes = require("./routes/auth.routes");
const recipeRoutes = require("./routes/recipe.routes");
const userRoutes = require("./routes/user.routes");
const commentRoutes = require("./routes/comment.routes");
const notiRoutes = require("./routes/notifications.routes");
const ingredientRoutes = require("./routes/ingredients.routes");
const bcrypt = require("bcrypt");
const User = require("./models/User.model");

// // Middlewares
const upload = require("./middlewares/upload.middleware");
const chatRouter = require("./routes/chat.routes");

app.use(cors());
app.use(express.json());
app.use("/images", express.static("images"));

//* ROUTES
app.post("/upload", upload.array("file", 5), (req, res) => {
  try {
    const files = (req.files || []).map((f) => f.path);
    res.status(200).json({ message: "File upload successful", files });
  } catch (err) {
    console.error("Upload error", err);
    res.status(500).json({ message: "Upload failed" });
  }
});

app.use("/auth", authRoutes);
app.use("/recipe", recipeRoutes);
app.use("/users", userRoutes);
app.use("/comment", commentRoutes);
app.use("/notification", notiRoutes);
app.use("/chat", chatRouter);
app.use("/ingredients", ingredientRoutes);

async function ensureAdminUser() {
  const email = process.env.ADMIN_EMAIL || "admin@coctelmatch.com";
  const password = process.env.ADMIN_PASSWORD || "admin1234";
  try {
    const existing = await User.findOne({ email });
    if (existing) {
      if (existing.role !== "admin") {
        existing.role = "admin";
        await existing.save();
        console.log("Admin role granted to existing user:", email);
      }
      return;
    }
    const hash = await bcrypt.hash(password, 8);
    const admin = new User({
      name: "Administrador",
      email,
      password: hash,
      role: "admin",
      city: "",
      gender: "",
      bio: "",
      recipes: [],
      savedRecipes: [],
      likedRecipes: [],
    });
    await admin.save();
    console.log("Admin user created:", email);
  } catch (err) {
    console.error("Failed to ensure admin user:", err?.message || err);
  }
}

app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("Successfully connected To Database");
    console.log("Server running at port :", process.env.PORT);
    await ensureAdminUser();
  } catch (err) {
    console.log(err);
  }
});
