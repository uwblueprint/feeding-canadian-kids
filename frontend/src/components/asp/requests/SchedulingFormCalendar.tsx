import {
  Box,
  Button,
  Center,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  GridItem,
  Input,
  Select,
  SimpleGrid,
  Spacer,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import DatePicker, { Calendar } from "react-multi-date-picker";
import type { Value } from "react-multi-date-picker";

type SchedulingFormCalendarProps = {
  scheduledDropOffTime: string;
  setScheduledDropOffTime: (scheduledDropOffTime: string) => void;
  dates: Date[];
  setDates: (dates: Date[]) => void;
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
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  const toast = useToast();

  const validateData = () => {
    if (scheduledDropOffTime === "" || dates.length === 0) {
      setAttemptedSubmit(true);
      if (dates.length === 0) {
        toast({
          title: "No dates selected",
          description: "Please select at least one date",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      }
      return;
    }

    setAttemptedSubmit(false);
    handleNext();
  };

  const valueToDateArray = (value: Value): Date[] => {
    // If value is a string or a number, throw an error
    if (typeof value === "string" || typeof value === "number") {
      throw new Error("Invalid value type");
    }

    // If value is a date, return an array with that date
    if (value instanceof Date) {
      return [value];
    }

    // If value is an array, return that array
    if (Array.isArray(value)) {
      return value.map((date) => new Date(date as string));
    }

    throw new Error(
      "Invalid value type attempted to be converted to list of dates",
    );
  };

  // scheduledDropOffTimeEnd is 1 hour later than scheduledDropOffTime
  const scheduledDropOffTimeEnd = new Date(
    new Date().toDateString() + " " + scheduledDropOffTime,
  );
  scheduledDropOffTimeEnd.setHours(scheduledDropOffTimeEnd.getHours() + 1);

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
          receive meal donations. Selected dates will be highlighted. Please
          note that the drop off time will be the same for all selected dates.
        </Text>
      </GridItem>

      <GridItem colSpan={{ base: 1, md: 2 }}>
        {/* Weekly input is commented out for now since we don't plan on implementing it right now but may do so in the future
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
  */}

        <br />
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={{ base: 4, md: 4 }}>
          <GridItem colSpan={{ base: 1, sm: 2 }}>
            <Center>
              <FormControl
                isInvalid={attemptedSubmit && dates.length === 0}
                isRequired
              >
                <Calendar
                  numberOfMonths={2}
                  value={dates}
                  onChange={(v: Value) => {
                    setDates(valueToDateArray(v));
                  }}
                  minDate={new Date()}
                />
              </FormControl>
            </Center>
          </GridItem>

          <GridItem colSpan={{ base: 1, sm: 2 }}>
            <FormControl
              isInvalid={attemptedSubmit && scheduledDropOffTime === ""}
              isRequired
            >
              <FormLabel variant="form-label-bold">
                Scheduled drop-off time
              </FormLabel>
              <Flex direction="row" align="center">
                <Input
                  required
                  height={{ base: "2rem", md: "3rem" }}
                  size="xs"
                  onChange={(e) => setScheduledDropOffTime(e.target.value)}
                  type="time"
                  placeholder="Select a time"
                  flex="1"
                />
                <Text marginLeft="1rem" flex="1">
                  {scheduledDropOffTime &&
                    " - " +
                      scheduledDropOffTimeEnd.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                </Text>
              </Flex>
            </FormControl>
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
