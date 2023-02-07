import { gql, useMutation } from "@apollo/client";
import { CheckCircleIcon, DeleteIcon, EditIcon } from "@chakra-ui/icons";
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
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useMediaQuery,
} from "@chakra-ui/react";
import { CredentialResponse, GoogleLogin } from "@react-oauth/google";
import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import authAPIClient from "../../APIClients/AuthAPIClient";
import { HOME_PAGE, SIGNUP_PAGE } from "../../constants/Routes";
import AuthContext from "../../contexts/AuthContext";
import { AuthenticatedUser } from "../../types/AuthTypes";

const Join = (): React.ReactElement => {
  const [role, setRole] = useState("ASP");
  const [email, setEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");

  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [contactEmail, setContactEmail] = useState(""); // might go unused
  // const [onsiteName, setOnsiteName] = useState("");
  // const [onsiteNumber, setOnsiteNumber] = useState("");
  // const [onsiteEmail, setOnsiteEmail] = useState("");
  const [attemptedSubmit, setAttemptedSubmit] = useState(false);

  // interface OnsiteInfo {
  //   name: string;
  //   number: string;
  //   email: string;
  // }

  const [isWebView] = useMediaQuery("(min-width: 62em)");

  const [onsiteInfo, setOnsiteInfo] = useState([
    {
      name: "",
      number: "",
      email: "",
      edit: true,
      attemptedSubmit: false,
    },
  ]);

  return (
    <Center>
      <Flex
        flexDir="column"
        w={{ base: "100%", lg: "911px" }}
        p={{ base: "48px", lg: "64px" }}
        m="128px 0"
        gap={{ base: "20px", lg: "32px" }}
        borderRadius="8px"
        boxShadow={{
          base: "",
          lg:
            "0px 0px 3px rgba(0, 0, 0, 0.1), 0px 4px 20px rgba(0, 0, 0, 0.15)",
        }}
      >
        <Text
          alignSelf={{ base: "center", lg: "unset" }}
          variant={{ base: "mobile-display-xl", lg: "desktop-display-xl" }}
        >
          Sign Up
        </Text>
        <Text
          alignSelf={{ base: "center", lg: "unset" }}
          textAlign={{ base: "center", lg: "unset" }}
          variant="desktop-xs"
        >
          Already have an account?{" "}
          <Link color="#272D77" textDecoration="underline" href="/login">
            Login here
          </Link>
        </Text>

        <Flex flexDir="column">
          <FormControl isRequired>
            <FormLabel
              variant={{ base: "mobile-body-bold", lg: "desktop-body-bold" }}
            >
              Type of user
            </FormLabel>
            <RadioGroup onChange={setRole} value={role}>
              <Stack direction={{ base: "column", lg: "row" }}>
                <Radio value="ASP">
                  <Text variant="desktop-heading-6">After School Program</Text>
                </Radio>
                <Radio value="MD">
                  <Text variant="desktop-heading-6">Meal Donor</Text>
                </Radio>
              </Stack>
            </RadioGroup>
          </FormControl>
        </Flex>

        {isWebView && (
          <Flex flexDir="column">
            <FormControl isRequired isInvalid={attemptedSubmit && email === ""}>
              <FormLabel variant="desktop-button-bold">Email address</FormLabel>
              <Input
                variant="outline"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
          </Flex>
        )}
        {!isWebView && (
          <Flex flexDir="column">
            <FormControl isRequired isInvalid={attemptedSubmit && email === ""}>
              <FormLabel variant="mobile-body-bold">Email address</FormLabel>
              <Input
                variant="mobile-outline"
                type="email"
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>
          </Flex>
        )}

        {isWebView && <Divider />}
        <>
          {isWebView && (
            <>
              <Text variant="desktop-heading">Organization Info</Text>
              <Flex flexDir="row" gap="24px">
                <Flex flexDir="column" w="240px">
                  <FormControl
                    isRequired
                    isInvalid={attemptedSubmit && organizationName === ""}
                  >
                    <FormLabel variant="desktop-button-bold">
                      Name of organization
                    </FormLabel>
                    <Input
                      onChange={(e) => setOrganizationName(e.target.value)}
                    />
                  </FormControl>
                </Flex>
                <Flex flexDir="column" w="519px">
                  <FormControl
                    isRequired
                    isInvalid={attemptedSubmit && organizationAddress === ""}
                  >
                    <FormLabel variant="desktop-button-bold">
                      Address of organization
                    </FormLabel>
                    <Input
                      onChange={(e) => setOrganizationAddress(e.target.value)}
                    />
                  </FormControl>
                </Flex>
              </Flex>
            </>
          )}
          {!isWebView && (
            <Flex flexDir="column" gap="8px">
              <FormControl isRequired>
                <FormLabel variant="mobile-body-bold">
                  Organization Info
                </FormLabel>

                <Flex flexDir="column" gap="8px">
                  <FormControl
                    isRequired
                    isInvalid={attemptedSubmit && organizationName === ""}
                  >
                    <Input
                      variant="mobile-outline"
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="Name of organization"
                    />
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={attemptedSubmit && organizationAddress === ""}
                  >
                    <Input
                      variant="mobile-outline"
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="Address of organization"
                    />
                  </FormControl>
                </Flex>
              </FormControl>
            </Flex>
          )}
        </>

        {isWebView && <Divider />}
        {isWebView && (
          <>
            <Text variant="desktop-heading">Contact Information</Text>
            <Flex flexDir="column" gap="24px">
              <Flex flexDir="column">
                <FormControl
                  isRequired
                  isInvalid={attemptedSubmit && name === ""}
                >
                  <FormLabel variant="desktop-button-bold">
                    1. Primary contact name
                  </FormLabel>
                  <Input onChange={(e) => setName(e.target.value)} />
                </FormControl>
              </Flex>
              <Flex flexDir="row" gap="24px">
                <Flex flexDir="column" w="240px">
                  <FormControl
                    isRequired
                    isInvalid={attemptedSubmit && number === ""}
                  >
                    <FormLabel variant="desktop-button-bold">
                      Phone number
                    </FormLabel>
                    <Input
                      type="tel"
                      onChange={(e) => setNumber(e.target.value)}
                    />
                  </FormControl>
                </Flex>
                <Flex flexDir="column" w="519px">
                  <FormControl
                    isRequired
                    isInvalid={attemptedSubmit && contactEmail === ""}
                  >
                    <FormLabel variant="desktop-button-bold">
                      Email address
                    </FormLabel>
                    <Input
                      type="email"
                      onChange={(e) => setContactEmail(e.target.value)}
                    />
                  </FormControl>
                </Flex>
              </Flex>
            </Flex>
          </>
        )}
        {!isWebView && (
          <Flex flexDir="column" gap="8px">
            <FormControl isRequired>
              <FormLabel variant="mobile-body-bold">Primary Contact</FormLabel>
              <Flex flexDir="column" gap="8px">
                <FormControl
                  isRequired
                  isInvalid={attemptedSubmit && name === ""}
                >
                  <Input
                    variant="mobile-outline"
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Full Name"
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={attemptedSubmit && number === ""}
                >
                  <Input
                    variant="mobile-outline"
                    type="tel"
                    onChange={(e) => setNumber(e.target.value)}
                    placeholder="Phone number"
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={attemptedSubmit && contactEmail === ""}
                >
                  <Input
                    variant="mobile-outline"
                    type="email"
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Email address"
                  />
                </FormControl>
              </Flex>
            </FormControl>
          </Flex>
        )}
        <FormControl isRequired>
          <Flex flexDir="column" gap="24px">
            {!isWebView && (
              <Flex flexDir="column" gap="20px">
                {onsiteInfo.map((info, index) => (
                  <Flex flexDir="column" gap="8px" key={index}>
                    <Flex flexDir="row" justifyContent="space-between">
                      <FormLabel variant="mobile-body-bold">
                        Additional Onsite Staff
                      </FormLabel>
                      {onsiteInfo.length >= 2 && (
                        <DeleteIcon
                          h="16px"
                          w="16px"
                          color="#CBD5E0"
                          cursor="pointer"
                          _hover={{ color: "#272D77" }}
                          onClick={() => {
                            onsiteInfo.splice(index, 1);
                            setOnsiteInfo([...onsiteInfo]);
                          }}
                        />
                      )}
                    </Flex>
                    <FormControl
                      isInvalid={
                        onsiteInfo[index].attemptedSubmit &&
                        onsiteInfo[index].name === ""
                      }
                    >
                      <Input
                        h="37px"
                        variant="mobile-outline"
                        value={onsiteInfo[index].name}
                        placeholder="Full Name"
                        onChange={(e) => {
                          onsiteInfo[index].name = e.target.value;
                          setOnsiteInfo([...onsiteInfo]);
                        }}
                      />
                    </FormControl>
                    <FormControl
                      isInvalid={
                        onsiteInfo[index].attemptedSubmit &&
                        onsiteInfo[index].number === ""
                      }
                    >
                      <Input
                        h="37px"
                        variant="mobile-outline"
                        value={onsiteInfo[index].number}
                        placeholder="Phone Number"
                        onChange={(e) => {
                          onsiteInfo[index].number = e.target.value;
                          setOnsiteInfo([...onsiteInfo]);
                        }}
                      />
                    </FormControl>
                    <FormControl
                      isInvalid={
                        onsiteInfo[index].attemptedSubmit &&
                        onsiteInfo[index].email === ""
                      }
                    >
                      <Input
                        h="37px"
                        variant="mobile-outline"
                        value={onsiteInfo[index].email}
                        placeholder="Email"
                        onChange={(e) => {
                          onsiteInfo[index].email = e.target.value;
                          setOnsiteInfo([...onsiteInfo]);
                        }}
                      />
                    </FormControl>
                  </Flex>
                ))}
                {onsiteInfo.length < 10 && (
                  <Text
                    variant="mobile-body-bold"
                    cursor="pointer"
                    onClick={() => {
                      setOnsiteInfo([
                        ...onsiteInfo,
                        {
                          name: "",
                          number: "",
                          email: "",
                          edit: true,
                          attemptedSubmit: false,
                        },
                      ]);
                    }}
                  >
                    + Add another contact
                  </Text>
                )}
              </Flex>
            )}
            {isWebView && (
              <>
                <Flex flexDir="column" gap="8px">
                  <FormLabel variant="desktop-body-bold">
                    2. Additional onsite staff
                  </FormLabel>
                  <Text color="#69696B" variant="desktop-xs">
                    *Must add at least 1 onsite staff up to a maximum of 10.
                  </Text>
                </Flex>
                <TableContainer border="1px solid #EDF2F7" borderRadius="8px">
                  <Table>
                    <Thead>
                      <Tr
                        borderRadius="8px 8px 0 0"
                        h="40px"
                        background="#EDF2F7"
                      >
                        <Th
                          borderRadius="8px 0 0 0"
                          padding="0 12px 0 24px"
                          textTransform="none"
                        >
                          <Text color="black" variant="desktop-xs">
                            Full Name
                          </Text>
                        </Th>
                        <Th padding="0 12px" textTransform="none">
                          <Text color="black" variant="desktop-xs">
                            Number
                          </Text>
                        </Th>
                        <Th padding="0 0 0 12px" textTransform="none">
                          <Text color="black" variant="desktop-xs">
                            Email
                          </Text>
                        </Th>
                        <Th />
                        <Th borderRadius="0 8px 0 0" />
                      </Tr>
                    </Thead>

                    <Tbody>
                      {onsiteInfo.map((info, index) => (
                        <Tr h="58px" key={index}>
                          <Td padding="0 12px 0 24px" gap="24px">
                            {onsiteInfo[index].edit ? (
                              <FormControl
                                isInvalid={
                                  onsiteInfo[index].attemptedSubmit &&
                                  onsiteInfo[index].name === ""
                                }
                              >
                                <Input
                                  h="37px"
                                  w="168px"
                                  value={onsiteInfo[index].name}
                                  onChange={(e) => {
                                    onsiteInfo[index].name = e.target.value;
                                    setOnsiteInfo([...onsiteInfo]);
                                  }}
                                />
                              </FormControl>
                            ) : (
                              <Text w="168px" variant="desktop-xs">
                                {onsiteInfo[index].name}
                              </Text>
                            )}
                          </Td>
                          <Td padding="0 12px">
                            {onsiteInfo[index].edit ? (
                              <FormControl
                                isInvalid={
                                  onsiteInfo[index].attemptedSubmit &&
                                  onsiteInfo[index].number === ""
                                }
                              >
                                <Input
                                  h="37px"
                                  w="145px"
                                  value={onsiteInfo[index].number}
                                  onChange={(e) => {
                                    onsiteInfo[index].number = e.target.value;
                                    setOnsiteInfo([...onsiteInfo]);
                                  }}
                                />
                              </FormControl>
                            ) : (
                              <Text w="145px" variant="desktop-xs">
                                {onsiteInfo[index].number}
                              </Text>
                            )}
                          </Td>
                          <Td padding="0 0 0 12px">
                            {onsiteInfo[index].edit ? (
                              <FormControl
                                isInvalid={
                                  onsiteInfo[index].attemptedSubmit &&
                                  onsiteInfo[index].email === ""
                                }
                              >
                                <Input
                                  h="37px"
                                  w="294px"
                                  value={onsiteInfo[index].email}
                                  onChange={(e) => {
                                    onsiteInfo[index].email = e.target.value;
                                    setOnsiteInfo([...onsiteInfo]);
                                  }}
                                />
                              </FormControl>
                            ) : (
                              <Text w="294px" variant="desktop-xs">
                                {onsiteInfo[index].email}
                              </Text>
                            )}
                          </Td>
                          {onsiteInfo[index].edit ? (
                            <Td padding="0 4px">
                              <CheckCircleIcon
                                h="19.5px"
                                w="100%"
                                color="#CBD5E0"
                                cursor="pointer"
                                _hover={{ color: "#272D77" }}
                                onClick={() => {
                                  onsiteInfo[index].attemptedSubmit = true;
                                  if (
                                    onsiteInfo[index].name !== "" &&
                                    onsiteInfo[index].number !== "" &&
                                    onsiteInfo[index].email !== ""
                                  ) {
                                    onsiteInfo[index].edit = false;
                                  }
                                  setOnsiteInfo([...onsiteInfo]);
                                }}
                              />
                            </Td>
                          ) : (
                            <Td padding="0 4px">
                              <EditIcon
                                h="19.5px"
                                w="100%"
                                color="#CBD5E0"
                                cursor="pointer"
                                _hover={{ color: "#272D77" }}
                                onClick={() => {
                                  onsiteInfo[index].edit = true;
                                  setOnsiteInfo([...onsiteInfo]);
                                }}
                              />
                            </Td>
                          )}
                          {onsiteInfo.length >= 2 ? (
                            <Td padding="0 4px">
                              <DeleteIcon
                                h="19.5px"
                                w="100%"
                                color="#CBD5E0"
                                cursor="pointer"
                                _hover={{ color: "#272D77" }}
                                onClick={() => {
                                  onsiteInfo.splice(index, 1);
                                  setOnsiteInfo([...onsiteInfo]);
                                }}
                              />
                            </Td>
                          ) : (
                            <Td padding="0 4px" />
                          )}
                        </Tr>
                      ))}
                    </Tbody>
                  </Table>
                </TableContainer>
                {onsiteInfo.length < 10 && (
                  <Text
                    variant="desktop-button-bold"
                    cursor="pointer"
                    onClick={() => {
                      setOnsiteInfo([
                        ...onsiteInfo,
                        {
                          name: "",
                          number: "",
                          email: "",
                          edit: true,
                          attemptedSubmit: false,
                        },
                      ]);
                    }}
                  >
                    + Add another contact
                  </Text>
                )}
              </>
            )}
          </Flex>
        </FormControl>

        <Flex flexDir="column" alignItems="center" gap="8px">
          <Button
            w={{ base: "100%", lg: "480px" }}
            variant={{ base: "mobile-button-bold", lg: "desktop-button-bold" }}
            color="white"
            bgColor="#272D77"
            _hover={{ bgColor: "#272D77" }}
            borderRadius="6px"
            onClick={() => {
              setAttemptedSubmit(true);
              const req = {
                role,
                email,
                organizationName,
                organizationAddress,
                name,
                number,
                contactEmail,
                onsiteInfo,
              };
              console.log(req);
              // add validation for the request
            }}
          >
            Create Account
          </Button>
          <Text
            color="#69696B"
            variant={{ base: "mobile-xs", lg: "desktop-xs" }}
          >
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
