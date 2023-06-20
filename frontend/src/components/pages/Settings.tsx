import {
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Text,
  Textarea,
  useMediaQuery,
} from "@chakra-ui/react";
import React, { useState } from "react";

import { Contact, UserSettings } from "../../types/UserTypes";
import {
  isNonNegativeInt,
  isValidEmail,
  trimWhiteSpace,
} from "../../utils/ValidationUtils";
import OnsiteStaffSection from "../common/OnsiteStaffSection";

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

const Settings = (): React.ReactElement => {
  const [primaryContact, setPrimaryContact] = useState<Contact>({
    name: "",
    phone: "",
    email: "",
  });
  const [organizationName, setOrganizationName] = useState("");
  const [numberOfKids, setNumberOfKids] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");
  const [organizationDescription, setOrganizationDescription] = useState("");
  const [onsiteInfo, setOnsiteInfo] = useState<Array<Contact>>([
    {
      name: "",
      phone: "",
      email: "",
    },
  ]);

  const [attemptedSubmit, setAttemptedSave] = useState(false);
  const [isWebView] = useMediaQuery("(min-width: 62em)");

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
            width="190px"
            height="45px"
            variant="desktop-button-bold"
            color="primary.green"
            bgColor="background.white"
            border="1px solid"
            borderColor="primary.green"
            borderRadius="6px"
            _hover={{ color: "text.white", bgColor: "primary.green" }}
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
          w="100%"
          variant="mobile-button-bold"
          color="primary.green"
          bgColor="background.white"
          border="1px solid"
          borderColor="primary.green"
          borderRadius="6px"
          _hover={{ color: "text.white", bgColor: "primary.green" }}
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
            <FormControl
              isInvalid={
                attemptedSubmit &&
                numberOfKids !== "" &&
                !isNonNegativeInt(numberOfKids)
              }
            >
              <FormLabel variant="form-label-bold">Number of kids</FormLabel>
              <Input
                type="number"
                value={numberOfKids}
                placeholder={PLACEHOLDER_WEB_EXAMPLE_NUMBER_OF_KIDS}
                onChange={(e) => setNumberOfKids(e.target.value)}
              />
            </FormControl>
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
            borderWidth="2px"
            borderRadius="4px"
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
              isInvalid={
                attemptedSubmit &&
                numberOfKids !== "" &&
                !isNonNegativeInt(numberOfKids)
              }
            >
              <Input
                variant="mobile-outline"
                type="number"
                value={numberOfKids}
                placeholder={PLACEHOLDER_MOBILE_EXAMPLE_NUMBER_OF_KIDS}
                onChange={(e) => setNumberOfKids(e.target.value)}
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
            <Textarea
              size="xs"
              p="12px"
              borderWidth="2px"
              focusBorderColor="gray.200"
              boxShadow="none !important"
              borderRadius="4px"
              placeholder={PLACEHOLDER_MOBILE_EXAMPLE_ORG_DESCRIPTION}
              value={organizationDescription}
              onChange={(e) => setOrganizationDescription(e.target.value)}
            />
          </Flex>
        </FormControl>
      </Flex>
    );
  };

  const isRequestValid = (): boolean => {
    const stringsToValidate = [
      primaryContact.name,
      organizationName,
      organizationAddress,
    ];
    const phoneNumsToValidate = [primaryContact.phone];
    const emailsToValidate = [primaryContact.email];

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

    if (numberOfKids !== "" && !isNonNegativeInt(numberOfKids)) return false;

    return true;
  };

  const handleSubmit = () => {
    setAttemptedSave(true);
    if (!isRequestValid()) return;

    const request: UserSettings = {
      primaryContact: {
        name: trimWhiteSpace(primaryContact.name),
        email: trimWhiteSpace(primaryContact.email),
        phone: trimWhiteSpace(primaryContact.phone),
      },
      organizationName: trimWhiteSpace(organizationName),
      numberOfKids: parseInt(trimWhiteSpace(numberOfKids), 10),
      organizationAddress: trimWhiteSpace(organizationAddress),
      organizationDescription: trimWhiteSpace(organizationDescription),
      onsiteContacts: onsiteInfo.map((obj) => ({
        name: trimWhiteSpace(obj.name),
        phone: trimWhiteSpace(obj.phone),
        email: trimWhiteSpace(obj.email),
      })),
    };

    // eslint-disable-next-line no-console
    console.log(request);

    // TODO: handleSaveSettings(request);
  };

  const getSaveSection = (): React.ReactElement => {
    return (
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
        disabled={attemptedSubmit && !isRequestValid()}
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
  };

  return (
    <Center>
      <Flex
        flexDir="column"
        w={{ base: "100%", lg: "1000px" }}
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
          onsiteInfo={onsiteInfo}
          setOnsiteInfo={setOnsiteInfo}
          attemptedSubmit={attemptedSubmit}
        />
        {getSaveSection()}
      </Flex>
    </Center>
  );
};

export default Settings;
