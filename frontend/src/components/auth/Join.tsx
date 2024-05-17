import { ApolloError, gql, useMutation } from "@apollo/client";
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
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { GraphQLError } from "graphql";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import LargerBackgroundImage from "../../assets/largerbackground.png";
import {
  ASP_DASHBOARD_PAGE,
  HOME_PAGE,
  JOIN_SUCCESS_PAGE,
} from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import {
  Contact,
  OnboardingRequest,
  Role,
  UserInfo,
} from "../../types/UserTypes";
import { logPossibleGraphQLError } from "../../utils/GraphQLUtils";
import {
  isNonNegativeInt,
  isValidEmail,
  trimWhiteSpace,
} from "../../utils/ValidationUtils";
import useIsWebView from "../../utils/useIsWebView";
import OnsiteContactSection from "../common/OnsiteContactSection";

const PLACEHOLDER_WEB_EXAMPLE_FULL_NAME = "Jane Doe";
const PLACEHOLDER_WEB_EXAMPLE_PHONE_NUMBER = "111-222-3333";
const PLACEHOLDER_WEB_EXAMPLE_EMAIL = "example@domain.com";
const PLACEHOLDER_WEB_EXAMPLE_ORG_NAME = "Feeding Canadian Kids";
const PLACEHOLDER_WEB_EXAMPLE_NUM_KIDS = "50";
const PLACEHOLDER_WEB_EXAMPLE_ADDRESS = "123 Main Street, Anytown";
const PLACEHOLDER_WEB_EXAMPLE_DESCRIPTION =
  "Non-Profit Organization in Alberta";

const PLACEHOLDER_MOBILE_EXAMPLE_FULL_NAME = "Full Name (Jane Doe)";
const PLACEHOLDER_MOBILE_EXAMPLE_EMAIL = "Email (example@domain.com)";
const PLACEHOLDER_MOBILE_EXAMPLE_PHONE_NUMBER = "Phone Number (111-222-3333)";
const PLACEHOLDER_MOBILE_EXAMPLE_ORG_NAME = "Name of organization";
const PLACEHOLDER_MOBILE_EXAMPLE_ADDRESS = "Address of organization";
const PLACEHOLDER_MOBILE_EXAMPLE_NUM_KIDS = "Number of kids";
const PLACEHOLDER_MOBILE_EXAMPLE_DESCRIPTION = "Description of organization";

const SIGNUP = gql`
  mutation OnboardRequest($userInfo: UserInfoInput!) {
    createOnboardingRequest(userInfo: $userInfo) {
      onboardingRequest {
        id
        info {
          email
          organizationAddress
          organizationName
          organizationDesc
          role
          roleInfo {
            aspInfo {
              numKids
            }
            donorInfo {
              type
              tags
            }
          }
          primaryContact {
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
  const [role, setRole] = useState<Role>("ASP");
  const [email, setEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationDesc, setOrganizationDesc] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");
  const [numKids, setNumKids] = useState("");
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
  const isWebView = useIsWebView();
  const [signup] = useMutation<{ createOnboardingRequest: OnboardingRequest }>(
    SIGNUP,
  );
  const toast = useToast();
  const navigate = useNavigate();
  const { authenticatedUser } = useContext(AuthContext);

  if (authenticatedUser) {
    return <Navigate replace to={ASP_DASHBOARD_PAGE} />;
  }

  const getTitleSection = (): React.ReactElement => (
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

  const getUserTypeSection = (): React.ReactElement => (
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
        <RadioGroup
          onChange={(radioVal) => setRole(radioVal as Role)}
          value={role}
        >
          <Stack direction={{ base: "column", lg: "row" }}>
            <Radio value="ASP">
              <Text variant="desktop-heading-6">After School Program</Text>
            </Radio>
            <Radio value="Donor">
              <Text variant="desktop-heading-6">Meal Donor</Text>
            </Radio>
          </Stack>
        </RadioGroup>
      </FormControl>
    </Flex>
  );

  const getEmailSection = (): React.ReactElement => (
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

  const getWebOrganizationSection = (): React.ReactElement => (
    <>
      <Text variant="desktop-heading">Organization Information</Text>
      <Flex flexDir="row" gap="24px">
        <Flex
          flexDir="column"
          w={role !== "ASP" ? "240px" : "-webkit-fit-content"}
        >
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
        {role === "ASP" && (
          <Flex flexDir="column" w="-webkit-fit-content">
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && !isNonNegativeInt(numKids)}
            >
              <FormLabel variant="desktop-button-bold">
                Number of kids
              </FormLabel>
              <Input
                type="number"
                value={numKids}
                placeholder={PLACEHOLDER_WEB_EXAMPLE_NUM_KIDS}
                onChange={(e) => setNumKids(e.target.value)}
              />
            </FormControl>
          </Flex>
        )}
        <Flex
          flexDir="column"
          w={role !== "ASP" ? "519px" : "-webkit-fit-content"}
        >
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
      <Flex flexDir="column" w="480px">
        <FormControl
          isRequired
          isInvalid={attemptedSubmit && organizationDesc === ""}
        >
          <FormLabel variant="desktop-button-bold">
            Description of organization
          </FormLabel>
          <Textarea
            value={organizationDesc}
            placeholder={PLACEHOLDER_WEB_EXAMPLE_DESCRIPTION}
            onChange={(e) => setOrganizationDesc(e.target.value)}
          />
        </FormControl>
      </Flex>
    </>
  );

  const getMobileOrganizationSection = (): React.ReactElement => (
    <Flex flexDir="column" gap="8px">
      <FormControl isRequired>
        <FormLabel variant="mobile-form-label-bold">
          Organization Information
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
          {role === "ASP" && (
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && !isNonNegativeInt(numKids)}
            >
              <Input
                variant="mobile-outline"
                type="number"
                value={numKids}
                onChange={(e) => setNumKids(e.target.value)}
                placeholder={PLACEHOLDER_MOBILE_EXAMPLE_NUM_KIDS}
              />
            </FormControl>
          )}
          <FormControl
            isRequired
            isInvalid={attemptedSubmit && organizationDesc === ""}
          >
            <Textarea
              variant="mobile-outline"
              value={organizationDesc}
              placeholder={PLACEHOLDER_MOBILE_EXAMPLE_DESCRIPTION}
              onChange={(e) => setOrganizationDesc(e.target.value)}
            />
          </FormControl>
        </Flex>
      </FormControl>
    </Flex>
  );

  const getWebContactSection = (): React.ReactElement => (
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
              <FormLabel variant="desktop-button-bold">Phone number</FormLabel>
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
              isInvalid={attemptedSubmit && !isValidEmail(primaryContact.email)}
            >
              <FormLabel variant="desktop-button-bold">Email address</FormLabel>
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

  const getMobileContactSection = (): React.ReactElement => (
    <Flex flexDir="column" gap="8px">
      <FormControl isRequired>
        <FormLabel variant="mobile-form-label-bold">Primary Contact</FormLabel>
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

  const handleSignUp = async (userInfo: UserInfo) => {
    try {
      const response = await signup({ variables: { userInfo } });
      // eslint-disable-next-line no-console
      console.log(response);
      navigate(JOIN_SUCCESS_PAGE);
    } catch (e: unknown) {
      if (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        e?.graphQLErrors &&
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        String(e.graphQLErrors[0]?.message).includes("GEOCODING")
      ) {
        toast({
          title:
            "Failed to located address, please try entering more information or a different address!",
          status: "error",
          isClosable: true,
        });
      } else {
        toast({
          title: "Failed to create account. Please try again.",
          status: "error",
          isClosable: true,
        });
      }
      // eslint-disable-next-line no-console
      console.log(e);
      logPossibleGraphQLError(e as ApolloError);
    }
  };

  const isRequestValid = () => {
    const stringsToValidate = [
      role,
      organizationName,
      organizationAddress,
      primaryContact.name,
      organizationDesc,
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

    if (role === "ASP" && !isNonNegativeInt(numKids)) return false;

    return true;
  };

  const handleSubmit = () => {
    setAttemptedSubmit(true);
    if (!isRequestValid()) return;
    const request: UserInfo = {
      email: trimWhiteSpace(email),
      organizationAddress: trimWhiteSpace(organizationAddress),
      organizationName: trimWhiteSpace(organizationName),
      organizationDesc,
      role,
      roleInfo: {
        aspInfo:
          role === "ASP"
            ? {
                numKids: parseInt(trimWhiteSpace(numKids), 10),
              }
            : null,
        donorInfo: null,
      },
      primaryContact: {
        name: trimWhiteSpace(primaryContact.name),
        email: trimWhiteSpace(primaryContact.email),
        phone: trimWhiteSpace(primaryContact.phone),
      },
      initialOnsiteContacts: onsiteInfo.map((obj) => ({
        name: trimWhiteSpace(obj.name),
        phone: trimWhiteSpace(obj.phone),
        email: trimWhiteSpace(obj.email),
      })),
    };

    // eslint-disable-next-line no-console
    console.log(request);

    handleSignUp(request);
  };

  const getSubmitSection = (): React.ReactElement => (
    <Flex flexDir="column" alignItems="center" gap="8px">
      <Button
        w={{ base: "100%", lg: "480px" }}
        variant={{ base: "mobile-button-bold", lg: "desktop-button-bold" }}
        color="white"
        bgColor="primary.blue"
        disabled={attemptedSubmit && !isRequestValid()}
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

  return (
    <Center
      style={{
        backgroundImage: `url(${LargerBackgroundImage})`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      <Flex
        flexDir="column"
        w={{ base: "100%", lg: "911px" }}
        p={{ base: "24px", sm: "48px", lg: "64px" }}
        margin="50px 0"
        gap={{ base: "20px", lg: "32px" }}
        borderRadius="8px"
        boxShadow={{
          base: "",
          lg:
            "0px 0px 3px rgba(0, 0, 0, 0.1), 0px 4px 20px rgba(0, 0, 0, 0.15)",
        }}
        style={{
          backgroundColor: "white",
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
        <OnsiteContactSection
          onsiteInfo={onsiteInfo}
          setOnsiteInfo={setOnsiteInfo}
          attemptedSubmit={attemptedSubmit}
        />
        {getSubmitSection()}
      </Flex>
    </Center>
  );
};

export default Join;
