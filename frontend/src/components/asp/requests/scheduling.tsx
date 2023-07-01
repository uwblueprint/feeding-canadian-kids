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
  Input,
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
  useBreakpointValue,
  useMediaQuery,
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
              rounded="md"
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
            <Input
              size="xs"
              height={{ base: "2rem", md: "3rem" }}
              variant="outline"
              colorScheme="primary.blue"
              type="date"
              rounded="md"
              width={{ base: "100%", md: "100%" }}
              placeholder="Select a date"
            />
          </Box>

          <Box>
            <Text as="b">End Date</Text>
            <br />
            <Input
              size="xs"
              height={{ base: "2rem", md: "3rem" }}
              variant="outline"
              colorScheme="primary.blue"
              type="date"
              rounded="md"
              width={{ base: "100%", md: "100%" }}
              placeholder="Select a date"
            />
          </Box>

          <Box>
            <Text as="b">Scheduled drop-off time</Text>
            <Input
              height={{ base: "2rem", md: "3rem" }}
              size="xs"
              type="time"
              placeholder="Select a time"
              width={{ base: "100%", md: "100%" }}
            />
          </Box>
        </SimpleGrid>

        <br />
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

const MealFormProgress = (): React.ReactElement => {
  const fontSize = useBreakpointValue({ base: "12px", sm: "16px", md: "20px" });

  return (
    <div>
      <Center>
        <Tabs
          bg="blue"
          size="sm"
          variant="unstyled"
          align="center"
          overflowX="auto"
          overflowY="hidden"
        >
          <TabList>
            <Tab>
              <HStack direction="row" spacing={4}>
                <Avatar
                  bgColor="primary.blue"
                  name="1"
                  src="https://bit.ly/broken-link"
                  size="xs"
                />
                <Text as="b" color="primary.blue" fontSize={fontSize}>
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

                <Text as="b" color="gray" fontSize={fontSize}>
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

                <Text as="b" color="gray" fontSize={fontSize}>
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

/* const steps = [
    { title: "First", description: "Contact Info" },
    { title: "Second", description: "Date & Time" },
    { title: "Third", description: "Select Rooms" },
  ];
  return (
    <div>
      <Stepper size="lg" index={activeStep}>
        {steps.map((step, index) => (
          <Step key={index}>
            <StepIndicator>
              <StepStatus
                complete={<StepIcon />}
                incomplete={<StepNumber />}
                active={<StepNumber />}
              />
            </StepIndicator>

            <Box flexShrink="0">
              <StepTitle>{step.title}</StepTitle>
              <StepDescription>{step.description}</StepDescription>
            </Box>

            <StepSeparator />
          </Step>
        ))}
      </Stepper>
    </div>
  ); */

const CreateMealRequest = (): React.ReactElement => {
  return (
    <div>
      {/* <Flex
        flexDirection="column"
        width="100vw"
        justifyContent={{ base: "center", md: "flex-start" }}
        alignItems="center"
      > */}
      {titleSection()}

      {MealFormProgress()}
      {/* </Flex> */}
    </div>
  );
};

export default CreateMealRequest;
