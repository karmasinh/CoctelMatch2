import {
  Box,
  Divider,
  Flex,
  Heading,
  Icon,
  Text,
  Link,
} from "@chakra-ui/react";
import {
  FaFacebook,
  FaTwitter,
  FaEnvelope,
  FaPinterest,
  FaLinkedin,
} from "react-icons/fa";
import { useLocation, Link as RouterLink } from "react-router-dom";

function Footer() {

  const location = useLocation();

  if(location.pathname === "/admin") {
    return null;
  }

  return (
    <>
      <Divider orientation="horizontal" marginy="2rem" borderRadius="full" />
      <Box width="min(80rem,100%)" mx="auto" py={10} color="text" px={4}>
        <Text
          fontFamily={"Kaushan Script"}
          fontSize="2xl"
          fontWeight="bold"
          marginBottom="2rem"
        >
          Cocktail
          <Text as="span" display="inline" color="primary.500">
            Match
          </Text>
        </Text>
        <Flex wrap={'wrap'} gap={8} justifyContent="space-between">
          <Box>
            <Heading as="h6" size="MD" marginBottom="16px">
              Sobre CocktailMatch
            </Heading>
            <Link as={RouterLink} to="/about" display="block" mb={2}>Acerca de</Link>
            <Link as={RouterLink} to="/mixology-guides" display="block" mb={2}>Guías de mixología</Link>
            <Link as={RouterLink} to="/team" display="block" mb={2}>Equipo</Link>
            <Link as={RouterLink} to="/contact" display="block" mb={2}>Contacto</Link>
          </Box>
          <Box p={0} mr={4}>
            <Heading as="h6" size="MD" marginBottom="16px">
              Explora
            </Heading>
            <Link as={RouterLink} to="/explore" display="block" mb={2}>Cócteles</Link>
            <Link as={RouterLink} to="/explore?veg=non-veg" display="block" mb={2}>Sin alcohol</Link>
            <Link as={RouterLink} to="/explore?impression=desc" display="block" mb={2}>Populares</Link>
            <Link as={RouterLink} to="/explore?sort=latest" display="block" mb={2}>Novedades</Link>
          </Box>
          <Box>
            <Heading as="h6" size="md" marginBottom="16px">
              Conecta
            </Heading>
            <Flex alignItems="center">
              <Link href="#">
                <Icon
                  as={FaFacebook}
                  boxSize={6}
                  marginRight="16px"
                  transition="0.2s ease-in"
                  _hover={{ color: "primary.500" }}
                />
              </Link>
              <Link href="#">
                <Icon
                  as={FaTwitter}
                  transition="0.2s ease-in"
                  _hover={{ color: "primary.500" }}
                  boxSize={6}
                  marginRight="16px"
                />
              </Link>
              <Link href="#">
                <Icon
                  as={FaEnvelope}
                  transition="0.2s ease-in"
                  _hover={{ color: "primary.500" }}
                  boxSize={6}
                  marginRight="16px"
                />
              </Link>
              <Link href="#">
                <Icon
                  as={FaPinterest}
                  transition="0.2s ease-in"
                  _hover={{ color: "primary.500" }}
                  boxSize={6}
                  marginRight="16px"
                />
              </Link>
              <Link href="#">
                <Icon
                  as={FaLinkedin}
                  transition="0.2s ease-in"
                  _hover={{ color: "primary.500" }}
                  boxSize={6}
                  marginRight="16px"
                />
              </Link>
            </Flex>
          </Box>
        </Flex>
      </Box>
    </>
  );
}

export default Footer;
