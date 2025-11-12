import React, { useState } from "react";
import { Box, Heading, Text, Input, Textarea, Button, Flex, Divider, SimpleGrid } from "@chakra-ui/react";

const AdminHomeEditor = () => {
  const [heroTitle, setHeroTitle] = useState("Cócteles increíbles y la mezcla perfecta.");
  const [heroSubtitle, setHeroSubtitle] = useState("Explora miles de cócteles irresistibles");
  const [heroImage, setHeroImage] = useState("/images/loginImage.jpg");

  const [popularTitle, setPopularTitle] = useState("CÓCTELES MÁS POPULARES");
  const [popularSubtitle, setPopularSubtitle] = useState("Descubre las mezclas favoritas de la comunidad y prueba nuevas recetas.");

  const [aboutSections, setAboutSections] = useState([
    { title: "SALUDABLE Y DE CALIDAD CON UN NUEVO TOQUE", image: "/images/loginImage.jpg", link: "/about", description: "Texto descriptivo" },
    { title: "PRUEBA EL FUTURO DE LA MIXOLOGÍA", image: "/images/signupimage.jpg", link: "/about", description: "Texto descriptivo" },
  ]);

  const addAboutSection = () => {
    setAboutSections((prev) => [...prev, { title: "", image: "", link: "/about", description: "" }]);
  };

  const updateSection = (idx, key, value) => {
    setAboutSections((prev) => prev.map((s, i) => (i === idx ? { ...s, [key]: value } : s)));
  };

  const handleSave = () => {
    // TODO: Integrate with backend settings API
    console.log("Saving home settings", { heroTitle, heroSubtitle, heroImage, popularTitle, popularSubtitle, aboutSections });
  };

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>Editor de la página de inicio</Heading>
      <Text color="gray.600" mb={6}>Configura textos, imágenes y secciones principales. (Esqueleto; pendiente conexión a backend)</Text>

      <Heading size="md" mb={3}>Hero</Heading>
      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
        <Input value={heroTitle} onChange={(e) => setHeroTitle(e.target.value)} placeholder="Título principal" />
        <Input value={heroSubtitle} onChange={(e) => setHeroSubtitle(e.target.value)} placeholder="Subtítulo" />
        <Input value={heroImage} onChange={(e) => setHeroImage(e.target.value)} placeholder="URL de imagen de fondo" />
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

      <Flex gap={3}>
        <Button onClick={handleSave}>Guardar</Button>
        <Button variant="outline">Descartar</Button>
      </Flex>
    </Box>
  );
};

export default AdminHomeEditor;