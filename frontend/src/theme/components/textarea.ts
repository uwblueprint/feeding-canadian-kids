const TextArea = {
    baseStyle: {},
    sizes: {},
    variants: {
      outline: {
        field: {
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
  
  export default TextArea;