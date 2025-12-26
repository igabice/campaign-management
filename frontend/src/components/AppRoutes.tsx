import React from "react";
import { Route, Routes } from "react-router-dom";

import { LoginPage } from "../features/auth/LoginPage";
import { SignupPage } from "../features/auth/SignupPage";
import { ForgotPasswordPage } from "../features/auth/ForgotPasswordPage";
import { ResetPasswordPage } from "../features/auth/ResetPasswordPage";
import { VerifyEmailPage } from "../features/auth/VerifyEmailPage";
import { InviteResponsePage } from "../features/auth/InviteResponsePage";
import { ProtectedRoute } from "../features/auth/ProtectedRoute";
import { Dashboard } from "../features/dashboard/Dashboard";
import { CalendarPage } from "../features/calendar/CalendarPage";
import { TeamPage } from "../features/team/TeamPage";
import { ContentPlannerPage } from "../features/contentPlanner/ContentPlannerPage";
import { CreatePlanPage } from "../features/contentPlanner/CreatePlanPage";
import { PreviewPlanPage } from "../features/contentPlanner/PreviewPlanPage";
import { DraftPlanPage } from "../features/contentPlanner/DraftPlanPage";
import { PlanDetailsPage } from "../features/contentPlanner/PlanDetailsPage";
import { HomePage } from "../features/home/HomePage";
import { MainLayout } from "./MainLayout";
import { LandingOrDashboard } from "./LandingOrDashboard";
import { NotificationsPage } from "../features/notifications/NotificationsPage";
import SubscriptionPage from "../features/subscription/SubscriptionPage";
import UserPreferencePage from "../features/userPreferences/UserPreferencePage";
import OnboardingPage from "../features/onboarding/OnboardingPage";
import { PrivacyPage } from "../features/legal/PrivacyPage";
import { TermsPage } from "../features/legal/TermsPage";
import { ContactPage } from "../features/legal/ContactPage";
import { BlogListPage } from "../features/blog/BlogListPage";
import { BlogCreatePage } from "../features/blog/BlogCreatePage";
import { BlogDetailPage } from "../features/blog/BlogDetailPage";
import { BlogManagementPage } from "../features/blog/BlogManagementPage";
import { BlogEditPage } from "../features/blog/BlogEditPage";
import { BlogLayout } from "./BlogLayout";
import { ApprovalCenter } from "./ApprovalCenter";

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingOrDashboard />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route
        path="/forgot-password"
        element={<ForgotPasswordPage />}
      />
      <Route path="/reset-password" element={<ResetPasswordPage />} />
      <Route path="/verify-email" element={<VerifyEmailPage />} />
      <Route
        path="/invites/:inviteId"
        element={<InviteResponsePage />}
      />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route
        path="/blog"
        element={
          <BlogLayout>
            <BlogListPage />
          </BlogLayout>
        }
      />
      <Route
        path="/blog/create"
        element={
          <MainLayout>
            <BlogCreatePage />
          </MainLayout>
        }
      />
      <Route
        path="/blog/:slug"
        element={
          <BlogLayout>
            <BlogDetailPage />
          </BlogLayout>
        }
      />
      <Route element={<ProtectedRoute />}>
        <Route
          path="/dashboard"
          element={
            <MainLayout>
              <Dashboard />
            </MainLayout>
          }
        />
        <Route
          path="/calendar"
          element={
            <MainLayout>
              <CalendarPage />
            </MainLayout>
          }
        />
        <Route
          path="/team"
          element={
            <MainLayout>
              <TeamPage />
            </MainLayout>
          }
        />
        <Route
          path="/content-planner"
          element={
            <MainLayout>
              <ContentPlannerPage />
            </MainLayout>
          }
        />
        <Route
          path="/content-planner/create"
          element={
            <MainLayout>
              <CreatePlanPage />
            </MainLayout>
          }
        />
        <Route
          path="/content-planner/preview"
          element={
            <MainLayout>
              <PreviewPlanPage />
            </MainLayout>
          }
        />
        <Route
          path="/content-planner/draft/:id"
          element={
            <MainLayout>
              <DraftPlanPage />
            </MainLayout>
          }
        />
        <Route
          path="/content-planner/:planId"
          element={
            <MainLayout>
              <PlanDetailsPage />
            </MainLayout>
          }
        />
        <Route
          path="/notifications"
          element={
            <MainLayout>
              <NotificationsPage />
            </MainLayout>
          }
        />
        <Route
          path="/approvals"
          element={
            <MainLayout>
              <ApprovalCenter />
            </MainLayout>
          }
        />
        <Route
          path="/subscription"
          element={
            <MainLayout>
              <SubscriptionPage />
            </MainLayout>
          }
        />
        <Route
          path="/preferences"
          element={
            <MainLayout>
              <UserPreferencePage />
            </MainLayout>
          }
        />
        <Route
          path="/blog-management"
          element={
            <MainLayout>
              <BlogManagementPage />
            </MainLayout>
          }
        />
        <Route
          path="/blog/edit/:id"
          element={
            <MainLayout>
              <BlogEditPage />
            </MainLayout>
          }
        />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;