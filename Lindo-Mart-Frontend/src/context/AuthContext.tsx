import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { api } from "@/services/api";

interface User {
  _id: string;
  username: string;
  email: string;
  phoneNumber: string;
  role: string;
  movedForms?: Array<{
    formId: string;
    recipientId: string;
    _id: string;
  }>;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (
    username: string,
    email: string,
    phoneNumber: string,
    password: string
  ) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Check for existing session on mount
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      // You might want to verify the token with the backend here
      // For now, we'll just keep the user logged in if token exists
      setUser(JSON.parse(localStorage.getItem("user") || "null"));
    }
  }, []);

  const login = async (username: string, password: string) => {
    try {
      const { data } = await api.post("/auth/login", {
        username,
        password,
      });

      // Validate the response data
      if (!data.access_token || !data.user) {
        throw new Error("Invalid response from server");
      }

      // Store only the token in localStorage
      localStorage.setItem("auth_token", data.access_token);
      // Store user data in state and localStorage for persistence
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));

      // Check user role and redirect accordingly
      if (data.user.role === "Admin") {
        toast.success("Welcome back, Admin!");
        navigate("/admin");
      } else {
        toast.success("Successfully logged in!");
        navigate("/dashboard");
      }
    } catch (error: any) {
      // Clear any existing auth data
      localStorage.removeItem("auth_token");
      localStorage.removeItem("user");
      setUser(null);

      // Handle specific error messages
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Invalid username or password";
      toast.error(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const signup = async (
    username: string,
    email: string,
    phoneNumber: string,
    password: string
  ) => {
    try {
      const { data } = await api.post("/auth/register", {
        username,
        email,
        phoneNumber,
        password,
      });

      // After successful registration, log the user in
      await login(username, password);

      toast.success("Account created successfully!");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Registration failed";
      toast.error(errorMessage);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    toast.info("You have been logged out");
    navigate("/login");
  };

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isAdmin: !!user && user.role === "Admin",
    login,
    signup,
    logout,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
