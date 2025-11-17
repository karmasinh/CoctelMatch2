import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Image, useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { loginUser } from "../../redux/authReducer/actions";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";

import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  FormControl,
  FormLabel,
  Stack,
  Heading,
} from "@chakra-ui/react";

export const LoginForm = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle form submission logic here
    if (email && password) {
      let userObj = { email, password };
      dispatch(loginUser(userObj, toast, navigate));
    }
  };

  return (
    <Box p={4}>
      <Box></Box>
      <Box>
        <Heading size="2xl" textTransform={"uppercase"} mb={"2rem"}>
          Iniciar sesión
        </Heading>
        <form onSubmit={handleSubmit}>
          <Stack spacing={4}>
            <FormControl>
              <FormLabel>Correo electrónico</FormLabel>
              <Input
                type="email"
                placeholder="Introduce tu correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Contraseña</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Introduce tu contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <InputRightElement px={2}>
                  <Button
                    alignSelf="center"
                    variant="outline"
                    size={"md"}
                    onClick={handlePasswordVisibility}
                  >
                    {showPassword ? <ViewIcon /> : <ViewOffIcon />}
                  </Button>
                </InputRightElement>
              </InputGroup>
            </FormControl>

            <Button type="submit" colorScheme="primary" width="min-content">
              Entrar
            </Button>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};
