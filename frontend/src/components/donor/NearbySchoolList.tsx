import {
  Box,
  Card,
  CardBody,
  Center,
  Flex,
  Grid,
  Image,
  Text,
} from "@chakra-ui/react";
import React from "react";
import { IoPersonOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";

import { MEAL_DONOR_CALENDAR_PAGE } from "../../constants/Routes";
import type { ASPDistance } from "../../types/UserTypes";

// Props: we need a list of ASPDistance
type NearbySchoolListProps = {
  schools: ASPDistance[];
};

const NearbySchoolList = ({
  schools,
}: NearbySchoolListProps): React.ReactElement => {
  const navigate = useNavigate();

  return (
    <div>
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", xl: "repeat(2, 1fr)" }}
        gap={6}
      >
        <Flex
          flex="1"
          direction="column"
          justifyContent="center"
          alignItems="left"
          padding="0 10vw"
        >
          <Text fontSize="lg" as="b" marginTop="20px">
            Your School Matches
          </Text>

          <Text>
            Partner with a school in your community that aligns with your
            donation preferences.
          </Text>
        </Flex>
        <Flex flex="1" padding="0 7vw">
          <Box
            display="flex"
            flexDirection="column"
            justifyItems="center"
            alignItems="center"
            overflowY={{ base: "visible", xl: "auto" }}
            overflowX={{ base: "visible", xl: "hidden" }}
            height={{ base: undefined, xl: "80vh" }}
            width="100%"
          >
            {schools.map((school) => (
              <Card
                key={school?.id}
                borderWidth="1px"
                borderRadius="lg"
                p="20px"
                m="10px"
                direction={{ base: "column", sm: "row" }}
                width="100%"
              >
                <Flex
                  alignItems="center"
                  justifyItems="center"
                  marginRight="1vw"
                >
                  <Image
                    src="/classroom.png"
                    alt={school?.info?.organizationName}
                    borderRadius="full"
                    w={{ base: "10vh", sm: "20vh" }}
                    h={{ base: "10vh", sm: "20vh" }}
                    objectFit="contain"
                  />
                </Flex>

                <CardBody justifyContent="left" alignItems="left">
                  <Center h="100%">
                    <Flex direction="column" width="100%">
                      <Text>{school?.distance} km away</Text>
                      <Text fontSize="lg" fontWeight="bold">
                        {school?.info?.organizationName}
                      </Text>
                      <Flex alignItems="center" mt={2} columnGap={2}>
                        <IoPersonOutline />
                        <Text>
                          {school?.info?.roleInfo.aspInfo?.numKids} children
                        </Text>
                      </Flex>
                      <Text color="primary.blue" fontSize="xs">
                        <button
                          style={{
                            textDecoration: "underline",
                            fontWeight: "bold",
                          }}
                          onClick={() => {
                            navigate(
                              `${MEAL_DONOR_CALENDAR_PAGE}?aspId=${school?.id}&distance=${school?.distance}`,
                            );
                          }}
                          type="button"
                        >
                          View meals needed 🡒
                        </button>
                      </Text>
                    </Flex>
                  </Center>
                </CardBody>
              </Card>
            ))}
          </Box>
        </Flex>
      </Grid>
    </div>
  );
};

export default NearbySchoolList;
