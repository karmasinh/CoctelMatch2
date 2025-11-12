import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@chakra-ui/react";
import {
  Box,
  Heading,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Select,
} from "@chakra-ui/react";
import { createUser } from "../../redux/authReducer/actions";
import { useDispatch } from "react-redux";

export const SignUpForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    city: "",
    gender: "",
    bio: "",
    role: "",
  });
  const [profileImage, setProfileImage] = useState(null);
  const canSubmit =
    formData.name.trim().length > 0 &&
    formData.email.trim().length > 0 &&
    formData.password.trim().length > 0 &&
    (formData.role === "user" || formData.role === "mixologist");

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    if (type === "file") {
      setProfileImage(e.target.files[0]);
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formDataToSubmit = new FormData();
    formDataToSubmit.append("name", formData.name);
    formDataToSubmit.append("email", formData.email);
    formDataToSubmit.append("password", formData.password);
    formDataToSubmit.append("city", formData.city);
    formDataToSubmit.append("gender", formData.gender);
    formDataToSubmit.append("bio", formData.bio);
    if (formData.role) {
      formDataToSubmit.append("role", formData.role);
    }
    formDataToSubmit.append("profileImage", profileImage);

    dispatch(createUser(formDataToSubmit, toast, navigate));
  };

  return (
    <Box>
      <Heading textTransform={"uppercase"} mb="2rem" size="2xl">
        Crear cuenta
      </Heading>
      <form onSubmit={handleSubmit}>
        <FormControl id="name" isRequired>
          <FormLabel>Nombre</FormLabel>
          <Input type="text" name="name" onChange={handleChange} />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Correo electrónico</FormLabel>
          <Input type="email" name="email" onChange={handleChange} />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Contraseña</FormLabel>
          <Input type="password" name="password" onChange={handleChange} />
        </FormControl>
        <FormControl id="city">
          <FormLabel>Ciudad</FormLabel>
          <Input type="text" name="city" onChange={handleChange} />
        </FormControl>
        <FormControl id="gender">
          <FormLabel>Género</FormLabel>
          <Select
            name="gender"
            onChange={handleChange}
            placeholder="Selecciona género"
          >
            <option value="Male">Hombre</option>
            <option value="Female">Mujer</option>
          </Select>
        </FormControl>
        <FormControl id="bio">
          <FormLabel>Biografía</FormLabel>
          <Textarea name="bio" onChange={handleChange} />
        </FormControl>
        <FormControl id="role" isRequired>
          <FormLabel>Rol</FormLabel>
          <Select
            name="role"
            onChange={handleChange}
            placeholder="Selecciona rol"
            value={formData.role}
          >
            <option value="user">Usuario</option>
            <option value="mixologist">Mixólogo</option>
          </Select>
        </FormControl>
        <FormControl id="profileImage">
          <FormLabel>Imagen de perfil</FormLabel>
          <Input
            type="file"
            name="profileImage"
            accept="image/*"
            onChange={handleChange}
          />
        </FormControl>
        <Button type="submit" colorScheme="primary" mt={4} isDisabled={!canSubmit}>
          Crear cuenta
        </Button>
      </form>
    </Box>
  );
};
