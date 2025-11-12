import React, { useEffect, useState } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Button,
  Divider,
  Flex,
  Grid,
  Heading,
  SimpleGrid,
  Text,
  Spinner,
  Center,
  useToast,
} from "@chakra-ui/react";
import styled from "styled-components";
import { getUserData, getUserRecipes } from "../redux/authReducer/actions";
import { Homecard } from "../components/home/HomeCard";
import InfoCard from "../components/home/Card";
import { RecipeCard } from "../components/home/RecipeCard";
import ImageGrid from "../components/home/ImageGrid";
import { Reveal } from "../components/common/Reveal";
import { useNavigate } from "react-router-dom";
const recipes = [
  { name: "Mojito clásico", image: "/images/signupimage.jpg" },
  { name: "Negroni", image: "/images/loginImage.jpg" },
  { name: "Margarita de fresa", image: "/images/signupimage.jpg" },
  { name: "Old Fashioned", image: "/images/loginImage.jpg" },
  { name: "Piña Colada", image: "/images/signupimage.jpg" },
  { name: "Espresso Martini", image: "/images/loginImage.jpg" },
];
const fallbackImages = [
  "/images/signupimage.jpg",
  "/images/loginImage.jpg",
  "/images/Pattern.png",
  "/images/signupimage.jpg",
];
export const Home = () => {
  const dispatch = useDispatch();
  const toast = useToast();
  const token = localStorage.getItem("token") || "";
  const user = useSelector((store) => store.authReducer.loggedInUser);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && token) {
      dispatch(getUserData(token, toast));
    }
  }, []);

  const [screenSize, setScreenSize] = useState(getScreenSize());
  const [popularRecipes, setPopularRecipes] = useState([]);
  const [loadingPopular, setLoadingPopular] = useState(false);

  function getScreenSize() {
    return window.innerWidth > 768
      ? "lg"
      : window.innerWidth > 480
      ? "md"
      : "base";
  }

  useEffect(() => {
    function handleResize() {
      setScreenSize(getScreenSize());
    }

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Cargar cócteles populares desde la API (orden aproximado por likes)
  useEffect(() => {
    const loadPopular = async () => {
      try {
        setLoadingPopular(true);
        const base = process.env.REACT_APP_API_URL || "";
        const url = `${base}/recipe?impression=desc`;
        const { data } = await axios.get(url);
        const sorted = Array.isArray(data)
          ? [...data].sort((a, b) => (b?.likes?.length || 0) - (a?.likes?.length || 0))
          : [];
        const items = sorted.slice(0, 8).map((r) => {
          const first = (r?.images || [])[0] || "";
          const imageUrl = first ? `${base}/${first}` : null;
          return {
            id: r?._id,
            title: r?.title || "Cóctel",
            likesCount: r?.likes?.length || 0,
            imageUrl: imageUrl || undefined,
          };
        });
        setPopularRecipes(items.length > 0 ? items : []);
      } catch (err) {
        setPopularRecipes([]);
      } finally {
        setLoadingPopular(false);
      }
    };
    loadPopular();
  }, []);

  const getRecipesToDisplay = () => {
    const recipesToShow = {
      lg: 6,
      md: 2,
      base: 1,
    };
    console.log(screenSize);
    return recipes.slice(0, recipesToShow[screenSize]);
  };

  return (
    <DIV>
      <Reveal>
        <Box className="cover">
          <img
            src="/images/loginImage.jpg"
            alt="Hero Background"
            onError={(e) => {
              e.currentTarget.src = "/images/signupimage.jpg";
            }}
          />
          <div className="hero-content" style={{ paddingInline: "1rem" }}>
            <Heading
              as="h1"
              fontSize={{ lg: "3rem", md: "2rem", base: "1.5rem" }}
              fontWeight={{ lg: "800", md: "700", base: "600" }}
              textTransform="uppercase"
              textAlign="center"
              noOfLines={2}
              mb="1rem"
              textShadow="3px 3px 4px white"
            >
              Cócteles increíbles <br />
              y la mezcla perfecta.
            </Heading>
            <Text textAlign="center" mb="2rem">
              Explora miles de cócteles irresistibles
            </Text>
            <Button onClick={() => navigate("/explore")}>VER MÁS CÓCTELES</Button>
            <Grid
              mt="3rem"
              width={{ xl: "100%", lg: "80%", md: "60%", base: "60%" }}
              templateColumns={{
                lg: "repeat(3, 1fr)",
                md: "repeat(2,1fr)",
                base: "1fr",
              }}
              mx={{ base: "auto" }}
              justifyContent="center"
              alignItems={"center"}
              gap={{ lg: "3rem", md: "2rem", base: "1rem" }}
            >
              {getRecipesToDisplay().map((el, i) => {
                return (
                  <Reveal key={i} delay={1 + (i + 1) * 0.25}>
                    <Homecard {...el} />
                  </Reveal>
                );
              })}
            </Grid>
          </div>
        </Box>
      </Reveal>
      <Box py={{ lg: 20, md: 16, base: 10 }}>
        <Reveal>
          <InfoCard
            img={"/images/loginImage.jpg"}
            title={"SALUDABLE Y DE CALIDAD CON UN NUEVO TOQUE"}
            direction={"row"}
            screenSize={screenSize}
            mb={"15rem"}
            linkTo="/about"
          />
        </Reveal>
        <Reveal>
          <InfoCard
            img={"/images/signupimage.jpg"}
            screenSize={screenSize}
            title={"PRUEBA EL FUTURO DE LA MIXOLOGÍA"}
            direction={"row-reverse"}
            linkTo="/about"
          />
        </Reveal>
      </Box>
      <Reveal>
        <Box textAlign="center" py={{ lg: 20, md: 16, base: 10 }}>
            <Heading
              fontFamily={"Kaushan Script, sans-serif"}
              size={{ lg: "lg", md: "md", base: "sm" }}
              color="primary.500"
              mb="0.5rem"
            >
            Más
            </Heading>
          <Heading
            fontWeight="800"
            lineHeight={1.15}
            mb="1rem"
            noOfLines={2}
            color="text"
            maxW="500px"
            mx="auto"
            size={{ lg: "xl", md: "lg", base: "md" }}
          >
            {" "}
            CÓCTELES MÁS POPULARES{" "}
          </Heading>
          <Text mb={"2rem"}>
            {" "}
            Descubre las mezclas favoritas de la comunidad y prueba nuevas
            recetas de coctelería. <br />
            Inspírate y crea tu próxima bebida estrella.{" "}
          </Text>
          <Button mb={"4rem"} onClick={() => navigate("/explore")}>
            Explorar más
          </Button>
          {loadingPopular && (
            <Center my={6}>
              <Spinner size="lg" thickness="4px" speed="0.65s" emptyColor="gray.200" color="primary.500" />
            </Center>
          )}
          <SimpleGrid
            columns={{ lg: 4, md: 2, base: 1 }}
            spacing={4}
            width="min(80rem,100%)"
            mx="auto"
            px={{ lg: 4, base: 8 }}
          >
            {(popularRecipes.length > 0
              ? popularRecipes
              : fallbackImages.map((img) => ({ imageUrl: img }))
            ).map((item, i) => (
              <RecipeCard key={i} img={item.imageUrl} title={item.title} recipeId={item.id} likesCount={item.likesCount} />
            ))}
          </SimpleGrid>
        </Box>
      </Reveal>
      <Reveal>
        <Flex
          mx="auto"
          // border="1px solid black"
          direction={{ lg: "row", md: "row", base: "column" }}
          paddingBlock={{ lg: "8rem 10rem", md: "5rem", base: "4rem" }}
          px={4}
          width="min(80rem,100%)"
          alignItems="center"
          justifyContent={"space-between"}
          gap="2rem"
        >
          <ImageGrid />
          <Box
            width={{ lg: "50%", base: "100%" }}
            textAlign={{ lg: "right", base: "center" }}
          >
            <Heading
              fontFamily={"Kaushan Script, sans-serif"}
              size={{ lg: "lg", md: "md", base: "sm" }}
              color="primary.500"
              mb="0.5rem"
            >
              Sobre nosotros
            </Heading>
            <Heading
              fontWeight="800"
              lineHeight={1.15}
              mb="1rem"
              noOfLines={{ lg: 2 }}
              color="text"
              maxW={{ lg: "500px" }}
              ml="auto"
              size={{ lg: "xl", md: "lg", base: "md" }}
            >
              LO QUE DICEN NUESTROS <br /> CLIENTES
            </Heading>
            <Text mb="2rem">
              En CocktailMatch amamos la mixología. Creamos y compartimos
              cócteles con ingredientes de calidad y técnicas modernas.
              Aprende, experimenta y sorprende a tus amigos con bebidas
              espectaculares.
            </Text>
            <Button onClick={() => navigate("/about")}>Explorar más</Button>
          </Box>
        </Flex>
      </Reveal>
    </DIV>
  );
};

const DIV = styled.div`
  .cover {
    width: 100%;
    height: 90vh;
    text-align: center;
    position: relative;
    overflow: hidden;
    img {
      width: 100%;
      object-fit: cover;
      object-position: top;
    }
    .hero-content {
      position: absolute;
      width: min(80rem, 100%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      z-index: 11;
    }
    &::before {
      content: "";
      position: absolute;
      inset: 0;
      background-color: #fff4;
      z-index: 1;
    }
  }
  @media screen and (max-width: 768px) {
    .cover {
      height: 70vh;
      img {
        width: 100%;
        min-height: 100%;
      }
    }
  }
`;
