import {
  Avatar,
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  HStack,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
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
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

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
  const [donationFrequency, setDonationFrequency] = React.useState("");
  const [donationDays, setDonationDays] = React.useState([] as string[]);
  const [startDate, setStartDate] = React.useState("");
  const [endDate, setEndDate] = React.useState("");
  const [scheduledDropOffTime, setScheduledDropOffTime] = React.useState("");
  const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];
  const [nextButton, setNextButton] = React.useState(false);

  // Button state (array of booleans)
  const [buttonState, setButtonState] = React.useState(Array(7).fill(false));

  // Turn button to solid variant when clicked
  const handleClick = (index: number) => {
    const newButtonState = [...buttonState];
    newButtonState[index] = !newButtonState[index];
    setButtonState(newButtonState);

    // update the donationDays list on which days are selected from the boolean array
    const selectedDays = newButtonState
      .map((state, i) => (state ? dayNames[i] : "") as string)
      .filter((day) => day !== "");

    setDonationDays(selectedDays);
  };

  const validateData = () => {
    if (
      donationFrequency === "" ||
      donationDays.length === 0 ||
      startDate === "" ||
      endDate === "" ||
      scheduledDropOffTime === ""
    ) {
      // Handle validation error, display error message or prevent form submission
      setNextButton(true);
      console.log("Please fill in all the required fields.");
      return;
    }
    setNextButton(false);

    // Data is valid, continue to the next step
    console.log("Data is valid!");
    // Proceed with further actions or form submission
  };

  return (
    <Grid
      templateColumns={{ base: "repeat(1, 1fr)", md: "repeat(3, 1fr)" }}
      gap={4}
      paddingLeft={{ base: "1rem", md: "2rem" }}
      paddingRight={{ base: "1rem", md: "2rem" }}
      textAlign={{ base: "left", md: "left" }}
    >
      <GridItem colSpan={1}>
        <Text as="b">Date and Time</Text>
        <Text>Please select the date for the meal drop-off.</Text>
      </GridItem>

      <GridItem colSpan={{ base: 1, md: 2 }}>
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

        <Text
          color={donationFrequency === "" && nextButton ? "red" : "black"}
          as="b"
        >
          Donation Frequency*
        </Text>
        <Select
          required
          height={{ base: "2rem", md: "2.5rem" }}
          size="xs"
          onChange={(e) => setDonationFrequency(e.target.value)}
          placeholder="Select a donation frequency"
        >
          <option value="Weekly">Weekly</option>
          <option value="Monthly">Monthly</option>
          <option value="Does not repeat">Does not repeat</option>
        </Select>

        <br />
        <Text
          color={donationDays.length === 0 && nextButton ? "red" : "black"}
          as="b"
        >
          Days of Donation*
        </Text>

        <SimpleGrid columns={{ base: 4, md: 7 }} spacing={{ base: 3, md: 3 }}>
          {dayNames.map((day) => (
            <Button
              key={day}
              variant={buttonState[dayNames.indexOf(day)] ? "solid" : "outline"}
              colorScheme="primary.blue"
              borderColor="primary.blue"
              textColor={
                buttonState[dayNames.indexOf(day)] ? "white" : "primary.blue"
              }
              backgroundColor={
                buttonState[dayNames.indexOf(day)] ? "primary.blue" : "white"
              }
              onClick={() => handleClick(dayNames.indexOf(day))}
              color="primary.blue"
              height={{ base: "2rem", md: "3rem" }}
              rounded="md"
              fontSize="xs"
              fontWeight={600}
            >
              {day}
            </Button>
          ))}
        </SimpleGrid>

        <br />

        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 4, md: 4 }}>
          <Box>
            <Text
              color={startDate === "" && nextButton ? "red" : "black"}
              as="b"
            >
              Start Date
            </Text>
            <br />
            <Input
              required
              size="xs"
              height={{ base: "2rem", md: "3rem" }}
              variant="outline"
              colorScheme="primary.blue"
              onChange={(e) => setStartDate(e.target.value)}
              type="date"
              rounded="md"
              width={{ base: "100%", md: "100%" }}
              placeholder="Select a date"
            />
          </Box>

          <Box>
            <Text color={endDate === "" && nextButton ? "red" : "black"} as="b">
              End Date*
            </Text>
            <br />
            <Input
              required
              size="xs"
              height={{ base: "2rem", md: "3rem" }}
              variant="outline"
              onChange={(e) => setEndDate(e.target.value)}
              colorScheme="primary.blue"
              type="date"
              rounded="md"
              width={{ base: "100%", md: "100%" }}
              placeholder="Select a date"
            />
          </Box>

          <Box>
            <Text
              color={
                scheduledDropOffTime === "" && nextButton ? "red" : "black"
              }
              as="b"
            >
              Scheduled drop-off time*
            </Text>
            <Input
              required
              height={{ base: "2rem", md: "3rem" }}
              size="xs"
              onChange={(e) => setScheduledDropOffTime(e.target.value)}
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
        colSpan={{ base: 1, md: 3 }}
        display="flex"
        justifyContent="flex-end"
      >
        <Spacer />
        <Button
          colorScheme="primary.green"
          variant="solid"
          size="xs"
          onSubmit={(e) => e.preventDefault()}
          height={{ base: "2rem", md: "3rem" }}
          width={{ base: "10%", md: "10%" }}
          bg="primary.blue"
          onClick={validateData}
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

const QuitModal = ({
  isOpen,
  onClose,
  onQuit,
}: {
  isOpen: boolean;
  onClose: () => void;
  onQuit: () => void;
}): React.ReactElement => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Quit Editing?</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Text>Your changes will not be saved if you leave this page.</Text>
        </ModalBody>

        <ModalFooter>
          <Button bgColor="red" mr={3} onClick={onQuit}>
            Quit
          </Button>

          <Button colorScheme="red" variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
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

// How can I implement this?

const CreateMealRequest = (): React.ReactElement => {
  const [showQuitModal, setShowQuitModal] = useState(false);

  const handleQuitEditing = () => {
    setShowQuitModal(false);
  };

  const handleCancelQuit = () => {
    setShowQuitModal(false);
  };

  const alertUser = (e: {
    returnValue: string;
    preventDefault: () => void;
  }) => {
    e.preventDefault();
    e.returnValue = "";
    // setShowQuitModal(true);
  };

  useEffect(() => {
    window.addEventListener("beforeunload", (e) => alertUser(e));
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);

  return (
    <div>
      {titleSection()}

      {MealFormProgress()}

      <QuitModal
        isOpen={showQuitModal}
        onClose={handleCancelQuit}
        onQuit={handleQuitEditing}
      />
    </div>
  );
};

export default CreateMealRequest;
