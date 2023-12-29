import { CalendarIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Button as ChakraButton,
  Flex,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Wrap,
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import BackgroundImage from "../assets/background.png";
import RefreshCredentials from "../components/auth/RefreshCredentials";
import ListView from "../components/mealrequest/ListView";
import * as Routes from "../constants/Routes";
import AuthContext from "../contexts/AuthContext";

type ButtonProps = { children: React.ReactNode; path: string };

const NavigationButton = ({ children, path }: ButtonProps) => {
  const navigate = useNavigate();
  return <ChakraButton onClick={() => navigate(path)}>{children}</ChakraButton>;
};

const OldDashboard = (): React.ReactElement => {
  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "20px",
        height: "100vh",
        backgroundImage: `url(${BackgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Wrap>
        <RefreshCredentials />
        <NavigationButton path={Routes.CREATE_ENTITY_PAGE}>
          Create Entity
        </NavigationButton>

        <NavigationButton path={Routes.UPDATE_ENTITY_PAGE}>
          Update Entity
        </NavigationButton>
        <NavigationButton path={Routes.DISPLAY_ENTITY_PAGE}>
          Display Entities
        </NavigationButton>
        <NavigationButton path={Routes.CREATE_SIMPLE_ENTITY_PAGE}>
          Create Simple Entity
        </NavigationButton>
        <NavigationButton path={Routes.UPDATE_SIMPLE_ENTITY_PAGE}>
          Update Simple Entity
        </NavigationButton>
        <NavigationButton path={Routes.DISPLAY_SIMPLE_ENTITY_PAGE}>
          Display Simple Entities
        </NavigationButton>
        <NavigationButton path={Routes.HOOKS_PAGE}>Hooks Demo</NavigationButton>
      </Wrap>
      <div style={{ height: "2rem" }} />
    </div>
  );
};

const Dashboard = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);

  if (!authenticatedUser) {
    return <Navigate replace to={Routes.LOGIN_PAGE} />;
  }

  return (
    <Flex flexDir="column" alignItems="center" w="80vw" mx="auto" mb="100px">
      <Text variant="desktop-display-xl" my="20px">
        Your Dashboard
      </Text>
      <Text variant="desktop-caption" mb="20px">
        Use this page to see your upcoming food deliveries
      </Text>
      <Tabs defaultIndex={1} w="100%">
        <Flex flexDir="row" justifyContent="space-between">
          <TabList>
            <Tab gap="8px">
              <CalendarIcon w="16px" />
              <Text variant="desktop-button-bold">Calendar</Text>
            </Tab>
            <Tab gap="8px">
              <HamburgerIcon w="16px" />
              <Text variant="desktop-button-bold">List</Text>
            </Tab>
            <Tab>
              <Text variant="desktop-button-bold">Old Dashboard</Text>
            </Tab>
          </TabList>
          <NavigationButton path={Routes.CREATE_MEAL_REQUEST_PAGE}>
            + Create Request
          </NavigationButton>
        </Flex>

        <TabPanels>
          <TabPanel>
            <p>Insert Calendar Here</p>
          </TabPanel>
          <TabPanel p="0">
            <ListView authId={authenticatedUser.id} />
          </TabPanel>
          <TabPanel>
            <OldDashboard />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default Dashboard;
