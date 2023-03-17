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
import { OnboardingRequest } from "../../types/AuthTypes";
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

type Contact = {
  name: string;
  phone: string;
  email: string;
};

type Request = {
  email: string;
  organizationAddress: string;
  organizationName: string;
  role: string;
  primaryContact: Contact;
  onsiteContacts: Array<Contact>;
};

const SIGNUP = gql`
  mutation OnboardRequest($userInfo: UserInfoInput!) {
    createOnboardingRequest(userInfo: $userInfo) {
      onboardingRequest {
        id
        info {
          email
          organizationAddress
          organizationName
          role
          primaryContact {
            name
            phone
            email
          }
          onsiteContacts {
            name
            phone
            email
          }
        }
        dateSubmitted
        status
      }
    }
  }
`;

const Join = (): React.ReactElement => {
  const [role, setRole] = useState("ASP");
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
  const [signup] = useMutation<{ createOnboardingRequest: OnboardingRequest }>(
    SIGNUP,
  );
  const toast = useToast();
  const navigate = useNavigate();
  const { authenticatedUser } = useContext(AuthContext);

  if (authenticatedUser) {
    return <Navigate replace to={DASHBOARD_PAGE} />;
  }

  const getTitleSection = (): React.ReactElement => {
    return (
      <>
        <Text
          alignSelf={{ base: "center", lg: "unset" }}
          variant="desktop-display-xl"
        >
          Sign Up
        </Text>
        <Text
          alignSelf={{ base: "center", lg: "unset" }}
          textAlign={{ base: "center", lg: "unset" }}
          variant="desktop-xs"
        >
          Already have an account?{" "}
          <Link color="primary.blue" textDecoration="underline" href="/login">
            Login here
          </Link>
        </Text>
      </>
    );
  };

  const getUserTypeSection = (): React.ReactElement => {
    return (
      <Flex flexDir="column">
        <FormControl isRequired>
          <FormLabel
            variant={{
              base: "mobile-form-label-bold",
              lg: "form-label-bold",
            }}
          >
            Type of user
          </FormLabel>
          <RadioGroup onChange={setRole} value={role}>
            <Stack direction={{ base: "column", lg: "row" }}>
              <Radio value="ASP">
                <Text variant="desktop-heading-6">After School Program</Text>
              </Radio>
              <Radio value="MD">
                <Text variant="desktop-heading-6">Meal Donor</Text>
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
      </Flex>
    );
  };

  const getEmailSection = (): React.ReactElement => {
    return (
      <Flex flexDir="column">
        <FormControl
          isRequired
          isInvalid={attemptedSubmit && !isValidEmail(email)}
        >
          <FormLabel
            variant={{
              base: "mobile-form-label-bold",
              lg: "desktop-button-bold",
            }}
          >
            Email address
          </FormLabel>
          <Input
            variant={{
              base: "mobile-outline",
              lg: "outline",
            }}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={
              isWebView
                ? PLACEHOLDER_WEB_EXAMPLE_EMAIL
                : PLACEHOLDER_MOBILE_EXAMPLE_EMAIL
            }
          />
        </FormControl>
      </Flex>
    );
  };

  const getWebOrganizationSection = (): React.ReactElement => {
    return (
      <>
        <Text variant="desktop-heading">Organization Info</Text>
        <Flex flexDir="row" gap="24px">
          <Flex flexDir="column" w="240px">
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && organizationName === ""}
            >
              <FormLabel variant="desktop-button-bold">
                Name of organization
              </FormLabel>
              <Input
                value={organizationName}
                placeholder={PLACEHOLDER_WEB_EXAMPLE_ORG_NAME}
                onChange={(e) => setOrganizationName(e.target.value)}
              />
            </FormControl>
          </Flex>
          <Flex flexDir="column" w="519px">
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && organizationAddress === ""}
            >
              <FormLabel variant="desktop-button-bold">
                Address of organization
              </FormLabel>
              <Input
                value={organizationAddress}
                placeholder={PLACEHOLDER_WEB_EXAMPLE_ADDRESS}
                onChange={(e) => setOrganizationAddress(e.target.value)}
              />
            </FormControl>
          </Flex>
        </Flex>
      </>
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

  const getWebContactSection = (): React.ReactElement => {
    return (
      <>
        <Text variant="desktop-heading">Contact Information</Text>
        <Flex flexDir="column" gap="24px">
          <Flex flexDir="column">
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && primaryContact.name === ""}
            >
              <FormLabel variant="desktop-button-bold">
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
              >
                <FormLabel variant="desktop-button-bold">
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
                <FormLabel variant="desktop-button-bold">
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

  const handleSignUp = async (userInfo: Request) => {
    try {
      const response = await signup({ variables: { userInfo } });
      // eslint-disable-next-line no-console
      console.log(response);
      navigate(JOIN_SUCCESS_PAGE);
    } catch (e: unknown) {
      toast({
        title: "Failed to create account. Please try again.",
        status: "error",
        isClosable: true,
      });
      // eslint-disable-next-line no-console
      console.log(e);
    }
  };

  const isRequestValid = () => {
    const stringsToValidate = [
      role,
      organizationName,
      organizationAddress,
      primaryContact.name,
    ];
    const phoneNumsToValidate = [primaryContact.phone];
    const emailsToValidate = [email, primaryContact.email];

    for (let i = 0; i < onsiteInfo.length; i += 1) {
      stringsToValidate.push(onsiteInfo[i].name);
      phoneNumsToValidate.push(onsiteInfo[i].phone);
      emailsToValidate.push(onsiteInfo[i].email);
    }

    for (let i = 0; i < stringsToValidate.length; i += 1) {
      if (stringsToValidate[i] === "") return false;
    }

    for (let i = 0; i < phoneNumsToValidate.length; i += 1) {
      if (phoneNumsToValidate[i] === "") return false;
    }

    for (let i = 0; i < emailsToValidate.length; i += 1) {
      if (!isValidEmail(emailsToValidate[i])) return false;
    }

    return true;
  };

  const handleSubmit = () => {
    setAttemptedSubmit(true);
    if (!isRequestValid()) return;
    const request: Request = {
      email: trimWhiteSpace(email),
      organizationAddress: trimWhiteSpace(organizationAddress),
      organizationName: trimWhiteSpace(organizationName),
      role: trimWhiteSpace(role),
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

    handleSignUp(request);
  };

  const getSubmitSection = (): React.ReactElement => {
    return (
      <Flex flexDir="column" alignItems="center" gap="8px">
        <Button
          w={{ base: "100%", lg: "480px" }}
          variant={{ base: "mobile-button-bold", lg: "desktop-button-bold" }}
          color="white"
          bgColor="primary.blue"
          disabled={!isRequestValid()}
          _hover={{ bgColor: "primary.blue" }}
          _disabled={{
            bgColor: "#CCCCCC !important",
            color: "#666666",
            cursor: "auto",
          }}
          borderRadius="6px"
          onClick={handleSubmit}
        >
          Create Account
        </Button>
        <Text
          color="text.subtitle"
          variant={{ base: "mobile-xs", lg: "desktop-xs" }}
        >
          {"By selecting Create Account, you agree to FCK's "}
          {/* TODO: replace HOME_PAGE with actual terms & conditions route */}
          <Link
            color="primary.blue"
            textDecoration="underline"
            href={HOME_PAGE}
            isExternal
          >
            Terms & Conditions
          </Link>
        </Text>
      </Flex>
    );
  };

  return (
    <Center>
      <Flex
        flexDir="column"
        w={{ base: "100%", lg: "911px" }}
        p={{ base: "24px", sm: "48px", lg: "64px" }}
        marginBottom="50px"
        gap={{ base: "20px", lg: "32px" }}
        borderRadius="8px"
        boxShadow={{
          base: "",
          lg:
            "0px 0px 3px rgba(0, 0, 0, 0.1), 0px 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        {getTitleSection()}
        {getUserTypeSection()}
        {getEmailSection()}
        {isWebView && <Divider />}
        {isWebView
          ? getWebOrganizationSection()
          : getMobileOrganizationSection()}
        {isWebView && <Divider />}
        {isWebView ? getWebContactSection() : getMobileContactSection()}
        {isWebView ? getWebOnsiteStaffSection() : getMobileOnsiteStaffSection()}
        {getSubmitSection()}
      </Flex>
    </Center>
  );
};

export default Join;
