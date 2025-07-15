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
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

type PageNavigationState = { tabIndex: number };

function getTabIndex(state: unknown): number {
  if (!state) return 0; // Makes sure it's not null
  if (typeof state !== "object") return 0;
  if (typeof (state as PageNavigationState).tabIndex !== "number") return 0;
  return (state as PageNavigationState).tabIndex;
}

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
  shouldGoBackToStep1,
}: {
  header1: string;
  header2: string;
  header3: string;
  panel1: React.ReactElement;
  panel2: React.ReactElement;
  panel3: React.ReactElement;
  shouldGoBackToStep1: (currentStep: number) => boolean;
}): React.ReactElement => {
  const fontSize = useBreakpointValue({ base: "12px", sm: "16px", md: "20px" });
  const { state, pathname, search } = useLocation();

  const [tabIndex, setTabIndex] = useState(0);
  const navigate = useNavigate();

  // Get state:
  useEffect(() => {
    let newTabIndex = getTabIndex(state);

    if (shouldGoBackToStep1(newTabIndex)) {
      newTabIndex = 0;
      navigate(pathname + search, { state: { tabIndex: 0 } });
      window.history.replaceState({}, "", "");
    }

    setTabIndex(newTabIndex);
  }, [navigate, pathname, search, shouldGoBackToStep1, state]);

  const handleNext = () => {
    const thisTab = tabIndex;
    setTabIndex((prevIndex) => prevIndex + 1);
    navigate(pathname + search, { state: { tabIndex: thisTab + 1 } });
  };

  const handleBack = () => {
    const thisTab = tabIndex;
    setTabIndex((prevIndex) => prevIndex - 1);
    navigate(pathname + search, { state: { tabIndex: thisTab - 1 } });
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

            <Tab isDisabled={tabIndex < 1}>
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

            <Tab isDisabled={tabIndex < 2}>
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
              <panel2.type
                {...panel2.props}
                handleBack={handleBack}
                handleNext={handleNext}
              />
            </TabPanel>
            <TabPanel>
              <panel3.type {...panel3.props} handleBack={handleBack} />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Center>
    </div>
  );
};

export default ThreeStepForm;
