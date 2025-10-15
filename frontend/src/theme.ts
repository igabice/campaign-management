import { extendTheme } from '@chakra-ui/react';

export const theme = extendTheme({
  config: {
    initialColorMode: "light",
    useSystemColorMode: false,
  },
  fonts: {
    heading: `'Chirp', sans-serif`,
    body: `'Chirp', sans-serif`,
  },
  colors: {
    primary: {
      500: "#F9D71C",
    },
  },
  styles: {
    global: (props: { colorMode: 'light' | 'dark' }) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.900" : "white",
        color: props.colorMode === "dark" ? "whiteAlpha.900" : "gray.800",
        fontSize: "115%",
      },
    }),
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
