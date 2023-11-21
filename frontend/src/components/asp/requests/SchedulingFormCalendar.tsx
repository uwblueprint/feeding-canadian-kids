import {
  Box,
  Button,
  Center,
  Grid,
  GridItem,
  Input,
  Select,
  SimpleGrid,
  Spacer,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import DatePicker, { Calendar } from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";

type SchedulingFormCalendarProps = {
  scheduledDropOffTime: string;
  setScheduledDropOffTime: (scheduledDropOffTime: string) => void;
  dates: Value;
  setDates: (dates: Value) => void;
  setIsWeeklyInput: (isWeeklyInput: boolean) => void;
  handleNext: () => void;
};

const SchedulingFormCalendar: React.FunctionComponent<SchedulingFormCalendarProps> = ({
  scheduledDropOffTime,
  setScheduledDropOffTime,
  dates,
  setDates,
  setIsWeeklyInput,
  handleNext,
}) => {
  const [nextButtonEnabled, setNextButtonEnabled] = useState(false);

  const validateData = () => {
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
        <Text as="b">Edit Date Manually</Text>
        <Text>
          You can select or deselect the dates on which you would like to
          receive meal donations. Selected dates will be highlighted.
        </Text>
      </GridItem>

      <GridItem colSpan={{ base: 1, md: 2 }}>
        <Text color="primary.blue" fontSize="xs">
          If your schedule is the same each week,&nbsp;
          <button
            style={{ textDecoration: "underline" }}
            onClick={() => setIsWeeklyInput(true)}
            type="button"
          >
            click here to request weekly donations
          </button>
        </Text>

        <br />
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 4, md: 4 }}>
          <GridItem colSpan={{ base: 1, sm: 2 }}>
            <Center>
              <Calendar
                numberOfMonths={2}
                value={dates}
                onChange={setDates}
                minDate={new Date()}
              />
            </Center>
          </GridItem>

          <GridItem colSpan={1}>
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
          </GridItem>
        </SimpleGrid>
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
          bg="primary.green"
          onClick={validateData}
        >
          Next
        </Button>
      </GridItem>
    </Grid>
  );
};

export default SchedulingFormCalendar;
