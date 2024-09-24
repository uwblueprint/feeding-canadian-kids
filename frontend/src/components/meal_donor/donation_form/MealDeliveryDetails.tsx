// MealDeliveryDetails component
import { Box, HStack, Stack, Text } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoLocationOutline } from "react-icons/io5";

import { MealRequest } from "../../../types/MealRequestTypes";

type MealDeliveryDetailsProps = {
  mealRequestsInformation: Array<MealRequest>;
};

const MealDeliveryDetails: React.FunctionComponent<MealDeliveryDetailsProps> = ({
  mealRequestsInformation,
}) => {
  const [selectedMealRequest, setSelectedMealRequest] = useState<MealRequest>(
    mealRequestsInformation[0],
  );

  return (
    <Stack>
      <Stack paddingY={{ base: "1rem", md: "1.5rem" }}>
        <Text>Meal Delivery Details</Text>
        <Text fontSize="2xl" fontWeight="semibold" lineHeight="20px">
          {mealRequestsInformation.length} Date
          {mealRequestsInformation.length === 1 ? "" : "s"}
        </Text>
        <HStack>
          <IoLocationOutline />
          <Text>
            {mealRequestsInformation[0]?.requestor.info?.organizationAddress}
          </Text>
        </HStack>
      </Stack>
      <Stack overflowY="auto" maxHeight="260px" gap="0.8rem">
        {mealRequestsInformation?.map((request: MealRequest) => {
          const startDate = new Date(request.dropOffDatetime + "Z");
          const endDate = new Date(request.dropOffDatetime + "Z");
          endDate.setHours(endDate.getHours() + 1);
          return (
            <Box
              bg="#F4F4F4E5"
              maxW="350px"
              borderRadius="md"
              paddingX="15px"
              paddingY="15px"
              key={request.id}
            >
              <HStack>
                <Stack w="50%">
                  <Text fontSize="xs" lineHeight="15px">
                    {startDate.toLocaleDateString(undefined, {
                      month: "long",
                      day: "numeric",
                    })}
                  </Text>
                  <Text fontWeight="semibold" fontSize="s" lineHeight="15px">
                    {request.mealInfo.portions} Meals
                  </Text>
                  <Text lineHeight="20px" fontSize="xs">
                    {startDate.toLocaleTimeString("en-US", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }) +
                      " - " +
                      endDate.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                  </Text>
                </Stack>
                <Stack
                  w="50%"
                  fontSize={{ base: "2xs", md: "xs" }}
                  lineHeight="15px"
                >
                  <Text>Acommodations:</Text>
                  <Text>{request.mealInfo.dietaryRestrictions}</Text>
                </Stack>
              </HStack>
            </Box>
          );
        })}
      </Stack>
    </Stack>
  );
};

export default MealDeliveryDetails;
