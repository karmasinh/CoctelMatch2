const mongoose = require("mongoose");

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
  },
  { versionKey: false }
);

ingredientSchema.index({ name: 1 }, { unique: true });

const Ingredient = mongoose.model("Ingredient", ingredientSchema);

module.exports = Ingredient;