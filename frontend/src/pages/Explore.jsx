import {
  Box,
  Button,
  Grid,
  HStack,
  Heading,
  Image,
  Input,
  InputGroup,
  InputLeftElement,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Divider,
  Tag,
  TagCloseButton,
  Text,
  VStack,
  useDisclosure,
  Flex,
  CardFooter,
  Card,
  CardHeader,
  Spinner,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { getAllRecipes } from "../redux/authReducer/actions";
import { useSelector } from "react-redux";
import axios from "axios";
import FeedCard from "../components/Feed/FeedCard";
import { BiLike, BiShare } from "react-icons/bi";
import styled from "@emotion/styled";
import { useNavigate, useLocation } from "react-router-dom";
import { Carousel } from "../components/Feed/SingleRecipeCarousel";
import { AddCocktailModal } from "./AddCocktailModal";
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const Explore = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedCuisines, setSelectedCuisines] = useState([]);
  const [selectedFlavors, setSelectedFlavors] = useState([]);
  const [recipe, setRecipe] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState(false);
  const [impression, setImpression] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [sortLatest, setSortLatest] = useState(false);
  const [applySearch, setApplySearch] = useState(false);
  const [suggestionsOpen, setSuggestionsOpen] = useState(false);
  const inputRef = React.useRef(null);
  const dropdownRef = React.useRef(null);
  const handleImpressionChange = (event) => {
    setImpression(event.target.value);
  };
  const token =
    useSelector((store) => store.authReducer.token) ||
    localStorage.getItem("token");

  const handleFilter = () => {
    setFilter(!filter);
    onClose();
  };

  // Function to set cuisine multiple option
  const handleCuisineChange = (e) => {
    const data = e.target.value;
    const newCuisines = [...selectedCuisines];
    if (newCuisines.includes(data)) {
      const index = newCuisines.indexOf(data);
      newCuisines.splice(index, 1);
    } else {
      newCuisines.push(data);
    }
    setSelectedCuisines(newCuisines);
  };

  // Function to set flavors multiple option
  const handleFlavorsChange = (e) => {
    const value = e.target.value;
    setSelectedFlavors((prev) => (prev.includes(value) ? prev : [...prev, value]));
  };
  const handleFlavorRemove = (flavor) => {
    setSelectedFlavors((prev) => prev.filter((f) => f !== flavor));
  };

  // Function to remove cuisine
  const handleCuisineRemove = (cuisine) => {
    const updatedCuisines = selectedCuisines.filter((item) => item !== cuisine);
    setSelectedCuisines(updatedCuisines);
  };

  // Inicializa filtros desde los parámetros de la URL (para enlaces del footer)
  useEffect(() => {
    if (!location?.search) return;
    const params = new URLSearchParams(location.search);
    const vegParam = params.get("veg");
    const impressionParam = params.get("impression");
    const sortParam = params.get("sort");
    const flavorsParam = params.get("flavors");
    if (vegParam) setSelectedOption(vegParam);
    if (impressionParam) setImpression(impressionParam);
    setSortLatest(sortParam === "latest");
    if (flavorsParam) {
      try {
        const arr = JSON.parse(flavorsParam);
        if (Array.isArray(arr)) setSelectedFlavors(arr);
      } catch (e) {
        const arr = flavorsParam.split(",").map((s) => s.trim()).filter(Boolean);
        if (arr.length > 0) setSelectedFlavors(arr);
      }
    }
    // Fuerza recarga con los filtros aplicados
    setFilter((prev) => !prev);
  }, [location.search]);

  useEffect(() => {
    setLoading(true);
    const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
    axios
      .get(`${API}/recipe/getAllRecipe`, {
        params: {
          impression: impression || undefined,
          veg: selectedOption || undefined,
          // Let backend handle cuisine filtering if provided
          cuisine:
            selectedCuisines && selectedCuisines.length > 0
              ? JSON.stringify(selectedCuisines)
              : undefined,
          flavors:
            selectedFlavors && selectedFlavors.length > 0
              ? JSON.stringify(selectedFlavors)
              : undefined,
          q: applySearch && searchText ? searchText : undefined,
        },
        headers,
      })
      .then((res) => {
        let data = res.data || [];
        if (sortLatest) {
          data = [...data].sort((a, b) => {
            const aDate = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
            const bDate = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
            return bDate - aDate;
          });
        }
        setRecipe(data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
    // Reset applySearch so que no dispare múltiples veces
    if (applySearch) setApplySearch(false);
  }, [filter, impression, selectedOption, selectedCuisines, sortLatest, applySearch]);

  console.log(recipe, "recipe");

  // Autocompletado de títulos
  useEffect(() => {
    const handler = setTimeout(async () => {
      try {
        if (!searchText || searchText.trim().length === 0) { setSuggestions([]); setSuggestionsOpen(false); return; }
        const headers = token ? { Authorization: `Bearer ${token}` } : undefined;
        const { data } = await axios.get(`${API}/recipe/getAllRecipe`, { params: { q: searchText }, headers });
        const titles = Array.isArray(data) ? data.map((r) => r.title).filter(Boolean) : [];
        const unique = Array.from(new Set(titles)).slice(0, 6);
        setSuggestions(unique);
        setSuggestionsOpen(unique.length > 0);
      } catch (_) {
        setSuggestions([]);
        setSuggestionsOpen(false);
      }
    }, 250);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Cerrar sugerencias al hacer click fuera
  useEffect(() => {
    const onDocClick = (e) => {
      const tgt = e.target;
      if (dropdownRef.current && dropdownRef.current.contains(tgt)) return;
      if (inputRef.current && inputRef.current.contains(tgt)) return;
      setSuggestionsOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // Categorías de cócteles (español)
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

  return (
    <>
      <Box>
        {/* Hero section image with heading and a button */}
        <Box h="45vh" position="relative">
          <Image
            src="https://images.unsplash.com/photo-1495546968767-f0573cca821e?auto=format&fit=crop&q=80&w=2831&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Hero image"
            w="100%"
            h="100%"
            objectFit="cover"
          />

          <VStack
            position="absolute"
            top="0"
            left="0"
            right="0"
            bottom="0"
            alignItems="center"
            justifyContent="space-around"
            paddingX="7"
          >
            <Heading
              as="h3"
              size="2xl"
              color="white"
              textShadow="1px 1px 2px black"
              textAlign={"center"}
            >
            ¡Encuentra los mejores cócteles en pocos pasos!
            </Heading>

            <Button>Buscar ahora</Button>
          </VStack>
        </Box>
        {/* Search bar and advance search option */}
        <Box boxShadow="0 4px 10px #0002" padding="4">
          <HStack spacing={5} width="min(80rem,100%)" mx="auto">
            {/* <Input variant="flushed" placeholder="Flushed" width='30%' /> */}
            <InputGroup width="30%">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="text" />
              </InputLeftElement>
              <Input
                placeholder="Busca un cóctel"
                border="1px solid"
                outline="none"
                borderColor="text"
                _focus={{ borderColor: "primary.500" }}
                value={searchText}
                onChange={(e) => { setSearchText(e.target.value); if (e.target.value.trim().length > 0) setSuggestionsOpen(true); }}
                onKeyDown={(e) => { if (e.key === "Enter") { setApplySearch(true); setSuggestionsOpen(false); } }}
                onFocus={() => { if (suggestions.length > 0) setSuggestionsOpen(true); }}
                onClick={() => { if (suggestions.length > 0) setSuggestionsOpen((prev) => !prev); }}
                ref={inputRef}
              />
            </InputGroup>
            {suggestionsOpen && suggestions.length > 0 && (
              <Box ref={dropdownRef} bg="background" borderWidth="1px" borderColor="borderColor" borderRadius="md" p={2} position="absolute" mt={12} w="30%" zIndex={10}>
                <VStack align="stretch" spacing={1}>
                  {suggestions.map((s) => (
                    <Button key={s} variant="ghost" justifyContent="flex-start" onClick={() => { setSearchText(s); setApplySearch(true); setSuggestionsOpen(false); }}>{s}</Button>
                  ))}
                </VStack>
              </Box>
            )}
            <Heading as="h5" size="md" color="text">
              Búsqueda avanzada
            </Heading>
            {/* This is the icon of filter */}
            <svg
              onClick={onOpen}
              width="30"
              height="30"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              cursor="pointer"
            >
              <path
                fill="#F58332"
                d="M9 5a1 1 0 1 0 0 2a1 1 0 0 0 0-2zM6.17 5a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-7.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 0 1 0-2h1.17zM15 11a1 1 0 1 0 0 2a1 1 0 0 0 0-2zm-2.83 0a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-1.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 1 1 0-2h7.17zM9 17a1 1 0 1 0 0 2a1 1 0 0 0 0-2zm-2.83 0a3.001 3.001 0 0 1 5.66 0H19a1 1 0 1 1 0 2h-7.17a3.001 3.001 0 0 1-5.66 0H5a1 1 0 1 1 0-2h1.17z"
              />
            </svg>
          </HStack>
          {/* Botón inline para añadir cóctel visible a admin/mixologist */}
          <AddCocktailModal mode="inline" />
          {/* This model will open when selected advance search feature */}
          <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Filtros avanzados</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                {/* Options for rating */}
                <Select
                  value={impression}
                  onChange={handleImpressionChange}
                  placeholder="Ordenar por popularidad"
                >
                  <option value="desc">Más populares</option>
                  <option value="asc">Menos populares</option>
                </Select>
                {/* Options for selecting veg / non-veg recipe */}
                <RadioGroup
                  marginY="5"
                  value={selectedOption}
                  onChange={setSelectedOption}
                >
                  <Stack spacing={5} direction="row">
                    <Radio colorScheme="green" value="veg">
                      Con alcohol
                    </Radio>
                    <Radio colorScheme="red" value="non-veg">
                      Sin alcohol
                    </Radio>
                  </Stack>
                </RadioGroup>
                {/* Select option for single/multiple cuisines */}
                <Select
                  placeholder="Selecciona categorías"
                  value={cuisines}
                  onChange={handleCuisineChange}
                >
                  {cuisines.map((cuisine) => (
                    <option key={cuisine + Date.now()} value={cuisine}>
                      {cuisine}
                    </option>
                  ))}
                </Select>
                {/* This will show the selected cuisines */}
                <HStack
                  display={"flex"}
                  flexWrap={"wrap"}
                  paddingY="2"
                  spacing="2"
                >
                  {selectedCuisines.map((cuisine) => (
                    <Tag key={cuisine} size="md">
                      {cuisine}
                      <TagCloseButton
                        onClick={() => handleCuisineRemove(cuisine)}
                      />
                    </Tag>
                  ))}
                </HStack>
                {/* Select option for single/multiple flavors */}
                <Select
                  placeholder="Selecciona sabores"
                  value={selectedFlavors}
                  onChange={handleFlavorsChange}
                  mt={4}
                >
                  {[
                    "Afrutado",
                    "Especiado",
                    "Herbal",
                    "Cremoso",
                    "Ahumado",
                    "Seco",
                    "Dulce",
                    "Ácido",
                    "Amargo",
                  ].map((flavor) => (
                    <option key={flavor} value={flavor}>
                      {flavor}
                    </option>
                  ))}
                </Select>
                <HStack
                  display={"flex"}
                  flexWrap={"wrap"}
                  paddingY="2"
                  spacing="2"
                >
                  {selectedFlavors.map((flavor) => (
                    <Tag key={flavor} size="md">
                      {flavor}
                      <TagCloseButton onClick={() => handleFlavorRemove(flavor)} />
                    </Tag>
                  ))}
                </HStack>
              </ModalBody>
              <ModalFooter>
                <Button
                  border={"1px solid"}
                  borderColor={"secondary"}
                  color="secondary"
                  variant="outline"
                  mr="1rem"
                  onClick={onClose}
                >
                  Cerrar
                </Button>
                <Button variant="solid" onClick={handleFilter}>
                  Aplicar
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Box>
        {/* Mapping all recipe */}
        <DIV>
          {loading ? (
            <Spinner
              mx="auto"
              thickness="4px"
              speed="0.65s"
              emptyColor="gray.200"
              color="primary.500"
              size="xl"
            />
          ) : recipe?.length > 0 ? (
            recipe.map((ele, index) => (
              <Card
                textAlign={"left"}
                key={index}
                boxShadow={"lg"}
                borderRadius="1rem"
                transition="0.2s ease-in"
                _hover={{ boxShadow: "xl", transform: "scale(1.01)" }}
              >
                <Box borderWidth="0" borderRadius="md" overflow="hidden">
                  <CardHeader>
                    {/* <Image
                      width="100%"
                      src={`${process.env.REACT_APP_API_URL}/${ele.images[0]}`}
                      alt="Card"
                    /> */}
                    <Image height={"300px"} w="100%" objectFit="cover" src={`${API}/${ele?.images?.[0]}`} alt={ele.title} />
                  </CardHeader>
                  <Divider w="90%" mx="auto"></Divider>
                  <Box p="1rem">
                    <Heading
                      fontSize="lg"
                      m={0}
                      lineHeight={1.1}
                      textTransform="uppercase"
                      fontWeight="700"
                    >
                      {ele.title}
                    </Heading>
                    <Flex
                      align="center"
                      justifyContent="space-between"
                      py={1}
                      mb="0.5rem"
                    >
                      <Text
                        my={3}
                        fontFamily={"Kaushan Script"}
                        fontSize="md"
                        fontWeight="bold"
                        color="primary.500"
                      >
                        {ele?.cuisine[0]}
                      </Text>
                      <Flex mt={3} flexWrap="wrap" gap={3}>
                        {ele?.tags?.length > 0 &&
                          ele?.tags.map((e, index) => (
                            <Tag key={index}>{e}</Tag>
                          ))}
                      </Flex>
                    </Flex>
                    <Text fontSize="sm" mb="1rem">
                      {ele.description}
                    </Text>
                    <CardFooter
                      p="0"
                      justify="flex-start"
                      gap="1rem"
                      flexWrap="wrap"
                      sx={{
                        "& > button": {
                          minW: "136px",
                        },
                      }}
                    >
                      <Button
                        flex={{ base: "1", md: "0.25" }}
                        variant="outline"
                        leftIcon={<BiShare />}
                        border={"1px solid"}
                        borderColor={"secondary"}
                        color="secondary"
                        onClick={() => navigate(`/recipe/${ele._id}`)}
                      >
                        Detalles
                      </Button>
                    </CardFooter>
                  </Box>
                </Box>
              </Card>
            ))
          ) : (
            <Heading as="h2" size="md" color="text">
              No se encontraron cócteles
            </Heading>
          )}
        </DIV>
      </Box>
    </>
  );
};

// Leer parámetros de la URL para filtros rápidos desde el footer
// Ejemplos: /explore?veg=non-veg, /explore?impression=desc, /explore?sort=latest
export const _ExploreParamsInitializer = () => null;


const DIV = styled.div`
  text-align: center;
  min-height: 20vh;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
  width: min(80rem, 100%);
  margin-inline: auto;
  padding-block: 5rem;
  @media (max-width: 768px) {
    grid-template-columns: repeat(
      1,
      1fr
    ); /* 1 column on screens up to 768px wide */
  }

  @media (min-width: 769px) and (max-width: 1024px) {
    grid-template-columns: repeat(
      2,
      1fr
    ); /* 2 columns on screens between 769px and 1024px wide */
  }

  @media (min-width: 1025px) {
    grid-template-columns: repeat(
      3,
      1fr
    ); /* 3 columns on screens wider than 1024px */
  }
`;
