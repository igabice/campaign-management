import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  colors: {
    primary: {
      500: "#F9D71C",
    },
  },
  styles: {
    global: {
      body: {
        bg: "gray.900",
        color: "whiteAlpha.900",
      },
    },
  },
  components: {
    Button: {
      variants: {
        primary: {
          bg: "#F9D71C",
          color: "black",
          _hover: {
            bg: "#F9D71C",
            opacity: 0.8,
          },
          _active: {
            bg: "#F9D71C",
          },
        },
      },
    },
  },
});
