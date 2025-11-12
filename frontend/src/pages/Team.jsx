import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";

export const Team = () => {
  return (
    <Box width="min(80rem,100%)" mx="auto" px={4} py={8} color="text">
      <Heading as="h1" size="lg" mb={4}>
        Equipo
      </Heading>
      <Text fontSize="md">
        Conoce al equipo detrás de CocktailMatch. Contenido en construcción.
      </Text>
    </Box>
  );
};

export default Team;