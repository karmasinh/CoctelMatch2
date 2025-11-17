const Settings = require("../models/Settings.model");

async function getSettings(req, res) {
  try {
    let doc = await Settings.findOne();
    if (!doc) {
      doc = await Settings.create({});
    }
    res.status(200).json({ settings: doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to load settings", error: err?.message || err });
  }
}

async function updateSettings(req, res) {
  try {
    let doc = await Settings.findOne();
    if (!doc) {
      doc = await Settings.create({});
    }
    const { home, about, aboutSections, contact, navbar } = req.body || {};
    if (home) doc.home = { ...doc.home.toObject(), ...home };
    if (about) doc.about = { ...doc.about.toObject(), ...about };
    if (Array.isArray(aboutSections)) doc.aboutSections = aboutSections;
    if (contact) doc.contact = { ...doc.contact.toObject(), ...contact };
    if (navbar) doc.navbar = { ...doc.navbar.toObject(), ...navbar };
    await doc.save();
    res.status(200).json({ message: "Settings updated", settings: doc });
  } catch (err) {
    res.status(500).json({ message: "Failed to update settings", error: err?.message || err });
  }
}

module.exports = { getSettings, updateSettings };
