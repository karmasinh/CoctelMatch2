import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Textarea,
  Image,
  Grid,
  Select,
  HStack,
  Tag,
  TagCloseButton,
  RadioGroup,
  Radio,
  useToast,
  Flex,
  Divider,
} from "@chakra-ui/react";
import {
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  StepSeparator,
  StepStatus,
  StepTitle,
  Stepper,
  useSteps,
  Text,
} from "@chakra-ui/react";
import { addNewRecipe } from "../../redux/recipeReducer/actions";
import { useDispatch, useSelector } from "react-redux";
import { searchIngredients, getIngredients } from "../../redux/ingredientReducer/actions";

const cuisines = [
  "Clásicos",
  "Tiki",
  "Modernos",
  "Sin alcohol",
  "Shots",
  "Ponches",
  "Sours",
  "Highballs",
  "Collins",
  "Fizzes",
  "Aperitivos",
  "Digestivos",
  "Tropicales",
  "De autor",
  "Otros",
];

const tags = [
  "Dulce",
  "Ácido",
  "Amargo",
  "Fuerte",
  "Suave",
  "Helado",
  "Agitado",
  "Mezclado",
  "Afrutado",
  "Cremoso",
  "Herbal",
  "Especiado",
  "Ahumado",
  "Seco",
];

const steps = [
  { title: "Paso 1", description: "Añade información básica del cóctel" },
  { title: "Paso 2", description: "Añade ingredientes y pasos de mezcla" },
  { title: "Paso 3", description: "Añade imágenes del cóctel" },
  { title: "Paso 4", description: "Añade etiquetas y leyenda" },
];
export const AddRecipeForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const token =
    useSelector((store) => store.authReducer.token) ||
    localStorage.getItem("token");
  const ingredientState = useSelector((store) => store.ingredientReducer);

  const [step, setStep] = useState(1);
  const activeStepText = steps[step - 1].description;
  const [ingredient, setIngredient] = useState("");
  const [ingredientQuery, setIngredientQuery] = useState("");
  const [instruction, setInstruction] = useState("");
  const [recipeData, setRecipeData] = useState({
    title: "",
    description: "",
    ingredients: [],
    instructions: [],
    images: [],
    cuisine: [],
    tags: [],
    veg: false,
    caption: "",
  });

  // Seed ingredients list on mount (if backend endpoint exists)
  useEffect(() => {
    if (token) {
      dispatch(getIngredients(token));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Debounced search for ingredient suggestions
  useEffect(() => {
    const q = ingredientQuery.trim();
    const handler = setTimeout(() => {
      if (q.length > 0) {
        dispatch(searchIngredients(q, token));
      }
    }, 300);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredientQuery]);

  // Validación por pasos
  const isStep1Valid =
    recipeData.title.trim().length > 0 &&
    recipeData.description.trim().length > 0 &&
    recipeData.cuisine.length > 0;
  const isStep2Valid =
    recipeData.ingredients.length > 0 &&
    recipeData.instructions.length > 0;
  const isStep3Valid = recipeData.images.length > 0;
  const isFinalValid =
    isStep1Valid && isStep2Valid && isStep3Valid && recipeData.tags.length > 0;

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setRecipeData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleArrayItemChange = (event, arrayName, index) => {
    const newArray = [...recipeData[arrayName]];
    newArray[index] = event.target.value;
    setRecipeData((prevData) => ({
      ...prevData,
      [arrayName]: newArray,
    }));
  };

  const handleAddArrayItem = (arrayName) => {
    setRecipeData((prevData) => ({
      ...prevData,
      [arrayName]: [...prevData[arrayName], ""],
    }));
  };

  const handleRemoveArrayItem = (arrayName, index) => {
    const newArray = [...recipeData[arrayName]];
    newArray.splice(index, 1);
    setRecipeData((prevData) => ({
      ...prevData,
      [arrayName]: newArray,
    }));
  };

  const handleCuisineChange = (event) => {
    setRecipeData((prevData) => ({
      ...prevData,
      cuisine: [...prevData.cuisine, event.target.value],
    }));
  };

  const handleCuisineRemove = (cuisine) => {
    setRecipeData((prevData) => ({
      ...prevData,
      cuisine: prevData.cuisine.filter((c) => c !== cuisine),
    }));
  };

  const handleTagsChange = (event) => {
    setRecipeData((prevData) => ({
      ...prevData,
      tags: [...prevData.tags, event.target.value],
    }));
  };

  const handleTagRemove = (tag) => {
    setRecipeData((prevData) => ({
      ...prevData,
      tags: prevData.tags.filter((t) => t !== tag),
    }));
  };

  const handleVegChange = (value) => {
    setRecipeData((prevData) => ({
      ...prevData,
      veg: value === "true",
    }));
  };

  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setRecipeData((prevData) => ({
      ...prevData,
      images: [...prevData.images, ...files],
    }));
  };

  const handleAddIngredient = () => {
    setRecipeData((prevData) => ({
      ...prevData,
      ingredients: [...prevData.ingredients, ingredient],
    }));
    setIngredient((prev) => {
      return "";
    });
    setStep(2);
  };

  const handleAddInstruction = () => {
    setRecipeData((prevData) => ({
      ...prevData,
      instructions: [...prevData.instructions, instruction],
    }));
    setInstruction((prev) => {
      return "";
    });
    setStep(2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new FormData object
    const formData = new FormData();

    // Append text fields
    formData.append("title", recipeData.title);
    formData.append("description", recipeData.description);
    formData.append("veg", recipeData.veg.toString());
    formData.append("caption", recipeData.caption);

    // Append cuisine and tags as arrays
    recipeData.cuisine.forEach((cuisine, index) => {
      formData.append(`cuisine[${index}]`, cuisine);
    });
    recipeData.tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });

    // Append ingredients and instructions as arrays
    recipeData.ingredients.forEach((ingredient, index) => {
      formData.append(`ingredients[${index}]`, ingredient);
    });
    recipeData.instructions.forEach((instruction, index) => {
      formData.append(`instructions[${index}]`, instruction);
    });

    // Append images
    recipeData.images.forEach((image, index) => {
      formData.append(`images`, image);
    });

    // Append additional fields as needed (likes, comments, time, rating, etc.)

    console.log(token, formData);

    // Now, you can dispatch the `addNewRecipe` action with `formData`
    dispatch(addNewRecipe(token, formData, toast, navigate, closeModal));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Título</FormLabel>
              <Input
                name="title"
                value={recipeData.title}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Textarea
                placeholder="Describe el perfil de sabor del cóctel"
                name="description"
                value={recipeData.description}
                onChange={handleInputChange}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Categoría</FormLabel>
              <Select
                placeholder="Selecciona categorías"
                value={recipeData.cuisine}
                onChange={handleCuisineChange}
              >
                {cuisines.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>
                    {cuisine}
                  </option>
                ))}
              </Select>
              <HStack
                display={"flex"}
                flexWrap={"wrap"}
                paddingY="2"
                spacing="2"
              >
                {recipeData.cuisine.map((cuisine) => (
                  <Tag key={cuisine} size="md">
                    {cuisine}
                    <TagCloseButton
                      onClick={() => handleCuisineRemove(cuisine)}
                    />
                  </Tag>
                ))}
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>Con alcohol/Sin alcohol</FormLabel>
              <RadioGroup
                name="veg"
                value={recipeData.veg.toString()}
                onChange={handleVegChange}
              >
                <HStack spacing="24px">
                  <Radio value={"true"}>Con alcohol</Radio>
                  <Radio value={"false"}>Sin alcohol</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
            <Divider></Divider>
            <Flex
              alignItems={"center"}
              justifyContent={"space-between"}
              py="1rem"
            >
              <Button variant="outline" m={0} onClick={closeModal}>
                Cerrar
              </Button>
              <Button onClick={() => setStep(step + 1)} isDisabled={!isStep1Valid}>
                Siguiente
              </Button>
            </Flex>
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Ingredientes</FormLabel>
              <Input
                mb="0.5rem"
                name="currentIngredient"
                value={ingredient}
                onChange={(e) => setIngredient(e.target.value)}
                placeholder="Escribe un ingrediente y añádelo"
              />
              <Button variant="outline" size="sm" onClick={handleAddIngredient}>
                Añadir ingrediente
              </Button>
              <Divider my={3} />
              <FormLabel>Buscar ingredientes (sugerencias)</FormLabel>
              <Input
                mb="0.5rem"
                name="ingredientQuery"
                value={ingredientQuery}
                onChange={(e) => setIngredientQuery(e.target.value)}
                placeholder="Buscar en la lista maestra"
              />
              <HStack display={"flex"} flexWrap={"wrap"} paddingY="2" spacing="2">
                {ingredientState?.isLoading && <Text>Cargando sugerencias…</Text>}
                {!ingredientState?.isLoading && ingredientQuery && ingredientState?.searchResults?.length === 0 && (
                  <Text color="gray.500">Sin resultados para “{ingredientQuery}”.</Text>
                )}
                {ingredientState?.searchResults?.slice(0, 12).map((item, idx) => (
                  <Tag
                    key={`${item}-${idx}`}
                    size="md"
                    variant="outline"
                    cursor="pointer"
                    onClick={() => {
                      setRecipeData((prev) => ({
                        ...prev,
                        ingredients: [...prev.ingredients, item],
                      }));
                    }}
                  >
                    {item}
                  </Tag>
                ))}
              </HStack>
              <HStack
                display={"flex"}
                flexWrap={"wrap"}
                paddingY="2"
                spacing="2"
              >
                {recipeData.ingredients.map((ingredient, index) => (
                  <Tag key={index} size="md">
                    {ingredient}
                    <TagCloseButton
                      onClick={() =>
                        handleRemoveArrayItem("ingredients", index)
                      }
                    />
                  </Tag>
                ))}
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>Instrucciones</FormLabel>
              <Textarea
                mb="0.5rem"
                value={instruction}
                onChange={(e) => setInstruction(e.target.value)}
              />
              <Button
                size="sm"
                variant={"outline"}
                onClick={handleAddInstruction}
              >
                Añadir instrucción
              </Button>
              <HStack
                display={"flex"}
                flexDir={"column"}
                paddingY="2"
                spacing="2"
              >
                {recipeData.instructions.map((instruction, index) => (
                  <Tag
                    key={index}
                    size="md"
                    width="100%"
                    display={"flex"}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                    px={4}
                    py={2}
                  >
                    {`Paso ${index + 1} : `}
                    {instruction}
                    <TagCloseButton
                      onClick={() =>
                        handleRemoveArrayItem("instructions", index)
                      }
                    />
                  </Tag>
                ))}
              </HStack>
            </FormControl>
            <Divider></Divider>
            <Flex
              alignItems={"center"}
              justifyContent={"space-between"}
              py="1rem"
            >
              <Button variant="outline" m={0} onClick={closeModal}>
                Cerrar
              </Button>
              <Flex gap="1rem">
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Atrás
                </Button>
                <Button onClick={() => setStep(step + 1)} isDisabled={!isStep2Valid}>
                  Siguiente
                </Button>
              </Flex>
            </Flex>
          </Stack>
        );

      case 3:
        return (
          <Stack spacing={4}>
            <FormControl minH={"20vh"}>
              <FormLabel>Subir imágenes</FormLabel>
              <input
                type="file"
                name="images"
                multiple
                onChange={handleFileChange}
                style={{ marginBottom: "0.5rem" }}
              />
              <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                {recipeData.images.map((image, index) => (
                  <Box key={index}>
                    <Image
                      src={URL.createObjectURL(image)}
                      alt={`Image ${index}`}
                    />
                  </Box>
                ))}
              </Grid>
            </FormControl>
            <Divider></Divider>
            <Flex
              alignItems={"center"}
              justifyContent={"space-between"}
              py="1rem"
            >
              <Button variant="outline" m={0} onClick={closeModal}>
                Cerrar
              </Button>
              <Flex gap="1rem">
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Atrás
                </Button>
                <Button onClick={() => setStep(step + 1)} isDisabled={!isStep3Valid}>
                  Siguiente
                </Button>
              </Flex>
            </Flex>
          </Stack>
        );
      case 4:
        return (
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Etiquetas</FormLabel>
              <Select
                placeholder="Selecciona etiquetas"
                value={recipeData.tags}
                onChange={handleTagsChange}
              >
                {tags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </Select>
              <HStack
                display={"flex"}
                flexWrap={"wrap"}
                paddingY="2"
                spacing="2"
              >
                {recipeData.tags.map((tag) => (
                  <Tag key={tag} size="md">
                    {tag}
                    <TagCloseButton onClick={() => handleTagRemove(tag)} />
                  </Tag>
                ))}
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>Leyenda</FormLabel>
              <Textarea
                name="caption"
                placeholder="Escribe una leyenda para tu publicación"
                onChange={handleInputChange}
                // value={}
                // onChange={}
              />
            </FormControl>
            <Divider></Divider>
            <Flex
              alignItems={"center"}
              justifyContent={"space-between"}
              py="1rem"
            >
              <Button variant="outline" m={0} onClick={closeModal}>
                Cerrar
              </Button>
              <Flex gap="1rem">
                <Button variant="outline" onClick={() => setStep(step - 1)}>
                  Atrás
                </Button>
                <Button onClick={handleSubmit} isDisabled={!isFinalValid}>
                  Publicar cóctel
                </Button>
              </Flex>
            </Flex>
          </Stack>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <Stack mb={5}>
        <Stepper size="sm" index={step - 1} gap="0" mb="1rem">
          {steps.map((step, index) => (
            <Step key={index} gap="0">
              <StepIndicator>
                <StepStatus complete={<StepIcon />} />
              </StepIndicator>
              <StepSeparator _horizontal={{ ml: "0" }} />
            </Step>
          ))}
        </Stepper>
        <Text>
          Paso {step}: <b>{activeStepText}</b>
        </Text>
      </Stack>
      <form onSubmit={handleSubmit}>{renderStep()}</form>
    </div>
  );
};
