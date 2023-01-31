const Input = {
  baseStyle: {},
  sizes: {},
  variants: {
    outline: {
      field: {
        errorBorderColor: "secondary.critical",
        color: "text.default",
        borderWidth: "1px",
        bg: "background.white",
        padding: "12px",
        borderRadius: "4px",
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: "400",
        fontSize: "14px",
        lineHeight: "27px",
      },
    },
  },
  defaultProps: { variant: "outline" },
};

export default Input;
