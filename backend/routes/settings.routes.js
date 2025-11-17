const express = require("express");
const router = express.Router();
const { getSettings, updateSettings } = require("../controllers/settings.controller");
const { requireAdmin } = require("../middlewares/rbac.middleware");

// Public: anyone can read settings
router.get("/", getSettings);

// Admin-only: update settings
router.patch("/", requireAdmin, updateSettings);

module.exports = router;