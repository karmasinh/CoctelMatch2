const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const ingredientController = require("../controllers/ingredient.controller");
const { requireAdmin } = require("../middlewares/rbac.middleware");

// Protect all ingredient endpoints
router.use(auth);

// GET /ingredients
router.get("/", ingredientController.getIngredients);

// GET /ingredients/all
router.get("/all", requireAdmin, ingredientController.getIngredientDocs);

// POST /ingredients
router.post("/", requireAdmin, ingredientController.addIngredient);

// PATCH /ingredients/:id
router.patch("/:id", requireAdmin, ingredientController.updateIngredient);

// DELETE /ingredients/:id
router.delete("/:id", requireAdmin, ingredientController.deleteIngredient);

module.exports = router;