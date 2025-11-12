import React, { useState } from "react";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { AddCocktailForm } from "../components/forms/AddCocktailForm";
import {
  Box,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";

// inline: muestra el botón integrado en la página con texto
// floating: muestra un botón flotante redondo en la esquina inferior derecha
export const AddCocktailModal = ({ mode = "inline" }) => {
  const isAuth = useSelector((store) => store.authReducer.isAuth);
  const loggedInUser = useSelector((store) => store.authReducer.loggedInUser);
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // Mostrar solo en rutas pertinentes y para roles válidos
  const allowedPaths = ["/feed", "/explore", "/user-recipes"]; // secciones donde añadir tiene sentido
  const allowedRoles = ["mixologist", "admin"];
  const canShow = isAuth && allowedPaths.includes(location.pathname) && allowedRoles.includes(loggedInUser?.role);

  if (!canShow) return null;

  return (
    <>
      {mode === "floating" ? (
        <Box position="fixed" bottom="2rem" right="2rem" zIndex="999">
          <Button
            onClick={openModal}
            size="md"
            bgColor="accent"
            color="background"
            borderRadius="50%"
            width={4}
            p={6}
            boxShadow="xl"
          >
            <AddIcon />
          </Button>
        </Box>
      ) : (
        <Box w="min(80rem,100%)" mx="auto" px={4} py={4} display="flex" justifyContent="flex-end">
          <Button leftIcon={<AddIcon />} onClick={openModal}>
            Añadir cóctel
          </Button>
        </Box>
      )}

      <Modal isOpen={isOpen} onClose={closeModal}>
        <ModalOverlay />
        <ModalContent width="min(50rem,100%)">
          <ModalHeader textTransform={"uppercase"} fontSize={"2xl"}>
            Añadir cóctel
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <AddCocktailForm closeModal={closeModal} />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};
