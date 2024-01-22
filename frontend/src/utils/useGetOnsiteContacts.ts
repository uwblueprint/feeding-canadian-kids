import { useMediaQuery } from "@chakra-ui/react";

const useGetOnsiteContacts = (): boolean => {
  const [isWebView] = useMediaQuery("(min-width: 62em)");
  return isWebView;
};

export default useGetOnsiteContacts;
