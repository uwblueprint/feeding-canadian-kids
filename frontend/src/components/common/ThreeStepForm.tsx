/* eslint-disable react/jsx-props-no-spreading */
// Props spreading is used to add the handleNext prop to the panel components
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
import React, { useState } from "react";

/**
 * A three-step form with tabs at the top.
 * It takes in three panels, each of which is a React component.
 * Each panel should have a handleNext prop, which is a function that is called when the user clicks the "Next" button or is otherwise ready to move on to the next step.
 */
const ThreeStepForm = ({
  header1,
  header2,
  header3,
  panel1,
  panel2,
  panel3,
}: {
  header1: string;
  header2: string;
  header3: string;
  panel1: React.ReactElement;
  panel2: React.ReactElement;
  panel3: React.ReactElement;
}): React.ReactElement => {
  const fontSize = useBreakpointValue({ base: "12px", sm: "16px", md: "20px" });

  const [tabIndex, setTabIndex] = useState(0);
  const [completedTab, setCompletedTab] = useState(-1); // The highest tab index that has been completed

  const handleNext = () => {
    const thisTab = tabIndex;
    setTabIndex((prevIndex) => prevIndex + 1);
    setCompletedTab((prevIndex) => Math.max(prevIndex, thisTab));
  };

  const handleBack = () => {
    const thisTab = tabIndex;
    setTabIndex((prevIndex) => prevIndex + 1);
    setCompletedTab((prevIndex) => Math.max(prevIndex, thisTab));
  };

  return (
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
                  {header1}
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
                  {header2}
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
                  {header3}
                </Text>
              </HStack>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <panel1.type {...panel1.props} handleNext={handleNext} />
            </TabPanel>
            <TabPanel>
              <panel2.type {...panel2.props} handleNext={handleNext} />
            </TabPanel>
            <TabPanel>
              <panel3.type {...panel3.props} handleNext={handleNext} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Center>
    </div>
  );
};

export default ThreeStepForm;
