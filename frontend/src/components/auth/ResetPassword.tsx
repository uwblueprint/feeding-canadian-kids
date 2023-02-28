import { gql, useMutation } from "@apollo/client";
import { Box, Button, Flex, FormControl, FormLabel, HStack, Input, Text, VStack } from "@chakra-ui/react";
import React, { useContext, useState } from "react";

import AuthContext from "../../contexts/AuthContext";

const RESET_PASSWORD = gql`
  mutation ResetPassword($email: String!) {
    resetPassword(email: $email) {
      success
    }
  }
`;

const ResetPassword = (): React.ReactElement => {
  const { authenticatedUser } = useContext(AuthContext);
  const [error, setError] = useState(false);
  const [password, setPassword] = useState('');

  const [resetPassword] = useMutation<{ resetPassword: { success: boolean } }>(
    RESET_PASSWORD,
  );

  const onResetPasswordClick = async () => {
    await resetPassword({ variables: { email: authenticatedUser?.email } });
  };

  // return (
  //   <Flex
  //     flexDirection="column"
  //     width="100wh"
  //     height="100vh"
  //     justifyContent="center"
  //     alignItems="center"
  //   >
  //     <VStack
  //       justify="space-between"
  //       border={{ base: "0px", md: "1px" }}
  //       borderColor="#D6D6D6"
  //       borderRadius="5%"
  //       padding={{ base: "4% 3% 4% 3%", md: "4% 7% 4% 7%" }}
  //       width={{ base: "80%", md: "40%" }}
  //       height="fit-content"
  //     >
  //       <Text
  //         pb={{ base: 1, md: 5 }}
  //         variant={{ base: "mobile-display-xl", md: "desktop-display-xl" }}
  //       >
  //         Reset password
  //       </Text>
  //         <Text
  //           pb={5}
  //           textAlign="center"
  //           variant={{ base: "mobile-caption", md: "desktop-caption" }}
  //         >
  //           Please enter your new password. The password must be at least 8 characters.
  //         </Text>
  //       <Flex width="100%" justifyContent="flexStart" flexDirection="column">
  //         <Box>
  //           <FormControl pb={5} isRequired isInvalid={error}>
  //             <FormLabel
  //               variant={{
  //                 base: "mobile-form-label-bold",
  //                 md: "form-label-bold",
  //               }}
  //             >
  //               Email Address
  //             </FormLabel>
  //             <Input
  //               variant="outline"
  //               type="email"
  //               value={email}
  //               onChange={(e) => setEmail(e.target.value)}
  //             />
  //           </FormControl>
  //         </Box>
  //         <Box>
  //           <FormControl pb={2} isRequired isInvalid={error}>
  //             <FormLabel
  //               variant={{
  //                 base: "mobile-form-label-bold",
  //                 md: "form-label-bold",
  //               }}
  //             >
  //               Password
  //             </FormLabel>
  //             <Input
  //               variant="outline"
  //               type="password"
  //               value={password}
  //               onChange={(e) => setPassword(e.target.value)}
  //             />
  //           </FormControl>
  //         </Box>
  //         <Text
  //           pb={12}
  //           variant={{ base: "mobile-xs", md: "desktop-xs" }}
  //           textDecoration="underline"
  //         >
  //           Forgot Password?
  //         </Text>
  //       </Flex>
  //       <VStack pb={5} width="100%">
  //         <Button
  //           onClick={onLogInClick}
  //           width={{ base: "100%", md: "90%" }}
  //           pt={1}
  //           pb={1}
  //           backgroundColor="#272D77"
  //         >
  //           <Text
  //             variant={{
  //               base: "mobile-button-bold",
  //               md: "desktop-button-bold",
  //             }}
  //             color="white"
  //           >
  //             Log in
  //           </Text>
  //         </Button>
  //         <HStack>
  //           <Text variant={{ base: "mobile-xs", md: "desktop-xs" }}>
  //             Don’t have an account?
  //           </Text>
  //           <Link to={SIGNUP_PAGE}>
  //             <Text
  //               variant={{ base: "mobile-xs", md: "desktop-xs" }}
  //               textDecoration="underline"
  //             >
  //               Sign up now.
  //             </Text>
  //           </Link>
  //         </HStack>
  //       </VStack>
  //     </VStack>
  //   </Flex>
  // );
};

export default ResetPassword;
