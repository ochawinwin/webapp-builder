import { createBrowserRouter } from "react-router";
import { RootLayout } from "./components/layout/RootLayout";
import { LandingPage } from "./pages/LandingPage";
import { CandidateLogin } from "./pages/auth/CandidateLogin";
import { CandidateRegister } from "./pages/auth/CandidateRegister";
import { HRLogin } from "./pages/auth/HRLogin";
import { HRRegister } from "./pages/auth/HRRegister";
import { JobSearch } from "./pages/JobSearch";
import { JobDetail } from "./pages/JobDetail";
import { CandidateProfile } from "./pages/CandidateProfile";
import { HRDashboard } from "./pages/hr/HRDashboard";
import { JobManagement } from "./pages/hr/JobManagement";
import { ATSBoard } from "./pages/hr/ATSBoard";
import { CompanyProfileSettings } from "./pages/hr/CompanyProfileSettings";
import { FeedManagement } from "./pages/hr/FeedManagement";
import { TeamManagement } from "./pages/hr/TeamManagement";
import { CompanyPublicProfile } from "./pages/CompanyPublicProfile";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: RootLayout,
    children: [
      { index: true, Component: LandingPage },
      { path: "login", Component: CandidateLogin },
      { path: "register", Component: CandidateRegister },
      { path: "hr/login", Component: HRLogin },
      { path: "hr/register", Component: HRRegister },
      { path: "search", Component: JobSearch },
      { path: "jobs/:id", Component: JobDetail },
      { path: "profile", Component: CandidateProfile },
      { path: "company/:id", Component: CompanyPublicProfile },
      {
        path: "hr",
        children: [
          { path: "dashboard", Component: HRDashboard },
          { path: "jobs", Component: JobManagement },
          { path: "ats/:id", Component: ATSBoard },
          { path: "profile", Component: CompanyProfileSettings },
          { path: "feed", Component: FeedManagement },
          { path: "team", Component: TeamManagement },
        ],
      },
      { path: "*", Component: NotFound },
    ],
  },
]);
