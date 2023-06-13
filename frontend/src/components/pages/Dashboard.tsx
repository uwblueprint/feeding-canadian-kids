import { 
    CalendarIcon,
    ChevronDownIcon,
    HamburgerIcon
} from '@chakra-ui/icons';

import {
    Box,
    Tab,
    Table,
    TableContainer,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Tbody,
    Text,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr
} from '@chakra-ui/react';

import React from 'react';

function App() {
  return (
      <Box margin="150px" textAlign="center">
        <Text
            pb={{ base: 1, md: 5 }}
            pl={{ base: 1, md: 6 }}
            pt={{ base: 2, md: 8 }}
            variant={{ base: "mobile-display-xl", md: "desktop-display-xl" }}
        >
            Your Dashboard 
        </Text>

        <Text fontSize="xs" marginBottom="20px">
            Use this page to see your upcoming food deliveries.
        </Text>

        {/* tabs */}
        <Tabs>
          <TabList>
            <Tab>
                <Text
                    variant={{
                        base: "mobile-heading",
                        md: "desktop-heading",
                    }}
                >
                <CalendarIcon boxSize={5} mr={2} />
                Calendar
                </Text>
            </Tab>
            <Tab>
                <Text
                    variant={{
                        base: "mobile-heading",
                        md: "desktop-heading",
                    }}
                >
                <HamburgerIcon boxSize={5} mr={2} />
                List
                </Text>
            </Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <p>Content for Tab 2</p>
            </TabPanel>
            
            <TabPanel>
                <TableContainer>
                    <Table variant='simple'>
                        <Thead>
                        {/* should abstract the rows into a react component */}
                        <Tr>
                            <Th>Date Requested</Th>
                            <Th>Time Requested</Th>
                            <Th>Donor's Name</Th>
                            <Th>Number of Meals</Th>
                            <Th></Th>
                        </Tr>
                        </Thead>
                        <Tbody>
                        <Tr>
                            <Td>Oct 27, 2022</Td>
                            <Td>5:00-6:00 PM</Td>
                            <Td>Harvey's</Td>
                            <Td>5</Td>
                            <Td>
                                <ChevronDownIcon boxSize={6} />
                            </Td>
                        </Tr>
                        <Tr>
                            <Td>Oct 27, 2022</Td>
                            <Td>5:00-6:00 PM</Td>
                            <Td>Harvey's</Td>
                            <Td>5</Td>
                            <Td>
                                <ChevronDownIcon boxSize={6} />
                            </Td>
                        </Tr>
                        <Tr>
                            <Td>Oct 27, 2022</Td>
                            <Td>5:00-6:00 PM</Td>
                            <Td>Harvey's</Td>
                            <Td>5</Td>
                            <Td>
                                <ChevronDownIcon boxSize={6} />
                            </Td>
                        </Tr>
                        </Tbody>
                    </Table>
                </TableContainer>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
  );
}

export default App;
