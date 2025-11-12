import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  Image,
  Text,
  UnorderedList,
  ListItem,
  Grid,
  HStack,
  Tabs,
  TabList,
  Tab,
  TabPanel,
  TabPanels,
  Tooltip,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Editable,
  EditablePreview,
  useEditableControls,
  ButtonGroup,
  IconButton,
  EditableInput,
  Textarea,
  Heading,
  Divider,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, EditIcon } from "@chakra-ui/icons";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserData, updateUserDetails } from "../redux/authReducer/actions";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { buildImageUrl } from "../utils/media";

export const Account = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();
  const [showRecipe, setShowRecipe] = useState("recipes");
  const token =
    useSelector((store) => store.authReducer.token) ||
    localStorage.getItem("token");
  // console.log(token)
  const user = useSelector((store) => store.authReducer.loggedInUser);
  console.log("user", user);
  // const recipes = useSelector((store) => store.authReducer.recipes);
  const [recipes, setRecipes] = useState([]);
  const [likedRecipes, setLikedRecipes] = useState([]);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const [userName, setUserName] = useState(user?.name);
  const [userBio, setUserBio] = useState(user?.bio);
  const [userCity, setUserCity] = useState(user?.city);
  const [profileImageFile, setProfileImageFile] = useState(null);

  // Function to edit profile
  const handleEditProfile = () => {
    const newUserName = userName || user?.name;
    const newUserBio = userBio || user?.bio;
    const newUserCity = userCity || user?.city;

    const data = {
      name: newUserName,
      bio: newUserBio,
      city: newUserCity,
    };
    console.log("Data that i wanter to get updated", data);
    const headers = {
      Authorization: `Bearer ${token}`,
    };
    const doUpdate = (payload) => {
      dispatch(updateUserDetails(user?._id, payload, headers, toast));
      navigate("/");
    };

    if (profileImageFile) {
      const formData = new FormData();
      formData.append("file", profileImageFile);
      axios
        .post(`${process.env.REACT_APP_API_URL}/upload`, formData)
        .then((res) => {
          const paths = res?.data?.files || [];
          if (paths.length > 0) {
            doUpdate({ ...data, profileImage: paths[0] });
          } else {
            doUpdate(data);
          }
        })
        .catch(() => doUpdate(data));
    } else {
      doUpdate(data);
    }
  };

  useEffect(() => {
    if (token) {
      dispatch(getUserData(token, toast));
    }
  }, []);

  useEffect(() => {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/recipe/getMyRecipe?populate=${showRecipe}&`,
        config
      )
      .then((response) => {
        setRecipes(response.data.recipes);
        setLikedRecipes(response.data.likedRecipes);
        setSavedRecipes(response.data.savedRecipes);
      })
      .catch((error) => {
        console.error("Error fetching user recipes:", error);
      });
  }, [showRecipe]);

  return (
    <Container
      bgColor={"#EEF2F7"}
      maxW="full"
      height={"100vh"}
      p={0}
      paddingBlock={"3rem"}
    >
      {/* Modal for editting profile */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader textTransform={"uppercase"} fontSize={"2xl"}>
            Edit profile
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {/* For name */}
            <Center>
              <Text fontWeight={"bold"} textTransform={"uppercase"}>
                Name
              </Text>
            </Center>
            <Editable
              mb="1rem"
              textAlign="center"
              defaultValue={user?.name}
              fontSize="md"
              isPreviewFocusable={false}
              onChange={(newUserName) => setUserName(newUserName)}
            >
              <EditablePreview />
              {/* Here is the custom input */}
              <Textarea as={EditableInput} my="0.5rem" />
              <EditableControls />
            </Editable>
            <Divider mb="1rem"></Divider>

            {/* For profile image */}
            <Center>
              <Text fontWeight={"bold"} textTransform={"uppercase"}>
                Profile Image
              </Text>
            </Center>
            <Center mb="1rem">
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
              />
            </Center>

            {/* For city */}
            <Center>
              <Text fontWeight={"bold"} textTransform={"uppercase"}>
                City
              </Text>
            </Center>
            <Editable
              mb="1rem"
              textAlign="center"
              defaultValue={user?.city}
              fontSize="md"
              isPreviewFocusable={false}
              onChange={(newUserCity) => setUserCity(newUserCity)}
            >
              <EditablePreview />
              {/* Here is the custom input */}
              <Textarea as={EditableInput} my="0.5rem" />
              <EditableControls />
            </Editable>
            <Divider mb="1rem"></Divider>

            {/* For bio */}
            <Center>
              <Text fontWeight={"bold"} textTransform="uppercase">
                Biography
              </Text>
            </Center>
            <Editable
              mb="1rem"
              textAlign="center"
              defaultValue={user?.bio}
              fontSize="md"
              isPreviewFocusable={false}
              onChange={(newUserBio) => setUserBio(newUserBio)}
            >
              <EditablePreview />
              {/* Here is the custom input */}
              <Textarea as={EditableInput} my="0.5rem" />
              <EditableControls />
            </Editable>
            <Divider mb="1rem"></Divider>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={"1rem"} onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleEditProfile}>Edit</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      <Flex flexDir={{ base: "column" }} bg="gray.50" p={{ base: 4, md: 8 }}>
        {/* Encabezado del perfil */}
        <Box w={"min(80rem,100%)"} mx="auto" bg="white" borderRadius="xl" boxShadow="md" p={{ base: 4, md: 6 }}>
          <Flex gap={6} align={{ base: "flex-start", md: "center" }} direction={{ base: "column", md: "row" }}>
            <Center>
              <Box borderRadius="full" overflow="hidden" w={{ base: 28, md: 36 }} h={{ base: 28, md: 36 }}>
                <Image
                  w="100%"
                  h="100%"
                  borderRadius="full"
                  objectFit="cover"
                  src={user?.profileImage}
                  fallbackSrc="/images/loginImage.jpg"
                  alt="Foto de perfil"
                />
              </Box>
            </Center>
            <Box flex="1">
              <Flex align="center" gap={3} wrap="wrap">
                <Heading size={{ base: "md", md: "lg" }} textTransform="uppercase">
                  {user?.name}
                </Heading>
                <Text color="gray.600">{user?.city}</Text>
                <Text color="gray.500">Rol: {user?.role || "usuario"}</Text>
                <Button size="sm" colorScheme="blue" ml="auto" onClick={onOpen}>
                  Editar perfil
                </Button>
              </Flex>
              {user?.bio && (
                <Text mt={2} color="gray.700">{user?.bio}</Text>
              )}
              <Grid mt={4} templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(4, 1fr)" }} gap={3}>
                <Box bg="gray.100" borderRadius="md" p={3} textAlign="center">
                  <Text fontWeight="bold" textTransform="uppercase" fontSize="xs" color="gray.600">Publicaciones</Text>
                  <Text fontSize="xl" fontWeight="bold">{user?.recipes.length}</Text>
                </Box>
                <Box bg="gray.100" borderRadius="md" p={3} textAlign="center">
                  <Text fontWeight="bold" textTransform="uppercase" fontSize="xs" color="gray.600">Amigos</Text>
                  <Text fontSize="xl" fontWeight="bold">{user?.friends.length}</Text>
                </Box>
                <Box bg="gray.100" borderRadius="md" p={3} textAlign="center">
                  <Text fontWeight="bold" textTransform="uppercase" fontSize="xs" color="gray.600">Guardados</Text>
                  <Text fontSize="xl" fontWeight="bold">{user?.savedRecipes.length}</Text>
                </Box>
                <Box bg="gray.100" borderRadius="md" p={3} textAlign="center">
                  <Text fontWeight="bold" textTransform="uppercase" fontSize="xs" color="gray.600">Me gusta</Text>
                  <Text fontSize="xl" fontWeight="bold">{user?.likedRecipes.length}</Text>
                </Box>
              </Grid>
            </Box>
          </Flex>
        </Box>

        {/* User Posts and others */}
        <Box w={"min(80rem,100%)"} m={"auto"} mt={6}>
          {/* Grid View of Images */}
          <Tabs colorScheme="blue" isFitted variant="enclosed">
            <TabList>
              <Tab onClick={() => setShowRecipe("recipes")}>Publicaciones</Tab>
              <Tab onClick={() => setShowRecipe("savedRecipes")}>
                Cócteles guardados
              </Tab>
              <Tab onClick={() => setShowRecipe("likedRecipes")}>
                Últimos me gusta
              </Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={3}>
                  {recipes?.length > 0 &&
                    recipes.map((ele, index) => (
                      <Tooltip
                        bg="blue.500"
                        px={4}
                        py={2}
                        label={`Likes: ${ele?.likes?.length}, Comments: ${ele?.comments?.length}`}
                        key={index}
                      >
                        <div>
                          <Image
                            src={buildImageUrl(ele.images?.[0])}
                            alt="Recipe Image"
                            boxSize="100%"
                            objectFit="cover"
                            onClick={() => navigate(`/recipe/${ele._id}`)}
                          />
                        </div>
                      </Tooltip>
                    ))}
                </Grid>
              </TabPanel>
              <TabPanel>
                <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={3}>
                  {savedRecipes?.length > 0 &&
                    savedRecipes.map((ele, index) => (
                      <Tooltip
                        bg="blue.500"
                        px={4}
                        py={2}
                        label={`Likes: ${ele?.likes?.length}, Comments: ${ele?.comments?.length}`}
                        key={index}
                      >
                        <div>
                          <Image
                            src={buildImageUrl(ele.images?.[0])}
                            alt="Recipe Image"
                            boxSize="100%"
                            objectFit="cover"
                            onClick={() => navigate(`/recipe/${ele._id}`)}
                          />
                        </div>
                      </Tooltip>
                    ))}
                </Grid>
              </TabPanel>
              <TabPanel>
                <Grid templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(3, 1fr)" }} gap={3}>
                  {likedRecipes?.length > 0 &&
                    likedRecipes.map((ele, index) => (
                      <Tooltip
                        bg="blue.500"
                        px={4}
                        py={2}
                        label={`Likes: ${ele?.likes?.length}, Comments: ${ele?.comments?.length}`}
                        key={index}
                      >
                        <div>
                          <Image
                            src={buildImageUrl(ele.images?.[0])}
                            alt="Recipe Image"
                            boxSize="100%"
                            objectFit="cover"
                            onClick={() => navigate(`/recipe/${ele._id}`)}
                          />
                        </div>
                      </Tooltip>
                    ))}
                </Grid>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Container>
  );
};

function EditableControls() {
  const {
    isEditing,
    getSubmitButtonProps,
    getCancelButtonProps,
    getEditButtonProps,
  } = useEditableControls();

  return isEditing ? (
    <ButtonGroup justifyContent="center" size="sm">
      <IconButton icon={<CheckIcon />} {...getSubmitButtonProps()} />
      <IconButton icon={<CloseIcon />} {...getCancelButtonProps()} />
    </ButtonGroup>
  ) : (
    <Flex justifyContent="center">
      <IconButton size="sm" icon={<EditIcon />} {...getEditButtonProps()} />
    </Flex>
  );
}
