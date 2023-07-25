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
import React, { useEffect } from "react";

import SchedulingForm from "./SchedulingForm";
import TitleSection from "./TitleSection";

const CreateMealRequest = (): React.ReactElement => {
  const fontSize = useBreakpointValue({ base: "12px", sm: "16px", md: "20px" });

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
              <TabPanel>
                <SchedulingForm />
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
