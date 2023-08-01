import {
  Avatar,
  Center,
  HStack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";

import SchedulingFormWeekly from "./SchedulingFormWeekly";
import TitleSection from "./TitleSection";

const CreateMealRequest = (): React.ReactElement => {
  const fontSize = useBreakpointValue({ base: "12px", sm: "16px", md: "20px" });

  const [tabIndex, setTabIndex] = useState(0);
  const [completedTab, setCompletedTab] = useState(-1); // The highest tab index that has been completed

  // Part 1: Scheduling
  const [isWeeklyInput, setIsWeeklyInput] = useState(true); // Are we in weekly input mode (false means we are in calendar mode)
  const [donationFrequency, setDonationFrequency] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [scheduledDropOffTime, setScheduledDropOffTime] = useState("");

  // Button state (array of booleans)
  const [weekdayButtonStates, setWeekdayButtonStates] = useState(
    Array(7).fill(false),
  );

  const handleNext = () => {
    const thisTab = tabIndex;
    setTabIndex((prevIndex) => prevIndex + 1);
    setCompletedTab((prevIndex) => Math.max(prevIndex, thisTab));

    // TODO: once the last tab is reached, submit the form
    // Below is a way to get a list of days, i.e. the indexes of the true values in the boolean array
    const selectedDays = weekdayButtonStates
      .map((state, i) => (state ? i : -1))
      .filter((day) => day !== -1);

    console.log(selectedDays);
  };

  const alertUser = (e: {
    returnValue: string;
    preventDefault: () => void;
  }) => {
    e.preventDefault();

    e.returnValue = "";
  };

  useEffect(() => {
    window.addEventListener("beforeunload", (e) => alertUser(e));
    return () => {
      window.removeEventListener("beforeunload", alertUser);
    };
  }, []);

  return (
    <div>
      <TitleSection />

      <div>
        <Center>
          <Tabs
            size="sm"
            variant="unstyled"
            align="center"
            overflowX="auto"
            overflowY="hidden"
            index={tabIndex}
            onChange={setTabIndex}
          >
            <TabList>
              <Tab>
                <HStack direction="row" spacing={4}>
                  <Avatar
                    bgColor={tabIndex === 0 ? "primary.blue" : "gray"}
                    name="1"
                    src="https://bit.ly/broken-link"
                    size="xs"
                  />
                  <Text
                    as="b"
                    color={tabIndex === 0 ? "primary.blue" : "gray"}
                    fontSize={fontSize}
                  >
                    Scheduling
                  </Text>
                </HStack>
              </Tab>

              <Tab isDisabled={completedTab < 0}>
                <HStack direction="row" spacing={4}>
                  <Avatar
                    bgColor={tabIndex === 1 ? "primary.blue" : "gray"}
                    name="2"
                    src="https://bit.ly/broken-link"
                    size="xs"
                  />

                  <Text
                    as="b"
                    color={tabIndex === 1 ? "primary.blue" : "gray"}
                    fontSize={fontSize}
                  >
                    Meal Donation Information
                  </Text>
                </HStack>
              </Tab>

              <Tab isDisabled={completedTab < 1}>
                <HStack direction="row" spacing={4}>
                  <Avatar
                    bgColor={tabIndex === 2 ? "primary.blue" : "gray"}
                    name="3"
                    src="https://bit.ly/broken-link"
                    size="xs"
                  />
                  <Text
                    as="b"
                    color={tabIndex === 2 ? "primary.blue" : "gray"}
                    fontSize={fontSize}
                  >
                    Review & Submit
                  </Text>
                </HStack>
              </Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                {isWeeklyInput ? (
                  <SchedulingFormWeekly
                    donationFrequency={donationFrequency}
                    setDonationFrequency={setDonationFrequency}
                    weekdayButtonStates={weekdayButtonStates}
                    setWeekdayButtonStates={setWeekdayButtonStates}
                    startDate={startDate}
                    setStartDate={setStartDate}
                    endDate={endDate}
                    setEndDate={setEndDate}
                    scheduledDropOffTime={scheduledDropOffTime}
                    setScheduledDropOffTime={setScheduledDropOffTime}
                    setIsWeeklyInput={setIsWeeklyInput}
                    onComplete={handleNext}
                  />
                ) : (
                  <p>one!</p>
                )}
              </TabPanel>
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
    </div>
  );
};

export default CreateMealRequest;
