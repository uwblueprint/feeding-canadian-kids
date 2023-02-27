// returns true if string is a valid email
export const isValidEmail = (emailStr: string): boolean => {
  const emailRegex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return emailRegex.test(emailStr.toLowerCase());
};

// replaces all consecutive white spaces with single space then trims
export const trimWhiteSpace = (s: string): string => {
  return s.replace(/\s+/g, " ").trim();
};
