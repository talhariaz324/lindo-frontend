import { RouteObject } from "react-router-dom";
import { AdminLayout } from "@/components/layouts/AdminLayout";
import DashboardPage from "@/pages/admin/DashboardPage";
import ProfileSettingsPage from "@/pages/admin/ProfileSettings";
import App from "@/App";

export const routes: RouteObject[] = [
  {
    path: "/",
    element: <App />,
  },
  {
    path: "admin",
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "settings",
        element: <ProfileSettingsPage />,
      },
      // Add more admin routes as needed
    ],
  },
];
