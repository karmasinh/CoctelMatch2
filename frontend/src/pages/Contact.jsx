import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";

export const Contact = () => {
  return (
    <Box width="min(80rem,100%)" mx="auto" px={4} py={8} color="text">
      <Heading as="h1" size="lg" mb={4}>
        Contacto
      </Heading>
      <Text fontSize="md">
        Envíanos tus consultas y sugerencias. Próximamente agregaremos un
        formulario de contacto.
      </Text>
    </Box>
  );
};

export default Contact;