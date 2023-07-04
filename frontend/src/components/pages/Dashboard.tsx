import { 
    CalendarIcon,
    ChevronDownIcon,
    HamburgerIcon
} from '@chakra-ui/icons';

import {
    Box,
    Button,
    Flex,
    Tab,
    Table,
    TableContainer,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Text,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
    Wrap
} from '@chakra-ui/react';

import React from 'react';

// eslint-disable-next-line import/order
import dayGridPlugin from "@fullcalendar/daygrid";
// eslint-disable-next-line import/order
import FullCalendar from "@fullcalendar/react";

import { useNavigate } from "react-router-dom";

import MealRequestForm from "./MealRequestForm";

import BackgroundImage from "../../assets/background.png";

import * as Routes from "../../constants/Routes";

import SampleContext from "../../contexts/SampleContext";

import Logout from "../auth/Logout";

import RefreshCredentials from "../auth/RefreshCredentials";

type ButtonProps = { text: string; path: string };

const NavButton = ({ text, path }: ButtonProps) => {
  const navigate = useNavigate();
  return <Button onClick={() => navigate(path)}>{text}</Button>;
};

function App() {
  return (
      <Box 
        marginLeft={['15px', '150px']} 
        marginRight={['15px', '150px']} 
        marginTop={['50px', '150px']} 
        marginBottom={['50px', '150px']} 
        textAlign="center"
    >
        <Text
            fontFamily="Dimbo"
            fontStyle="normal"
            fontWeight="400"
            fontSize={['26px', '40px']}
            pb = {['8px', '10px']}
        >
            Your Dashboard 
        </Text>

        <Text
            fontFamily="Inter"
            fontSize={['12px', '16px']}
        >
            Use this page to see your upcoming food deliveries.
        </Text>

        <Flex justifyContent="flex-end">
            <Button colorScheme='green'>Create Request</Button>
        </Flex>

        {/* tabs */}
        <Tabs colorScheme='black'>
          <TabList>
            <Tab>
                <Text
                    variant={{
                        base: "mobile-heading",
                        md: "desktop-heading",
                    }}
                >
                <CalendarIcon boxSize={5} mr={2} />
                Calendar
                </Text>
            </Tab>
            <Tab>
                <Text
                    variant={{
                        base: "mobile-heading",
                        md: "desktop-heading",
                    }}
                >
                <HamburgerIcon boxSize={5} mr={2} />
                List
                </Text>
            </Tab>
            <Tab>
                <Text
                    variant={{
                        base: "mobile-heading",
                        md: "desktop-heading",
                    }}
                >
                Test Buttons
                </Text>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
            <FullCalendar
                plugins={[ dayGridPlugin ]}
                initialView="dayGridMonth"
            />
            </TabPanel>
            
            <TabPanel>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                        {/* should abstract the rows into a react component */}
                        <Tr>
                            <Th>Date Requested</Th>
                            <Th>Time Requested</Th>
                            <Th>Donor's Name</Th>
                            <Th>Number of Meals</Th>
                            <Th></Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                        <Tr>
                            <Td>Oct 27, 2022</Td>
                            <Td>5:00-6:00 PM</Td>
                            <Td>Harvey's</Td>
                            <Td>5</Td>
                            <Td>
                                <ChevronDownIcon boxSize={6} />
                            </Td>
                        </Tr>
                        <Tr>
                            <Td>Oct 27, 2022</Td>
                            <Td>5:00-6:00 PM</Td>
                            <Td>Harvey's</Td>
                            <Td>5</Td>
                            <Td>
                                <ChevronDownIcon boxSize={6} />
                            </Td>
                        </Tr>
                        <Tr>
                            <Td>Oct 27, 2022</Td>
                            <Td>5:00-6:00 PM</Td>
                            <Td>Harvey's</Td>
                            <Td>5</Td>
                            <Td>
                                <ChevronDownIcon boxSize={6} />
                            </Td>
                        </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </TabPanel>
            <TabPanel>
            <Wrap>
        <Logout />
        <RefreshCredentials />
        <NavButton text="Create Entity" path={Routes.CREATE_ENTITY_PAGE} />
        <NavButton text="Update Entity" path={Routes.UPDATE_ENTITY_PAGE} />
        <NavButton text="Display Entities" path={Routes.DISPLAY_ENTITY_PAGE} />
        <NavButton
          text="Create Simple Entity"
          path={Routes.CREATE_SIMPLE_ENTITY_PAGE}
        />
        <NavButton
          text="Update Simple Entity"
          path={Routes.UPDATE_SIMPLE_ENTITY_PAGE}
        />
        <NavButton
          text="Display Simple Entities"
          path={Routes.DISPLAY_SIMPLE_ENTITY_PAGE}
        />
        <NavButton text="Edit Team" path={Routes.EDIT_TEAM_PAGE} />
        <NavButton text="Hooks Demo" path={Routes.HOOKS_PAGE} />
        <MealRequestForm />
        </Wrap>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
  );
}

export default App;
