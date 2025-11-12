import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Divider,
  Flex,
  HStack,
  Input,
  Tag,
  TagCloseButton,
  Spinner,
  useToast,
} from "@chakra-ui/react";

export default function AdminIngredients() {
  const token = useSelector((store) => store.authReducer.token) || localStorage.getItem("token");
  const toast = useToast();

  const [ingredients, setIngredients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState("");
  const [newName, setNewName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingName, setEditingName] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 24;

  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

  const loadIngredients = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/ingredients/all${query ? `?search=${encodeURIComponent(query)}` : ""}`, config);
      setIngredients(res.data?.ingredients || []);
    } catch (err) {
      toast({ title: "Error cargando ingredientes", description: err?.response?.data?.message || err.message, status: "error", duration: 3000, isClosable: true });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadIngredients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  useEffect(() => {
    // Reset page when query changes or list updates
    setPage(1);
  }, [query, ingredients.length]);

  const handleAdd = async () => {
    const name = (newName || "").trim();
    if (!name) return;
    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/ingredients`, { name }, config);
      setNewName("");
      toast({ title: "Ingrediente creado", status: "success", duration: 2000, isClosable: true });
      loadIngredients();
    } catch (err) {
      toast({ title: "No se pudo crear", description: err?.response?.data?.message || err.message, status: "error", duration: 3000, isClosable: true });
    }
  };

  const startEdit = (id, name) => {
    setEditingId(id);
    setEditingName(name);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingName("");
  };

  const confirmEdit = async () => {
    const name = (editingName || "").trim();
    if (!name || !editingId) return;
    try {
      await axios.patch(`${process.env.REACT_APP_API_URL}/ingredients/${editingId}`, { name }, config);
      toast({ title: "Ingrediente actualizado", status: "success", duration: 2000, isClosable: true });
      cancelEdit();
      loadIngredients();
    } catch (err) {
      toast({ title: "No se pudo actualizar", description: err?.response?.data?.message || err.message, status: "error", duration: 3000, isClosable: true });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/ingredients/${id}`, config);
      toast({ title: "Ingrediente eliminado", status: "success", duration: 2000, isClosable: true });
      loadIngredients();
    } catch (err) {
      toast({ title: "No se pudo eliminar", description: err?.response?.data?.message || err.message, status: "error", duration: 3000, isClosable: true });
    }
  };

  return (
    <Box p={5}>
      <Heading size="lg" mb={4}>Administrar ingredientes</Heading>
      <Card>
        <CardHeader>
          <Flex gap="1rem" alignItems="center" flexWrap="wrap">
            <Input placeholder="Buscar ingrediente" value={query} onChange={(e) => setQuery(e.target.value)} maxW="20rem" />
            <Flex gap="0.5rem" alignItems="center">
              <Input placeholder="Nuevo ingrediente" value={newName} onChange={(e) => setNewName(e.target.value)} maxW="16rem" />
              <Button variant="outline" onClick={handleAdd}>Añadir</Button>
            </Flex>
          </Flex>
        </CardHeader>
        <Divider />
        <CardBody>
          {isLoading ? (
            <Flex alignItems="center" justifyContent="center" minH="30vh">
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="primary.500" size="xl" />
            </Flex>
          ) : ingredients.length === 0 ? (
            <Heading as="h2" size="md" color="text">Sin ingredientes</Heading>
          ) : (
            <>
              <HStack display="flex" flexWrap="wrap" spacing="2">
                {ingredients.slice((page - 1) * pageSize, page * pageSize).map((ing) => (
                  <Tag key={ing._id} size="lg" variant="outline" p={2}>
                    {editingId === ing._id ? (
                      <Flex alignItems="center" gap="0.5rem">
                        <Input value={editingName} onChange={(e) => setEditingName(e.target.value)} size="sm" maxW="12rem" />
                        <Button size="sm" variant="solid" onClick={confirmEdit}>Guardar</Button>
                        <Button size="sm" variant="ghost" onClick={cancelEdit}>Cancelar</Button>
                      </Flex>
                    ) : (
                      <Flex alignItems="center" gap="0.75rem">
                        <span>{ing.name}</span>
                        <Button size="sm" variant="outline" onClick={() => startEdit(ing._id, ing.name)}>Editar</Button>
                        <Button size="sm" colorScheme="red" onClick={() => handleDelete(ing._id)}>Eliminar</Button>
                      </Flex>
                    )}
                    <TagCloseButton display="none" />
                  </Tag>
                ))}
              </HStack>
              <Flex mt={4} gap="0.5rem" alignItems="center">
                <Button size="sm" variant="outline" onClick={() => setPage((p) => Math.max(1, p - 1))} isDisabled={page === 1}>Anterior</Button>
                <Box fontSize="sm">Página {page} de {Math.max(1, Math.ceil(ingredients.length / pageSize))}</Box>
                <Button size="sm" variant="outline" onClick={() => setPage((p) => p + 1)} isDisabled={page >= Math.ceil(ingredients.length / pageSize)}>Siguiente</Button>
              </Flex>
            </>
          )}
        </CardBody>
        <CardFooter></CardFooter>
      </Card>
    </Box>
  );
}