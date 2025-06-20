import React from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { theme } from "./theme";
import { CampaignsDashboard } from "./features/campaigns/CampaignDashboard";
import { AppHeader } from "./components/AppHeader";
import { CampaignView } from "./features/campaigns/CampaignView";

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <AppHeader />
        <Box p={4}>
          <Routes>
            <Route path="/campaigns" element={<CampaignsDashboard />} />
            <Route path="/campaigns/:campaignId" element={<CampaignView />} />
            <Route path="/" element={<CampaignsDashboard />} />
          </Routes>
        </Box>
      </Router>
    </ChakraProvider>
  );
};

export default App;
