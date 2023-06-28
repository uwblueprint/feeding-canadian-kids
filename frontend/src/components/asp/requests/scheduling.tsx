import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Center,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Select,
  SimpleGrid,
  Spacer,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import { Form } from "react-router-dom";

const titleSection = (): React.ReactElement => {
  return (
    <div>
      <VStack
        spacing={4}
        alignItems="center"
        height="fit-content"
        style={{
          background: "white",
        }}
        padding={{ base: "1rem", lg: "2rem" }}
      >
        <Text
          alignSelf={{ base: "center", lg: "unset" }}
          variant="desktop-display-xl"
          color="primary.blue"
          as="b"
        >
          Create a meal request
        </Text>

        <Text
          alignSelf={{ base: "center", lg: "unset" }}
          variant="desktop-body"
          textAlign="center"
          maxWidth="100%"
        >
          Tell us a little bit about your requirements and we&apos;ll connect
          you with a meal donor. This program aims to support kids age 6 to 12.
        </Text>
      </VStack>
    </div>
  );
};

const SchedulingForm = (): React.ReactElement => {
  const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  return (
    <Grid
      templateColumns="repeat(3, 1fr)"
      gap={4}
      paddingLeft={{ base: "1rem", md: "2rem" }}
      paddingRight={{ base: "1rem", md: "2rem" }}
      textAlign={{ base: "left", md: "left" }}
    >
      <GridItem colSpan={1} bg="tomato">
        <Text as="b">Date and Time</Text>
        <Text>Please select the date for the meal drop-off.</Text>
      </GridItem>
      <GridItem colStart={2} colEnd={4} bg="papayawhip">
        <Text color="primary.blue" fontSize="xs">
          If this is not a weekly donation,&nbsp;
          <a
            href="https://www.google.com"
            style={{ textDecoration: "underline" }}
          >
            click here to enter dates manually
          </a>
          .
        </Text>
        <br />
        <Text as="b">Donation Frequency</Text>

        <Select
          height={{ base: "2rem", md: "2.5rem" }}
          size="xs"
          placeholder="Select a donation frequency"
        >
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Does not repeat">Does not repeat</option>
        </Select>
        <br />
        <Text as="b">Days of Donation</Text>

        <SimpleGrid columns={{ base: 4, md: 7 }} spacing={{ base: 3, md: 3 }}>
          {dayNames.map((day) => (
            <Button
              key={day}
              variant="outline"
              colorScheme="primary.blue"
              size="xs"
              height={{ base: "2rem", md: "3rem" }}
              rounded="none"
            >
              {day}
            </Button>
          ))}
        </SimpleGrid>

        <br />

        <SimpleGrid columns={{ base: 2, md: 2 }} spacing={{ base: 4, md: 4 }}>
          <Box>
            <Text as="b">Start Date</Text>
            <br />
            <Button
              size="xs"
              height={{ base: "2rem", md: "3rem" }}
              variant="outline"
              colorScheme="primary.blue"
              rounded="none"
              width={{ base: "100%", md: "100%" }}
            >
              Select a date
            </Button>
          </Box>

          <Box>
            <Text as="b">End Date</Text>
            <br />
            <Button
              size="xs"
              height={{ base: "2rem", md: "3rem" }}
              variant="outline"
              colorScheme="primary.blue"
              rounded="none"
              width={{ base: "100%", md: "100%" }}
            >
              Select a date
            </Button>
          </Box>
        </SimpleGrid>

        <br />

        <Text as="b">Scheduled drop-off time</Text>
        <br />
        <Select
          height={{ base: "2rem", md: "2.5rem" }}
          size="xs"
          placeholder="Select a time"
          width={{ base: "50%", md: "50%" }}
        >
          <option value="Morning">Morning</option>
          <option value="Afternoon">Afternoon</option>
          <option value="Evening">Evening</option>
        </Select>
      </GridItem>

      {/* Next button that is right aligned */}
      <GridItem
        colStart={1}
        colEnd={4}
        bg="papayawhip"
        display="flex"
        justifyContent="flex-end"
      >
        <Spacer />
        <Button
          colorScheme="primary.blue"
          variant="solid"
          size="xs"
          height={{ base: "2rem", md: "3rem" }}
          width={{ base: "10%", md: "10%" }}
          bg="primary.blue"
        >
          Next
        </Button>
      </GridItem>
    </Grid>
  );
};

const mealFormProgress = (): React.ReactElement => {
  return (
    <div>
      <Center>
        <Tabs bg="gray" size="sm" variant="unstyled" align="center">
          <TabList>
            <Tab>
              <HStack direction="row" spacing={4}>
                <Avatar
                  bgColor="primary.blue"
                  name="1"
                  src="https://bit.ly/broken-link"
                  size="xs"
                />
                <Text
                  as="b"
                  fontSize="20px"
                  color="primary.blue"
                  variant="desktop-body"
                >
                  Scheduling
                </Text>
              </HStack>
            </Tab>

            <Tab isDisabled>
              <HStack direction="row" spacing={4}>
                <Avatar
                  bgColor="gray"
                  name="2"
                  src="https://bit.ly/broken-link"
                  size="xs"
                />

                <Text as="b" color="gray" fontSize="20px">
                  {" "}
                  Meal Donation Information
                </Text>
              </HStack>
            </Tab>

            <Tab isDisabled>
              <HStack direction="row" spacing={4}>
                <Avatar
                  bgColor="gray"
                  name="3"
                  src="https://bit.ly/broken-link"
                  size="xs"
                />

                <Text as="b" color="gray" fontSize="20px">
                  {" "}
                  Review & Submit
                </Text>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>{SchedulingForm()}</TabPanel>
            <TabPanel>
              <p>two!</p>
            </TabPanel>
            <TabPanel>
              <p>three!</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Center>
    </div>
  );
};

const CreateMealRequest = (): React.ReactElement => {
  return (
    <div>
      {/* <Flex
        flexDirection="column"
        width="100vw"
        height="100vh"
        justifyContent={{ base: "center", md: "flex-start" }}
        alignItems="center"
      > */}
      {titleSection()}

      {mealFormProgress()}
      {/* </Flex> */}
    </div>
  );
};

export default CreateMealRequest;
