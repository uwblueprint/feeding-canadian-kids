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
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";

import { Contact } from "../../types/UserTypes";
import { isValidEmail } from "../../utils/ValidationUtils";
import useIsWebView from "../../utils/useIsWebView";
import OnsiteStaffSection from "../common/OnsiteStaffSection";

const PLACEHOLDER_WEB_EXAMPLE_FULL_NAME = "Jane Doe";
const PLACEHOLDER_WEB_EXAMPLE_PHONE_NUMBER = "111-222-3333";
const PLACEHOLDER_WEB_EXAMPLE_EMAIL = "example@domain.com";

const PLACEHOLDER_MOBILE_EXAMPLE_FULL_NAME = "Full Name (Jane Doe)";
const PLACEHOLDER_MOBILE_EXAMPLE_EMAIL = "Email (example@domain.com)";
const PLACEHOLDER_MOBILE_EXAMPLE_PHONE_NUMBER = "Phone Number (111-222-3333)";

const EditMealRequestForm = () => {
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
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialFocusRef = React.useRef(null);

  const getMobileContactSection = (): React.ReactElement => {
    return (
      <Flex flexDir="column" gap="8px">
        <FormControl isRequired mb={6}>
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
        initialFocusRef={initialFocusRef}
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

                // TODO: Hook this up to a state variable
                // TODO: Setup correct validation for this
                // isInvalid={attemptedSubmit && }
              >
                Number of meals
              </FormLabel>
              <Input ref={initialFocusRef} w="200px" placeholder="Ex. 100" />
            </FormControl>

            <FormControl mt={3} mb={6} isRequired>
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}

                // TODO: Hook this up to a state variable
                // TODO: Setup correct validation for this
                // isInvalid={attemptedSubmit && }
              >
                Dietary restrictions
              </FormLabel>
              <Input placeholder="Ex. Nut allergy, gluten free" />
            </FormControl>

            <FormControl mt={3} mb={6} isRequired>
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
                // TODO: Hook this up to a state variable
                // TODO: Setup correct validation for this
                // isInvalid={attemptedSubmit && }
              >
                Delivery Notes
              </FormLabel>
              <Input placeholder="Ex. Nut allergy, gluten free" />
              <br />
            </FormControl>
            {isWebView && <Divider />}
            {isWebView ? getWebContactSection() : getMobileContactSection()}

            <OnsiteStaffSection
              onsiteInfo={onsiteInfo}
              setOnsiteInfo={setOnsiteInfo}
              attemptedSubmit={attemptedSubmit}
            />
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3} variant="outline">
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={() => {
                setAttemptedSubmit(true);
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EditMealRequestForm;
