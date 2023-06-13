import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useState } from "react";

import {
  DASHBOARD_PAGE,
  HOME_PAGE,
  JOIN_SUCCESS_PAGE,
} from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import {
  Contact,
  OnboardingRequest,
  Role,
  UserInfo,
} from "../../types/AuthTypes";
import { isValidEmail, trimWhiteSpace } from "../../utils/ValidationUtils";

const PLACEHOLDER_WEB_EXAMPLE_FULL_NAME = "Jane Doe";
const PLACEHOLDER_WEB_EXAMPLE_PHONE_NUMBER = "111-222-3333";
const PLACEHOLDER_WEB_EXAMPLE_EMAIL = "example@domain.com";
const PLACEHOLDER_WEB_EXAMPLE_ORG_NAME = "Feeding Canadian Kids";
const PLACEHOLDER_WEB_EXAMPLE_ADDRESS = "123 Main Street, Anytown";

const PLACEHOLDER_MOBILE_EXAMPLE_FULL_NAME = "Full Name (Jane Doe)";
const PLACEHOLDER_MOBILE_EXAMPLE_EMAIL = "Email (example@domain.com)";
const PLACEHOLDER_MOBILE_EXAMPLE_PHONE_NUMBER = "Phone Number (111-222-3333)";
const PLACEHOLDER_MOBILE_EXAMPLE_ORG_NAME = "Name of organization";
const PLACEHOLDER_MOBILE_EXAMPLE_ADDRESS = "Address of organization";

const MealRequestForm = () => {
  const [role, setRole] = useState<Role>("ASP");
  const [email, setEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");
  const [primaryContact, setPrimaryContact] = useState<Contact>({
    name: "",
    phone: "",
    email: "",
  });
  const [onsiteInfo, setOnsiteInfo] = useState<Array<Contact>>([
    {
      name: "",
      phone: "",
      email: "",
    },
  ]);

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isWebView] = useMediaQuery("(min-width: 62em)");
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

  const getMobileOnsiteStaffSection = (): React.ReactElement => {
    return (
      <Flex flexDir="column" gap="20px">
        {onsiteInfo.map((info, index) => (
          <Flex flexDir="column" gap="8px" key={index}>
            <Flex flexDir="row" justifyContent="space-between">
              <FormControl isRequired={index === 0}>
                <FormLabel variant="mobile-form-label-bold" pt="20px">
                  {`Additional Onsite Staff (${index + 1})`}
                </FormLabel>
              </FormControl>
              <EditIcon
                h="16px"
                w="16px"
                color="gray.gray300"
                cursor="pointer"
                _hover={{ color: "primary.blue" }}
              />
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
                *Must add at least 1 onsite staff. Maximum of 10.
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

  const getWebOnsiteStaffSection = (): React.ReactElement => {
    return (
      <Flex flexDir="column" gap="24px">
        <Flex flexDir="column" gap="8px">
          <FormControl isRequired>
            <FormLabel variant="form-label-bold">
              2. Additional onsite staff
            </FormLabel>
          </FormControl>
          <Text color="text.subtitle" variant="desktop-xs" mt="-12px">
            *Must add at least 1 onsite staff. Maximum of 10.
          </Text>
        </Flex>
        <TableContainer border="1px solid #EDF2F7" borderRadius="8px">
          <Table background="primary.lightblue">
            <Thead>
              <Tr
                borderRadius="8px 8px 0 0"
                h="40px"
                w="256px"
                background="primary.lightblue"
              >
                <Th
                  borderRadius="8px 0 0 0"
                  padding="0 12px 0 24px"
                  w="256px"
                  textTransform="none"
                  background="primary.lightblue"
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

            <Tbody background="white">
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
                  <Td padding="0 0 0 8px">
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
                  <Td padding="0">
                    <EditIcon
                      h="19.5px"
                      w="100%"
                      color="gray.gray300"
                      cursor="pointer"
                      _hover={{ color: "primary.blue" }}
                      pr={0}
                    />
                  </Td>
                  {onsiteInfo.length >= 2 ? (
                    <Td padding="0 2px">
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
                        pr={2}
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

  const getMobileContactSection = (): React.ReactElement => {
    return (
      <Flex flexDir="column" gap="8px">
        <FormControl isRequired>
          <FormLabel variant="mobile-form-label-bold">
            Primary Contact
          </FormLabel>
          <Flex flexDir="column" gap="8px">
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && primaryContact.name === ""}
            >
              <Input
                variant="mobile-outline"
                value={primaryContact.name}
                onChange={(e) =>
                  setPrimaryContact({ ...primaryContact, name: e.target.value })
                }
                placeholder={PLACEHOLDER_MOBILE_EXAMPLE_FULL_NAME}
              />
            </FormControl>
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && primaryContact.phone === ""}
            >
              <Input
                variant="mobile-outline"
                type="tel"
                value={primaryContact.phone}
                onChange={(e) =>
                  setPrimaryContact({
                    ...primaryContact,
                    phone: e.target.value,
                  })
                }
                placeholder={PLACEHOLDER_MOBILE_EXAMPLE_PHONE_NUMBER}
              />
            </FormControl>
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && !isValidEmail(primaryContact.email)}
            >
              <Input
                variant="mobile-outline"
                type="email"
                value={primaryContact.email}
                onChange={(e) =>
                  setPrimaryContact({
                    ...primaryContact,
                    email: e.target.value,
                  })
                }
                placeholder={PLACEHOLDER_MOBILE_EXAMPLE_EMAIL}
              />
            </FormControl>
          </Flex>
        </FormControl>
      </Flex>
    );
  };

  const getWebContactSection = (): React.ReactElement => {
    return (
      <>
        <Text variant="desktop-heading" pt={4} pb={3}>
          Contact Information
        </Text>

        <Flex flexDir="column" gap="24px">
          <Flex flexDir="column">
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && primaryContact.name === ""}
            >
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                1. Primary contact name
              </FormLabel>
              <Input
                value={primaryContact.name}
                placeholder={PLACEHOLDER_WEB_EXAMPLE_FULL_NAME}
                onChange={(e) =>
                  setPrimaryContact({ ...primaryContact, name: e.target.value })
                }
              />
            </FormControl>
          </Flex>

          <Flex flexDir="row" gap="24px">
            <Flex flexDir="column" w="240px">
              <FormControl
                isRequired
                isInvalid={attemptedSubmit && primaryContact.phone === ""}
                mb={6}
              >
                <FormLabel
                  variant={{
                    base: "mobile-form-label-bold",
                    md: "form-label-bold",
                  }}
                >
                  Phone number
                </FormLabel>
                <Input
                  type="tel"
                  value={primaryContact.phone}
                  placeholder={PLACEHOLDER_WEB_EXAMPLE_PHONE_NUMBER}
                  onChange={(e) =>
                    setPrimaryContact({
                      ...primaryContact,
                      phone: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Flex>

            <Flex flexDir="column" w="519px">
              <FormControl
                isRequired
                isInvalid={
                  attemptedSubmit && !isValidEmail(primaryContact.email)
                }
              >
                <FormLabel
                  variant={{
                    base: "mobile-form-label-bold",
                    md: "form-label-bold",
                  }}
                >
                  Email address
                </FormLabel>
                <Input
                  type="email"
                  value={primaryContact.email}
                  placeholder={PLACEHOLDER_WEB_EXAMPLE_EMAIL}
                  onChange={(e) =>
                    setPrimaryContact({
                      ...primaryContact,
                      email: e.target.value,
                    })
                  }
                />
              </FormControl>
            </Flex>
          </Flex>
        </Flex>
      </>
    );
  };

  return (
    <>
      <Button onClick={onOpen}>Edit Meal Request</Button>
      <Modal
        initialFocusRef={initialRef}
        finalFocusRef={finalRef}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent
          maxWidth={{ base: "100%", md: "900px" }}
          padding={{ base: "10px", md: "40px" }}
        >
          <Text
            pb={{ base: 1, md: 5 }}
            pl={{ base: 6, md: 6 }}
            pt={{ base: 5, md: 8 }}
            variant={{ base: "mobile-display-xl", md: "desktop-display-xl" }}
          >
            Edit Meal Request
          </Text>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Text
              variant={{
                base: "mobile-heading",
                md: "desktop-heading",
              }}
            >
              Meal Information
            </Text>

            <FormControl mt={3} mb={6} isRequired>
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                Number of meals
              </FormLabel>
              <Input ref={initialRef} w="200px" placeholder="Ex. 100" />
            </FormControl>

            <FormControl mt={3} mb={6} isRequired>
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                Dietary restrictions
              </FormLabel>
              <Input
                ref={initialRef}
                placeholder="Ex. Nut allergy, gluten free"
              />
            </FormControl>

            <FormControl mt={3} mb={6} isRequired>
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                Delivery Notes
              </FormLabel>
              <Input
                ref={initialRef}
                placeholder="Ex. Nut allergy, gluten free"
              />
              <br />
            </FormControl>

            {isWebView && <Divider />}
            {/* {isWebView
          ? getWebOrganizationSection()
          : getMobileOrganizationSection()} */}
            {isWebView && <Divider />}
            {isWebView ? getWebContactSection() : getMobileContactSection()}
            {isWebView
              ? getWebOnsiteStaffSection()
              : getMobileOnsiteStaffSection()}
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3} variant="outline">
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MealRequestForm;
