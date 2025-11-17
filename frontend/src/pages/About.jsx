import React, { useEffect, useState } from "react";
import { Box, Heading, Text, SimpleGrid, Image, Stack, Divider } from "@chakra-ui/react";
import axios from "axios";
import DOMPurify from "dompurify";

const About = () => {
  const [settings, setSettings] = useState(null);
  const base = process.env.REACT_APP_API_URL || "";
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(`${base}/settings`);
        setSettings(data?.settings || null);
      } catch (_) {}
    })();
  }, []);
  return (
    <Box width="min(80rem,100%)" mx="auto" px={4} py={10}>
      <Heading size={{ lg: "xl", md: "lg", base: "md" }} mb={4}>
        {settings?.about?.title || "Acerca de CocktailMatch"}
      </Heading>
      <Text color="gray.700" mb={6} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(settings?.about?.content || `CocktailMatch es una plataforma para descubrir, crear y compartir cócteles. Reúne recetas de bartenders y aficionados, integra técnicas de mixología moderna y te guía paso a paso para preparar bebidas increíbles.`) }} />

      <Divider my={6} />
      <Heading size="md" mb={3}>¿Qué es la mixología?</Heading>
      <Text color="gray.700" mb={4}>
        La mixología es el arte y la ciencia de combinar destilados, modificadores y 
        aromáticos para crear perfiles de sabor balanceados. Incluye métodos de preparación 
        como agitado, mezclado, batido, licuado y infusionado, además de técnicas de 
        decoración y servicio.
      </Text>

      <SimpleGrid columns={{ lg: 3, md: 2, base: 1 }} spacing={6} mb={8}>
        <Stack borderRadius="lg" boxShadow="sm" p={4} bg="white">
          <Heading size="sm">Ingredientes base</Heading>
          <Text color="gray.700">
            Destilados (ron, ginebra, vodka, tequila, whisky) combinados con cítricos, siropes,
            bitters y licores aromáticos.
          </Text>
        </Stack>
        <Stack borderRadius="lg" boxShadow="sm" p={4} bg="white">
          <Heading size="sm">Métodos</Heading>
          <Text color="gray.700">Agitado, mezclado, directo al vaso, batido, macerado e infusionado.</Text>
        </Stack>
        <Stack borderRadius="lg" boxShadow="sm" p={4} bg="white">
          <Heading size="sm">Balance</Heading>
          <Text color="gray.700">Equilibrio entre dulce, ácido, amargo y aromático para un resultado armonioso.</Text>
        </Stack>
      </SimpleGrid>

      <Divider my={6} />
      <Heading size="md" mb={3}>Sobre la plataforma</Heading>
      <Text color="gray.700" mb={6}>
        - Explora miles de recetas y filtra por categoría, popularidad o novedades.
        <br />- Añade tus propios cócteles con imágenes, ingredientes y pasos.
        <br />- Usa la búsqueda por ingredientes para encontrar recetas con lo que tienes a mano.
        <br />- Prueba el modo guiado de preparación con temporizador.
      </Text>

      <Image src={settings?.about?.image ? `${base}/${settings.about.image}` : "/images/loginImage.jpg"} alt="Mixología" borderRadius="lg" />
    </Box>
  );
};

export default About;
