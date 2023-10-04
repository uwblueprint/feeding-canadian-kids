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
import type { Value } from "react-multi-date-picker";
import DatePicker from "react-multi-date-picker";

type SchedulingFormCalendarProps = {
  scheduledDropOffTime: string;
  setScheduledDropOffTime: (scheduledDropOffTime: string) => void;
  setIsWeeklyInput: (isWeeklyInput: boolean) => void;
  handleNext: () => void;
};

const SchedulingFormCalendar: React.FunctionComponent<SchedulingFormCalendarProps> = ({
  scheduledDropOffTime,
  setScheduledDropOffTime,
  setIsWeeklyInput,
  handleNext,
}) => {
  const [nextButtonEnabled, setNextButtonEnabled] = useState(false);

  const [values, setValues] = useState<Value>([]);

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
        <Text as="b">Date and Time</Text>
        <Text>Please select the date for the meal drop-off.</Text>
      </GridItem>

      <GridItem colSpan={{ base: 1, md: 2 }}>
        <Text color="primary.blue" fontSize="xs">
          If your requests are the same each week,&nbsp;
          <button
            style={{ textDecoration: "underline" }}
            onClick={() => setIsWeeklyInput(true)}
            type="button"
          >
            click here to enter dates weekly
          </button>
        </Text>

        <br />
        <Box>
          <Text
            color={
              scheduledDropOffTime === "" && nextButtonEnabled ? "red" : "black"
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

        <Text color={"black"} as="b">
          Select Dates
        </Text>

        <DatePicker multiple value={values} onChange={setValues} />
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

export default SchedulingFormCalendar;
