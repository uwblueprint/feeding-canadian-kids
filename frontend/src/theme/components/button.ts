const Button = {
  baseStyle: {
    /* Base style doesn't work properly for buttons :/ */
  },
  sizes: {
    lg: {
      fontSize: "body",
      borderRadius: "md",
      height: "2.5rem",
      pl: "1rem",
      pr: "1rem",
    },
  },
  variants: {
    default: {
      bg: "primary.green",
      color: "text.white",
      "&[disabled]": {
        _hover: { bg: "primary.green" },
      },
      _hover: {
        bg: "primary.darkgreen",
      },
    },
    outline: {
      borderWidth: "1px",
      borderColor: "primary.green",
      color: "primary.green",
      _hover: {
        bg: "background.interactive",
      },
    },
    ghost: {
      color: "primary.green",
      _hover: {
        bg: "background.interactive",
      },
    },
    link: {
      color: "primary.green",
    },
    "desktop-button-bold": {
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: "700",
      fontSize: "18px",
      lineHeight: "24px",
    },
    "mobile-button-bold": {
      fontFamily: "Inter",
      fontStyle: "normal",
      fontWeight: "700",
      fontSize: "14px",
      lineHeight: "24px",
    },
  },
  defaultProps: {
    variant: "default",
    size: "lg",
  },
};

export default Button;
