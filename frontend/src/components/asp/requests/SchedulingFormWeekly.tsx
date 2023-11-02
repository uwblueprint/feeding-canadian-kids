import {
  Box,
  Button,
  Grid,
  GridItem,
  Input,
  Select,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";

type SchedulingFormWeeklyProps = {
  donationFrequency: string;
  setDonationFrequency: (donationFrequency: string) => void;
  weekdayButtonStates: boolean[];
  setWeekdayButtonStates: (weekdayButtonStates: boolean[]) => void;
  startDate: string;
  setStartDate: (startDate: string) => void;
  endDate: string;
  setEndDate: (endDate: string) => void;
  scheduledDropOffTime: string;
  setScheduledDropOffTime: (scheduledDropOffTime: string) => void;
  setIsWeeklyInput: (isWeeklyInput: boolean) => void;
  handleNext: () => void;
};

const SchedulingFormWeekly: React.FunctionComponent<SchedulingFormWeeklyProps> = ({
  donationFrequency,
  setDonationFrequency,
  weekdayButtonStates,
  setWeekdayButtonStates,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  scheduledDropOffTime,
  setScheduledDropOffTime,
  setIsWeeklyInput,
  handleNext,
}) => {
  const dayNames = ["Sun", "Mon", "Tues", "Wed", "Thurs", "Fri", "Sat"];

  const [nextButtonEnabled, setNextButtonEnabled] = useState(false);

  const numberOfChosenDays = weekdayButtonStates.filter((state) => state)
    .length;

  // Turn button to solid variant when clicked
  const handleClick = (index: number) => {
    const newButtonState = [...weekdayButtonStates];
    newButtonState[index] = !newButtonState[index];
    setWeekdayButtonStates(newButtonState);
  };

  const validateData = () => {
    if (
      donationFrequency === "" ||
      numberOfChosenDays === 0 ||
      startDate === "" ||
      endDate === "" ||
      scheduledDropOffTime === ""
    ) {
      // Handle validation error, display error message or prevent form submission
      setNextButtonEnabled(true);
      return;
    }
    setNextButtonEnabled(false);

    handleNext();
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
          <button
            style={{ textDecoration: "underline" }}
            onClick={() => setIsWeeklyInput(false)}
            type="button"
          >
            click here to enter dates manually
          </button>
          .
        </Text>
        <br />

        <Text
          color={
            donationFrequency === "" && nextButtonEnabled ? "red" : "black"
          }
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
          color={
            numberOfChosenDays === 0 && nextButtonEnabled ? "red" : "black"
          }
          as="b"
        >
          Days of Donation*
        </Text>

        <SimpleGrid columns={{ base: 4, md: 7 }} spacing={{ base: 3, md: 3 }}>
          {dayNames.map((day) => (
            <Button
              key={day}
              variant={
                weekdayButtonStates[dayNames.indexOf(day)] ? "solid" : "outline"
              }
              colorScheme="primary.blue"
              borderColor="primary.blue"
              textColor={
                weekdayButtonStates[dayNames.indexOf(day)]
                  ? "white"
                  : "primary.blue"
              }
              backgroundColor={
                weekdayButtonStates[dayNames.indexOf(day)]
                  ? "primary.blue"
                  : "white"
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
              color={startDate === "" && nextButtonEnabled ? "red" : "black"}
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
            <Text
              color={endDate === "" && nextButtonEnabled ? "red" : "black"}
              as="b"
            >
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
                scheduledDropOffTime === "" && nextButtonEnabled
                  ? "red"
                  : "black"
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

export default SchedulingFormWeekly;
