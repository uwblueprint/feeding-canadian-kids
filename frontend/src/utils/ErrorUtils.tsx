import { Center, Spinner, useToast } from "@chakra-ui/react";
import React from "react";

export const ErrorMessage = ({ children = "" }: { children?: string }) => (
  <Center>
    <p>
      Sorry something went wrong. Please retry by refreshing the page and let us
      know what happened at{" "}
      <a href="mailto:info@feedingcanadiankids.org​">
        info@feedingcanadiankids.org
      </a>
      <br />
      {children}
    </p>
  </Center>
);
