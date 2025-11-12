const Recipe = require("../models/Recipe.model");
const Ingredient = require("../models/Ingredient.model");

// GET /ingredients?search=...
// Returns a unique, sorted list of ingredient names gathered from existing recipes.
exports.getIngredients = async (req, res) => {
  try {
    const { search = "" } = req.query;

    // Prefer persisted collection; fallback to dedup from recipes if empty
    const q = search.trim().toLowerCase();
    let list = [];

    const persisted = await Ingredient.find(
      q ? { name: { $regex: q, $options: "i" } } : {}
    ).sort({ name: 1 });

    if (persisted && persisted.length > 0) {
      list = persisted.map((i) => i.name);
    } else {
      // Only project the ingredients field to minimize payload
      const recipes = await Recipe.find({}, { ingredients: 1, _id: 0 });
      const unique = new Set();
      for (const r of recipes) {
        const arr = Array.isArray(r.ingredients) ? r.ingredients : [];
        for (const item of arr) {
          if (typeof item === "string") {
            const name = item.trim();
            if (name) unique.add(name);
          }
        }
      }
      list = Array.from(unique)
        .filter((n) => (q ? n.toLowerCase().includes(q) : true))
        .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
    }

    return res.status(200).json({ ingredients: list });
  } catch (error) {
    console.error("Failed to fetch ingredients", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch ingredients", error: error.message });
  }
};

// GET /ingredients/all?search=...
// Returns full ingredient documents (id + name) for admin/management UIs.
exports.getIngredientDocs = async (req, res) => {
  try {
    const { search = "" } = req.query;
    const q = search.trim();
    const filter = q ? { name: { $regex: q, $options: "i" } } : {};
    const docs = await Ingredient.find(filter).sort({ name: 1 }).select({ name: 1 });
    return res.status(200).json({ ingredients: docs });
  } catch (error) {
    console.error("Failed to fetch ingredient docs", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch ingredient docs", error: error.message });
  }
};

// POST /ingredients
exports.addIngredient = async (req, res) => {
  try {
    const name = (req.body?.name || "").trim();
    if (!name) return res.status(400).json({ message: "Name is required" });

    const created = await Ingredient.create({ name });
    return res.status(201).json({ message: "Ingredient created", ingredient: created });
  } catch (error) {
    if (error?.code === 11000) {
      return res.status(409).json({ message: "Ingredient already exists" });
    }
    console.error("Failed to add ingredient", error);
    return res.status(500).json({ message: "Failed to add ingredient", error: error.message });
  }
};

// PATCH /ingredients/:id
exports.updateIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const name = (req.body?.name || "").trim();
    if (!name) return res.status(400).json({ message: "Name is required" });

    const updated = await Ingredient.findByIdAndUpdate(id, { name }, { new: true });
    if (!updated) return res.status(404).json({ message: "Ingredient not found" });
    return res.status(200).json({ message: "Ingredient updated", ingredient: updated });
  } catch (error) {
    console.error("Failed to update ingredient", error);
    return res.status(500).json({ message: "Failed to update ingredient", error: error.message });
  }
};

// DELETE /ingredients/:id
exports.deleteIngredient = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Ingredient.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Ingredient not found" });
    return res.status(200).json({ message: "Ingredient deleted" });
  } catch (error) {
    console.error("Failed to delete ingredient", error);
    return res.status(500).json({ message: "Failed to delete ingredient", error: error.message });
  }
};