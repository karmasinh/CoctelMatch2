import React, { useEffect, useState } from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  Divider,
  Avatar,
  Skeleton,
  SimpleGrid,
  Image,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  HStack,
  UnorderedList,
  ListItem,
  Tooltip,
} from "@chakra-ui/react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { buildImageUrl } from "../utils/media";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

const SingleUser = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const token = useSelector((s) => s.authReducer.token) || localStorage.getItem("token");

  const [user, setUser] = useState({});
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : undefined;
    setLoading(true);
    setErrorMsg("");
    axios
      .get(`${API}/users/getAllUsers/admin`, config)
      .then((res) => {
        const match = (res.data || []).find((u) => u._id === userId);
        if (!match) {
          setErrorMsg("Usuario no encontrado.");
          setUser({});
          setRecipes([]);
        } else {
          setUser(match);
          setRecipes(match?.recipes || []);
        }
      })
      .catch(() => {
        setErrorMsg("Error al cargar el usuario.");
        setUser({});
        setRecipes([]);
      })
      .finally(() => setLoading(false));
  }, [token, userId]);

  return (
    <Container maxW="full" minH="100vh" p={0} paddingBlock={{ base: "2rem", md: "3rem" }} bg={{ base: "gray.50", md: "gray.100" }}>
      <Flex direction="column" p={{ base: 4, md: 6 }}>
        <Box w="min(80rem,100%)" mx="auto" display="flex" justifyContent="space-between" gap="1rem" flexWrap="wrap">
          <Box w={{ md: "25%", base: "100%" }} display="flex" alignItems="center" justifyContent="center" p={2}>
            <Skeleton isLoaded={!loading} borderRadius="full">
              <Avatar size="2xl" name={user?.name || ""} src={buildImageUrl(user?.profileImage)} />
            </Skeleton>
          </Box>
          <Divider display={{ base: "none", md: "block" }} orientation="vertical" borderColor="gray.300" opacity={0.4} />
          <Box flex="1" minW={{ base: "100%", md: "60%" }} display="flex" flexDir="column" gap={3}>
            <Skeleton isLoaded={!loading}>
              <HStack spacing={4} align="baseline">
                <Heading size="md" textTransform="uppercase">{user?.name || "—"}</Heading>
                <Text color="gray.600">{user?.city || ""}</Text>
              </HStack>
            </Skeleton>
            <Skeleton isLoaded={!loading}>
              <Text color="gray.700">{user?.bio || "Sin biografía."}</Text>
            </Skeleton>
            <Skeleton isLoaded={!loading}>
              <UnorderedList listStyleType="none" display="flex" gap={8} m="0" p="0" textAlign="center">
                <ListItem>
                  <Text fontWeight="bold" textTransform="uppercase">Posts</Text>
                  <Text>{recipes?.length || 0}</Text>
                </ListItem>
              </UnorderedList>
            </Skeleton>
            {errorMsg && (<Text color="red.500" fontWeight="medium">{errorMsg}</Text>)}
          </Box>
        </Box>

        <Box w="min(80rem,100%)" m="auto" mt="1rem">
          <Tabs colorScheme="primary" isFitted>
            <TabList>
              <Tab>Posts</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Skeleton isLoaded={!loading}>
                  {recipes?.length > 0 ? (
                    <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={3}>
                      {recipes.map((ele) => (
                        <Tooltip bg="accent" px={4} py={2} label={`Likes: ${ele?.likes?.length || 0}, Comments: ${ele?.comments?.length || 0}`} key={ele?._id}>
                          <Box role="button" onClick={() => navigate(`/recipe/${ele._id}`)} cursor="pointer" borderRadius="md" overflow="hidden" _hover={{ opacity: 0.9 }} bg="white">
                            <Image src={buildImageUrl(ele?.images?.[0])} fallbackSrc="/images/loginImage.jpg" alt={ele?.title || "Imagen de receta"} w="100%" h="220px" objectFit="cover" />
                          </Box>
                        </Tooltip>
                      ))}
                    </SimpleGrid>
                  ) : (
                    <Box bg="white" border="1px solid" borderColor="gray.200" borderRadius="md" p={6} textAlign="center">
                      <Text color="gray.600">Este usuario no tiene posts aún.</Text>
                    </Box>
                  )}
                </Skeleton>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Container>
  );
};

export default SingleUser;
