import {
  ApolloClient,
  InMemoryCache,
  gql,
  useMutation,
  useQuery,
} from "@apollo/client";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Text,
  VStack,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const SetPassword = (): React.ReactElement => {
  const [notMatching, setNotMatching] = useState(false);
  const [tooShort, setTooShort] = useState(false);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  const { objectID: objectId } = useParams();

  const GET_OBJECT_ID = gql`
    query GetOnboardingRequestById{
      getOnboardingRequestById(id: "${objectId}"
          
        ) {
        email
        organizationAddress
        organizationName
        role
        primaryContact {
          name
          email
          phone
        }
        onsiteContacts {
          name
          email
          phone
        }
        dateSubmitted
        status
      }
    }
  `;

  const REGISTER_USER = gql`
    mutation register(
      $email: String!
      $password: String!
      $requestId: String!
    ) {
      register(email: $email, password: $password, requestId: $requestId) {
        user {
          accessToken
          id
          firstName
          lastName
          email
          role
        }
      }
    }
  `;

  const { data, loading, error } = useQuery(GET_OBJECT_ID, {
    onCompleted: () => {},
  });

  const [
    register,
    { loading: registerLoading, error: registerError },
  ] = useMutation(REGISTER_USER);

  if (loading) return <p>Loading...</p>;

  function dataStatus() {
    return data.getOnboardingRequestById[0].status !== "Approved";
  }

  const onResetPasswordClick = async () => {
    setNotMatching(password !== confirm);
    setTooShort(password.length < 8);

    const response = await register({
      variables: {
        email: data?.getOnboardingRequestById[0].email,
        password,
        requestId: objectId,
      },
    }).then(() => {
      navigate("/login");
    });

    return response;
  };

  return (
    <Flex
      flexDirection="column"
      width="100wh"
      height="100vh"
      justifyContent={{ base: "center", md: "flex-start" }}
      alignItems="center"
      marginBottom="50px"
    >
      <VStack
        justify="space-between"
        border={{ base: "0px", md: "1px" }}
        borderColor="#D6D6D6"
        borderRadius="5%"
        padding={{ base: "4% 3% 4% 3%", md: "4% 7% 4% 7%" }}
        width={{ base: "80%", md: "40%" }}
        height="fit-content"
      >
        <Text
          textAlign="center"
          pb={{ base: 1, md: 5 }}
          variant={{ base: "mobile-display-xl", md: "desktop-display-xl" }}
        >
          Set your password
        </Text>
        {error ? (
          <Text
            pb={5}
            textAlign="center"
            variant={{ base: "mobile-caption", md: "desktop-caption" }}
            textColor={error || dataStatus() ? "red" : "black"}
          >
            Sorry, we could not find an onboarding request associated with the
            object ID.
          </Text>
        ) : (
          <Text
            pb={5}
            textAlign="center"
            variant={{ base: "mobile-caption", md: "desktop-caption" }}
            textColor={error || dataStatus() ? "red" : "black"}
          >
            {data.getOnboardingRequestById[0].status === "Approved"
              ? "Please enter your new password. The password must be at least 8 characters long."
              : "Sorry, your onboarding request has not been approved. Please wait for a response from admin"}
          </Text>
        )}

        <Flex width="100%" justifyContent="flexStart" flexDirection="column">
          <Box>
            <FormControl
              pb={5}
              isRequired
              isInvalid={notMatching || tooShort || !!error || dataStatus()}
            >
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                Enter new password
              </FormLabel>
              <Input
                variant="outline"
                type="password"
                value={password}
                // outlineColor={er ? "red" : ""}
                onChange={(e) => setPassword(e.target.value)}
              />
              {tooShort ? (
                <FormErrorMessage>
                  <Text
                    variant={{
                      base: "mobile-caption",
                      md: "desktop-caption",
                    }}
                  >
                    Password must be at least 8 characters long.
                  </Text>
                </FormErrorMessage>
              ) : null}
            </FormControl>
          </Box>
          <Box>
            <FormControl
              pb={12}
              isRequired
              isInvalid={notMatching || tooShort || !!error || dataStatus()}
            >
              <FormLabel
                variant={{
                  base: "mobile-form-label-bold",
                  md: "form-label-bold",
                }}
              >
                Confirm new password
              </FormLabel>
              <Input
                variant="outline"
                type="password"
                value={confirm}
                // outlineColor={confirmGray ? "red" : ""}
                onChange={(e) => setConfirm(e.target.value)}
              />
              {notMatching ? (
                <FormErrorMessage>
                  <Text
                    variant={{
                      base: "mobile-caption",
                      md: "desktop-caption",
                    }}
                  >
                    Passwords do not match.
                  </Text>
                </FormErrorMessage>
              ) : null}
            </FormControl>
          </Box>
        </Flex>
        <VStack pb={5} width="100%">
          <Button
            onClick={onResetPasswordClick}
            width={{ base: "100%", md: "90%" }}
            pt={1}
            pb={1}
            backgroundColor="primary.blue"
            disabled={!!error || dataStatus()}
          >
            <Text
              variant={{
                base: "mobile-button-bold",
                md: "desktop-button-bold",
              }}
              color="white"
            >
              {registerLoading ? "Loading..." : "Confirm"}
            </Text>
          </Button>
        </VStack>
      </VStack>
    </Flex>
  );
};

export default SetPassword;
