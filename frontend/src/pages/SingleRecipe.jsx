import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { Carousel } from "../components/Feed/SingleRecipeCarousel";
import { useParams } from "react-router-dom";
import { CheckIcon } from "@chakra-ui/icons";
import {
  Box,
  Checkbox,
  Flex,
  Heading,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  Tag,
  Text,
  SimpleGrid,
  List,
  ListItem,
  VStack,
  Divider,
  Avatar,
  Button,
  Input,
  Textarea,
  useDisclosure,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import { getUserDetailsForSingleRecipe } from "../redux/authReducer/actions";
import { getSingleRecipe } from "../redux/recipeReducer/actions";
import { updateRecipe } from "../redux/recipeReducer/actions";
import { updateUser } from "../redux/userReducer/actions";
import axios from "axios";

function SingleRecipe() {
  const { postId } = useParams();
  const [owner, setOwner] = useState({});
  const [recipe, setRecipe] = useState({});
  const dispatch = useDispatch();
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [editData, setEditData] = useState({
    title: "",
    description: "",
    tags: "",
    cuisine: "",
    veg: true,
    ingredientsText: "",
    instructionsText: "",
    time: "",
    caption: "",
  });
  const [editImages, setEditImages] = useState([]);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const token =
    useSelector((store) => store.authReducer.token) ||
    localStorage.getItem("token");
  const loggedInUser = useSelector((store) => store.authReducer.loggedInUser);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    axios
      .get(
        `${process.env.REACT_APP_API_URL}/recipe/getSingleRecipe/${postId}`,
        config
      )
      .then((res) => {
        // console.log(res.data)
        setRecipe(res?.data);
        setOwner(res.data.userId);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    setEditData({
      title: recipe?.title || "",
      description: recipe?.description || "",
      tags: Array.isArray(recipe?.tags) ? recipe.tags.join(", ") : "",
      cuisine: Array.isArray(recipe?.cuisine)
        ? recipe.cuisine[0] || ""
        : recipe?.cuisine || "",
      veg: !!recipe?.veg,
      ingredientsText: Array.isArray(recipe?.ingredients)
        ? recipe.ingredients.join("\n")
        : "",
      instructionsText: Array.isArray(recipe?.instructions)
        ? recipe.instructions.join("\n")
        : "",
      time: recipe?.time || "",
      caption: recipe?.caption || "",
    });
  }, [recipe]);

  // Inicializar estados de me gusta / guardado cuando tengamos recipe y loggedInUser
  useEffect(() => {
    if (recipe?._id && loggedInUser) {
      const hasLiked = Array.isArray(recipe.likes)
        ? recipe.likes.includes(loggedInUser._id)
        : false;
      const hasSaved = Array.isArray(loggedInUser.savedRecipes)
        ? loggedInUser.savedRecipes.includes(recipe._id)
        : false;
      setLiked(!!hasLiked);
      setSaved(!!hasSaved);
    }
  }, [recipe, loggedInUser]);

  console.log("Recipe", recipe);
  console.log("Owner", owner);

  if (!recipe.title) {
    return <h1>Cargando...</h1>;
  }

  const handleEditChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const payload = {
      title: editData.title.trim() || recipe.title,
      description: editData.description.trim() || recipe.description,
      tags: editData.tags
        ? editData.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean)
        : recipe.tags,
      cuisine: editData.cuisine
        ? [editData.cuisine.trim()]
        : recipe.cuisine,
      veg: !!editData.veg,
      ingredients: editData.ingredientsText
        ? editData.ingredientsText
            .split("\n")
            .map((t) => t.trim())
            .filter(Boolean)
        : recipe.ingredients,
      instructions: editData.instructionsText
        ? editData.instructionsText
            .split("\n")
            .map((t) => t.trim())
            .filter(Boolean)
        : recipe.instructions,
      time: editData.time || recipe.time,
      caption: editData.caption || recipe.caption,
    };

    // Si hay nuevas imágenes seleccionadas, subir antes de guardar
    if (editImages && editImages.length > 0) {
      try {
        const formData = new FormData();
        editImages.forEach((file) => formData.append("file", file));
        const uploadRes = await axios.post(
          `${process.env.REACT_APP_API_URL}/upload`,
          formData
        );
        const uploadedPaths = uploadRes?.data?.files || [];
        if (uploadedPaths.length > 0) {
          payload.images = uploadedPaths;
        }
      } catch (err) {
        console.error("Error subiendo imágenes", err);
      }
    }

    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_API_URL}/recipe/update/${recipe._id}`,
        payload,
        config
      );
      const updated = res?.data?.updatedRecipe || payload;
      setRecipe(updated);
      toast({ title: "Receta actualizada", status: "success" });
      onClose();
    } catch (error) {
      console.error(error);
      toast({
        title: "No se pudo actualizar la receta",
        status: "error",
      });
    }
  };

  const handleAddLike = () => {
    if (!liked && recipe?._id && loggedInUser?._id) {
      const newLikes = [...(recipe.likes || []), loggedInUser._id];
      const newLikedRecipes = Array.isArray(loggedInUser.likedRecipes)
        ? [...loggedInUser.likedRecipes]
        : [];
      if (!newLikedRecipes.includes(recipe._id)) newLikedRecipes.push(recipe._id);

      dispatch(updateRecipe(recipe._id, { likes: newLikes }, token, toast, "like"));
      dispatch(
        updateUser(
          loggedInUser._id,
          { likedRecipes: newLikedRecipes },
          token,
          toast,
          "like",
          recipe._id
        )
      );
      setLiked(true);
    }
  };

  const handleRemoveLike = () => {
    if (liked && recipe?._id && loggedInUser?._id) {
      const newLikes = (recipe.likes || []).filter((id) => id !== loggedInUser._id);
      const newLikedRecipes = (loggedInUser.likedRecipes || []).filter(
        (id) => id !== recipe._id
      );

      dispatch(updateRecipe(recipe._id, { likes: newLikes }, token, toast, "dislike"));
      dispatch(
        updateUser(
          loggedInUser._id,
          { likedRecipes: newLikedRecipes },
          token,
          toast,
          "dislike",
          recipe._id
        )
      );
      setLiked(false);
    }
  };

  const handleSaveRecipe = () => {
    if (!saved && recipe?._id && loggedInUser?._id) {
      const newSavedRecipes = Array.isArray(loggedInUser.savedRecipes)
        ? [...loggedInUser.savedRecipes, recipe._id]
        : [recipe._id];
      dispatch(
        updateUser(
          loggedInUser._id,
          { savedRecipes: newSavedRecipes },
          token,
          toast,
          "save",
          recipe._id
        )
      );
      setSaved(true);
    }
  };

  const handleUnsaveRecipe = () => {
    if (saved && recipe?._id && loggedInUser?._id) {
      const newSavedRecipes = (loggedInUser.savedRecipes || []).filter(
        (id) => id !== recipe._id
      );
      dispatch(
        updateUser(
          loggedInUser._id,
          { savedRecipes: newSavedRecipes },
          token,
          toast,
          "unsave",
          recipe._id
        )
      );
      setSaved(false);
    }
  };

  return (
    <>
      <DIV>
        <Flex gap="1rem" justifyContent="space-between" mb="2rem">
          <Box width={"55%"}>
            <Carousel height="100%" images={recipe?.images} />
            <Divider mt="2rem" />
            {/* Botonera de interacción */}
            <Flex gap="1rem" mt="1rem" alignItems="center">
              <Button
                variant={liked ? "solid" : "outline"}
                colorScheme="orange"
                onClick={() => {
                  if (liked) {
                    handleRemoveLike();
                  } else {
                    handleAddLike();
                  }
                }}
              >
                {liked ? "Me gusta" : "Dar me gusta"}
              </Button>
              <Button
                variant={saved ? "solid" : "outline"}
                colorScheme="blue"
                onClick={() => {
                  if (saved) {
                    handleUnsaveRecipe();
                  } else {
                    handleSaveRecipe();
                  }
                }}
              >
                {saved ? "Guardado" : "Guardar"}
              </Button>
            </Flex>
            <Box>
              <Heading textTransform="uppercase" size="lg" my="2rem">
                Ingredientes
              </Heading>
              <VStack textAlign="left" align="start">
                <List
                  w="100%"
                  display="grid"
                  gridTemplateColumns="repeat(auto-fill, minmax(200px, 1fr))"
                  gap={4}
                >
                  {recipe?.ingredients.length > 0 &&
                    recipe.ingredients.map((ele, ind) => (
                      <ListItem key={ind} display="flex" alignItems="center">
                        <Box
                          as={CheckIcon}
                          w={5}
                          h={5}
                          color="green.500"
                          mr={2}
                        />
                        <Text fontSize="xs">{ele}</Text>
                      </ListItem>
                    ))}
                </List>
              </VStack>
            </Box>
          </Box>
          <Box
            width={"45%"}
            p={"1rem"}
            display="flex"
            gap="1rem"
            flexDirection={"column"}
          >
            {/* User details image, name, city */}
            <Flex
              size="2xl"
              gap={"1rem"}
              alignItems={"center"}
              justifyContent={"flex-start"}
            >
              <Avatar
                size="2xl"
                src={`${process.env.REACT_APP_API_URL}/${owner.profileImage}`}
              />
              <Box>
                <Text
                  fontSize={"xl"}
                  fontWeight={"bolder"}
                  textTransform={"uppercase"}
                >
                  {owner?.name}
                </Text>
                <Flex alignItems={"flex-end"}>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fill="#fb8500"
                      d="M12 11.5A2.5 2.5 0 0 1 9.5 9A2.5 2.5 0 0 1 12 6.5A2.5 2.5 0 0 1 14.5 9a2.5 2.5 0 0 1-2.5 2.5M12 2a7 7 0 0 0-7 7c0 5.25 7 13 7 13s7-7.75 7-13a7 7 0 0 0-7-7Z"
                    />
                  </svg>
                  <Text fontSize={"lg"} textTransform={"uppercase"}>
                    {owner?.city}
                  </Text>
                </Flex>
              </Box>
            </Flex>

            {/* Recipe Information */}
            <Flex flexDir={"column"} mt={5} gap={3}>
              <Flex gap={"1rem"} alignItems={"center"}>
                <Heading textTransform={"uppercase"} fontSize={"2xl"}>
                  {recipe?.title}
                </Heading>
                {(loggedInUser?.role === 'admin' || loggedInUser?._id === owner?._id) && (
                  <Button size="sm" colorScheme="blue" onClick={onOpen}>
                    Editar cóctel
                  </Button>
                )}
                <svg
                  width="30"
                  height="30"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill={recipe?.veg ? "#10b981" : "#ea580c"}
                    d="M20 4v16H4V4h16m2-2H2v20h20V2M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6s6-2.69 6-6s-2.69-6-6-6Z"
                  />
                </svg>
              </Flex>
              <Flex alighItems="center" gap={3}>
                <svg
                  width="33"
                  height="33"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#000000"
                    d="m20 15l2-2v5a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h13l-2 2H4v12h16v-3zm2.44-8.56l-.88-.88a1.5 1.5 0 0 0-2.12 0L12 13v2H6v2h9v-1l7.44-7.44a1.5 1.5 0 0 0 0-2.12z"
                  />
                </svg>
                <Text>{recipe?.description}</Text>
              </Flex>
              <Flex alighItems="center" gap={3}>
                <svg
                  width="23"
                  height="23"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill="#000000"
                    d="M21 15c0-4.625-3.507-8.441-8-8.941V4h-2v2.059c-4.493.5-8 4.316-8 8.941v2h18v-2zM2 18h20v2H2z"
                  />
                </svg>{" "}
                <Text>{recipe.cuisine[0]}</Text>
              </Flex>
            </Flex>
            <Flex gap={4} my={3}>
              {recipe?.tags?.length > 0 &&
                recipe?.tags?.map((ele, index) => (
                  <Tag key={index} size="xl" p="1rem">
                    {ele}
                  </Tag>
                ))}
            </Flex>
            <Divider />
            <Flex height="max-content" flexGrow={1} direction={"column"}>
              <Heading textTransform={"uppercase"} mb="2rem">
                Instrucciones
              </Heading>
              <Stepper orientation="vertical" h="100%">
                {recipe?.instructions.map((step, index) => (
                  <Step key={index}>
                    <StepIndicator>
                      <StepStatus
                        complete={<StepIcon />}
                        incomplete={<StepNumber />}
                        active={<StepNumber />}
                      />
                    </StepIndicator>
                    <StepSeparator />
                    <Box>
                      <StepTitle>{step}</StepTitle>
                    </Box>
                  </Step>
                ))}
              </Stepper>
            </Flex>
          </Box>
        </Flex>
      </DIV>
      {/* Recipe Ingredients */}
      {(loggedInUser?.role === 'admin' || loggedInUser?._id === owner?._id) && (
        <Modal isOpen={isOpen} onClose={onClose} isCentered>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Editar cóctel</ModalHeader>
            <ModalCloseButton />
            <ModalBody display="flex" flexDirection="column" gap={3}>
              <Input
                name="title"
                value={editData.title}
                onChange={handleEditChange}
                placeholder="Título"
              />
              <Textarea
                name="description"
                value={editData.description}
                onChange={handleEditChange}
                placeholder="Descripción"
              />
              <Input
                name="time"
                value={editData.time}
                onChange={handleEditChange}
                placeholder="Tiempo (minutos)"
              />
              <Input
                name="caption"
                value={editData.caption}
                onChange={handleEditChange}
                placeholder="Subtítulo / pie"
              />
              <Input
                name="cuisine"
                value={editData.cuisine}
                onChange={handleEditChange}
                placeholder="Categoría / tipo"
              />
              <Input
                name="tags"
                value={editData.tags}
                onChange={handleEditChange}
                placeholder="Etiquetas (separadas por coma)"
              />
              <Textarea
                name="ingredientsText"
                value={editData.ingredientsText}
                onChange={handleEditChange}
                placeholder={"Ingredientes (uno por línea)"}
              />
              <Textarea
                name="instructionsText"
                value={editData.instructionsText}
                onChange={handleEditChange}
                placeholder={"Instrucciones (una por línea)"}
              />
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => setEditImages(Array.from(e.target.files))}
              />
              <Checkbox
                name="veg"
                isChecked={editData.veg}
                onChange={(e) =>
                  setEditData((prev) => ({ ...prev, veg: e.target.checked }))
                }
              >
                Sin alcohol
              </Checkbox>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Cancelar
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSave}
                isDisabled={!editData.title.trim() || !editData.description.trim()}
              >
                Guardar cambios
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </>
  );
}

export default SingleRecipe;

const DIV = styled.div`
  width: 90%;
  margin: 5rem auto 10rem auto;
  @media screen and (max-width: 768px) {
    /* flex-direction: column; */
  }
`;
