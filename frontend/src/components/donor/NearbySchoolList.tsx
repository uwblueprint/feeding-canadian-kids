import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Image,
  Input,
  Spacer,
  Stack,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useContext, useEffect, useState } from "react";
import {
  IoInformationCircleOutline,
  IoLocationOutline,
  IoPersonOutline,
} from "react-icons/io5";
import { Navigate } from "react-router-dom";

import type { ASPDistance, Contact } from "../../types/UserTypes";

// Props: we need a list of ASPDistance
type NearbySchoolListProps = {
  schools: ASPDistance[];
};

const NearbySchoolList = ({
  schools,
}: NearbySchoolListProps): React.ReactElement => {
  const getCityFromAddress = (address: string): string => {
    const addressSplit = address.split(",");
    console.log(address);
    return addressSplit[1] ? addressSplit[1].trim() : "City";
  };

  return (
    <div>
      <Grid
        templateColumns={{ base: "repeat(1, 1fr)", sm: "repeat(2, 1fr)" }}
        gap={6}
      >
        <Flex
          flex="1"
          direction="column"
          justifyContent="center"
          alignItems="left"
          padding="0 10vw"
        >
          <Text fontSize="lg" as="b">
            Your School Matches
          </Text>

          <Text>
            Partner with a school in your community that aligns with your
            donation preferences.
          </Text>
        </Flex>
        <Flex justifyContent="center" alignItems="center" padding="0 10vw">
          <Flex direction="column" justifyItems="center" alignItems="center">
            {schools.slice(0, 3).map((school) => (
              <Card
                key={school?.id}
                borderWidth="1px"
                borderRadius="lg"
                p={4}
                m={4}
                direction={{ base: "column", sm: "row" }}
              >
                <Flex>
                  <Image
                    src="https://images.squarespace-cdn.com/content/v1/5dc5d641498834108f7c46a5/6384d8a2-9c31-4ae6-a287-256643f2271e/responsiveclassroom.png?format=1500w"
                    alt={school?.info?.organizationName}
                    borderRadius="full"
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
                      <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        mt={2}
                      >
                        <Text>
                          {school?.info?.roleInfo.aspInfo?.numKids} children
                        </Text>
                        <Spacer />
                        <Text>
                          {getCityFromAddress(
                            school?.info?.organizationAddress || "",
                          )}
                        </Text>
                      </Flex>
                      <Text color="primary.blue" fontSize="xs">
                        <button
                          style={{
                            textDecoration: "underline",
                            fontWeight: "bold",
                          }}
                          onClick={() => {
                            // TODO
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
          </Flex>
        </Flex>
      </Grid>
    </div>
  );
};

export default NearbySchoolList;
