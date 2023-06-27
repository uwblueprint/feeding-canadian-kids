import { Button, Divider, Flex, Image } from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import greenGear from "../../assets/greenGear.svg";
import Logo from "../../assets/logo.png";
import whiteGear from "../../assets/whiteGear.svg";
import { HOME_PAGE, SETTINGS_PAGE } from "../../constants/Routes";


const Header = () => {
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
      padding={{ base: "12px 24px", md: "24px 48px" }}
      bgColor="background.grey"
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
      {/* <Divider orientation='vertical' borderColor="red" borderWidth="10px"/> */}
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
        <Button
          width={{ base: "90px", md: "120px" }}
          height={{ base: "40px", md: "50px" }}
          p="0"
          variant="desktop-button-bold"
          bgColor="background.grey"
          border="2px solid"
          borderColor="primary.green"
          color="primary.green"
          _hover={{
            color: "background.grey",
            bgColor: "primary.green",
          }}
          onClick={() => {
            navigate(SETTINGS_PAGE);
          }}
        >
          Logout
        </Button>
      </Flex>
    </Flex>
  );
};

export default Header;
