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
  Text,
} from "@chakra-ui/react";
import {
  Step,
  StepIcon,
  StepIndicator,
  StepSeparator,
  StepStatus,
  Stepper,
  useSteps,
} from "@chakra-ui/react";
import { addNewRecipe } from "../../redux/recipeReducer/actions";
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

const flavors = [
  "Afrutado",
  "Especiado",
  "Herbal",
  "Cremoso",
  "Ahumado",
  "Seco",
  "Dulce",
  "Ácido",
  "Amargo",
];

const steps = [
  { title: "Paso 1", description: "Añade información básica del cóctel" },
  { title: "Paso 2", description: "Añade ingredientes y pasos de mezcla" },
  { title: "Paso 3", description: "Añade imágenes del cóctel" },
  { title: "Paso 4", description: "Añade etiquetas y leyenda" },
];

export const AddCocktailForm = ({ closeModal }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const token = useSelector((store) => store.authReducer.token) || localStorage.getItem("token");
  const ingredientState = useSelector((store) => store.ingredientReducer);

  const [step, setStep] = useState(1);
  const activeStepText = steps[step - 1].description;
  const [ingredient, setIngredient] = useState("");
  const [ingredientQuery, setIngredientQuery] = useState("");
  const [instruction, setInstruction] = useState("");
  const [cuisineBulk, setCuisineBulk] = useState("");
  const [recipeData, setRecipeData] = useState({
    title: "",
    description: "",
    ingredients: [],
    instructions: [],
    images: [],
    cuisine: [],
    tags: [],
    flavors: [],
    veg: false,
    caption: "",
  });

  const isStep1Valid =
    recipeData.title.trim().length > 0 &&
    recipeData.description.trim().length > 0 &&
    recipeData.cuisine.length > 0;
  const isStep2Valid = recipeData.ingredients.length > 0 && recipeData.instructions.length > 0;
  const isStep3Valid = recipeData.images.length > 0;
  const isFinalValid = isStep1Valid && isStep2Valid && isStep3Valid && recipeData.tags.length > 0;

  useEffect(() => {
    if (token) dispatch(getIngredients(token));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const q = ingredientQuery.trim();
    const handler = setTimeout(() => {
      if (q.length > 0) dispatch(searchIngredients(q, token));
    }, 300);
    return () => clearTimeout(handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ingredientQuery]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipeData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddArrayItem = (arrayName) => {
    setRecipeData((prevData) => ({ ...prevData, [arrayName]: [...prevData[arrayName], ""] }));
  };
  const handleRemoveArrayItem = (arrayName, index) => {
    const newArray = [...recipeData[arrayName]];
    newArray.splice(index, 1);
    setRecipeData((prevData) => ({ ...prevData, [arrayName]: newArray }));
  };

  const handleCuisineChange = (event) => {
    setRecipeData((prevData) => ({ ...prevData, cuisine: [...prevData.cuisine, event.target.value] }));
  };
  const handleCuisineRemove = (cuisine) => {
    setRecipeData((prevData) => ({ ...prevData, cuisine: prevData.cuisine.filter((c) => c !== cuisine) }));
  };

  const handleVegChange = (value) => {
    setRecipeData((prevData) => ({ ...prevData, veg: value === "true" }));
  };
  const handleFileChange = (event) => {
    const files = Array.from(event.target.files);
    setRecipeData((prevData) => ({ ...prevData, images: [...prevData.images, ...files] }));
  };

  const handleAddIngredient = () => {
    const raw = (ingredient || "").trim();
    if (!raw) return;
    const parts = raw.split(",").map((p) => p.trim()).filter((p) => p.length > 0);
    setRecipeData((prevData) => ({ ...prevData, ingredients: [...prevData.ingredients, ...parts] }));
    setIngredient("");
    setStep(2);
  };
  const handleAddInstruction = () => {
    const raw = (instruction || "").trim();
    if (!raw) return;
    const parts = raw.split(",").map((p) => p.trim()).filter((p) => p.length > 0);
    setRecipeData((prevData) => ({ ...prevData, instructions: [...prevData.instructions, ...parts] }));
    setInstruction("");
    setStep(2);
  };

  const handleTagsChange = (event) => {
    setRecipeData((prevData) => ({ ...prevData, tags: [...prevData.tags, event.target.value] }));
  };
  const handleFlavorsChange = (event) => {
    const value = event.target.value;
    setRecipeData((prevData) => ({ ...prevData, flavors: prevData.flavors.includes(value) ? prevData.flavors : [...prevData.flavors, value] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", recipeData.title);
    formData.append("description", recipeData.description);
    formData.append("veg", recipeData.veg.toString());
    formData.append("caption", recipeData.caption);
    recipeData.cuisine.forEach((cuisine, index) => formData.append(`cuisine[${index}]`, cuisine));
    recipeData.tags.forEach((tag, index) => formData.append(`tags[${index}]`, tag));
    recipeData.flavors.forEach((flavor, index) => formData.append(`flavors[${index}]`, flavor));
    recipeData.ingredients.forEach((ingredient, index) => formData.append(`ingredients[${index}]`, ingredient));
    recipeData.instructions.forEach((instruction, index) => formData.append(`instructions[${index}]`, instruction));
    recipeData.images.forEach((image) => formData.append(`images`, image));
    dispatch(addNewRecipe(token, formData, toast, navigate, closeModal));
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Título</FormLabel>
              <Input name="title" value={recipeData.title} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Descripción</FormLabel>
              <Textarea placeholder="Describe el perfil de sabor del cóctel" name="description" value={recipeData.description} onChange={handleInputChange} />
            </FormControl>
            <FormControl>
              <FormLabel>Categoría</FormLabel>
              <Select placeholder="Selecciona categorías" value={recipeData.cuisine} onChange={handleCuisineChange}>
                {cuisines.map((cuisine) => (
                  <option key={cuisine} value={cuisine}>{cuisine}</option>
                ))}
              </Select>
              <Input mt={2} placeholder="Añadir categorías separadas por comas" value={cuisineBulk} onChange={(e) => setCuisineBulk(e.target.value)} />
              <Button mt={2} size="sm" variant="outline" onClick={() => {
                const raw = (cuisineBulk || "").trim();
                if (!raw) return;
                const parts = raw.split(",").map((p) => p.trim()).filter((p) => p.length > 0);
                setRecipeData((prevData) => ({ ...prevData, cuisine: [...prevData.cuisine, ...parts] }));
                setCuisineBulk("");
              }}>Añadir categorías por comas</Button>
              <HStack display={"flex"} flexWrap={"wrap"} paddingY="2" spacing="2">
                {recipeData.cuisine.map((cuisine) => (
                  <Tag key={cuisine} size="md">
                    {cuisine}
                    <TagCloseButton onClick={() => handleCuisineRemove(cuisine)} />
                  </Tag>
                ))}
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>Con alcohol/Sin alcohol</FormLabel>
              <RadioGroup name="veg" value={recipeData.veg.toString()} onChange={handleVegChange}>
                <HStack spacing="24px">
                  <Radio value={"true"}>Con alcohol</Radio>
                  <Radio value={"false"}>Sin alcohol</Radio>
                </HStack>
              </RadioGroup>
            </FormControl>
            <Divider />
            <Flex alignItems={"center"} justifyContent={"space-between"} py="1rem">
              <Button variant="outline" m={0} onClick={closeModal}>Cerrar</Button>
              <Button onClick={() => setStep(step + 1)} isDisabled={!isStep1Valid}>Siguiente</Button>
            </Flex>
          </Stack>
        );
      case 2:
        return (
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Ingredientes</FormLabel>
              <Input mb="0.5rem" name="currentIngredient" value={ingredient} onChange={(e) => setIngredient(e.target.value)} placeholder="Escribe ingredientes separados por comas o uno solo" />
              <Button variant="outline" size="sm" onClick={handleAddIngredient}>Añadir ingrediente(s)</Button>
              <Divider my={3} />
              <FormLabel>Buscar ingredientes (sugerencias)</FormLabel>
              <Input mb="0.5rem" name="ingredientQuery" value={ingredientQuery} onChange={(e) => setIngredientQuery(e.target.value)} placeholder="Buscar en la lista maestra" />
              <HStack display={"flex"} flexWrap={"wrap"} paddingY="2" spacing="2">
                {ingredientState?.isLoading && <Text>Cargando sugerencias…</Text>}
                {!ingredientState?.isLoading && ingredientQuery && ingredientState?.searchResults?.length === 0 && (
                  <Text color="gray.500">Sin resultados para “{ingredientQuery}”.</Text>
                )}
                {ingredientState?.searchResults?.slice(0, 12).map((item, idx) => (
                  <Tag key={`${item}-${idx}`} size="md" variant="outline" cursor="pointer" onClick={() => {
                    setRecipeData((prev) => ({ ...prev, ingredients: [...prev.ingredients, item] }));
                  }}>
                    {item}
                  </Tag>
                ))}
              </HStack>
              <HStack display={"flex"} flexWrap={"wrap"} paddingY="2" spacing="2">
                {recipeData.ingredients.map((ingredient, index) => (
                  <Tag key={index} size="md">
                    {ingredient}
                    <TagCloseButton onClick={() => handleRemoveArrayItem("ingredients", index)} />
                  </Tag>
                ))}
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>Instrucciones</FormLabel>
              <Textarea mb="0.5rem" placeholder="Escribe instrucciones separadas por comas o una por vez" value={instruction} onChange={(e) => setInstruction(e.target.value)} />
              <Button size="sm" variant={"outline"} onClick={handleAddInstruction}>Añadir instrucción(es)</Button>
              <HStack display={"flex"} flexDir={"column"} paddingY="2" spacing="2">
                {recipeData.instructions.map((instruction, index) => (
                  <Tag key={index} size="md" width="100%" display={"flex"} alignItems={"center"} justifyContent={"space-between"} px={4} py={2}>
                    {`Paso ${index + 1} : `}
                    {instruction}
                    <TagCloseButton onClick={() => handleRemoveArrayItem("instructions", index)} />
                  </Tag>
                ))}
              </HStack>
            </FormControl>
            <Divider />
            <Flex alignItems={"center"} justifyContent={"space-between"} py="1rem">
              <Button variant="outline" m={0} onClick={closeModal}>Cerrar</Button>
              <Flex gap="1rem">
                <Button variant="outline" onClick={() => setStep(step - 1)}>Atrás</Button>
                <Button onClick={() => setStep(step + 1)} isDisabled={!isStep2Valid}>Siguiente</Button>
              </Flex>
            </Flex>
          </Stack>
        );
      case 3:
        return (
          <Stack spacing={4}>
            <FormControl minH={"20vh"}>
              <FormLabel>Subir imágenes</FormLabel>
              <input type="file" name="images" multiple onChange={handleFileChange} style={{ marginBottom: "0.5rem" }} />
              <Grid templateColumns="repeat(2, 1fr)" gap={2}>
                {recipeData.images.map((image, index) => (
                  <Box key={index}>
                    <Image src={URL.createObjectURL(image)} alt={`Image ${index}`} />
                  </Box>
                ))}
              </Grid>
            </FormControl>
            <Divider />
            <Flex alignItems={"center"} justifyContent={"space-between"} py="1rem">
              <Button variant="outline" m={0} onClick={closeModal}>Cerrar</Button>
              <Flex gap="1rem">
                <Button variant="outline" onClick={() => setStep(step - 1)}>Atrás</Button>
                <Button onClick={() => setStep(step + 1)} isDisabled={!isStep3Valid}>Siguiente</Button>
              </Flex>
            </Flex>
          </Stack>
        );
      case 4:
        return (
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Etiquetas</FormLabel>
              <Select placeholder="Selecciona etiquetas" value={recipeData.tags} onChange={handleTagsChange}>
                {tags.map((tag) => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </Select>
              <HStack display={"flex"} flexWrap={"wrap"} paddingY="2" spacing="2">
                {recipeData.tags.map((tag, index) => (
                  <Tag key={index} size="md">
                    {tag}
                    <TagCloseButton onClick={() => handleRemoveArrayItem("tags", index)} />
                  </Tag>
                ))}
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>Sabores (opcional)</FormLabel>
              <Select placeholder="Selecciona sabores" value={recipeData.flavors} onChange={handleFlavorsChange}>
                {flavors.map((flavor) => (
                  <option key={flavor} value={flavor}>{flavor}</option>
                ))}
              </Select>
              <HStack display={"flex"} flexWrap={"wrap"} paddingY="2" spacing="2">
                {recipeData.flavors.map((flavor, index) => (
                  <Tag key={index} size="md">
                    {flavor}
                    <TagCloseButton onClick={() => handleRemoveArrayItem("flavors", index)} />
                  </Tag>
                ))}
              </HStack>
            </FormControl>
            <FormControl>
              <FormLabel>Leyenda</FormLabel>
              <Input name="caption" value={recipeData.caption} onChange={handleInputChange} />
            </FormControl>
            <Divider />
            <Flex alignItems={"center"} justifyContent={"space-between"} py="1rem">
              <Button variant="outline" m={0} onClick={closeModal}>Cerrar</Button>
              <Flex gap="1rem">
                <Button variant="outline" onClick={() => setStep(step - 1)}>Atrás</Button>
                <Button type="submit" onClick={handleSubmit} isDisabled={!isFinalValid}>Publicar cóctel</Button>
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