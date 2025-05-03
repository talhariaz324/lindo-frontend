import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

const LoginPage = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await login(username, password);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const setDemoCredentials = (type: "admin" | "manager" | "user") => {
    switch (type) {
      case "admin":
        setUsername("talhariaz324");
        setPassword("Shortcut123");
        break;
      case "manager":
        setUsername("testtech129");
        setPassword("Shortcut123");
        break;
      case "user":
        setUsername("test-person");
        setPassword("Shortcut123");
        break;
    }
  };

  return (
    <div className="container relative hidden min-h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0 bg-zinc-900">
          <img
            src="/auth-bg.webp"
            alt="Login background"
            className="object-cover w-full h-full opacity-50"
          />
        </div>
        <div className="relative z-20 flex items-center text-lg font-medium">
          {/* <img src="/logo.png" alt="Logo" className="h-8 w-auto mr-2" /> */}
          Lindo Mart
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              "Streamline your workflow with our intuitive form management
              system. Efficiently handle inventory, equipment, and customer
              feedback all in one place."
            </p>
            <footer className="text-sm">Lindo Mart Management</footer>
          </blockquote>
        </div>
      </div>
      <div className="lg:p-8">
        <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
          <div className="flex flex-col space-y-2 text-center">
            <h1 className="text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="text-sm text-muted-foreground">
              Enter your credentials to access your account
            </p>
          </div>

          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="demo">Demo Accounts</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              <div className={cn("grid gap-6")}>
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="p-3 bg-red-100 border border-red-200 text-red-700 rounded-md text-sm">
                      {error}
                    </div>
                  )}
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <label
                        htmlFor="username"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Username
                      </label>
                      <Input
                        id="username"
                        placeholder="Enter your username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        disabled={isLoading}
                        className="border-input bg-background"
                        required
                      />
                    </div>
                    <div className="grid gap-2">
                      <label
                        htmlFor="password"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Password
                      </label>
                      <Input
                        id="password"
                        placeholder="Enter your password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isLoading}
                        className="border-input bg-background"
                        required
                      />
                    </div>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Signing in..." : "Sign In"}
                    </Button>
                  </div>
                </form>
              </div>
            </TabsContent>

            <TabsContent value="demo" className="space-y-4">
              <div className="grid gap-4">
                <div className="rounded-lg border p-3">
                  <h3 className="font-semibold mb-2">Super Admin Account</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Full access to all features and forms
                  </p>
                  <div className="text-sm mb-2">
                    <p>Username: admin</p>
                    <p>Password: admin123</p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => setDemoCredentials("admin")}
                  >
                    Use These Credentials
                  </Button>
                </div>
                <div className="rounded-lg border p-3">
                  <h3 className="font-semibold mb-2">Admin Account</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Access to assigned forms and management
                  </p>
                  <div className="text-sm mb-2">
                    <p>Username: manager</p>
                    <p>Password: manager123</p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => setDemoCredentials("manager")}
                  >
                    Use These Credentials
                  </Button>
                </div>
                <div className="rounded-lg border p-3">
                  <h3 className="font-semibold mb-2">User Account</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Regular user access for form submissions
                  </p>
                  <div className="text-sm mb-2">
                    <p>Username: user</p>
                    <p>Password: user123</p>
                  </div>
                  <Button
                    className="w-full"
                    onClick={() => setDemoCredentials("user")}
                  >
                    Use These Credentials
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <p className="px-8 text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
