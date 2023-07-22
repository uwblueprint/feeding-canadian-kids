import { CalendarIcon, ChevronDownIcon, HamburgerIcon } from "@chakra-ui/icons";
import { AtSignIcon, EmailIcon, InfoIcon } from "@chakra-ui/icons";
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
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import MealRequestForm from "./MealRequestForm";

import BackgroundImage from "../../assets/background.png";
import * as Routes from "../../constants/Routes";
import SampleContext from "../../contexts/SampleContext";
import Logout from "../auth/Logout";
import RefreshCredentials from "../auth/RefreshCredentials";

type ButtonProps = { text: string; path: string };

type Staff = {
  name: string;
  email: string;
  phone: string;
};

type MealRequest = {
  date: Date;
  onsiteStaff: Staff[];
  dropOffTime: Date;
  dropOffLocation: string;
  deliveryInstructions: string;
};

const SAMPLE_ONSITE_STAFF_1: Staff = {
  name: "John D.",
  email: "john@email.com",
  phone: "123-456-7890",
};

const SAMPLE_ONSITE_STAFF_2: Staff = {
  name: "Alice F.",
  email: "alice@email.com",
  phone: "123-456-7890",
};

const SAMPLE_MEAL_REQUEST_1: MealRequest = {
  date: new Date(2023, 7, 18, 12, 30, 0),
  onsiteStaff: [SAMPLE_ONSITE_STAFF_1, SAMPLE_ONSITE_STAFF_2],
  dropOffTime: new Date(2023, 7, 18, 12, 30, 0),
  dropOffLocation: "20 Main St.",
  deliveryInstructions: "Leave at the main entrance.",
};

const SAMPLE_MEAL_REQUEST_2: MealRequest = {
  date: new Date(2023, 7, 22, 12, 30, 0),
  onsiteStaff: [SAMPLE_ONSITE_STAFF_1, SAMPLE_ONSITE_STAFF_2],
  dropOffTime: new Date(2023, 7, 22, 12, 30, 0),
  dropOffLocation: "20 Main St.",
  deliveryInstructions: "Leave at the main entrance.",
};

const NavButton = ({ text, path }: ButtonProps) => {
  const navigate = useNavigate();
  return <Button onClick={() => navigate(path)}>{text}</Button>;
};

function App() {
  const [isWebView] = useMediaQuery("(min-width: 62em)");

  const [selectedMealRequest, setSelectedMealRequest] = useState<
    MealRequest | undefined
  >(undefined);

  return (
    <Box
      marginLeft={["20px", "20px", "150px", "150px"]}
      marginRight={["20px", "20px", "150px", "150px"]}
      marginTop={["50px", "150px"]}
      marginBottom={["50px", "150px"]}
      textAlign="center"
    >
      <Text
        fontFamily="Dimbo"
        fontStyle="normal"
        fontWeight="400"
        fontSize={["26px", "40px"]}
        pb={["8px", "10px"]}
      >
        Your Dashboard
      </Text>

      <Text
        fontFamily="Inter"
        fontWeight="400"
        fontSize={["12px", "16px"]}
        pb="10px"
      >
        Use this page to see your upcoming food deliveries.
      </Text>

      <Flex
        justifyContent={["center", "flex-end"]}
        flexDirection={["column", "row"]}
        alignItems={["center", "flex-start"]}
      >
        <Button
          colorScheme="green"
          fontSize={["12px", "14px", "14px", "14px"]}
          width={["100%", "100%", "100%", "auto"]}
          mt={"10px"}
          mb={"20px"}
        >
          + Create Request
        </Button>
      </Flex>

      {/* tabs */}
      <Tabs colorScheme="black">
        <TabList>
          <Tab>
            <Text fontFamily="Inter" fontSize={["14px", "18px"]}>
              <CalendarIcon boxSize={4} mr={2} />
              Calendar
            </Text>
          </Tab>
          <Tab>
            <Text fontFamily="Inter" fontSize={["14px", "18px"]}>
              <HamburgerIcon boxSize={4} mr={2} />
              List
            </Text>
          </Tab>
          <Tab>
            <Text fontFamily="Inter" fontSize={["14px", "18px"]}>
              Test Buttons
            </Text>
          </Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {isWebView && (
              <Stack direction="row">
                <div style={{ width: "100%" }}>
                  <FullCalendar
                    headerToolbar={{
                      left: "prev",
                      center: "title",
                      right: "next"
                    }}
                    themeSystem="Simplex"
                    plugins={[dayGridPlugin]}
                    initialView="dayGridMonth"
                    events={[
                      {
                        title: "event 1",
                        date: "2023-07-01",
                        extendedProps: { mealRequest: SAMPLE_MEAL_REQUEST_1 },
                      },
                      {
                        title: "event 2",
                        date: "2023-07-08",
                        extendedProps: { mealRequest: SAMPLE_MEAL_REQUEST_2 },
                      },
                    ]}
                    // eventContent={renderEventContent}
                    eventClick={(info) => {
                      setSelectedMealRequest(
                        info.event.extendedProps.mealRequest,
                      );
                      // info.el.style.borderColor = "red";
                    }}
                    eventMouseLeave={() => {
                      setSelectedMealRequest(undefined);
                    }}
                  />
                </div>
                {selectedMealRequest && (
                  <div style={{ width: "30%", margin: "20px" }}>
                    <Text><strong>Upcoming Delivery</strong></Text>
                    <Card padding={3}>
                      <CardBody>
                        <Table variant="unstyled" size='lg'>
                          <Tr>
                            <Td >
                              <AtSignIcon />
                            </Td>
                            <Text>
                            <strong>Location:{" "}<br /></strong>{selectedMealRequest.date.toLocaleString()}
                            </Text>
                          </Tr>
                          <Tr>
                            <Td>
                              <InfoIcon />
                            </Td>
                            <Text><strong>Onsite Staff:</strong></Text>
                            {selectedMealRequest.onsiteStaff.map(
                              (staffMember) => (
                                <>
                                  <Text>{staffMember.name}</Text>
                                  <Text>{staffMember.email}</Text>
                                  <Text>{staffMember.phone}</Text>
                                </>
                              ),
                            )}
                          </Tr>

                          <Tr>
                            <Td>
                              <EmailIcon />
                            </Td>
                            <Text>
                            <strong>Delivery notes:{" "}</strong><br />
                              {selectedMealRequest.deliveryInstructions}
                            </Text>
                          </Tr>
                        </Table>
                      </CardBody>
                    </Card>
                  </div>
                )}
              </Stack>
            )}
          </TabPanel>

          <TabPanel>
            <TableContainer>
              <Table style={{ fontFamily: "Inter" }}>
                <Thead style={{ fontSize: "18px" }}>
                  {/* should abstract the rows into a react component */}
                  <Tr>
                    <Th style={{ fontFamily: "Inter" }}>Date Requested</Th>
                    <Th style={{ fontFamily: "Inter" }}>Time Requested</Th>
                    <Th style={{ fontFamily: "Inter" }}>Donor's Name</Th>
                    <Th style={{ fontFamily: "Inter" }}>Number of Meals</Th>
                    <Th></Th>
                  </Tr>
                </Thead>

                <Tbody style={{ fontSize: "16px" }}>
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
