import { OnsiteContact } from "../types/UserTypes";

// returns true if string is a valid email
export const isValidEmail = (emailStr: string): boolean => {
  const emailRegex =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return emailRegex.test(emailStr.toLowerCase());
};

// replaces all consecutive white spaces with single space then trims
export const trimWhiteSpace = (s: string): string =>
  s.replace(/\s+/g, " ").trim();

// returns true if string is a valid non-negative integer
export const isNonNegativeInt = (s: string): boolean => {
  const parsedInt = parseInt(trimWhiteSpace(s), 10);
  if (Number.isNaN(parsedInt) || parsedInt < 0) return false;
  return true;
};

export const onsiteContactsDiffer = (
  contact1: OnsiteContact,
  contact2: OnsiteContact,
): boolean =>
  contact1.id !== contact2.id ||
  contact1.name !== contact2.name ||
  contact1.phone !== contact2.phone ||
  contact1.email !== contact2.email;
