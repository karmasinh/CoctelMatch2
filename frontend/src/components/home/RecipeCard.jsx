import React from "react";
import { Box, Image, Text, Flex, Center, Button, HStack, Tag } from "@chakra-ui/react";
import { StarIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";

const StarRating = ({ rating }) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <StarIcon mx={0.5} key={i} color={i <= rating ? "accent" : "gray.300"} />
    );
  }

  return <Flex>{stars}</Flex>;
};

export const RecipeCard = ({ img, title, recipeId, likesCount }) => {
  const navigate = useNavigate();
  return (
    <Box
      borderWidth="1px"
      transition="0.2s ease-in"
      borderRadius="lg"
      overflow="hidden"
      shadow="md"
      _hover={{ transform: "scale(1.02)" }}
    >
      <Image
        w={"100%"}
        objectFit={"cover"}
        maxH={{ lg: "300px", md: "225px", base: "150px" }}
        src={img}
        alt="Imagen de cóctel"
      />
      <Box p={4}>
        {title && (
          <Text fontSize={{ lg: "lg", md: "md", base: "sm" }} fontWeight="bold" mb={2}>
            {title}
          </Text>
        )}
        <Text fontSize={{ lg: "md", md: "sm", base: "xs" }} mb={"1rem"}>
          Mezclas únicas y sabores inigualables. Descubre nuevos cócteles y aprende técnicas modernas.
        </Text>
        <Center my="2">
          <StarRating rating={Math.floor(Math.random() * (5 - 3 + 1)) + 3} />
        </Center>
        {typeof likesCount === "number" && (
          <Center mb={2}>
            <HStack spacing={2}>
              <Tag size="sm" colorScheme="pink">{likesCount} likes</Tag>
            </HStack>
          </Center>
        )}
        {recipeId && (
          <Center>
            <Button size="sm" variant="outline" onClick={() => navigate(`/recipe/${recipeId}`)}>
              Ver detalle
            </Button>
          </Center>
        )}
      </Box>
    </Box>
  );
};
