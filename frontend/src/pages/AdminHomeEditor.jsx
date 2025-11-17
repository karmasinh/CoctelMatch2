import React, { useEffect, useState } from "react";
import { Box, Heading, Text, Input, Textarea, Button, Flex, Divider, SimpleGrid, Spinner, Center, Select, useToast } from "@chakra-ui/react";
import axios from "axios";
import DOMPurify from "dompurify";
import { z } from "zod";

const AdminHomeEditor = () => {
  const toast = useToast();
  const base = process.env.REACT_APP_API_URL || "";
  const token = localStorage.getItem("token") || "";

  const [loading, setLoading] = useState(false);
  const [heroTitle, setHeroTitle] = useState("");
  const [heroSubtitle, setHeroSubtitle] = useState("");
  const [heroImage, setHeroImage] = useState("");
  const [heroTitleColor, setHeroTitleColor] = useState("#000000");
  const [heroSubtitleColor, setHeroSubtitleColor] = useState("#333333");
  const [heroTitleSize, setHeroTitleSize] = useState("3rem");
  const [heroSubtitleSize, setHeroSubtitleSize] = useState("1rem");

  const [popularTitle, setPopularTitle] = useState("");
  const [popularSubtitle, setPopularSubtitle] = useState("");

  const [aboutSections, setAboutSections] = useState([]);
  const [aboutTitle, setAboutTitle] = useState("");
  const [aboutContent, setAboutContent] = useState("");
  const [aboutImage, setAboutImage] = useState("");

  const [contactTitle, setContactTitle] = useState("");
  const [contactContent, setContactContent] = useState("");
  const [contactImage, setContactImage] = useState("");

  const SettingsSchema = z.object({
    home: z.object({
      heroTitle: z.string().min(3),
      heroSubtitle: z.string().min(3),
      bannerImage: z.string().optional(),
      popularTitle: z.string().min(3),
      popularSubtitle: z.string().min(3),
      heroTitleColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
      heroSubtitleColor: z.string().regex(/^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/),
      heroTitleSize: z.string(),
      heroSubtitleSize: z.string(),
    }),
    about: z.object({ title: z.string().min(3), content: z.string().min(3), image: z.string().optional() }),
    aboutSections: z.array(z.object({ title: z.string().min(1), image: z.string().optional(), link: z.string().min(1), description: z.string().optional() })),
    contact: z.object({ title: z.string().min(3), content: z.string().min(3), image: z.string().optional() }),
  });

  const addAboutSection = () => {
    setAboutSections((prev) => [...prev, { title: "", image: "", link: "/about", description: "" }]);
  };

  const updateSection = (idx, key, value) => {
    setAboutSections((prev) => prev.map((s, i) => (i === idx ? { ...s, [key]: value } : s)));
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`${base}/settings`);
        const s = data?.settings;
        if (s?.home) {
          setHeroTitle(s.home.heroTitle || "");
          setHeroSubtitle(s.home.heroSubtitle || "");
          setHeroImage(s.home.bannerImage || "");
          setPopularTitle(s.home.popularTitle || "");
          setPopularSubtitle(s.home.popularSubtitle || "");
          setHeroTitleColor(s.home.heroTitleColor || "#000000");
          setHeroSubtitleColor(s.home.heroSubtitleColor || "#333333");
          setHeroTitleSize(s.home.heroTitleSize || "3rem");
          setHeroSubtitleSize(s.home.heroSubtitleSize || "1rem");
        }
        if (s?.about) {
          setAboutTitle(s.about.title || "");
          setAboutContent(s.about.content || "");
          setAboutImage(s.about.image || "");
        }
        if (Array.isArray(s?.aboutSections)) setAboutSections(s.aboutSections);
        if (s?.contact) {
          setContactTitle(s.contact.title || "");
          setContactContent(s.contact.content || "");
          setContactImage(s.contact.image || "");
        }
      } catch (_) {
      } finally {
        setLoading(false);
      }
    };
    loadSettings();
  }, []);

  const handleSave = async () => {
    try {
      const payload = {
        home: {
          heroTitle: DOMPurify.sanitize(heroTitle),
          heroSubtitle: DOMPurify.sanitize(heroSubtitle),
          bannerImage: heroImage,
          popularTitle: DOMPurify.sanitize(popularTitle),
          popularSubtitle: DOMPurify.sanitize(popularSubtitle),
          heroTitleColor,
          heroSubtitleColor,
          heroTitleSize,
          heroSubtitleSize,
        },
        about: {
          title: DOMPurify.sanitize(aboutTitle),
          content: DOMPurify.sanitize(aboutContent),
          image: aboutImage,
        },
        aboutSections: aboutSections.map((s) => ({
          title: DOMPurify.sanitize(s.title || ""),
          image: s.image || "",
          link: s.link || "/about",
          description: DOMPurify.sanitize(s.description || ""),
        })),
        contact: {
          title: DOMPurify.sanitize(contactTitle),
          content: DOMPurify.sanitize(contactContent),
          image: contactImage,
        },
      };

      SettingsSchema.parse(payload);

      const { data: csrf } = await axios.get(`${base}/csrf-token`, { withCredentials: true });
      const csrfToken = csrf?.csrfToken || "";

      await axios.patch(`${base}/settings`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          "X-CSRF-Token": csrfToken,
        },
        withCredentials: true,
      });
      toast({ title: "Configuración guardada", status: "success", duration: 3000 });
    } catch (err) {
      toast({ title: "Error al guardar", status: "error", duration: 4000 });
    }
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Editor de la página de inicio</Heading>
      <Text color="gray.600" mb={6}>Configura textos, imágenes, estilos y secciones principales.</Text>
      {loading && (
        <Center my={4}><Spinner /></Center>
      )}

      <Heading size="md" mb={3}>Hero</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
        <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="Título principal" />
        <Input value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} placeholder="Subtítulo" />
        <Input value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="URL de imagen de fondo" />
        <Input type="color" value={heroTitleColor} onChange={(e) => setHeroTitleColor(e.target.value)} placeholder="Color título" />
        <Input type="color" value={heroSubtitleColor} onChange={(e) => setHeroSubtitleColor(e.target.value)} placeholder="Color subtítulo" />
        <Select value={heroTitleSize} onChange={(e) => setHeroTitleSize(e.target.value)}>
          <option value="2rem">2rem</option>
          <option value="2.5rem">2.5rem</option>
          <option value="3rem">3rem</option>
          <option value="3.5rem">3.5rem</option>
        </Select>
        <Select value={heroSubtitleSize} onChange={(e) => setHeroSubtitleSize(e.target.value)}>
          <option value="0.9rem">0.9rem</option>
          <option value="1rem">1rem</option>
          <option value="1.25rem">1.25rem</option>
          <option value="1.5rem">1.5rem</option>
        </Select>
      </SimpleGrid>

      <Divider my={6} />

      <Heading size="md" mb={3}>Sección populares</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
        <Input value={popularTitle} onChange={(e) => setPopularTitle(e.target.value)} placeholder="Título de populares" />
        <Textarea value={popularSubtitle} onChange={(e) => setPopularSubtitle(e.target.value)} placeholder="Descripción de populares" />
      </SimpleGrid>

      <Divider my={6} />

      <Heading size="md" mb={3}>Secciones "Acerca de"</Heading>
      {aboutSections.map((s, idx) => (
        <Box key={idx} borderWidth="1px" borderRadius="md" p={4} mb={3}>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4}>
            <Input value={s.title} onChange={(e) => updateSection(idx, "title", e.target.value)} placeholder="Título" />
            <Input value={s.image} onChange={(e) => updateSection(idx, "image", e.target.value)} placeholder="URL de imagen" />
            <Input value={s.link} onChange={(e) => updateSection(idx, "link", e.target.value)} placeholder="Ruta de enlace (e.g., /about)" />
            <Textarea value={s.description} onChange={(e) => updateSection(idx, "description", e.target.value)} placeholder="Descripción" />
          </SimpleGrid>
        </Box>
      ))}
      <Button variant="outline" onClick={addAboutSection} mb={4}>Añadir sección</Button>

      <Divider my={6} />
      <Heading size="md" mb={3}>Página "Acerca de"</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
        <Input value={aboutTitle} onChange={(e) => setAboutTitle(e.target.value)} placeholder="Título acerca de" />
        <Input value={aboutImage} onChange={(e) => setAboutImage(e.target.value)} placeholder="URL de imagen" />
        <Textarea value={aboutContent} onChange={(e) => setAboutContent(e.target.value)} placeholder="Contenido" />
      </SimpleGrid>

      <Divider my={6} />
      <Heading size="md" mb={3}>Página "Contacto"</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
        <Input value={contactTitle} onChange={(e) => setContactTitle(e.target.value)} placeholder="Título contacto" />
        <Input value={contactImage} onChange={(e) => setContactImage(e.target.value)} placeholder="URL de imagen" />
        <Textarea value={contactContent} onChange={(e) => setContactContent(e.target.value)} placeholder="Contenido" />
      </SimpleGrid>

      <Flex gap={3}>
        <Button onClick={handleSave}>Guardar</Button>
        <Button variant="outline">Descartar</Button>
      </Flex>
    </Box>
  );
};

export default AdminHomeEditor;
