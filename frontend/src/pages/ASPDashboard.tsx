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
} from "@chakra-ui/react";
import React, { useContext } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import ASPCalendar from "./ASPCalendar";

import ASPListView from "../components/mealrequest/ASPListView";
import * as Routes from "../constants/Routes";
import AuthContext from "../contexts/AuthContext";

type ButtonProps = { children: React.ReactNode; path: string };

const NavigationButton = ({ children, path }: ButtonProps) => {
  const navigate = useNavigate();
  return <ChakraButton onClick={() => navigate(path)}>{children}</ChakraButton>;
};

const Dashboard = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);

  if (!authenticatedUser) {
    return <Navigate replace to={Routes.LOGIN_PAGE} />;
  }

  return (
    <Flex flexDir="column" alignItems="center" w="90vw" mx="auto" mb="100px">
      <Text variant="desktop-display-xl" my="20px">
        Your Dashboard
      </Text>
      <Text variant="desktop-caption" mb="20px">
        Use this page to see your upcoming food deliveries
      </Text>
      <Tabs defaultIndex={0} w="100%" minWidth="500px" overflow="auto">
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
          </TabList>
          <NavigationButton path={Routes.CREATE_MEAL_REQUEST_PAGE}>
            + Create Request
          </NavigationButton>
        </Flex>

        <TabPanels>
          <TabPanel defaultChecked>
            <ASPCalendar authId={authenticatedUser.id}/>
          </TabPanel>
          <TabPanel p="0">
            <ASPListView authId={authenticatedUser.id} />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default Dashboard;
