import { Button, Flex, Image } from "@chakra-ui/react";
import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";

import Gear from "../../assets/greenGear.svg";
import Logo from "../../assets/logo.png";
import { HOME_PAGE, SETTINGS_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const { authenticatedUser } = useContext(AuthContext);

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
      {authenticatedUser && (
        <Flex flexDir="row" gap="24px">
          <Button
            width={{ base: "30px", md: "60px" }}
            height={{ base: "30px", md: "40px" }}
            p="0"
            bgColor="background.grey"
            border="2px solid"
            borderColor="primary.green"
            _hover={{
              color: "primary.green",
              bgColor: "background.grey",
            }}
            onClick={() => {
              navigate(SETTINGS_PAGE);
            }}
          >
            <Image
              width={{ base: "18px", md: "24px" }}
              src={Gear}
              alt="User Settings Button"
            />
          </Button>
          {/* TODO: add Logout button */}
        </Flex>
      )}
    </Flex>
  );
};

export default Header;
