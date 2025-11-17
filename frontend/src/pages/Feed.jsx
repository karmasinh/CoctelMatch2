import {
  Box,
  Flex,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Divider,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { UserFeed } from "../components/Feed/UserFeed";
import { FriendCard, MiniCard_Chef } from "../components/Feed/MiniCard";
import styled from "@emotion/styled";
import { BsSearch } from "react-icons/bs";
import { NonFriends } from "../components/Feed/NonFriends";
import { Requests } from "../components/Feed/Requests";
import { useDispatch, useSelector } from "react-redux";
import { getFriends } from "../redux/userReducer/actions";
import { AddCocktailModal } from "./AddCocktailModal";

export const Feed = () => {
  const dispatch = useDispatch();
  const friends = useSelector((store) => store.userReducer.friends);
  const token =
    useSelector((store) => store.authReducer.token) ||
    localStorage.getItem("token");
  useEffect(() => {
    if (token) {
      dispatch(getFriends(token));
    }
  }, []);
  return (
    <DIV>
      <Flex spacing={8} direction="row">
        <Box
          p={5}
          w="22%"
          h="90vh"
          overflowY="scroll"
          className="scroll"
          bg={{ base: "white", md: "background" }}
          borderWidth="1px"
          borderColor="borderColor"
          borderRadius="md"
        >
          <Heading size={"md"} mb={"1rem"} textTransform="uppercase">
            Nuevos amigos
          </Heading>
          <NonFriends />
          <Divider my={5} />
          <Heading size={"md"} mb={"1rem"} textTransform="uppercase">
            Solicitudes de amistad
          </Heading>
          <Requests />
          <Divider my={5} />
          <Heading size={"md"} mb="1rem" textTransform="uppercase">
            Tus amigos
          </Heading>
          <InputGroup mb="10px">
            <InputLeftElement pointerEvents="none">
              <BsSearch color="gray.300" />
            </InputLeftElement>
            <Input type="search" placeholder="Buscar" />
          </InputGroup>
          {friends.map((friend, index) => (
            <FriendCard friend={friend} key={index} />
          ))}
        </Box>
        <Box flex="1" maxW="min(80rem, 100%)" mx="auto">
          <AddCocktailModal mode="inline" />
          <UserFeed />
        </Box>
      </Flex>
    </DIV>
  );
};

const DIV = styled.div`
  background-color: #f7fbfc;
  .scroll::-webkit-scrollbar {
    display: none;
  }
`;
