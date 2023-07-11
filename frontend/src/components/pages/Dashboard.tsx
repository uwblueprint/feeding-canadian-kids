import { 
    CalendarIcon,
    ChevronDownIcon,
    HamburgerIcon
} from '@chakra-ui/icons';

import {
  Box,
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Flex,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Table,
  TableContainer,
  Tabs,
  Tbody,
  Td,
  Text,
  Tfoot,
  Th,
  Thead,
  Tr,
  Wrap,
  useMediaQuery,
} from "@chakra-ui/react";
// eslint-disable-next-line import/order
import dayGridPlugin from "@fullcalendar/daygrid";
// eslint-disable-next-line import/order
import FullCalendar from "@fullcalendar/react";
import React from "react";
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
  const [isWebView] = useMediaQuery("(min-width: 62em)");

  return (
    <Box 
        marginLeft={['20px', '20px', '150px', '150px']} 
        marginRight={['20px', '20px', '150px', '150px']} 
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
            fontWeight="400"
            fontSize={['12px', '16px']}
            pb = '10px'
        >
            Use this page to see your upcoming food deliveries.
        </Text>

        <Flex
          justifyContent={['center', 'flex-end']}
          flexDirection={['column', 'row']}
          alignItems={['center', 'flex-start']}
        >
          <Button
            colorScheme="green"
            fontSize={['12px', '14px', '14px', '14px']}
            width={['100%', '100%', '100%', 'auto']}
            mt={'10px'}
            mb={'20px'}
          >
            + Create Request
          </Button>
        </Flex>

        {/* tabs */}
        <Tabs colorScheme='black'>
          <TabList>
            <Tab>
                <Text
                    fontFamily="Inter"
                    fontSize={['14px', '18px']}
                >
                <CalendarIcon boxSize={4} mr={2} />
                Calendar
                </Text>
            </Tab>
            <Tab>
                <Text
                    fontFamily="Inter"
                    fontSize={['14px', '18px']}
                >
                <HamburgerIcon boxSize={4} mr={2} />
                List
                </Text>
            </Tab>
            <Tab>
                <Text
                    fontFamily="Inter"
                    fontSize={['14px', '18px']}
                >
                Test Buttons
                </Text>
            </Tab>
          </TabList>

        <TabPanels>
          <TabPanel>
            {isWebView && (
              <Stack direction="row">
                <div style={{ width: "70%" }}>
                  <FullCalendar
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={[
    { title: 'event 1', date: '2019-07-01' },
    { title: 'event 2', date: '2019-07-02' }
  ]}
                  />
                </div>
                <div style={{ width: "30%", margin: "20px" }}>
                  <Card padding={5}>
                    <CardBody>
                      <Text>
                        yo
                      </Text>
                    </CardBody>
                  </Card>
                </div>
              </Stack>
            )}
          </TabPanel>

          <TabPanel>
            <TableContainer>
              <Table variant="simple">
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
              <NavButton
                text="Create Entity"
                path={Routes.CREATE_ENTITY_PAGE}
              />
              <NavButton
                text="Update Entity"
                path={Routes.UPDATE_ENTITY_PAGE}
              />
              <NavButton
                text="Display Entities"
                path={Routes.DISPLAY_ENTITY_PAGE}
              />
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
