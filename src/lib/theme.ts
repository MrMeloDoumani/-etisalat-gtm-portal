import { extendTheme } from "@chakra-ui/react";

const colors = {
  brand: {
    50: "#ffe5e7",
    100: "#ffb3b8",
    200: "#ff8089",
    300: "#ff4d5a",
    400: "#ff1a2b",
    500: "#E30613", // Primary e& red
    600: "#cc0511",
    700: "#b3040f",
    800: "#99030d",
    900: "#80020b",
  },
  gray: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
  },
};

const fonts = {
  heading: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
  body: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: "600",
      borderRadius: "md",
    },
    variants: {
      solid: {
        bg: "brand.500",
        color: "white",
        _hover: {
          bg: "brand.600",
        },
        _active: {
          bg: "brand.700",
        },
      },
      outline: {
        borderColor: "brand.500",
        color: "brand.500",
        _hover: {
          bg: "brand.50",
        },
      },
      ghost: {
        color: "brand.500",
        _hover: {
          bg: "brand.50",
        },
      },
    },
    defaultProps: {
      variant: "solid",
    },
  },
  Card: {
    baseStyle: {
      container: {
        bg: "white",
        boxShadow: "md",
        borderRadius: "lg",
        border: "1px solid",
        borderColor: "gray.200",
        _hover: {
          boxShadow: "lg",
          borderColor: "brand.200",
        },
      },
    },
  },
  Heading: {
    baseStyle: {
      color: "gray.800",
    },
    variants: {
      brand: {
        color: "brand.500",
      },
    },
  },
  Text: {
    baseStyle: {
      color: "gray.700",
    },
  },
  Input: {
    variants: {
      outline: {
        field: {
          borderColor: "gray.300",
          _hover: {
            borderColor: "brand.300",
          },
          _focus: {
            borderColor: "brand.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
          },
        },
      },
    },
    defaultProps: {
      variant: "outline",
    },
  },
};

const styles = {
  global: {
    body: {
      bg: "white",
      color: "gray.800",
    },
    "*::placeholder": {
      color: "gray.400",
    },
    "*, *::before, &::after": {
      borderColor: "gray.200",
    },
  },
};

export const theme = extendTheme({
  colors,
  fonts,
  components,
  styles,
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});
