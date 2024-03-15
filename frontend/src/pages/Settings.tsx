/*

What do I need to do:
Setup update
setup delteo

create should be working
work on other pages as well

*/
import { ApolloError, gql, useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  HStack,
  Input,
  Spinner,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import { create } from "domain";
import { GraphQLError } from "graphql";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import Logout from "../components/auth/Logout";
import OnsiteStaffSection from "../components/common/OnsiteStaffSection";
import AUTHENTICATED_USER_KEY from "../constants/AuthConstants";
import { LOGIN_PAGE } from "../constants/Routes";
import AuthContext from "../contexts/AuthContext";
import { Contact, OnsiteContact, UserInfo } from "../types/UserTypes";
import { logPossibleGraphQLError } from "../utils/GraphQLUtils";
import { setLocalStorageObjProperty } from "../utils/LocalStorageUtils";
import {
  isNonNegativeInt,
  isValidEmail,
  trimWhiteSpace,
} from "../utils/ValidationUtils";
import useGetOnsiteContacts from "../utils/useGetOnsiteContacts";
import useIsMealDonor from "../utils/useIsMealDonor";
import useIsWebView from "../utils/useIsWebView";

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
const PLACEHOLDER_MOBILE_EXAMPLE_NUMBER_OF_KIDS = "Number of kids";
const PLACEHOLDER_MOBILE_EXAMPLE_ADDRESS = "Address of organization";
const PLACEHOLDER_MOBILE_EXAMPLE_ORG_DESCRIPTION =
  "Description of organization";

const UPDATE_USER_BY_ID = gql`
  mutation UpdateUserById(
    $requestorId: String!
    $id: String!
    $userInfo: UserInfoInput!
  ) {
    updateUserByID(requestorId: $requestorId, id: $id, userInfo: $userInfo) {
      user {
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
          active
          initialOnsiteContacts {
            name
            email
            phone
          }
        }
      }
    }
  }
`;

const CREATE_ONSITE_CONTACT = gql`
  mutation createOnsiteContact(
    $requestorId: String!
    $email: String!
    $name: String!
    $phone: String!
    $organizationId: String!
  ) {
    createOnsiteContact(
      requestorId: $requestorId
      email: $email
      name: $name
      phone: $phone
      organizationId: $organizationId
    ) {
      onsiteContact {
        id
        name
        email
        phone
      }
    }
  }
`;

const UPDATE_ONSITE_CONTACT = gql`
  mutation updateOnsiteContact(
    $id: String!
    $requestorId: String!
    $email: String!
    $name: String!
    $phone: String!
  ) {
    updateOnsiteContact(
      id: $id
      requestorId: $requestorId
      email: $email
      name: $name
      phone: $phone
    ) {
      onsiteContact {
        id
        name
        email
        phone
      }
    }
  }
`;

const DELETE_ONSITE_CONTACT = gql`
  mutation delete_onsite_contact($requestorId: String!, $id: String!) {
    deleteOnsiteContact(requestorId: $requestorId, id: $id) {
      success
    }
  }
`;

const Settings = (): React.ReactElement => {
  const { authenticatedUser, setAuthenticatedUser } = useContext(AuthContext);

  const [userInfo, setUserInfo] = useState<UserInfo>(
    authenticatedUser?.info || null,
  );

  const isMealDonor = useIsMealDonor();

  const [primaryContact, setPrimaryContact] = useState<Contact>(
    userInfo?.primaryContact || {
      name: "",
      phone: "",
      email: "",
    },
  );

  const [organizationName, setOrganizationName] = useState(
    userInfo?.organizationName || "",
  );
  const [numKids, setNumKids] = useState(
    userInfo?.roleInfo?.aspInfo?.numKids?.toString() || "",
  );
  const [organizationAddress, setOrganizationAddress] = useState(
    userInfo?.organizationAddress || "",
  );
  const [organizationDesc, setOrganizationDesc] = useState(
    userInfo?.organizationDesc || "",
  );

  const [serverOnsiteContacts, setServerOnsiteContacts] = useState<
    Array<OnsiteContact>
  >([]);

  const [attemptedSubmit, setAttemptedSave] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const isWebView = useIsWebView();
  const navigate = useNavigate();
  const toast = useToast();

  const [onsiteContacts, setOnsiteContacts] = useState<Array<OnsiteContact>>([
    {
      id: "",
      name: "",
      phone: "",
      email: "",
    },
  ]);

  useGetOnsiteContacts(
    toast,
    (contacts) => {
      setOnsiteContacts(contacts);
      setServerOnsiteContacts(contacts);
    },
    setIsLoading,
  );

  const [updateUserByID] = useMutation(UPDATE_USER_BY_ID);
  const [createOnsiteContact] = useMutation(CREATE_ONSITE_CONTACT);
  const [updateOnsiteContact] = useMutation(UPDATE_ONSITE_CONTACT);
  const [deleteOnsiteContact] = useMutation(DELETE_ONSITE_CONTACT);

  // OnsiteContact query

  if (!authenticatedUser) {
    return <Navigate replace to={LOGIN_PAGE} />;
  }

  const haveSettingsChanged = (): boolean => {
    if (!userInfo) return false;

    const defaultValues: Array<string | number> = [
      userInfo.organizationAddress,
      userInfo.organizationName,
      userInfo.organizationDesc,
      userInfo.roleInfo?.aspInfo?.numKids?.toString() || "",
    ];
    const currentValues: Array<string | number> = [
      trimWhiteSpace(organizationAddress),
      trimWhiteSpace(organizationName),
      organizationDesc,
      trimWhiteSpace(numKids),
    ];

    for (let i = 0; i < defaultValues.length; i += 1) {
      if (defaultValues[i] !== currentValues[i]) {
        return true;
      }
    }

    const defaultContactValues: Array<Contact> = [
      userInfo.primaryContact,
      ...(serverOnsiteContacts ?? []),
    ];
    const currentContactValues: Array<Contact> = [
      primaryContact,
      ...onsiteContacts,
    ];

    if (defaultContactValues.length !== currentContactValues.length)
      return true;

    for (let i = 0; i < defaultContactValues.length; i += 1) {
      if (
        defaultContactValues[i].name !== currentContactValues[i].name ||
        defaultContactValues[i].email !== currentContactValues[i].email ||
        defaultContactValues[i].phone !== currentContactValues[i].phone
      ) {
        return true;
      }
    }

    return false;
  };

  const onClickResetPassword = () => {
    navigate(`/${authenticatedUser?.id}/reset-password`);
  };

  const getTitleSection = (): React.ReactElement => (
    <Text
      alignSelf={{ base: "center", lg: "unset" }}
      variant="desktop-display-xl"
      color="primary.blue"
    >
      User Settings
    </Text>
  );

  const getWebLoginInfoSection = (): React.ReactElement => (
    <Flex flexDir="column" gap="24px">
      <Text variant="desktop-heading">Login Information</Text>
      <Flex flexDir="column" gap="24px">
        <Flex flexDir="column">
          <Text variant="desktop-body-bold">Email Address</Text>
          <Text variant="desktop-body">{userInfo?.email}</Text>
        </Flex>
        <HStack>
          <Logout/>
          <Button
            width="190px"
            height="45px"
            variant="desktop-button-bold"
            color="primary.green"
            bgColor="background.white"
            border="1px solid"
            borderColor="primary.green"
            borderRadius="6px"
            _hover={{ color: "text.white", bgColor: "primary.green" }}
            onClick={onClickResetPassword}
          >
            Reset Password
          </Button>
        </HStack>
      </Flex>
    </Flex>
  );

  const getMobileLoginInfoSection = (): React.ReactElement => (
    <Flex flexDir="column" gap="8px">
      <Text variant="mobile-body-bold">Email Address</Text>
      <Text variant="desktop-xs">{userInfo?.email}</Text>
      <Button
        w="100%"
        variant="mobile-button-bold"
        color="primary.green"
        bgColor="background.white"
        border="1px solid"
        borderColor="primary.green"
        borderRadius="6px"
        _hover={{ color: "text.white", bgColor: "primary.green" }}
        onClick={onClickResetPassword}
      >
        Reset Password
      </Button>
    </Flex>
  );

  const getWebContactSection = (): React.ReactElement => (
    <Flex flexDir="column" gap="24px">
      {haveSettingsChanged() && (
        <Text color="secondary.critical" variant="desktop-xs">
          You have unsaved changes. Make sure to click save at the bottom before
          leaving!
        </Text>
      )}
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

  const getWebOrganizationSection = (): React.ReactElement => (
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
        {isMealDonor ? null : (
          <Flex flexDir="column" w="200px">
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && !isNonNegativeInt(numKids)}
            >
              <FormLabel variant="form-label-bold">Number of kids</FormLabel>
              <Input
                type="number"
                value={numKids}
                placeholder={PLACEHOLDER_WEB_EXAMPLE_NUMBER_OF_KIDS}
                onChange={(e) => setNumKids(e.target.value)}
              />
            </FormControl>
          </Flex>
        )}
        <Flex flexDir="column" w="350px">
          <FormControl
            isRequired
            isInvalid={attemptedSubmit && organizationAddress === ""}
          >
            <FormLabel variant="form-label-bold">
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
            placeholder={PLACEHOLDER_WEB_EXAMPLE_ORG_DESCRIPTION}
            value={organizationDesc}
            onChange={(e) => setOrganizationDesc(e.target.value)}
          />
        </FormControl>
      </Flex>
    </Flex>
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
          {isMealDonor ? null : (
            <FormControl
              isRequired
              isInvalid={attemptedSubmit && !isNonNegativeInt(numKids)}
            >
              <Input
                variant="mobile-outline"
                type="number"
                value={numKids}
                placeholder={PLACEHOLDER_MOBILE_EXAMPLE_NUMBER_OF_KIDS}
                onChange={(e) => setNumKids(e.target.value)}
              />
            </FormControl>
          )}
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
          <FormControl
            isRequired
            isInvalid={attemptedSubmit && organizationDesc === ""}
          >
            <Textarea
              variant="mobile-outline"
              value={organizationDesc}
              placeholder={PLACEHOLDER_MOBILE_EXAMPLE_ORG_DESCRIPTION}
              onChange={(e) => setOrganizationDesc(e.target.value)}
            />
          </FormControl>
        </Flex>
      </FormControl>
    </Flex>
  );

  const isRequestValid = (): boolean => {
    const stringsToValidate = [
      primaryContact.name,
      organizationName,
      organizationAddress,
      organizationDesc,
    ];
    const phoneNumsToValidate = [primaryContact.phone];
    const emailsToValidate = [primaryContact.email];

    for (let i = 0; i < onsiteContacts.length; i += 1) {
      stringsToValidate.push(onsiteContacts[i].name);
      phoneNumsToValidate.push(onsiteContacts[i].phone);
      emailsToValidate.push(onsiteContacts[i].email);
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

    if (!isNonNegativeInt(numKids)) return false;

    return true;
  };

  const handleSaveSettings = async (
    requestorId: string,
    requestUserInfo: UserInfo,
    requestOnsiteContacts: Array<OnsiteContact>,
  ) => {
    setIsLoading(true);
    try {
      const response = await updateUserByID({
        variables: {
          requestorId,
          id: requestorId,
          userInfo: requestUserInfo,
        },
      });

      const newInfo = response.data.updateUserByID?.user?.info;
      if (newInfo) {
        setAuthenticatedUser({ ...authenticatedUser, info: newInfo });
        setUserInfo(newInfo);
        // Need to override local storage to persist new changes on page refresh/navigation
        // without this change, the initial state of userinfo will not include new changes
        // because local storage only updates after the user logs in
        setLocalStorageObjProperty(AUTHENTICATED_USER_KEY, "info", newInfo);
      } else {
        throw new GraphQLError("Failed to save settings");
      }

      // update onsite contacts
      // eslint-disable-next-line no-restricted-syntax
      await Promise.all(
        requestOnsiteContacts.map(async (contact: OnsiteContact) => {
          // If the contact already exists, we have an id for it
          const isNewContact = contact.id === undefined || contact.id === "";
          if (isNewContact) {
            await createOnsiteContact({
              variables: {
                requestorId,
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                organizationId: requestorId,
              },
            });
          } else {
            await updateOnsiteContact({
              variables: {
                id: contact.id,
                requestorId,
                name: contact.name,
                email: contact.email,
                phone: contact.phone,
                organizationId: requestorId,
              },
            });
          }
        }),
      );

      // Some contacts must have been deleted
      if (requestOnsiteContacts.length < serverOnsiteContacts.length) {
        await Promise.all(
          serverOnsiteContacts.map(async (contact: OnsiteContact) => {
            const id = contact.id;
            const newContact = requestOnsiteContacts.find((c) => c.id === id);
            if (newContact) {
              return;
            }

            await deleteOnsiteContact({
              variables: {
                id,
                requestorId,
              },
            });
          }),
        );
      }

      toast({
        title: "Saved settings successfully",
        status: "success",
        isClosable: true,
      });
      setServerOnsiteContacts(requestOnsiteContacts);
      setIsLoading(false);
    } catch (e: unknown) {
      logPossibleGraphQLError(e as ApolloError);
      setIsLoading(false);

      toast({
        title: "Failed to save settings",
        status: "error",
        isClosable: true,
      });
    }
  };

  const handleSubmit = () => {
    setAttemptedSave(true);
    if (!isRequestValid()) return;

    const requestUserInfo: UserInfo = {
      email: userInfo?.email || "",
      organizationAddress: trimWhiteSpace(organizationAddress),
      organizationName: trimWhiteSpace(organizationName),
      organizationDesc,
      role: userInfo?.role || "ASP",
      roleInfo: {
        aspInfo: {
          numKids: parseInt(trimWhiteSpace(numKids), 10),
        },
        donorInfo: null,
      },
      primaryContact: {
        name: trimWhiteSpace(primaryContact.name),
        email: trimWhiteSpace(primaryContact.email),
        phone: trimWhiteSpace(primaryContact.phone),
      },
      initialOnsiteContacts: userInfo?.initialOnsiteContacts ?? [],
      active: userInfo?.active,
    };

    const requestOnsiteContacts: Array<OnsiteContact> = onsiteContacts.map(
      (obj) => ({
        id: obj.id,
        name: trimWhiteSpace(obj.name),
        phone: trimWhiteSpace(obj.phone),
        email: trimWhiteSpace(obj.email),
      }),
    );

    const requestorId = authenticatedUser?.id;
    handleSaveSettings(requestorId, requestUserInfo, requestOnsiteContacts);
  };

  const getSaveSection = (): React.ReactElement => (
    <Button
      width={{ base: "100%", lg: "100px" }}
      height={{ base: "40px", lg: "45px" }}
      mt="24px"
      variant={{ base: "mobile-button-bold", lg: "desktop-button-bold" }}
      color="text.white"
      bgColor="primary.green"
      borderRadius="6px"
      border="1px solid"
      borderColor="primary.green"
      _hover={{
        color: "primary.green",
        bgColor: "background.white",
      }}
      disabled={
        !haveSettingsChanged() || (attemptedSubmit && !isRequestValid())
      }
      _disabled={{
        borderColor: "#CCCCCC !important",
        bgColor: "#CCCCCC !important",
        color: "#666666 !important",
        cursor: "default",
      }}
      onClick={handleSubmit}
    >
      Save
    </Button>
  );

  return (
    <Center>
      {isLoading ? (
        <Spinner />
      ) : (
        <Flex
          flexDir="column"
          w={{ base: "100%", lg: "980px" }}
          p={{ base: "24px", sm: "36px", lg: "48px" }}
          gap={{ base: "20px", lg: "32px" }}
          borderRadius="8px"
          bgColor="background.white"
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
          <OnsiteStaffSection
            onsiteInfo={onsiteContacts}
            setOnsiteInfo={setOnsiteContacts}
            attemptedSubmit={attemptedSubmit}
          />
          {getSaveSection()}
        </Flex>
      )}
    </Center>
  );
};

export default Settings;
