import React from "react";
import { ChakraProvider, Box } from "@chakra-ui/react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { theme } from "./theme";
import { CampaignsDashboard } from "./features/campaigns/CampaignDashboard";
import { AppHeader } from "./components/AppHeader";
import { CampaignView } from "./features/campaigns/CampaignView";
import { LoginPage } from "./features/auth/LoginPage";
import { SignupPage } from "./features/auth/SignupPage";
import { ForgotPasswordPage } from "./features/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "./features/auth/ResetPasswordPage";
import { VerifyEmailPage } from "./features/auth/VerifyEmailPage";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import { Dashboard } from "./features/dashboard/Dashboard";

const App = () => {
  return (
    <ChakraProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<><AppHeader /><Dashboard /></>} />
            <Route path="/campaigns" element={<><AppHeader /><Box p={4}><CampaignsDashboard /></Box></>} />
            <Route path="/campaigns/:campaignId" element={<><AppHeader /><Box p={4}><CampaignView /></Box></>} />
            <Route path="/" element={<><AppHeader /><Dashboard /></>} />
          </Route>
        </Routes>
      </Router>
    </ChakraProvider>
  );
};

export default App;
