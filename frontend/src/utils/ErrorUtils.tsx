import { Center, Spinner, useToast } from "@chakra-ui/react";
import React from "react";

export const ErrorMessage = ({ children = "" }: { children?: string }) => (
  <Center>
    Sorry something went wrong.
    <br />
    {children}
  </Center>
);
