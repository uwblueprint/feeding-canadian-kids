import { Button, Divider, Flex, Image } from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import greenGear from "../../assets/greenGear.svg";
import Logo from "../../assets/logo.png";
import whiteGear from "../../assets/whiteGear.svg";
import {
  DASHBOARD_PAGE,
  HOME_PAGE,
  SETTINGS_PAGE,
} from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import Logout from "../auth/Logout";

const Header = () => {
  const { authenticatedUser } = useContext(AuthContext);

  const navigate = useNavigate();

  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getImageSrc = () => {
    if (isHovered) {
      return whiteGear;
    }
    return greenGear;
  };

  return (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      padding={{ base: "12px 24px", md: "12px 24px" }}
      bgColor="background.grey"
    >
      <Flex
        flexDir="row"
        height={{ base: "50px", md: "70px" }}
        gap="24px"
        alignItems="center"
      >
        <Image
          src={Logo}
          alt="Logo"
          width={{ base: "50px", md: "70px" }}
          height={{ base: "50px", md: "70px" }}
          onClick={() => {
            navigate(HOME_PAGE);
          }}
          _hover={{
            cursor: "pointer",
          }}
        />
        <Divider
          orientation="vertical"
          borderColor="gray.gray83"
          borderWidth="1.5px"
        />
        <Flex flexDir="column">
          <Button
            width={{ base: "60px", md: "60px" }}
            height={{ base: "40px", md: "40px" }}
            p="0"
            color="gray.gray600"
            bgColor="background.grey"
            variant="desktop-button-bold"
            _hover={{
              color: "gray.gray83",
            }}
            onClick={() => {
              navigate(DASHBOARD_PAGE);
            }}
          >
            Home
          </Button>
          <Divider borderColor="gray.gray600" borderWidth="1.5px" />
        </Flex>
      </Flex>

      {authenticatedUser && (
        <Flex flexDir="row" gap="24px">
          <Button
            width={{ base: "30px", md: "60px" }}
            height={{ base: "40px", md: "50px" }}
            p="0"
            bgColor="background.grey"
            border="2px solid"
            borderColor="primary.green"
            _hover={{
              color: "background.grey",
              bgColor: "primary.green",
            }}
            onMouseEnter={handleHover}
            onMouseLeave={handleMouseLeave}
            onClick={() => {
              navigate(SETTINGS_PAGE);
            }}
          >
            <Image
              width={{ base: "18px", md: "24px" }}
              src={getImageSrc()}
              alt="User Settings Button"
            />
          </Button>
          <Logout />
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
