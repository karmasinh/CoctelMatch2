import React, { useEffect, useMemo, useState } from "react";
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Stack,
  Collapse,
  useColorModeValue,
  useDisclosure,
  useToast,
  Popover,
  PopoverTrigger,
  PopoverContent,
  Avatar,
  Badge,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuOptionGroup,
  MenuItemOption,
} from "@chakra-ui/react";
import { useColorMode } from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import { FaBell } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { logoutUser } from "../../redux/authReducer/actions";
import { Notifications } from "./Notifications";
import axios from "axios";

export const Navbar = () => {
  const { isOpen, onToggle } = useDisclosure();
  const isAuth = useSelector((store) => store.authReducer.isAuth);
  const loggedInUser = useSelector((store) => store.authReducer.loggedInUser);
  const token = useSelector((store) => store.authReducer.token);
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();
  const address = useLocation();
  const [settings, setSettings] = useState(null);
  const base = process.env.REACT_APP_API_URL || "";
  const { colorMode, toggleColorMode } = useColorMode();
  const applyPalette = (palette) => {
    try {
      const root = document.documentElement;
      if (palette === "cyan") {
        root.style.setProperty("--chakra-colors-primary-500", "#06b6d4");
        root.style.setProperty("--chakra-colors-primary-600", "#0ea5b7");
        root.style.setProperty("--chakra-colors-accent", "#22d3ee");
      } else {
        root.style.setProperty("--chakra-colors-primary-500", "#fb8500");
        root.style.setProperty("--chakra-colors-primary-600", "#e97300");
        root.style.setProperty("--chakra-colors-accent", "#e89c45");
      }
      localStorage.setItem("theme_palette", palette);
    } catch (_) {}
  };

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await axios.get(`${base}/settings`);
        setSettings(data?.settings || null);
      } catch (_) {
        setSettings(null);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (!loggedInUser) return;
    const stored = localStorage.getItem("theme_preference");
    const desired = stored || (loggedInUser.role === "admin" ? "dark" : "light");
    if (colorMode !== desired) toggleColorMode();
    const palette = localStorage.getItem("theme_palette") || "default";
    applyPalette(palette);
  }, [loggedInUser, colorMode]);

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("primary-500", "white");
  const borderColor = useColorModeValue("gray.200", "gray.900");
  const signInColor = useColorModeValue("gray.600", "gray.200");

  const logoutHandler = () => {
    dispatch(logoutUser(token, toast, navigate));
  };

  if(address.pathname === "/admin") {
    return null;
  }

  return (
    <Box w="min(100%,80rem)" mx="auto">
      <Flex
        bg={bgColor}
        color={textColor}
        py={{ base: 2 }}
        px={{ base: 4 }}
        align={"center"}
      >
        <Flex
          flex={{ base: 1, md: "auto" }}
          ml={{ base: -2 }}
          display={{ base: "flex", md: "none" }}
        >
          <IconButton
            onClick={onToggle}
            icon={
              isOpen ? <CloseIcon w={3} h={3} /> : <HamburgerIcon w={5} h={5} />
            }
            variant={"ghost"}
            aria-label={"Toggle Navigation"}
          />
        </Flex>
        <Flex
          flex={{ base: 1 }}
          justifyContent={{
            lg: "space-between",
            md: "space-between",
            base: "flex-end",
          }}
        >
          <Text
            as={Link}
            to="/"
            fontSize="2xl"
            fontWeight="bold"
            letterSpacing={"1px"}
            fontFamily={"Kaushan Script"}
            color={textColor}
          >
            Cocktail
            <Text display="inline" color="primary.500">
              Match
            </Text>
          </Text>

          <Flex display={{ base: "none", md: "flex" }} ml={{ lg: 8, md: 4, base: 2 }}>
            <DesktopNav settings={settings} />
          </Flex>
          {/* Usuario mostrado desde menú a la derecha (DesktopNav) */}
        </Flex>
      </Flex>
      <Collapse in={isOpen} animateOpacity>
        <MobileNav settings={settings} />
        <Stack
          flex={{ base: 1, md: 0 }}
          justify={"flex-start"}
          direction={"row"}
          spacing={{ base: 2, md: 4 }}
          p={4}
        >
          {isAuth ? (
            <>
              <Popover trigger={"hover"} placement={"top-end"}>
                <PopoverTrigger>
                  <IconButton
                    variant="link"
                    color={textColor}
                    _hover={{
                      opacity: 1,
                      color: "primary.500",
                    }}
                    aria-label="Notifications"
                  >
                    <FaBell size={24} />
                  </IconButton>
                </PopoverTrigger>
                <PopoverContent zIndex={100000} position="relative">
                  <Box p="4">
                    <Notifications />
                  </Box>
                </PopoverContent>
              </Popover>
              <Button
                onClick={logoutHandler}
                size={{ lg: "lg", md: "md", base: "sm" }}
              >
                Logout
              </Button>
            </>
          ) : (
            <>
              <Button
                as={Link}
                to="/login"
                variant={"outline"}
                size={{ lg: "lg", md: "md", base: "sm" }}
              >
                Login
              </Button>
              <Button
                size={{ lg: "lg", md: "md", base: "sm" }}
                as={Link}
                to="/signup"
              >
                SignUp
              </Button>
            </>
          )}
        </Stack>
      </Collapse>
    </Box>
  );
};

const DesktopNav = ({ settings }) => {
  const linkColor = useColorModeValue("text", "white");
  const linkHoverColor = useColorModeValue("primary.500", "teal.500");
  const { colorMode, toggleColorMode } = useColorMode();
  const applyPalette = (palette) => {
    try {
      const root = document.documentElement;
      if (palette === "cyan") {
        root.style.setProperty("--chakra-colors-primary-500", "#06b6d4");
        root.style.setProperty("--chakra-colors-primary-600", "#0ea5b7");
        root.style.setProperty("--chakra-colors-accent", "#22d3ee");
      } else {
        root.style.setProperty("--chakra-colors-primary-500", "#fb8500");
        root.style.setProperty("--chakra-colors-primary-600", "#e97300");
        root.style.setProperty("--chakra-colors-accent", "#e89c45");
      }
      localStorage.setItem("theme_palette", palette);
    } catch (_) {}
  };
  const isAuth = useSelector((store) => store.authReducer.isAuth);
  const loggedInUser = useSelector((store) => store.authReducer.loggedInUser);
  const token = useSelector((store) => store.authReducer.token);
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("primary-500", "white");
  const borderColor = useColorModeValue("gray.200", "gray.900");
  const signInColor = useColorModeValue("gray.600", "gray.200");

  const logoutHandler = () => {
    dispatch(logoutUser(token, toast, navigate));
  };
  const baseItems = [
    { label: "Explorar", href: "/explore", visible: settings?.navbar?.showExplore !== false },
    { label: "Social", href: "/feed", visible: true },
    { label: "Acerca de", href: "/about", visible: settings?.navbar?.showAbout !== false },
    { label: "Búsqueda", href: "/ingredients-search", visible: true },
  ];

  const adminItems = [
    { label: "Administración", href: "/admin" },
    { label: "Ingredientes", href: "/admin/ingredients" },
    { label: "Usuarios", href: "/admin/users" },
    { label: "Editor Home", href: "/admin/home-editor" },
  ];

  const roleItems = useMemo(() => {
    if (!isAuth) return [];
    if (loggedInUser?.role === "admin") {
      if (settings?.navbar?.showAdmin === false) return [];
      return adminItems;
    }
    if (loggedInUser?.role === "mixologist") return [{ label: "Añadir cóctel", href: "/user-recipes" }];
    if (loggedInUser?.role === "user") return [{ label: "Mi feed", href: "/feed" }];
    return [];
  }, [isAuth, loggedInUser, settings]);

  return (
    <Flex gap="1rem" alignItems={"center"}>
      <Flex gap="1rem" alignItems={"center"}>
        {[...baseItems.filter((i) => i.visible), ...roleItems].map((item) => (
          <Text
            key={item.href}
            as={Link}
            to={item.href}
            color={linkColor}
            _hover={{ textDecoration: "none", color: linkHoverColor }}
          >
            {item.label}
          </Text>
        ))}
      </Flex>
      <Stack
        flex={{ base: 1, md: 0 }}
        justify={"flex-end"}
        direction={"row"}
        spacing={{ base: 2, md: 4 }}
      >
        {isAuth ? (
          <>
            <Popover trigger={"hover"} placement={"top-end"}>
              <PopoverTrigger>
                <IconButton
                  variant="link"
                  color={textColor}
                  _hover={{
                    opacity: 1,
                    color: "primary.500",
                  }}
                  aria-label="Notifications"
                >
                  <FaBell size={24} />
                </IconButton>
              </PopoverTrigger>
              <PopoverContent zIndex={100000} position="relative">
                <Box p="4">
                  <Notifications />
                </Box>
              </PopoverContent>
            </Popover>
            <Menu placement="bottom-end">
              <MenuButton as={Button} variant="ghost" px={2} rightIcon={null}>
                <Flex align="center" gap={3}>
                  <Avatar size="sm" name={loggedInUser?.name} src={loggedInUser?.avatar} />
                  <Flex direction="column" align="flex-start" display={{ base: "none", md: "flex" }}>
                    <Text fontSize="sm" color={textColor}>
                      {loggedInUser?.name}
                    </Text>
                    {loggedInUser?.role && (
                      <Badge colorScheme="purple" fontSize="0.65rem" borderRadius="md">
                        {loggedInUser.role}
                      </Badge>
                    )}
                  </Flex>
                </Flex>
              </MenuButton>
              <MenuList>
                <MenuItem as={Link} to="/account">Configuración de la cuenta</MenuItem>
                {/* Selector de tema */}
                <MenuOptionGroup title="Modo" type="radio" defaultValue={colorMode} onChange={(val) => { const desired = val === "dark" ? "dark" : "light"; if (colorMode !== desired) toggleColorMode(); localStorage.setItem("theme_preference", desired); }}>
                  <MenuItemOption value="light">Claro</MenuItemOption>
                  <MenuItemOption value="dark">Oscuro</MenuItemOption>
                </MenuOptionGroup>
                <MenuOptionGroup title="Paleta" type="radio" defaultValue={localStorage.getItem("theme_palette") || "default"} onChange={(val) => applyPalette(val)}>
                  <MenuItemOption value="default">Naranja</MenuItemOption>
                  <MenuItemOption value="cyan">Cyan</MenuItemOption>
                </MenuOptionGroup>
                <MenuItem onClick={logoutHandler}>Cerrar sesión</MenuItem>
              </MenuList>
            </Menu>
          </>
        ) : (
          <>
            <Button
              as={Link}
              to="/login"
              variant={"outline"}
              size={{ lg: "lg", md: "md", base: "sm" }}
            >
                Iniciar sesión
            </Button>
            <Button
              size={{ lg: "lg", md: "md", base: "sm" }}
              as={Link}
              to="/signup"
            >
                Registrarse
            </Button>
          </>
        )}
      </Stack>
    </Flex>
  );
};

const MobileNav = ({ settings }) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const isAuth = useSelector((store) => store.authReducer.isAuth);
  const loggedInUser = useSelector((store) => store.authReducer.loggedInUser);

  const baseItems = [
    { label: "Explorar", href: "/explore", visible: settings?.navbar?.showExplore !== false },
    { label: "Social", href: "/feed", visible: true },
    { label: "Acerca de", href: "/about", visible: settings?.navbar?.showAbout !== false },
    { label: "Búsqueda", href: "/ingredients-search", visible: true },
  ];

  const adminItems = [
    { label: "Administración", href: "/admin" },
    { label: "Ingredientes", href: "/admin/ingredients" },
    { label: "Usuarios", href: "/admin/users" },
    { label: "Editor Home", href: "/admin/home-editor" },
  ];

  const roleItems = [];
  if (isAuth && loggedInUser?.role === "admin" && settings?.navbar?.showAdmin !== false) roleItems.push(...adminItems);
  if (isAuth && loggedInUser?.role === "mixologist") roleItems.push({ label: "Añadir cóctel", href: "/user-recipes" });
  if (isAuth && loggedInUser?.role === "user") roleItems.push({ label: "Mi feed", href: "/feed" });

  return (
    <Stack bg={bgColor} p={4} display={{ md: "none", base: "flex" }}>
      {[...baseItems.filter((i) => i.visible), ...roleItems].map((item) => (
        <MobileNavItem key={item.href} label={item.label} href={item.href} />
      ))}
    </Stack>
  );
};

const MobileNavItem = ({ label, href }) => {
  return (
    <Text
      py={2}
      as={Link}
      to={href ?? "#"}
      fontWeight={600}
      color={useColorModeValue("primary.500", "white")}
      _hover={{
        textDecoration: "none",
      }}
    >
      {label}
    </Text>
  );
};

export default Navbar;
