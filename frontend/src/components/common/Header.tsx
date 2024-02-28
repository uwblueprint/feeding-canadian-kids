import { gql, useMutation } from "@apollo/client";
import { ArrowBackIcon, HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  IconButton,
  Image,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import greenGear from "../../assets/greenGear.svg";
import Logo from "../../assets/logo.png";
import whiteGear from "../../assets/whiteGear.svg";
import {
  ASP_DASHBOARD_PAGE,
  HOME_PAGE,
  LOGIN_PAGE,
  SETTINGS_PAGE,
} from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import useIsWebView from "../../utils/useIsWebView";
import Logout from "../auth/Logout";

const LOGOUT = gql`
  mutation Logout($userId: String!) {
    logout(userId: $userId) {
      success
    }
  }
`;

const Header = () => {
  const isWebView = useIsWebView();
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isHovered, setIsHovered] = useState(false);

  const [logout] = useMutation<{ logout: { success: boolean } }>(LOGOUT);

  const onLogOutClick = async () => {
    const success = await authAPIClient.logout(
      String(authenticatedUser?.id),
      logout,
    );
    if (success) {
      setAuthenticatedUser(null);
    }
    navigate(LOGIN_PAGE);
  };

  const headerDesktop = (): React.ReactElement => (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      padding="12px 24px"
      bgColor="background.grey"
    >
      <Flex flexDir="row" height="70px" gap="24px" alignItems="center">
        <Image
          src={Logo}
          alt="Logo"
          width="70px"
          height="70px"
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
            width="60px"
            height="40px"
            p="0"
            color="gray.gray600"
            bgColor="background.grey"
            variant="desktop-button-bold"
            _hover={{
              color: "gray.gray83",
            }}
            onClick={() => {
              navigate(ASP_DASHBOARD_PAGE);
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
            width="60px"
            height="50px"
            p="0"
            bgColor="background.grey"
            border="2px solid"
            borderColor="primary.green"
            _hover={{
              color: "background.grey",
              bgColor: "primary.green",
            }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={() => {
              navigate(SETTINGS_PAGE);
            }}
          >
            <Image
              width="24px"
              src={isHovered ? whiteGear : greenGear}
              alt="User Settings Button"
            />
          </Button>
          <Logout />
        </Flex>
      )}
    </Flex>
  );

  const headerMobile = (): React.ReactElement => (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      padding="12px 24px"
      bgColor="background.grey"
    >
      <Flex flexDir="row" height="50px" gap="24px" alignItems="center">
        <Image
          src={Logo}
          alt="Logo"
          width="50px"
          height="50px"
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
            width="60px"
            height="40px"
            p="0"
            color="gray.gray600"
            bgColor="background.grey"
            _hover={{
              color: "gray.gray83",
            }}
            onClick={() => {
              navigate(ASP_DASHBOARD_PAGE);
            }}
          >
            Home
          </Button>
          <Divider borderColor="gray.gray600" borderWidth="1.5px" />
        </Flex>
      </Flex>

      {authenticatedUser && (
        <Flex flexDir="row" gap="24px">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon boxSize={9} />}
              color="gray.gray600"
              bgColor="background.grey"
              variant="desktop-button-bold"
            />
            <MenuList>
              <MenuItem
                icon={<SettingsIcon />}
                onClick={() => {
                  navigate(SETTINGS_PAGE);
                }}
              >
                Settings
              </MenuItem>
              <MenuItem icon={<ArrowBackIcon />} onClick={onLogOutClick}>
                Log Out
              </MenuItem>
            </MenuList>
          </Menu>
        </Flex>
      )}
    </Flex>
  );

  return isWebView ? headerDesktop() : headerMobile();
};

export default Header;
