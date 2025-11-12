import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Heading,
  Flex,
  Input,
  Select,
  Button,
  Text,
  Spinner,
  useToast,
  Stack,
  Tag,
  TagLabel,
  TagRightIcon,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";
import axios from "axios";
import { useSelector } from "react-redux";

const ROLES = ["admin", "mixologist", "user"];

const AdminUsers = () => {
  const token = useSelector((store) => store.authReducer.token);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const api = process.env.REACT_APP_API_URL;

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${api}/users/getAllUsers/admin`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (error) {
      toast({
        title: "Error al cargar usuarios",
        description: error?.response?.data?.message || "Intenta más tarde",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const name = (u.name || "").toLowerCase();
      const email = (u.email || "").toLowerCase();
      const role = (u.role || "").toLowerCase();
      return name.includes(q) || email.includes(q) || role.includes(q);
    });
  }, [users, query]);

  useEffect(() => {
    setPage(1);
  }, [query, users]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const visible = filtered.slice(startIndex, startIndex + pageSize);

  const updateRole = async (userId, role) => {
    try {
      await axios.patch(
        `${api}/users/update/${userId}`,
        { role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast({
        title: "Rol actualizado",
        description: `Nuevo rol: ${role}`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      // re-fetch to reflect changes
      fetchUsers();
    } catch (error) {
      toast({
        title: "No se pudo actualizar el rol",
        description: error?.response?.data?.message || "Revisa tus permisos",
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  return (
    <Box maxW="7xl" mx="auto" p={6}>
      <Heading size="lg" mb={4}>
        Gestión de usuarios
      </Heading>
      <Flex gap={4} mb={4} align="center">
        <Input
          placeholder="Buscar por nombre, email o rol"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Select
          w="auto"
          value={pageSize}
          onChange={(e) => setPageSize(Number(e.target.value))}
        >
          {[5, 10, 20, 50].map((n) => (
            <option key={n} value={n}>{n} / página</option>
          ))}
        </Select>
      </Flex>

      {loading ? (
        <Flex justify="center" mt={8}>
          <Spinner size="lg" />
        </Flex>
      ) : (
        <Stack spacing={3}>
          {visible.map((u) => (
            <Flex key={u._id} p={4} borderWidth="1px" borderRadius="md" align="center" justify="space-between">
              <Box>
                <Text fontWeight="bold">{u.name}</Text>
                <Text fontSize="sm" color="gray.500">{u.email}</Text>
                <Tag mt={2} colorScheme="blue" size="sm">
                  <TagLabel>Rol: {u.role || "user"}</TagLabel>
                  <TagRightIcon as={CheckIcon} />
                </Tag>
              </Box>
              <Flex gap={3} align="center">
                <Select
                  value={u.role || "user"}
                  onChange={(e) => updateRole(u._id, e.target.value)}
                  w="40"
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </Select>
                {/* Bloquear/Activar se puede implementar cuando el backend soporte estado */}
              </Flex>
            </Flex>
          ))}
        </Stack>
      )}

      <Flex mt={6} align="center" gap={3}>
        <Button isDisabled={page === 1} onClick={() => setPage((p) => p - 1)}>
          Anterior
        </Button>
        <Text>
          Página {page} de {totalPages}
        </Text>
        <Button isDisabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>
          Siguiente
        </Button>
      </Flex>
    </Box>
  );
};

export default AdminUsers;