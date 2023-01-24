import { gql, useMutation } from "@apollo/client";
import {
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Text,
} from "@chakra-ui/react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

const getOrganizationInfoSection = (): React.ReactElement => {
  return (
    <>
      <Text variant="desktop-heading">Organization Info</Text>
      <Flex flexDir="row" gap="24px">
        <Flex flexDir="column" w="240px">
          <FormControl isRequired>
            <FormLabel variant="desktop-button-bold">
              Name of organization
            </FormLabel>
            <Input />
          </FormControl>
        </Flex>
        <Flex flexDir="column" w="519px">
          <FormControl isRequired>
            <FormLabel variant="desktop-button-bold">
              Address of organization
            </FormLabel>
            <Input />
          </FormControl>
        </Flex>
      </Flex>
    </>
  );
};

const Join = (): React.ReactElement => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Center>
      <Flex
        flexDir="column"
        w="911px"
        h="1310px"
        p="64px"
        mt="128px"
        gap="32px"
        boxShadow="0px 0px 3px rgba(0, 0, 0, 0.1), 0px 4px 20px rgba(0, 0, 0, 0.15)"
      >
        <Text variant="desktop-display-xl">Sign Up</Text>
        {/* {getUserInfoSection()} */}
        <Divider />
        {getOrganizationInfoSection()}
        <Divider />
        {/* {getContactInfoSection()}
      {getCreateAccountButton()} */}
        {/* <h1>Join</h1>
      <Input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <Input
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /> */}
      </Flex>
    </Center>
  );
};

export default Join;
