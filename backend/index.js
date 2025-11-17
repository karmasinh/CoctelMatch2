//* Server Entry File
require("dotenv").config();

const cors = require("cors");
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");

const connection = require("./connection");
const authRoutes = require("./routes/auth.routes");
const recipeRoutes = require("./routes/recipe.routes");
const userRoutes = require("./routes/user.routes");
const commentRoutes = require("./routes/comment.routes");
const notiRoutes = require("./routes/notifications.routes");
const ingredientRoutes = require("./routes/ingredients.routes");
const settingsRoutes = require("./routes/settings.routes");
const bcrypt = require("bcrypt");
const User = require("./models/User.model");

// // Middlewares
const upload = require("./middlewares/upload.middleware");
const chatRouter = require("./routes/chat.routes");

app.use(cors({ origin: process.env.FRONTEND_ORIGIN || true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
}));

const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(globalLimiter);
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

// CSRF Protection (use cookies)
const csrfProtection = csurf({ cookie: true });
app.get("/csrf-token", csrfProtection, (req, res) => {
  res.status(200).json({ csrfToken: req.csrfToken() });
});

// Protect state-changing routes with CSRF unless JWT Authorization is present
app.use(["/recipe", "/users", "/comment", "/notification", "/ingredients", "/settings"], (req, res, next) => {
  if (["POST", "PATCH", "PUT", "DELETE"].includes(req.method)) {
    const hasAuth = !!req.headers.authorization;
    if (hasAuth) return next();
    return csrfProtection(req, res, next);
  }
  next();
});

app.use("/auth", authRoutes);
app.use("/recipe", recipeRoutes);
app.use("/users", userRoutes);
app.use("/comment", commentRoutes);
app.use("/notification", notiRoutes);
app.use("/chat", chatRouter);
app.use("/ingredients", ingredientRoutes);
app.use("/settings", settingsRoutes);

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

const PORT = Number(process.env.PORT) || 5000;
server.listen(PORT, async () => {
  try {
    await connection;
    console.log("Successfully connected To Database");
    console.log("Server running at port :", PORT);
    await ensureAdminUser();
  } catch (err) {
    console.log(err);
  }
});

process.on("SIGINT", () => {
  server.close(() => {
    process.exit(0);
  });
});

process.on("SIGTERM", () => {
  server.close(() => {
    process.exit(0);
  });
});
