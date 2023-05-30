import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React from "react";

function MealRequestForm() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const initialRef = React.useRef(null);
  const finalRef = React.useRef(null);

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
          maxWidth={{ base: "100px", md: "900px" }}
          padding={{ base: "10px", md: "40px" }}
        >
          <Text
            pb={{ base: 1, md: 5 }}
            pl={{ base: 1, md: 6 }}
            pt={{ base: 2, md: 8 }}
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
            <FormControl mt={3}>
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                Number of meals
              </FormLabel>
              <Input ref={initialRef} placeholder="Ex. 100" />
            </FormControl>

            <FormControl mt={4}>
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

            <FormControl mt={4}>
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                Delivery notes
              </FormLabel>
              <Input ref={initialRef} placeholder="Ex. leave at the door" />
            </FormControl>

            <Text
              variant={{
                base: "mobile-heading",
                md: "desktop-heading",
              }}
              mt={6}
            >
              Contact Information
            </Text>

            <FormControl mt={3}>
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                1. Primary contact name
              </FormLabel>
              <Input ref={initialRef} placeholder="Steve Jobs" />
            </FormControl>

            <FormControl mt={4}>
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                Last name
              </FormLabel>
              <Input placeholder="Last name" />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={onClose} mr={3}>
              Cancel
            </Button>
            <Button colorScheme="blue">Save</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}

export default MealRequestForm;
