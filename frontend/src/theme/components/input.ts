const Input = {
  baseStyle: {},
  sizes: {},
  variants: {
    outline: {
      field: {
        _invalid: {
          borderColor: "secondary.critical !important",
          boxShadow:
            "0 0 0 1px var(--chakra-colors-secondary-critical) !important",
        },
        color: "text.default",
        borderWidth: "2px",
        bg: "background.white",
        padding: "12px",
        borderRadius: "4px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: "16px",
        lineHeight: "27px",
      },
    },
    "mobile-outline": {
      field: {
        _invalid: {
          borderColor: "secondary.critical",
        },
        color: "text.default",
        borderWidth: "2px",
        bg: "background.white",
        padding: "12px",
        borderRadius: "4px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: "14px",
        lineHeight: "21px",
      },
    },
  },
  defaultProps: { variant: "outline" },
};

export default Input;
