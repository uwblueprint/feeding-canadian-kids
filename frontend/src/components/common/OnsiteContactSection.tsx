/* eslint-disable no-param-reassign */
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Flex,
  FormControl,
  FormLabel,
  Input,
  Select,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import React from "react";

import { Contact, OnsiteContact, Role } from "../../types/UserTypes";
import { isValidEmail } from "../../utils/ValidationUtils";
import useIsWebView from "../../utils/useIsWebView";

const PLACEHOLDER_WEB_EXAMPLE_FULL_NAME = "Jane Doe";
const PLACEHOLDER_WEB_EXAMPLE_PHONE_NUMBER = "111-222-3333";
const PLACEHOLDER_WEB_EXAMPLE_EMAIL = "example@domain.com";

const PLACEHOLDER_MOBILE_EXAMPLE_FULL_NAME = "Full Name (Jane Doe)";
const PLACEHOLDER_MOBILE_EXAMPLE_EMAIL = "Email (example@domain.com)";
const PLACEHOLDER_MOBILE_EXAMPLE_PHONE_NUMBER = "Phone Number (111-222-3333)";

type OnsiteTextInputRowProps = {
  onsiteInfo: Array<Contact>;
  setOnsiteInfo: React.Dispatch<React.SetStateAction<Contact[]>>;
  index: number;
  attemptedSubmit: boolean;
  minimumRowCount?: number;
};

type OnsiteTextInputRowPropsWithMax = OnsiteTextInputRowProps & {
  maximumRowCount?: number;
  userRole?: Role;
};

const OnsiteTextInputRow = ({
  onsiteInfo,
  setOnsiteInfo,
  index,
  attemptedSubmit,
  minimumRowCount = 1,
}: OnsiteTextInputRowProps): React.ReactElement => (
  <Tr h="58px">
    <Td padding="0 12px 0 24px" gap="24px">
      <FormControl
        isRequired={index < minimumRowCount}
        isInvalid={attemptedSubmit && onsiteInfo[index].name === ""}
      >
        <Input
          h="37px"
          value={onsiteInfo[index].name}
          placeholder={PLACEHOLDER_WEB_EXAMPLE_FULL_NAME}
          onChange={(e) => {
            onsiteInfo[index].name = e.target.value;
            setOnsiteInfo([...onsiteInfo]);
          }}
        />
      </FormControl>
    </Td>
    <Td padding="0 12px">
      <FormControl
        isRequired={index < minimumRowCount}
        isInvalid={attemptedSubmit && onsiteInfo[index].phone === ""}
      >
        <Input
          h="37px"
          type="tel"
          value={onsiteInfo[index].phone}
          placeholder={PLACEHOLDER_WEB_EXAMPLE_PHONE_NUMBER}
          onChange={(e) => {
            onsiteInfo[index].phone = e.target.value;
            setOnsiteInfo([...onsiteInfo]);
          }}
        />
      </FormControl>
    </Td>
    <Td padding="0 0 0 12px">
      <FormControl
        isRequired={index < minimumRowCount}
        isInvalid={attemptedSubmit && !isValidEmail(onsiteInfo[index].email)}
      >
        <Input
          h="37px"
          type="email"
          value={onsiteInfo[index].email}
          placeholder={PLACEHOLDER_WEB_EXAMPLE_EMAIL}
          onChange={(e) => {
            onsiteInfo[index].email = e.target.value;
            setOnsiteInfo([...onsiteInfo]);
          }}
        />
      </FormControl>
    </Td>
    {onsiteInfo.length > minimumRowCount ? (
      <Td padding="0 4px">
        <DeleteIcon
          h="19.5px"
          w="100%"
          color="gray.gray300"
          cursor="pointer"
          _hover={{ color: "primary.blue" }}
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
);

const MobileOnsiteTextInputRow = ({
  onsiteInfo,
  setOnsiteInfo,
  index,
  userRole,
  attemptedSubmit,
  minimumRowCount = 1,
  maximumRowCount = 10,
}: OnsiteTextInputRowPropsWithMax): React.ReactElement => (
  <Flex flexDir="column" gap="8px" key={index}>
    <Flex flexDir="row" justifyContent="space-between">
      <FormControl isRequired={index < minimumRowCount}>
        <FormLabel variant="mobile-form-label-bold">
          {`Additional ${
            userRole === "Donor" ? "meal donor contact(s)" : "onsite staff"
          } (${index + 1})`}
        </FormLabel>
      </FormControl>
      {onsiteInfo.length > minimumRowCount && (
        <DeleteIcon
          h="16px"
          w="16px"
          color="gray.gray300"
          cursor="pointer"
          _hover={{ color: "primary.blue" }}
          onClick={() => {
            onsiteInfo.splice(index, 1);
            setOnsiteInfo([...onsiteInfo]);
          }}
        />
      )}
    </Flex>
    {index === 0 && (
      <Text color="text.subtitle" variant="desktop-xs" mt="-16px">
        *Must add at least {minimumRowCount}{" "}
        {userRole === "Donor" ? "meal donor contact(s)" : "onsite staff"}.
        Maximum is {maximumRowCount}.
      </Text>
    )}
    <FormControl
      isRequired={index < minimumRowCount}
      isInvalid={attemptedSubmit && onsiteInfo[index].name === ""}
    >
      <Input
        h="37px"
        variant="mobile-outline"
        value={onsiteInfo[index].name}
        placeholder={PLACEHOLDER_MOBILE_EXAMPLE_FULL_NAME}
        onChange={(e) => {
          onsiteInfo[index].name = e.target.value;
          setOnsiteInfo([...onsiteInfo]);
        }}
      />
    </FormControl>
    <FormControl
      isRequired={index < minimumRowCount}
      isInvalid={attemptedSubmit && onsiteInfo[index].phone === ""}
    >
      <Input
        h="37px"
        variant="mobile-outline"
        type="tel"
        value={onsiteInfo[index].phone}
        placeholder={PLACEHOLDER_MOBILE_EXAMPLE_PHONE_NUMBER}
        onChange={(e) => {
          onsiteInfo[index].phone = e.target.value;
          setOnsiteInfo([...onsiteInfo]);
        }}
      />
    </FormControl>
    <FormControl
      isRequired={index < minimumRowCount}
      isInvalid={attemptedSubmit && !isValidEmail(onsiteInfo[index].email)}
    >
      <Input
        h="37px"
        variant="mobile-outline"
        type="email"
        value={onsiteInfo[index].email}
        placeholder={PLACEHOLDER_MOBILE_EXAMPLE_EMAIL}
        onChange={(e) => {
          onsiteInfo[index].email = e.target.value;
          setOnsiteInfo([...onsiteInfo]);
        }}
      />
    </FormControl>
  </Flex>
);

type OnsiteContactDropdownProps = {
  onsiteInfo: Array<Contact>;
  setOnsiteInfo: React.Dispatch<React.SetStateAction<Contact[]>>;
  availableStaff: Array<Contact>;
  index: number;
  attemptedSubmit: boolean;
  minimumRowCount?: number;
};

type OnsiteContactDropdownPropsWithMax = OnsiteContactDropdownProps & {
  maximumRowCount?: number;
  userRole?: Role;
};

const OnsiteDropdownInputRow = ({
  onsiteInfo,
  setOnsiteInfo,
  availableStaff,
  index,
  attemptedSubmit,
  minimumRowCount = 1,
}: OnsiteContactDropdownProps): React.ReactElement => (
  // Choose the name from a dropdown of available staff, and then fill in the rest of the info based on that

  <Tr h="58px">
    <Td padding="0 12px 0 24px" gap="24px">
      <FormControl
        isRequired={index < minimumRowCount}
        isInvalid={
          attemptedSubmit &&
          (!onsiteInfo[index] || onsiteInfo[index].name === "")
        }
      >
        <Select
          h="37px"
          fontSize="xs"
          value={
            onsiteInfo[index]
              ? availableStaff.findIndex(
                  (staff) =>
                    staff.name === onsiteInfo[index].name &&
                    staff.phone === onsiteInfo[index].phone &&
                    staff.email === onsiteInfo[index].email,
                )
              : ""
          }
          placeholder="Select a staff member"
          onChange={(e) => {
            // Find available staff with this name, and fill in the rest of the info
            const staff = availableStaff[parseInt(e.target.value, 10)];
            onsiteInfo[index] = staff;
            setOnsiteInfo([...onsiteInfo]);
          }}
        >
          {availableStaff.map((staff, index2) => (
            <option key={index2} value={index2}>
              {staff.name}
            </option>
          ))}
        </Select>
      </FormControl>
    </Td>
    {/* display text for phone number and email */}
    <Td padding="0 12px">
      <Text>{onsiteInfo[index] ? onsiteInfo[index].phone : ""}</Text>
    </Td>
    <Td padding="0 0 0 12px">
      <Text>{onsiteInfo[index] ? onsiteInfo[index].email : ""}</Text>
    </Td>
    {onsiteInfo.length > minimumRowCount ? (
      <Td padding="0 4px">
        <DeleteIcon
          h="19.5px"
          w="100%"
          color="gray.gray300"
          cursor="pointer"
          _hover={{ color: "primary.blue" }}
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
);

const MobileOnsiteDropdownInputRow = ({
  onsiteInfo,
  setOnsiteInfo,
  availableStaff,
  index,
  userRole,
  attemptedSubmit,
  minimumRowCount = 1,
  maximumRowCount = 10,
}: OnsiteContactDropdownPropsWithMax): React.ReactElement => (
  <Flex flexDir="column" gap="8px" key={index}>
    <Flex flexDir="row" justifyContent="space-between">
      <FormControl isRequired={index < minimumRowCount}>
        <FormLabel variant="mobile-form-label-bold">
          {`Additional ${
            userRole === "Donor" ? "meal donor contact(s)" : "onsite staff"
          } (${index + 1})`}
        </FormLabel>
      </FormControl>
      {onsiteInfo.length > minimumRowCount && (
        <DeleteIcon
          h="16px"
          w="16px"
          color="gray.gray300"
          cursor="pointer"
          _hover={{ color: "primary.blue" }}
          onClick={() => {
            onsiteInfo.splice(index, 1);
            setOnsiteInfo([...onsiteInfo]);
          }}
        />
      )}
    </Flex>
    {index === 0 && (
      <Text color="text.subtitle" variant="desktop-xs" mt="-16px">
        *Must add at least {minimumRowCount}{" "}
        {userRole === "Donor" ? "meal donor contact(s)" : "onsite staff"}.
        Maximum is {maximumRowCount}.
      </Text>
    )}
    <FormControl
      isRequired={index < minimumRowCount}
      isInvalid={attemptedSubmit && onsiteInfo[index].name === ""}
    >
      <Select
        h="37px"
        variant="mobile-outline"
        fontSize="xs"
        borderColor="gray.gray300"
        borderWidth={1}
        value={
          onsiteInfo[index]
            ? availableStaff.findIndex(
                (staff) =>
                  staff.name === onsiteInfo[index].name &&
                  staff.phone === onsiteInfo[index].phone &&
                  staff.email === onsiteInfo[index].email,
              )
            : ""
        }
        placeholder="Select a staff member"
        onChange={(e) => {
          // Find available staff with this name, and fill in the rest of the info
          const staff = availableStaff[parseInt(e.target.value, 10)];
          onsiteInfo[index] = staff;
          setOnsiteInfo([...onsiteInfo]);
        }}
      >
        {availableStaff.map((staff, index2) => (
          <option key={index2} value={index2}>
            {staff.name}
          </option>
        ))}
      </Select>
    </FormControl>
    {/* display text for phone number and email */}

    <Text>{onsiteInfo[index] ? onsiteInfo[index].phone : ""}</Text>
    <Text>{onsiteInfo[index] ? onsiteInfo[index].email : ""}</Text>
  </Flex>
);

type OnsiteContactSectionProps = {
  onsiteInfo: Array<OnsiteContact>;
  setOnsiteInfo: React.Dispatch<React.SetStateAction<OnsiteContact[]>>;
  attemptedSubmit: boolean;
  userRole: Role;
  availableStaff?: Array<OnsiteContact>;
  dropdown?: boolean;
  minimumRowCount?: number;
  maximumRowCount?: number;
};

const OnsiteContactSection = ({
  onsiteInfo,
  setOnsiteInfo,
  attemptedSubmit,
  userRole,
  availableStaff = [],
  dropdown = false,
  minimumRowCount = 1,
  maximumRowCount = 10,
}: OnsiteContactSectionProps): React.ReactElement => {
  const isWebView = useIsWebView();
  const roleLabel =
    userRole === "Donor" ? "meal donor contact(s)" : "onsite staff";

  if (isWebView) {
    return (
      <Flex flexDir="column" gap="24px">
        <Flex flexDir="column" gap="8px">
          <FormControl isRequired={minimumRowCount > 0}>
            <FormLabel variant="form-label-bold">
              {dropdown ? `Select ${roleLabel}` : `Additional ${roleLabel}`}{" "}
            </FormLabel>
          </FormControl>
          {minimumRowCount > 0 ? (
            <Text color="text.subtitle" variant="desktop-xs" mt="-12px">
              *Must add at least {minimumRowCount} {roleLabel}. Maximum is{" "}
              {maximumRowCount} {roleLabel}.
            </Text>
          ) : (
            <Text color="text.subtitle" variant="desktop-xs" mt="-12px">
              *Maximum is {maximumRowCount} {roleLabel}.
            </Text>
          )}
        </Flex>
        <TableContainer border="1px solid #EDF2F7" borderRadius="8px">
          <Table>
            <Thead>
              <Tr
                borderRadius="8px 8px 0 0"
                h="40px"
                background="primary.lightblue"
              >
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
                <Th padding="0 12px" w="200px" textTransform="none">
                  <Text color="black" variant="desktop-xs">
                    Phone Number
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
              {onsiteInfo.map((info, index) =>
                dropdown ? (
                  <OnsiteDropdownInputRow
                    key={index}
                    onsiteInfo={onsiteInfo}
                    setOnsiteInfo={setOnsiteInfo}
                    availableStaff={
                      /* Remove previously selected staff from dropdown */
                      availableStaff.filter(
                        (staff) =>
                          !onsiteInfo
                            .slice(0, index)
                            .concat(onsiteInfo.slice(index + 1))
                            .some(
                              (prevStaff) =>
                                prevStaff &&
                                prevStaff.name === staff.name &&
                                prevStaff.phone === staff.phone &&
                                prevStaff.email === staff.email,
                            ),
                      )
                    }
                    index={index}
                    attemptedSubmit={attemptedSubmit}
                    minimumRowCount={minimumRowCount}
                  />
                ) : (
                  <OnsiteTextInputRow
                    key={index}
                    onsiteInfo={onsiteInfo}
                    setOnsiteInfo={setOnsiteInfo}
                    index={index}
                    attemptedSubmit={attemptedSubmit}
                    minimumRowCount={minimumRowCount}
                  />
                ),
              )}
            </Tbody>
          </Table>
        </TableContainer>
        {onsiteInfo.length < maximumRowCount && (
          <Text
            variant="desktop-button-bold"
            color="primary.blue"
            cursor="pointer"
            w="fit-content"
            onClick={() => {
              setOnsiteInfo([
                ...onsiteInfo,
                {
                  name: "",
                  phone: "",
                  email: "",
                },
              ]);
            }}
          >
            + Add another contact
          </Text>
        )}
      </Flex>
    );
  }

  return (
    <Flex flexDir="column" gap="20px">
      {/* {showCreateModal ? <CreateMeal} */}
      {onsiteInfo.map((info, index) =>
        dropdown ? (
          <MobileOnsiteDropdownInputRow
            key={index}
            onsiteInfo={onsiteInfo}
            setOnsiteInfo={setOnsiteInfo}
            userRole={userRole}
            availableStaff={
              /* Remove previously selected staff from dropdown */
              availableStaff.filter(
                (staff) =>
                  !onsiteInfo
                    .slice(0, index)
                    .concat(onsiteInfo.slice(index + 1))
                    .some(
                      (prevStaff) =>
                        prevStaff &&
                        prevStaff.name === staff.name &&
                        prevStaff.phone === staff.phone &&
                        prevStaff.email === staff.email,
                    ),
              )
            }
            index={index}
            attemptedSubmit={attemptedSubmit}
            minimumRowCount={minimumRowCount}
          />
        ) : (
          <MobileOnsiteTextInputRow
            key={index}
            onsiteInfo={onsiteInfo}
            setOnsiteInfo={setOnsiteInfo}
            index={index}
            userRole={userRole}
            attemptedSubmit={attemptedSubmit}
            minimumRowCount={minimumRowCount}
          />
        ),
      )}
      {onsiteInfo.length < maximumRowCount && (
        <Text
          variant="mobile-body-bold"
          color="primary.blue"
          cursor="pointer"
          w="fit-content"
          onClick={() => {
            setOnsiteInfo([
              ...onsiteInfo,
              {
                name: "",
                phone: "",
                email: "",
              },
            ]);
          }}
        >
          + Add another contact
        </Text>
      )}
    </Flex>
  );
};

export default OnsiteContactSection;
