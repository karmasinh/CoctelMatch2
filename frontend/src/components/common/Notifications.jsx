import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  useToast,
  Box,
  Text,
  Button,
  Flex,
  Avatar,
  Divider,
  Center,
  Icon,
  AvatarBadge,
} from "@chakra-ui/react";
import { FaComment } from "react-icons/fa";
import { EditIcon } from "@chakra-ui/icons";
import { CheckCircleIcon } from "@chakra-ui/icons";

import axios from "axios";
import { buildImageUrl } from "../../utils/media";
const API = process.env.REACT_APP_API_URL || "http://localhost:5000";

export const Notifications = () => {
  const tokenFromStore = useSelector((store) => store.authReducer.token);
  const token = tokenFromStore || localStorage.getItem("token");
  const navigate = useNavigate();
  const toast = useToast();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const reversedNoti = notifications?.slice().reverse().slice(0, 5);
  const getNotificationIcon = (type) => {
    switch (type) {
      case "comment":
        return <FaComment color="#fb8600ca" />; // Chakra UI Comment icon
      case "like":
        return <CheckCircleIcon color="#fb8500ca" />; // Chakra UI CheckCircle icon
      case "post":
        return <EditIcon color="#fb8500ca" />; // Chakra UI Edit icon
      default:
        return null;
    }
  };

  const fetchNotifications = () => {
    setLoading(true);
    axios
      .get(`${API}/notification`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setNotifications(response.data.notifications);
        setLoading(false);
      })
      .catch((error) => {
        // Silenciar 429 y errores de red
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchNotifications();
    const intervalId = setInterval(fetchNotifications, 30000);
    return () => clearInterval(intervalId);
  }, [token]);

  return (
    <Box>
      {loading ? (
        <Text>Cargando…</Text>
      ) : reversedNoti.length > 0 ? (
        reversedNoti.map((notification, index) => (
          <>
            <Flex as={Link} to={notification.route || "#"} gap="0.5rem" alignItems="center">
              <Avatar
                size="sm"
                src={buildImageUrl(notification.senderImage)}
              ></Avatar>
              <Center height="50px">
                <Divider orientation="vertical" />
              </Center>
              <Text key={index} fontSize="0.9rem">
                {getNotificationIcon(notification.type)} {notification.message}{" "}
                a las {notification.time}
              </Text>
            </Flex>
            <Divider my={2} />
          </>
        ))
      ) : (
        <Text>Sin notificaciones</Text>
      )}
    </Box>
  );
};
