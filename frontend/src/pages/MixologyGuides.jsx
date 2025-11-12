import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";

export const MixologyGuides = () => {
  return (
    <Box width="min(80rem,100%)" mx="auto" px={4} py={8} color="text">
      <Heading as="h1" size="lg" mb={4}>
        Guías de mixología
      </Heading>
      <Text fontSize="md">
        Aquí publicaremos artículos y guías prácticas sobre técnicas de
        coctelería, ingredientes y trucos de los bartenders. Próximamente.
      </Text>
    </Box>
  );
};

export default MixologyGuides;