import { gql, useMutation } from "@apollo/client";
import {
  Button,
  Center,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Link,
  Radio,
  RadioGroup,
  Stack,
  Text,
} from "@chakra-ui/react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

const getUserInfoSection = (): React.ReactElement => {
  return (
    <>
      <Flex flexDir="column">
        <FormControl isRequired>
          <FormLabel variant="desktop-button-bold">Type of user</FormLabel>
          <RadioGroup defaultValue="1">
            <Stack direction="row">
              <Radio value="1">
                <Text variant="desktop-heading-6">Meal Donor</Text>
              </Radio>
              <Radio value="2">
                <Text variant="desktop-heading-6">After School Program</Text>
              </Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
      </Flex>
      <Flex flexDir="column">
        <FormControl isRequired>
          <FormLabel variant="desktop-button-bold">Email address</FormLabel>
          <Input />
        </FormControl>
      </Flex>
    </>
  );
};

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

const getContactInfoSection = (): React.ReactElement => {
  return (
    <>
      <Text variant="desktop-heading">Contact Information</Text>
      <Flex flexDir="column" gap="32px">
        <Flex flexDir="column" gap="24px">
          <Flex flexDir="column">
            <FormControl isRequired>
              <FormLabel variant="desktop-button-bold">
                1. Primary contact name
              </FormLabel>
              <Input />
            </FormControl>
          </Flex>
          <Flex flexDir="row" gap="24px">
            <Flex flexDir="column" w="240px">
              <FormControl isRequired>
                <FormLabel variant="desktop-button-bold">
                  Phone number
                </FormLabel>
                <Input />
              </FormControl>
            </Flex>
            <Flex flexDir="column" w="519px">
              <FormControl isRequired>
                <FormLabel variant="desktop-button-bold">
                  Email address
                </FormLabel>
                <Input />
              </FormControl>
            </Flex>
          </Flex>
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
        borderRadius="8px"
        boxShadow="0px 0px 3px rgba(0, 0, 0, 0.1), 0px 4px 20px rgba(0, 0, 0, 0.15)"
      >
        <Text variant="desktop-display-xl">Sign Up</Text>
        <Text variant="desktop-xs">
          Already have an account?{" "}
          <Link color="#272D77" textDecoration="underline" href="/login">
            Login here
          </Link>
        </Text>
        {getUserInfoSection()}
        <Divider />
        {getOrganizationInfoSection()}
        <Divider />
        {getContactInfoSection()}
        <Flex flexDir="column" alignItems="center" gap="8px">
          <Button
            w="480px"
            variant="desktop-button-bold"
            color="white"
            bgColor="#272D77"
            _hover={{ bgColor: "#272D77" }}
            borderRadius="6px"
          >
            Create Account
          </Button>
          <Text color="#69696B" variant="desktop-xs">
            {"By selecting Create Account, you agree to FCK's "}
            {/* replace with actual terms & conditions link */}
            <Link color="#272D77" textDecoration="underline" href="/join">
              Terms & Conditions
            </Link>
          </Text>
        </Flex>
      </Flex>
    </Center>
  );
};

export default Join;
