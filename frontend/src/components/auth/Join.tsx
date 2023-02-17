import { DeleteIcon } from "@chakra-ui/icons";
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
import React, { useState } from "react";

const Join = (): React.ReactElement => {
  const [role, setRole] = useState("ASP");
  const [email, setEmail] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [organizationAddress, setOrganizationAddress] = useState("");
  const [contactName, setContactName] = useState("");
  const [contactNumber, setContactNumber] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [onsiteInfo, setOnsiteInfo] = useState([
    {
      name: "",
      number: "",
      email: "",
    },
  ]);

  const [attemptedSubmit, setAttemptedSubmit] = useState(false);
  const [isWebView] = useMediaQuery("(min-width: 62em)");

  return (
    <Center>
      <Flex
        flexDir="column"
        w={{ base: "100%", lg: "911px" }}
        p={{ base: "24px", sm: "48px", lg: "64px" }}
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
          variant="desktop-display-xl"
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
              variant={{
                base: "mobile-form-label-bold",
                lg: "form-label-bold",
              }}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>
          </Flex>
        )}
        {!isWebView && (
          <Flex flexDir="column">
            <FormControl isRequired isInvalid={attemptedSubmit && email === ""}>
              <FormLabel variant="mobile-form-label-bold">
                Email address
              </FormLabel>
              <Input
                type="email"
                value={email}
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
                      value={organizationName}
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
                      value={organizationAddress}
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
                <FormLabel variant="mobile-form-label-bold">
                  Organization Info
                </FormLabel>

                <Flex flexDir="column" gap="8px">
                  <FormControl
                    isRequired
                    isInvalid={attemptedSubmit && organizationName === ""}
                  >
                    <Input
                      value={organizationName}
                      onChange={(e) => setOrganizationName(e.target.value)}
                      placeholder="Name of organization"
                    />
                  </FormControl>
                  <FormControl
                    isRequired
                    isInvalid={attemptedSubmit && organizationAddress === ""}
                  >
                    <Input
                      value={organizationAddress}
                      onChange={(e) => setOrganizationAddress(e.target.value)}
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
                  isInvalid={attemptedSubmit && contactName === ""}
                >
                  <FormLabel variant="desktop-button-bold">
                    1. Primary contact name
                  </FormLabel>
                  <Input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                  />
                </FormControl>
              </Flex>
              <Flex flexDir="row" gap="24px">
                <Flex flexDir="column" w="240px">
                  <FormControl
                    isRequired
                    isInvalid={attemptedSubmit && contactNumber === ""}
                  >
                    <FormLabel variant="desktop-button-bold">
                      Phone number
                    </FormLabel>
                    <Input
                      type="tel"
                      value={contactNumber}
                      onChange={(e) => setContactNumber(e.target.value)}
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
                      value={contactEmail}
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
              <FormLabel variant="mobile-form-label-bold">
                Primary Contact
              </FormLabel>
              <Flex flexDir="column" gap="8px">
                <FormControl
                  isRequired
                  isInvalid={attemptedSubmit && contactName === ""}
                >
                  <Input
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Full Name"
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={attemptedSubmit && contactNumber === ""}
                >
                  <Input
                    type="tel"
                    value={contactNumber}
                    onChange={(e) => setContactNumber(e.target.value)}
                    placeholder="Phone number"
                  />
                </FormControl>
                <FormControl
                  isRequired
                  isInvalid={attemptedSubmit && contactEmail === ""}
                >
                  <Input
                    type="email"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="Email address"
                  />
                </FormControl>
              </Flex>
            </FormControl>
          </Flex>
        )}
        {!isWebView && (
          <Flex flexDir="column" gap="20px">
            {onsiteInfo.map((info, index) => (
              <Flex flexDir="column" gap="8px" key={index}>
                <Flex flexDir="row" justifyContent="space-between">
                  <FormControl isRequired>
                    <FormLabel variant="mobile-form-label-bold">
                      {`Additional Onsite Staff (${index + 1})`}
                    </FormLabel>
                  </FormControl>
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
                {index === 0 && (
                  <Text color="#69696B" variant="desktop-xs" mt="-16px">
                    *Must add at least 1 onsite staff up to a maximum of 10.
                  </Text>
                )}
                <FormControl
                  isInvalid={attemptedSubmit && onsiteInfo[index].name === ""}
                >
                  <Input
                    h="37px"
                    value={onsiteInfo[index].name}
                    placeholder="Full Name"
                    onChange={(e) => {
                      onsiteInfo[index].name = e.target.value;
                      setOnsiteInfo([...onsiteInfo]);
                    }}
                  />
                </FormControl>
                <FormControl
                  isInvalid={attemptedSubmit && onsiteInfo[index].number === ""}
                >
                  <Input
                    h="37px"
                    type="tel"
                    value={onsiteInfo[index].number}
                    placeholder="Phone Number"
                    onChange={(e) => {
                      onsiteInfo[index].number = e.target.value;
                      setOnsiteInfo([...onsiteInfo]);
                    }}
                  />
                </FormControl>
                <FormControl
                  isInvalid={attemptedSubmit && onsiteInfo[index].email === ""}
                >
                  <Input
                    h="37px"
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
          <Flex flexDir="column" gap="24px">
            <Flex flexDir="column" gap="8px">
              <FormControl isRequired>
                <FormLabel variant="form-label-bold">
                  2. Additional onsite staff
                </FormLabel>
              </FormControl>
              <Text color="#69696B" variant="desktop-xs" mt="-12px">
                *Must add at least 1 onsite staff up to a maximum of 10.
              </Text>
            </Flex>
            <TableContainer border="1px solid #EDF2F7" borderRadius="8px">
              <Table>
                <Thead>
                  <Tr borderRadius="8px 8px 0 0" h="40px" background="#EDF2F7">
                    <Th
                      borderRadius="8px 0 0 0"
                      padding="0 12px 0 24px"
                      w="256px"
                      textTransform="none"
                    >
                      <Text color="black" variant="desktop-xs">
                        Full Name
                      </Text>
                    </Th>
                    <Th padding="0 12px" w="192px" textTransform="none">
                      <Text color="black" variant="desktop-xs">
                        Number
                      </Text>
                    </Th>
                    <Th padding="0 0 0 12px" textTransform="none">
                      <Text color="black" variant="desktop-xs">
                        Email
                      </Text>
                    </Th>
                    <Th w="48px" borderRadius="0 8px 0 0" />
                  </Tr>
                </Thead>

                <Tbody>
                  {onsiteInfo.map((info, index) => (
                    <Tr h="58px" key={index}>
                      <Td padding="0 12px 0 24px" gap="24px">
                        <FormControl
                          isInvalid={
                            attemptedSubmit && onsiteInfo[index].name === ""
                          }
                        >
                          <Input
                            h="37px"
                            value={onsiteInfo[index].name}
                            onChange={(e) => {
                              onsiteInfo[index].name = e.target.value;
                              setOnsiteInfo([...onsiteInfo]);
                            }}
                          />
                        </FormControl>
                      </Td>
                      <Td padding="0 12px">
                        <FormControl
                          isInvalid={
                            attemptedSubmit && onsiteInfo[index].number === ""
                          }
                        >
                          <Input
                            h="37px"
                            type="tel"
                            value={onsiteInfo[index].number}
                            onChange={(e) => {
                              onsiteInfo[index].number = e.target.value;
                              setOnsiteInfo([...onsiteInfo]);
                            }}
                          />
                        </FormControl>
                      </Td>
                      <Td padding="0 0 0 12px">
                        <FormControl
                          isInvalid={
                            attemptedSubmit && onsiteInfo[index].email === ""
                          }
                        >
                          <Input
                            h="37px"
                            value={onsiteInfo[index].email}
                            onChange={(e) => {
                              onsiteInfo[index].email = e.target.value;
                              setOnsiteInfo([...onsiteInfo]);
                            }}
                          />
                        </FormControl>
                      </Td>
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
                    },
                  ]);
                }}
              >
                + Add another contact
              </Text>
            )}
          </Flex>
        )}

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
              // const req = {
              //   role,
              //   email,
              //   organizationName,
              //   organizationAddress,
              //   contactName,
              //   contactNumber,
              //   contactEmail,
              //   onsiteInfo,
              // };
              // console.log(req);
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
