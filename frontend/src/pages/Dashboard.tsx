import {
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  DeleteIcon,
  EditIcon,
  HamburgerIcon,
} from "@chakra-ui/icons";
import {
  Box,
  Center,
  Button as ChakraButton,
  Collapse,
  Flex,
  HStack,
  Heading,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  VStack,
  Wrap,
} from "@chakra-ui/react";
import {
  DEFAULT_OPTIONS,
  getTheme,
} from "@table-library/react-table-library/chakra-ui";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useTheme } from "@table-library/react-table-library/theme";
import * as TABLE_LIBRARY_TYPES from "@table-library/react-table-library/types/table";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import EditMealRequestForm from "./EditMealRequestForm";
import mealRequestsJSON from "./MealRequestSampleData.json";

import BackgroundImage from "../../assets/background.png";
import * as Routes from "../../constants/Routes";
import SampleContext from "../../contexts/SampleContext";
import { Contact } from "../../types/UserTypes";
import Logout from "../auth/Logout";
import RefreshCredentials from "../auth/RefreshCredentials";

type ButtonProps = { text: string; path: string };

const Button = ({ text, path }: ButtonProps) => {
  const navigate = useNavigate();
  return <ChakraButton onClick={() => navigate(path)}>{text}</ChakraButton>;
};

const TeamInfoDisplay = () => {
  const { teamName, numTerms, members, isActive } = useContext(SampleContext);
  return (
    <div>
      <h2>Team Info</h2>
      <div>Name: {teamName}</div>
      <div># terms: {numTerms}</div>
      <div>
        Members:{" "}
        {members.map(
          (name, i) => ` ${name}${i === members.length - 1 ? "" : ","}`,
        )}
      </div>
      <div>Active: {isActive ? "Yes" : "No"}</div>
    </div>
  );
};

const OldDashboard = (): React.ReactElement => {
  return (
    <div
      style={{
        textAlign: "center",
        paddingTop: "20px",
        height: "100vh",
        backgroundImage: `url(${BackgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Wrap>
        <RefreshCredentials />
        <Button text="Create Entity" path={Routes.CREATE_ENTITY_PAGE} />
        <Button text="Update Entity" path={Routes.UPDATE_ENTITY_PAGE} />
        <Button text="Display Entities" path={Routes.DISPLAY_ENTITY_PAGE} />
        <Button
          text="Create Simple Entity"
          path={Routes.CREATE_SIMPLE_ENTITY_PAGE}
        />
        <Button
          text="Update Simple Entity"
          path={Routes.UPDATE_SIMPLE_ENTITY_PAGE}
        />
        <Button
          text="Display Simple Entities"
          path={Routes.DISPLAY_SIMPLE_ENTITY_PAGE}
        />
        <Button text="Hooks Demo" path={Routes.HOOKS_PAGE} />
        <EditMealRequestForm />
      </Wrap>
      <div style={{ height: "2rem" }} />
    </div>
  );
};

const ListView = () => {
  const chakraTheme = getTheme(DEFAULT_OPTIONS);
  const customTheme = {
    Table: `
      margin: 0 !important;
      width: 100%;
      --data-table-library_grid-template-columns: repeat(4, minmax(0, 1fr)) 88px;

      .animate {
        grid-column: 1 / -1;

        display: flex;
      }

      .animate > div {
        flex: 1;
        display: flex;
      }
    `,
    HeaderRow: `
      background-color: var(--chakra-colors-gray-50);
      color: var(--chakra-colors-gray-500);
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 600;
      line-height: 21px;
      text-transform: none;
    `,
  };

  const theme = useTheme([chakraTheme, customTheme]);

  const [ids, setIds] = React.useState<Array<TABLE_LIBRARY_TYPES.Identifier>>(
    [],
  );

  const handleExpand = (item: TABLE_LIBRARY_TYPES.TableNode) => () => {
    if (item.pending) return;

    if (ids.includes(item.id)) {
      setIds(ids.filter((id) => id !== item.id));
    } else {
      setIds(ids.concat(item.id));
    }
  };

  const handleEdit = (item: TABLE_LIBRARY_TYPES.TableNode) => () => {
    // eslint-disable-next-line no-console
    console.log("edit clicked for item", item.id);
  };

  const handleDelete = (item: TABLE_LIBRARY_TYPES.TableNode) => () => {
    // eslint-disable-next-line no-console
    console.log("delete clicked for item", item.id);
  };

  const mealRequests = mealRequestsJSON;

  const data = {
    nodes: mealRequests.map(
      (mealRequest, index): TABLE_LIBRARY_TYPES.TableNode => ({
        id: index,
        date_requested: new Date(mealRequest.drop_off_time.$date),
        time_requested: new Date(mealRequest.drop_off_time.$date),
        // donor_name: donor_name ? donor_name : null,
        donor_name: index % 2 ? null : "Placeholder Name",
        num_meals: mealRequest.meal_info.portions,
        primary_contact: mealRequest.primary_contact,
        onsite_staff: mealRequest.onsite_staff,
        meal_description: mealRequest.description,
        delivery_instructions: mealRequest.delivery_instructions,
        // pending: mealRequest.pending,
        pending: index % 2,
        _hasContent: false,
        nodes: null,
      }),
    ),
  };

  const COLUMNS = [
    {
      label: "Date Requested",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Text variant="desktop-xs">
          {item.date_requested.toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </Text>
      ),
    },
    {
      label: "Time Requested",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Text variant="desktop-xs">
          {item.time_requested.toLocaleTimeString("en-US")}
        </Text>
      ),
    },
    {
      label: "Donor's Name",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Text
          variant="desktop-xs"
          fontStyle={item.pending ? "italic" : "normal"}
          color={item.pending ? "gray.400" : "inherit"}
        >
          {item.pending ? "Pending Donor" : item.donor_name}
        </Text>
      ),
    },
    {
      label: "Num of Meals",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => (
        <Text variant="desktop-xs">{item.num_meals}</Text>
      ),
    },
    {
      label: "",
      renderCell: (item: TABLE_LIBRARY_TYPES.TableNode) => {
        if (!item.pending) {
          return (
            <Flex
              cursor="pointer"
              justifyContent="flex-end"
              onClick={handleExpand(item)}
            >
              {ids.includes(item.id) ? <ChevronUpIcon /> : <ChevronDownIcon />}
            </Flex>
          );
        }

        return (
          <HStack>
            <EditIcon
              onClick={handleEdit(item)}
              cursor="pointer"
              _hover={{ color: "primary.blue" }}
            />
            <DeleteIcon
              onClick={handleDelete(item)}
              cursor="pointer"
              _hover={{ color: "primary.blue" }}
            />
          </HStack>
        );
      },
    },
  ];

  const ROW_OPTIONS = {
    renderAfterRow: (item: TABLE_LIBRARY_TYPES.TableNode) => (
      <Collapse className="animate" in={ids.includes(item.id)}>
        <Flex
          flexDir="row"
          p="16px"
          borderBottom="1px solid"
          borderColor="gray.400"
        >
          <Flex flexDir="column" flex={1} p="8px">
            <Text variant="mobile-button-bold" mb="8px">
              Donor Contact Info:
            </Text>
            <Text variant="mobile-caption-bold">Primary:</Text>
            <Box mb="8px">
              <Text variant="mobile-caption-2">
                {item.primary_contact.name}
              </Text>
              <Text variant="mobile-caption-2">
                {item.primary_contact.email}
              </Text>
              <Text variant="mobile-caption-2">
                {item.primary_contact.phone}
              </Text>
            </Box>
            <Text variant="mobile-caption-bold">Onsite:</Text>
            {item.onsite_staff.map((staff: Contact) => (
              <Box key={staff.email} mb="4px">
                <Text variant="mobile-caption-2">{staff.name}</Text>
                <Text variant="mobile-caption-2">{staff.email}</Text>
                <Text variant="mobile-caption-2">{staff.phone}</Text>
              </Box>
            ))}
          </Flex>
          <Box flex={1} p="8px">
            <Text variant="mobile-button-bold">Meal Description:</Text>
            <Text variant="mobile-caption-2">{item.meal_description}</Text>
          </Box>
          <Box flex={1} p="8px">
            <Text variant="mobile-button-bold">Meal Donor Notes:</Text>
            <Text variant="mobile-caption-2">{item.delivery_instructions}</Text>
          </Box>
        </Flex>
      </Collapse>
    ),
  };

  return (
    <Box mt="24px">
      <Box
        display="flex"
        alignItems="center"
        w="100%"
        h="64px"
        p="12px 16px"
        bgColor="gray.50"
        borderLeft="2px solid"
        borderColor="gray.gray83"
      >
        <Text variant="desktop-body-bold">Meal Requests</Text>
      </Box>
      <CompactTable
        columns={COLUMNS}
        rowOptions={ROW_OPTIONS}
        data={data}
        theme={theme}
        layout={{ custom: true }}
      />
      {mealRequests.length === 0 && (
        <Center h="100px">
          <Text>No meal requests to display</Text>
        </Center>
      )}
    </Box>
  );
};

const Dashboard = (): React.ReactElement => {
  return (
    <Flex flexDir="column" alignItems="center" w="80vw" mx="auto" mb="100px">
      <Text variant="desktop-display-xl" my="20px">
        Your Dashboard
      </Text>
      <Text variant="desktop-caption" mb="20px">
        Use this page to see your upcoming food deliveries
      </Text>
      <Tabs defaultIndex={1} w="100%">
        <Flex flexDir="row" justifyContent="space-between">
          <TabList>
            <Tab gap="8px">
              <CalendarIcon w="16px" />
              <Text variant="desktop-button-bold">Calendar</Text>
            </Tab>
            <Tab gap="8px">
              <HamburgerIcon w="16px" />
              <Text variant="desktop-button-bold">List</Text>
            </Tab>
            <Tab>
              <Text variant="desktop-button-bold">Old Dashboard</Text>
            </Tab>
          </TabList>
          <ChakraButton>+ Create Request</ChakraButton>
        </Flex>

        <TabPanels>
          <TabPanel>
            <p>Insert Calendar Here</p>
          </TabPanel>
          <TabPanel p="0">
            <ListView />
          </TabPanel>
          <TabPanel>
            <OldDashboard />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
};

export default Dashboard;
