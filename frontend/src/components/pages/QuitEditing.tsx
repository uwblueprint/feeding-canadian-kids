import React from "react";
import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  AlertDialogCloseButton,
  Button,
  useDisclosure,
} from '@chakra-ui/react';


const QuitEditing = (): React.ReactElement => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const cancelRef = React.useRef<HTMLElement>(null)

  return (
    <>
      <Button colorScheme='red' onClick={onOpen}>
        Save
      </Button>

      <AlertDialog
        isOpen={isOpen}
        leastDestructiveRef={cancelRef}
        onClose={onClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize='sm' fontWeight='bold'>
              Quit Editing?
            </AlertDialogHeader>

            <AlertDialogBody>
              Your changes will not be saved if you leave this page.
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button /*ref={cancelRef}*/ onClick={onClose}>
                Quit
              </Button>
              <Button colorScheme='red' onClick={onClose} ml={3}>
                Cancel
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  )
}

export default QuitEditing;