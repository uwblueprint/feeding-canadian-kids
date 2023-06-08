import { extendTheme } from "@chakra-ui/react";

import { Button, FormLabel, Input, Text , TextArea} from "./components";
import colors from "./foundations/colors";
import fontSizes from "./foundations/fontSizes";
import fonts from "./foundations/fonts";
import styles from "./styles";

const overrides = {
  ...styles,
  components: { Button, FormLabel, Input, Text, TextArea },
  colors,
  fonts,
  fontSizes,
  breakpoints: {
    sm: "36em",
    md: "56em",
  },
};

export default extendTheme(overrides);
