const mongoose = require("mongoose");

const NavbarSettingsSchema = new mongoose.Schema({
  showExplore: { type: Boolean, default: true },
  showAccount: { type: Boolean, default: true },
  showAdmin: { type: Boolean, default: true },
  showAbout: { type: Boolean, default: true },
});

const HomeSettingsSchema = new mongoose.Schema({
  heroTitle: { type: String, default: "Descubre cócteles únicos" },
  heroSubtitle: { type: String, default: "Mezclas y técnicas modernas" },
  bannerImage: { type: String, default: "" },
  popularTitle: { type: String, default: "CÓCTELES MÁS POPULARES" },
  popularSubtitle: { type: String, default: "Descubre las mezclas favoritas de la comunidad y prueba nuevas recetas." },
  heroTitleColor: { type: String, default: "#000000" },
  heroSubtitleColor: { type: String, default: "#333333" },
  heroTitleSize: { type: String, default: "3rem" },
  heroSubtitleSize: { type: String, default: "1rem" },
});

const AboutSettingsSchema = new mongoose.Schema({
  title: { type: String, default: "Sobre Nosotros" },
  content: { type: String, default: "Somos apasionados por la mixología." },
  image: { type: String, default: "" },
});

const AboutSectionSchema = new mongoose.Schema({
  title: { type: String, default: "" },
  image: { type: String, default: "" },
  link: { type: String, default: "/about" },
  description: { type: String, default: "" },
});

const ContactSettingsSchema = new mongoose.Schema({
  title: { type: String, default: "Contacto" },
  content: { type: String, default: "Contáctanos para colaborar o resolver dudas." },
  image: { type: String, default: "" },
});

const SettingsSchema = new mongoose.Schema(
  {
    home: { type: HomeSettingsSchema, default: () => ({}) },
    about: { type: AboutSettingsSchema, default: () => ({}) },
    aboutSections: { type: [AboutSectionSchema], default: () => [] },
    contact: { type: ContactSettingsSchema, default: () => ({}) },
    navbar: { type: NavbarSettingsSchema, default: () => ({}) },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Settings", SettingsSchema);
