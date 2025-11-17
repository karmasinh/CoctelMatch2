import { Box, Heading, Text, Image } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";
import DOMPurify from "dompurify";

export const Contact = () => {
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
    <Box width="min(80rem,100%)" mx="auto" px={4} py={8} color="text">
      <Heading as="h1" size="lg" mb={4}>
        {settings?.contact?.title || "Contacto"}
      </Heading>
      <Text fontSize="md" dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(settings?.contact?.content || "Envíanos tus consultas y sugerencias. Próximamente agregaremos un formulario de contacto.") }} />
      {settings?.contact?.image && (
        <Image mt={4} src={`${base}/${settings.contact.image}`} alt="Contacto" borderRadius="lg" />
      )}
    </Box>
  );
};

export default Contact;
