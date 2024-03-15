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
  Text,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import { IoSettingsOutline, IoSettingsSharp } from "react-icons/io5";
import { useLocation, useNavigate } from "react-router-dom";

import { HeaderButtonsData } from "./HeaderButtons";

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
import { UserInfo } from "../../types/UserTypes";
import useIsWebView from "../../utils/useIsWebView";

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
  const location = useLocation();
  const [userInfo, setUserInfo] = useState<UserInfo>(
    authenticatedUser?.info || null,
  );
  const [role, setRole] = useState(userInfo?.role || "Donor");

  const [buttons, setButtons] = useState(HeaderButtonsData[role] || []);

  const isButtonActive = (path: string) => location.pathname === path;

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

  useEffect(() => {
    if (authenticatedUser?.info) {
      console.log(authenticatedUser?.info?.role);
      setButtons(HeaderButtonsData[authenticatedUser?.info?.role] || []);
    }
  }, [authenticatedUser]);

  const headerDesktop = (): React.ReactElement => (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      padding="12px 50px"
      borderBottom="1px solid #D9D9D9"
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
      </Flex>

      {authenticatedUser && (
        <Flex flexDir="row" gap="50px">
          {buttons.map((button, index) => (
            <div key={index}>
              {button?.name === "Settings" ? (
                <Button
                  color="gray.gray600"
                  variant="desktop-button-bold"
                  onClick={() => {
                    navigate(button.url);
                  }}
                  key={index}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  {isHovered || isButtonActive(button.url) ? (
                    <IoSettingsSharp />
                  ) : (
                    <IoSettingsOutline />
                  )}
                </Button>
              ) : (
                <Button
                  mx="25px"
                  color="gray.gray600"
                  variant="desktop-button-bold"
                  width="100px"
                  onClick={() => {
                    navigate(button.url);
                  }}
                  key={index}
                  _hover={{ transform: "scale(1.05)" }}
                >
                  <Text
                    fontSize="14px"
                    fontWeight={
                      isButtonActive(button.url) ? "semibold" : "medium"
                    }
                    _hover={{ fontWeight: "semibold" }}
                  >
                    {button.name}
                  </Text>
                </Button>
              )}
            </div>
          ))}
        </Flex>
      )}
    </Flex>
  );

  const headerMobile = (): React.ReactElement => (
    <Flex
      justifyContent="space-between"
      alignItems="center"
      padding="12px 24px"
      borderBottom="1px solid #D9D9D9"
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
      </Flex>

      {authenticatedUser && (
        <Flex flexDir="row" gap="24px">
          <Menu>
            <MenuButton
              as={IconButton}
              aria-label="Options"
              icon={<HamburgerIcon boxSize={9} />}
              color="gray.gray600"
              variant="desktop-button-bold"
            />
            <MenuList>
              {buttons.map((button, index) => (
                <div key={index}>
                  {button?.name === "Settings" ? (
                    <MenuItem
                      icon={<SettingsIcon />}
                      onClick={() => {
                        navigate(button.url);
                      }}
                      key={index}
                    >
                      Settings
                    </MenuItem>
                  ) : (
                    <MenuItem
                      onClick={() => {
                        navigate(button.url);
                      }}
                      key={index}
                    >
                      {button.name}
                    </MenuItem>
                  )}
                </div>
              ))}
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
