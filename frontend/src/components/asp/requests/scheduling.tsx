import {
  Avatar,
  AvatarGroup,
  Box,
  Button,
  Container,
  Flex,
  Grid,
  GridItem,
  HStack,
  Select,
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
  return (
    <Grid templateColumns="repeat(3, 1fr)" gap={4}>
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
        <Select size="xs" placeholder="Select a donation frequency">
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Does not repeat">Does not repeat</option>
        </Select>
        <br />
        <Text as="b">Days of Donation</Text>
        <Grid
          templateColumns={{ base: "repeat(2, 1fr)", md: "repeat(7, 1fr)" }}
          gap={1}
        >
          <GridItem colSpan={1}>
            <Button size="xs" variant="outline" colorScheme="primary.blue">
              Sun
            </Button>
          </GridItem>
          <GridItem colSpan={1}>
            <Button size="xs" variant="outline" colorScheme="primary.blue">
              Mon
            </Button>
          </GridItem>
          <GridItem colSpan={1}>
            <Button size="xs" variant="outline" colorScheme="primary.blue">
              Tue
            </Button>
          </GridItem>
          <GridItem colSpan={1}>
            <Button size="xs" variant="outline" colorScheme="primary.blue">
              Wed
            </Button>
          </GridItem>
          <GridItem colSpan={1}>
            <Button size="xs" variant="outline" colorScheme="primary.blue">
              Thu
            </Button>
          </GridItem>
          <GridItem colSpan={1}>
            <Button size="xs" variant="outline" colorScheme="primary.blue">
              Fri
            </Button>
          </GridItem>
          <GridItem colSpan={1}>
            <Button size="xs" variant="outline" colorScheme="primary.blue">
              Sat
            </Button>
          </GridItem>
        </Grid>
      </GridItem>
    </Grid>
  );
};

const mealFormProgress = (): React.ReactElement => {
  return (
    <Tabs size="sm" variant="unstyled">
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
  );
};

const CreateMealRequest = (): React.ReactElement => {
  return (
    <div>
      <Flex
        flexDirection="column"
        width="100vw"
        height="100vh"
        justifyContent={{ base: "center", md: "flex-start" }}
        alignItems="center"
      >
        {titleSection()}

        {mealFormProgress()}
      </Flex>
    </div>
  );
};

export default CreateMealRequest;
