import { Center, Spinner, useToast } from "@chakra-ui/react";
import React from "react";

export const ErrorMessage = ({ children = "" }: { children?: string }) => (
  <Center>
    <p>
      Sorry something went wrong. Please check your email and verify your email
      if you have not already! Else, please let us know what happened at{" "}
      <a href="mailto:info@feedingcanadiankids.org​">
        info@feedingcanadiankids.org
      </a>
      <br />
      {children}
    </p>
  </Center>
);
