import { Button, Flex } from "@chakra-ui/react";
import React, { useState } from "react";

import UserList from "../components/admin/UserList";
import TitleSection from "../components/asp/requests/TitleSection";
import useIsWebView from "../utils/useIsWebView";

type GetTitleSectionProps = {
  isASP: boolean;
  setIsASP: React.Dispatch<React.SetStateAction<boolean>>;
  isWebView: boolean;
};

const GetTitleSection = ({
  isASP,
  setIsASP,
  isWebView,
}: GetTitleSectionProps): React.ReactElement => (
  <Flex flexDir="column" width="100%">
    <Flex justify="flex-end">
      <Button
        width="10%"
        minWidth={{ base: "80px", lg: "150px" }}
        height={{ base: "40px", lg: "45px" }}
        color={isASP ? "text.black" : "text.white"}
        bgColor={isASP ? "background.white" : "primary.blue"}
        borderRadius="6px 0 0 6px"
        border="1px solid"
        borderColor="text.black"
        _hover={{
          bgColor: isASP ? "gray.gray83" : "secondary.blue",
        }}
        onClick={() => {
          setIsASP(false);
        }}
      >
        {isWebView ? "Meal Donors" : "Donors"}
      </Button>
      <Button
        width="10%"
        minWidth={{ base: "80px", lg: "150px" }}
        height={{ base: "40px", lg: "45px" }}
        color={isASP ? "text.white" : "text.black"}
        bgColor={isASP ? "primary.blue" : "background.white"}
        borderRadius="0 6px 6px 0"
        border="1px solid"
        borderColor="text.black"
        _hover={{
          bgColor: isASP ? "secondary.blue" : "gray.gray83",
        }}
        onClick={() => {
          setIsASP(true);
        }}
      >
        ASPs
      </Button>
    </Flex>
    <TitleSection
      title={isASP ? "List of After School Programs" : "List of Meal Donors"}
      description={isASP ? "" : ""}
    />
  </Flex>
);

const AdminUsersPage = (): React.ReactElement => {
  const [isASP, setIsASP] = useState(true);
  const isWebView = useIsWebView();

  return (
    <Flex
      flexDir="column"
      w={{ base: "100%" }}
      p={{ base: "14px", sm: "36px", lg: "48px" }}
      borderRadius="8px"
      bgColor="background.white"
      justifyContent="center"
      alignItems="center"
    >
      <Flex flexDir="column" width="100%">
        <GetTitleSection
          isASP={isASP}
          setIsASP={setIsASP}
          isWebView={isWebView}
        />
      </Flex>
      <UserList isASP={isASP} />
    </Flex>
  );
};

export default AdminUsersPage;
