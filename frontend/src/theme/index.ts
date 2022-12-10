import { extendTheme } from "@chakra-ui/react";

import { Button, Input, Text } from "./components";
import colors from "./foundations/colors";
import fontSizes from "./foundations/fontSizes";
import fonts from "./foundations/fonts";
import styles from "./styles";

const overrides = {
  ...styles,
  components: { Button, Input, Text },
  colors,
  fonts,
  fontSizes,
  breakpoints: {
    sm: "36em",
    md: "56em",
  },
};

export default extendTheme(overrides);
