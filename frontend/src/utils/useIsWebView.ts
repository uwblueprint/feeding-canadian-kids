import { useMediaQuery } from "@chakra-ui/react";

const useIsWebView = (): boolean => {
  const [isWebView] = useMediaQuery("(min-width: 62em)");
  return isWebView;
};

export default useIsWebView;
