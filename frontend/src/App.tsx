import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { BrowserRouter as Router } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { theme } from "./theme";

import AppRoutes from "./components/AppRoutes";
import { FirebaseMessaging } from "./components/FirebaseMessaging";
import { GlobalModalProvider } from "./contexts/GlobalModalContext";
import { TeamProvider } from "./contexts/TeamContext";

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <HelmetProvider>
        <Router>
          <GlobalModalProvider>
            <TeamProvider>
              <FirebaseMessaging />
              <AppRoutes />
            </TeamProvider>
          </GlobalModalProvider>
        </Router>
      </HelmetProvider>
    </ChakraProvider>
  );
};

export default App;
