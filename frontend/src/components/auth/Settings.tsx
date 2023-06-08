import { gql, useMutation } from "@apollo/client";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Textarea,
  Th,
  Thead,
  Tr,
  useMediaQuery,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

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
const PLACEHOLDER_WEB_EXAMPLE_NUMBER_OF_KIDS = "40";
const PLACEHOLDER_WEB_EXAMPLE_ORG_DESCRIPTION =
  "Our organization helps feed Canadian kids!";

const PLACEHOLDER_MOBILE_EXAMPLE_FULL_NAME = "Full Name (Jane Doe)";
const PLACEHOLDER_MOBILE_EXAMPLE_EMAIL = "Email (example@domain.com)";
const PLACEHOLDER_MOBILE_EXAMPLE_PHONE_NUMBER = "Phone Number (111-222-3333)";
const PLACEHOLDER_MOBILE_EXAMPLE_ORG_NAME = "Name of organization";
const PLACEHOLDER_MOBILE_EXAMPLE_ADDRESS = "Address of organization";

// const SIGNUP = gql`
//   mutation OnboardRequest($userInfo: UserInfoInput!) {
//     createOnboardingRequest(userInfo: $userInfo) {
//       onboardingRequest {
//         id
//         info {
//           email
//           organizationAddress
//           organizationName
//           role
//           primaryContact {
//             name
//             phone
//             email
//           }
//           onsiteContacts {
//             name
//             phone
//             email
//           }
//         }
//         dateSubmitted
//         status
//       }
//     }
//   }
// `;

const Settings = (): React.ReactElement => {
  // const [role, setRole] = useState<Role>("ASP");
  // const [email, setEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [numberOfKids, setNumberOfKids] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");
  const [organizationDescription, setOrganizationDescription] = useState("");
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
  // const [signup] = useMutation<{ createOnboardingRequest: OnboardingRequest }>(
  //   SIGNUP,
  // );
  // const toast = useToast();
  // const navigate = useNavigate();
  const { authenticatedUser } = useContext(AuthContext);

  if (authenticatedUser) {
    return <Navigate replace to={DASHBOARD_PAGE} />;
  }

  const getTitleSection = (): React.ReactElement => {
    return (
      <Text
        alignSelf={{ base: "center", lg: "unset" }}
        variant="desktop-display-xl"
        color="primary.blue"
      >
        User Settings
      </Text>
    );
  };

  const getWebLoginInfoSection = (): React.ReactElement => {
    return (
      <Flex flexDir="column" gap="24px">
        <Text variant="desktop-heading">Login Information</Text>
        <Flex flexDir="column" gap="24px">
          <Flex flexDir="column">
            <Text variant="desktop-body-bold">Email Address</Text>
            <Text variant="desktop-body">example.login@gmail.com</Text>
          </Flex>
          <Button
            w={{ base: "100%", lg: "190px" }}
            h={{ base: "100%", lg: "45px" }}
            variant="desktop-button-bold"
            color="primary.green"
            bgColor="background.white"
            border="1px solid"
            borderColor="primary.green"
            borderRadius="6px"
          >
            Reset Password
          </Button>
        </Flex>
      </Flex>
    );
  };

  const getMobileLoginInfoSection = (): React.ReactElement => {
    return (
      <Flex flexDir="column" gap="8px">
        <Text variant="mobile-body-bold">Email Address</Text>
        <Text variant="desktop-xs">example.login@gmail.com</Text>
        <Button
          w={{ base: "100%", lg: "190px" }}
          h={{ base: "100%", lg: "45px" }}
          variant="mobile-button-bold"
          color="primary.green"
          bgColor="background.white"
          border="1px solid"
          borderColor="primary.green"
          borderRadius="6px"
        >
          Reset Password
        </Button>
      </Flex>
    );
  };

  const getWebContactSection = (): React.ReactElement => {
    return (
      <Flex flexDir="column" gap="24px">
        <Text variant="desktop-heading">Contact Information</Text>
        <Flex flexDir="row" gap="24px">
          <Flex flexDir="column" w="300px">
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && primaryContact.name === ""}
            >
              <FormLabel variant="form-label-bold">
                Primary contact name
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
          <Flex flexDir="column" w="200px">
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && primaryContact.phone === ""}
            >
              <FormLabel variant="form-label-bold">Phone number</FormLabel>
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
          <Flex flexDir="column" w="350px">
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && !isValidEmail(primaryContact.email)}
            >
              <FormLabel variant="form-label-bold">Email address</FormLabel>
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

  const getWebOrganizationSection = (): React.ReactElement => {
    return (
      <Flex flexDir="column" gap="24px">
        <Text variant="desktop-heading">Organization Info</Text>
        <Flex flexDir="row" gap="24px">
          <Flex flexDir="column" w="300px">
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && organizationName === ""}
            >
              <FormLabel variant="form-label-bold">
                Name of organization
              </FormLabel>
              <Input
                value={organizationName}
                placeholder={PLACEHOLDER_WEB_EXAMPLE_ORG_NAME}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </FormControl>
          </Flex>
          <Flex flexDir="column" w="200px">
            <FormLabel variant="form-label-bold">Number of kids</FormLabel>
            <Input
              type="number"
              value={numberOfKids}
              placeholder={PLACEHOLDER_WEB_EXAMPLE_NUMBER_OF_KIDS}
              onChange={(e) => setNumberOfKids(e.target.value)}
            />
          </Flex>
          <Flex flexDir="column" w="350px">
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && organizationAddress === ""}
            >
              <FormLabel variant="form-label-bold">
                Address of organization
              </FormLabel>
              <Input
                type="email"
                value={organizationAddress}
                placeholder={PLACEHOLDER_WEB_EXAMPLE_ADDRESS}
                onChange={(e) => setOrganizationAddress(e.target.value)}
              />
            </FormControl>
          </Flex>
        </Flex>
        <Flex flexDir="column" w="60%" gap="8px">
          <Text variant="desktop-body-bold">Description of organization</Text>
          <Textarea
            size="desktop-body"
            p="12px"
            placeholder={PLACEHOLDER_WEB_EXAMPLE_ORG_DESCRIPTION}
            value={organizationDescription}
            onChange={(e) => setOrganizationDescription(e.target.value)}
          />
        </Flex>
      </Flex>
    );
  };

  const getMobileOrganizationSection = (): React.ReactElement => {
    return (
      <Flex flexDir="column" gap="8px">
        <FormControl isRequired>
          <FormLabel variant="mobile-form-label-bold">
            Organization Info
          </FormLabel>

          <Flex flexDir="column" gap="8px">
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && organizationName === ""}
            >
              <Input
                variant="mobile-outline"
                value={organizationName}
                placeholder={PLACEHOLDER_MOBILE_EXAMPLE_ORG_NAME}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </FormControl>
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && organizationAddress === ""}
            >
              <Input
                variant="mobile-outline"
                value={organizationAddress}
                onChange={(e) => setOrganizationAddress(e.target.value)}
                placeholder={PLACEHOLDER_MOBILE_EXAMPLE_ADDRESS}
              />
            </FormControl>
          </Flex>
        </FormControl>
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
            *Must add at least 1 onsite staff up to a maximum of 10.
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
  };

  const getMobileOnsiteStaffSection = (): React.ReactElement => {
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
                *Must add at least 1 onsite staff up to a maximum of 10.
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
            + Add onsite staff
          </Text>
        )}
      </Flex>
    );
  };

  // const handleSignUp = async (userInfo: UserInfo) => {
  //   try {
  //     const response = await signup({ variables: { userInfo } });
  //     // eslint-disable-next-line no-console
  //     console.log(response);
  //     navigate(JOIN_SUCCESS_PAGE);
  //   } catch (e: unknown) {
  //     toast({
  //       title: "Failed to create account. Please try again.",
  //       status: "error",
  //       isClosable: true,
  //     });
  //     // eslint-disable-next-line no-console
  //     console.log(e);
  //   }
  // };

  // const isRequestValid = () => {
  //   const stringsToValidate = [
  //     role,
  //     organizationName,
  //     organizationAddress,
  //     primaryContact.name,
  //   ];
  //   const phoneNumsToValidate = [primaryContact.phone];
  //   const emailsToValidate = [email, primaryContact.email];

  //   for (let i = 0; i < onsiteInfo.length; i += 1) {
  //     stringsToValidate.push(onsiteInfo[i].name);
  //     phoneNumsToValidate.push(onsiteInfo[i].phone);
  //     emailsToValidate.push(onsiteInfo[i].email);
  //   }

  //   for (let i = 0; i < stringsToValidate.length; i += 1) {
  //     if (stringsToValidate[i] === "") return false;
  //   }

  //   for (let i = 0; i < phoneNumsToValidate.length; i += 1) {
  //     if (phoneNumsToValidate[i] === "") return false;
  //   }

  //   for (let i = 0; i < emailsToValidate.length; i += 1) {
  //     if (!isValidEmail(emailsToValidate[i])) return false;
  //   }

  //   return true;
  // };

  const handleSubmit = () => {
    setAttemptedSubmit(true);
    // if (!isRequestValid()) return;
    const request = {
      organizationName: trimWhiteSpace(organizationName),
      numberOfKids: trimWhiteSpace(numberOfKids),
      organizationAddress: trimWhiteSpace(organizationAddress),
      primaryContact: {
        name: trimWhiteSpace(primaryContact.name),
        email: trimWhiteSpace(primaryContact.email),
        phone: trimWhiteSpace(primaryContact.phone),
      },
      onsiteContacts: onsiteInfo.map((obj) => ({
        name: trimWhiteSpace(obj.name),
        phone: trimWhiteSpace(obj.phone),
        email: trimWhiteSpace(obj.email),
      })),
    };

    // eslint-disable-next-line no-console
    console.log(request);

    // handleSignUp(request);
  };

  const getSubmitSection = (): React.ReactElement => {
    return (
      <Button
        w={{ base: "100%", lg: "100px" }}
        variant={{ base: "mobile-button-bold", lg: "desktop-button-bold" }}
        color="white"
        bgColor="primary.green"
        // disabled={attemptedSubmit && !isRequestValid()}
        // _hover={{ bgColor: "primary.green" }}
        // _disabled={{
        //   bgColor: "#CCCCCC !important",
        //   color: "#666666",
        //   cursor: "auto",
        // }}
        borderRadius="6px"
        onClick={handleSubmit}
      >
        Save
      </Button>
    );
  };

  return (
    <Center>
      <Flex
        flexDir="column"
        w={{ base: "100%", lg: "1000px" }}
        p={{ base: "24px", sm: "36px", lg: "48px" }}
        gap={{ base: "20px", lg: "32px" }}
        borderRadius="8px"
        style={{
          backgroundColor: "white",
        }}
      >
        {getTitleSection()}
        {isWebView ? getWebLoginInfoSection() : getMobileLoginInfoSection()}
        {isWebView && <Divider />}
        {isWebView ? getWebContactSection() : getMobileContactSection()}
        {isWebView && <Divider />}
        {isWebView
          ? getWebOrganizationSection()
          : getMobileOrganizationSection()}
        {isWebView && <Divider />}
        {isWebView ? getWebOnsiteStaffSection() : getMobileOnsiteStaffSection()}
        {getSubmitSection()}
      </Flex>
    </Center>
  );
};

export default Settings;
