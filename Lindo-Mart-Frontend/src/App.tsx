import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import { FormsProvider } from "./context/FormsContext";
import { useAuth } from "./context/AuthContext";
import { UsersProvider } from "@/context/UsersContext";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import DashboardPage from "./pages/DashboardPage";
import FormsListPage from "./pages/FormsListPage";
import FormDetailPage from "./pages/FormDetailPage";
import NewFormPage from "./pages/NewFormPage";
import NotFound from "./pages/NotFound";
import { AdminLayout } from "./components/layouts/AdminLayout";
import AdminDashboardPage from "./pages/admin/DashboardPage";
import ProfileAdmin from "./pages/admin/Profile";
import UserProfilePage from "./pages/UserProfile";
import ReceivedFormsPage from "./pages/admin/ReceivedFormsPage";
import MovedFormsPage from "./pages/admin/MovedFormsPage";
import FormDetailPageAdmin from "./pages/admin/FormDetailPageAdmin";
import UserRolesPage from "./pages/admin/UserRolesPage";

const queryClient = new QueryClient();

// Protected route component that redirects admin users to admin dashboard
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect admin, supervisor, and management users to admin dashboard
  if (
    user?.role === "Super-Admin" ||
    user?.role === "Supervisor" ||
    user?.role === "Management"
  ) {
    return <Navigate to="/admin" replace />;
  }

  return <FormsProvider>{children}</FormsProvider>;
};

// Admin route component
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Allow access for admin, supervisor, and management roles
  if (
    user?.role !== "Super-Admin" &&
    user?.role !== "Supervisor" &&
    user?.role !== "Management"
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Public route component that redirects authenticated users to their appropriate dashboard
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (
      user?.role === "Super-Admin" ||
      user?.role === "Supervisor" ||
      user?.role === "Management"
    ) {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

// Application component with routes
const AppWithRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route
        path="/"
        element={
          <PublicRoute>
            <HomePage />
          </PublicRoute>
        }
      />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route
        path="/login"
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      <Route
        path="/signup"
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* Protected User Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/user/profile"
        element={
          <ProtectedRoute>
            <UserProfilePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/forms"
        element={
          <ProtectedRoute>
            <FormsListPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forms/new"
        element={
          <ProtectedRoute>
            <NewFormPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/forms/:id"
        element={
          <ProtectedRoute>
            <FormDetailPage />
          </ProtectedRoute>
        }
      />

      {/* Admin Routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route index element={<AdminDashboardPage />} />
        <Route path="settings" element={<ProfileAdmin />} />
        <Route path="received-forms" element={<ReceivedFormsPage />} />
        <Route path="moved-forms" element={<MovedFormsPage />} />
        <Route
          path="received-forms/:formId"
          element={<FormDetailPageAdmin />}
        />
        <Route path="users" element={<UserRolesPage />} />
      </Route>

      {/* 404 Not Found - Redirect to appropriate dashboard if authenticated */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

// Main App component
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <UsersProvider>
            <NotificationProvider>
              <FormsProvider>
                <AppWithRoutes />
              </FormsProvider>
            </NotificationProvider>
          </UsersProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
