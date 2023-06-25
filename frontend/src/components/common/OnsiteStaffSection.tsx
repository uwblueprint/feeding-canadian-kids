/* eslint-disable no-param-reassign */
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";

import { Contact } from "../../types/UserTypes";
import { isValidEmail } from "../../utils/ValidationUtils";
import useIsWebView from "../../utils/useIsWebView";

const PLACEHOLDER_WEB_EXAMPLE_FULL_NAME = "Jane Doe";
const PLACEHOLDER_WEB_EXAMPLE_PHONE_NUMBER = "111-222-3333";
const PLACEHOLDER_WEB_EXAMPLE_EMAIL = "example@domain.com";

const PLACEHOLDER_MOBILE_EXAMPLE_FULL_NAME = "Full Name (Jane Doe)";
const PLACEHOLDER_MOBILE_EXAMPLE_EMAIL = "Email (example@domain.com)";
const PLACEHOLDER_MOBILE_EXAMPLE_PHONE_NUMBER = "Phone Number (111-222-3333)";

type OnsiteStaffSectionProps = {
  onsiteInfo: Array<Contact>;
  setOnsiteInfo: React.Dispatch<React.SetStateAction<Contact[]>>;
  attemptedSubmit: boolean;
};

const OnsiteStaffSection = ({
  onsiteInfo,
  setOnsiteInfo,
  attemptedSubmit,
}: OnsiteStaffSectionProps): React.ReactElement => {
  const isWebView = useIsWebView();

  if (isWebView) {
    return (
      <Flex flexDir="column" gap="24px">
        <Flex flexDir="column" gap="8px">
          <FormControl isRequired>
            <FormLabel variant="form-label-bold">
              Additional onsite staff
            </FormLabel>
          </FormControl>
          <Text color="text.subtitle" variant="desktop-xs" mt="-12px">
            *Must add at least 1 onsite staff. Maximum is 10.
          </Text>
        </Flex>
        <TableContainer border="1px solid #EDF2F7" borderRadius="8px">
          <Table>
            <Thead>
              <Tr
                borderRadius="8px 8px 0 0"
                h="40px"
                background="primary.lightblue"
              >
                <Th
                  borderRadius="8px 0 0 0"
                  padding="0 12px 0 24px"
                  w="256px"
                  textTransform="none"
                >
                  <Text color="black" variant="desktop-xs">
                    Full Name
                  </Text>
                </Th>
                <Th padding="0 12px" w="200px" textTransform="none">
                  <Text color="black" variant="desktop-xs">
                    Phone Number
                  </Text>
                </Th>
                <Th padding="0 0 0 12px" textTransform="none">
                  <Text color="black" variant="desktop-xs">
                    Email
                  </Text>
                </Th>
                <Th w="48px" borderRadius="0 8px 0 0" />
              </Tr>
            </Thead>

            <Tbody>
              {onsiteInfo.map((info, index) => (
                <Tr h="58px" key={index}>
                  <Td padding="0 12px 0 24px" gap="24px">
                    <FormControl
                      isRequired={index === 0}
                      isInvalid={
                        attemptedSubmit && onsiteInfo[index].name === ""
                      }
                    >
                      <Input
                        h="37px"
                        value={onsiteInfo[index].name}
                        placeholder={PLACEHOLDER_WEB_EXAMPLE_FULL_NAME}
                        onChange={(e) => {
                          onsiteInfo[index].name = e.target.value;
                          setOnsiteInfo([...onsiteInfo]);
                        }}
                      />
                    </FormControl>
                  </Td>
                  <Td padding="0 12px">
                    <FormControl
                      isRequired={index === 0}
                      isInvalid={
                        attemptedSubmit && onsiteInfo[index].phone === ""
                      }
                    >
                      <Input
                        h="37px"
                        type="tel"
                        value={onsiteInfo[index].phone}
                        placeholder={PLACEHOLDER_WEB_EXAMPLE_PHONE_NUMBER}
                        onChange={(e) => {
                          onsiteInfo[index].phone = e.target.value;
                          setOnsiteInfo([...onsiteInfo]);
                        }}
                      />
                    </FormControl>
                  </Td>
                  <Td padding="0 0 0 12px">
                    <FormControl
                      isRequired={index === 0}
                      isInvalid={
                        attemptedSubmit &&
                        !isValidEmail(onsiteInfo[index].email)
                      }
                    >
                      <Input
                        h="37px"
                        type="email"
                        value={onsiteInfo[index].email}
                        placeholder={PLACEHOLDER_WEB_EXAMPLE_EMAIL}
                        onChange={(e) => {
                          onsiteInfo[index].email = e.target.value;
                          setOnsiteInfo([...onsiteInfo]);
                        }}
                      />
                    </FormControl>
                  </Td>
                  {onsiteInfo.length >= 2 ? (
                    <Td padding="0 4px">
                      <DeleteIcon
                        h="19.5px"
                        w="100%"
                        color="gray.gray300"
                        cursor="pointer"
                        _hover={{ color: "primary.blue" }}
                        onClick={() => {
                          onsiteInfo.splice(index, 1);
                          setOnsiteInfo([...onsiteInfo]);
                        }}
                      />
                    </Td>
                  ) : (
                    <Td padding="0 4px" />
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {onsiteInfo.length < 10 && (
          <Text
            variant="desktop-button-bold"
            color="primary.blue"
            cursor="pointer"
            w="fit-content"
            onClick={() => {
              setOnsiteInfo([
                ...onsiteInfo,
                {
                  name: "",
                  phone: "",
                  email: "",
                },
              ]);
            }}
          >
            + Add another contact
          </Text>
        )}
      </Flex>
    );
  }

  return (
    <Flex flexDir="column" gap="20px">
      {onsiteInfo.map((info, index) => (
        <Flex flexDir="column" gap="8px" key={index}>
          <Flex flexDir="row" justifyContent="space-between">
            <FormControl isRequired={index === 0}>
              <FormLabel variant="mobile-form-label-bold">
                {`Additional Onsite Staff (${index + 1})`}
              </FormLabel>
            </FormControl>
            {onsiteInfo.length >= 2 && (
              <DeleteIcon
                h="16px"
                w="16px"
                color="gray.gray300"
                cursor="pointer"
                _hover={{ color: "primary.blue" }}
                onClick={() => {
                  onsiteInfo.splice(index, 1);
                  setOnsiteInfo([...onsiteInfo]);
                }}
              />
            )}
          </Flex>
          {index === 0 && (
            <Text color="text.subtitle" variant="desktop-xs" mt="-16px">
              *Must add at least 1 onsite staff. Maximum is 10.
            </Text>
          )}
          <FormControl
            isRequired={index === 0}
            isInvalid={attemptedSubmit && onsiteInfo[index].name === ""}
          >
            <Input
              h="37px"
              variant="mobile-outline"
              value={onsiteInfo[index].name}
              placeholder={PLACEHOLDER_MOBILE_EXAMPLE_FULL_NAME}
              onChange={(e) => {
                onsiteInfo[index].name = e.target.value;
                setOnsiteInfo([...onsiteInfo]);
              }}
            />
          </FormControl>
          <FormControl
            isRequired={index === 0}
            isInvalid={attemptedSubmit && onsiteInfo[index].phone === ""}
          >
            <Input
              h="37px"
              variant="mobile-outline"
              type="tel"
              value={onsiteInfo[index].phone}
              placeholder={PLACEHOLDER_MOBILE_EXAMPLE_PHONE_NUMBER}
              onChange={(e) => {
                onsiteInfo[index].phone = e.target.value;
                setOnsiteInfo([...onsiteInfo]);
              }}
            />
          </FormControl>
          <FormControl
            isRequired={index === 0}
            isInvalid={
              attemptedSubmit && !isValidEmail(onsiteInfo[index].email)
            }
          >
            <Input
              h="37px"
              variant="mobile-outline"
              type="email"
              value={onsiteInfo[index].email}
              placeholder={PLACEHOLDER_MOBILE_EXAMPLE_EMAIL}
              onChange={(e) => {
                onsiteInfo[index].email = e.target.value;
                setOnsiteInfo([...onsiteInfo]);
              }}
            />
          </FormControl>
        </Flex>
      ))}
      {onsiteInfo.length < 10 && (
        <Text
          variant="mobile-body-bold"
          color="primary.blue"
          cursor="pointer"
          w="fit-content"
          onClick={() => {
            setOnsiteInfo([
              ...onsiteInfo,
              {
                name: "",
                phone: "",
                email: "",
              },
            ]);
          }}
        >
          + Add another contact
        </Text>
      )}
    </Flex>
  );
};

export default OnsiteStaffSection;
