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
};

const components = {
  Button: {
    baseStyle: {
      fontWeight: "600",
    },
    variants: {
      solid: {
        bg: "brand.500",
        color: "white",
        _hover: {
          bg: "brand.600",
        },
      },
    },
  },
};

export const theme = extendTheme({
  colors,
  components,
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
});