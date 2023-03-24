import { Flex, Image } from "@chakra-ui/react";
import React from "react";

import Logo from "../../assets/logo.png";

const Header = () => {
  return (
    <Flex
      justifyContent={{ base: "center", md: "left" }}
      alignItems="center"
      padding="20px 24px"
      style={{ backgroundColor: "#A6A6A6" }}
    >
      <Image
        src={Logo}
        alt="Logo"
        height={{ base: 59, md: 99 }}
        width={{ base: 62, md: 104 }}
      />
    </Flex>
  );
};

export default Header;
