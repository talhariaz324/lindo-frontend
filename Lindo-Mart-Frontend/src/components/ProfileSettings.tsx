import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/use-toast";
import { User, Mail, Lock, FileText, Bell } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useEffect } from "react";
import api from "@/services/api";

interface ProfileSettingsProps {
  onSubmit: (data: ProfileFormValues) => Promise<void>;
  defaultValues?: Partial<ProfileFormValues>;
  showPasswordFields?: boolean;
  isAdmin?: boolean;
}

const profileFormSchema = z
  .object({
    username: z
      .string()
      .min(2, {
        message: "Username must be at least 2 characters.",
      })
      .max(30, {
        message: "Username must not be longer than 30 characters.",
      }),
    email: z
      .string()
      .min(1, { message: "This field is required" })
      .email("This is not a valid email"),
    currentPassword: z
      .string()
      .min(1, { message: "Current password is required" }),
    newPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
    bio: z.string().max(160).min(4),
    notifications: z.boolean().default(true),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.confirmPassword) {
        return data.newPassword === data.confirmPassword;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    }
  );

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileSettings({
  onSubmit,
  defaultValues = {
    bio: "",
    notifications: true,
  },
  showPasswordFields = true,
  isAdmin = false,
}: ProfileSettingsProps) {
  const { user } = useAuth();
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      ...defaultValues,
      username: user?.username || "",
      email: user?.email || "",
    },
    mode: "onChange",
  });

  // Update form when user data changes
  useEffect(() => {
    if (user) {
      form.setValue("username", user.username || "");
      form.setValue("email", user.email || "");
    }
  }, [user, form]);

  const handleSubmit = async (data: ProfileFormValues) => {
    try {
      // Only handle password change if both passwords are provided
      if (data.currentPassword && data.newPassword) {
        const response = await api.post("/auth/reset-password", {
          oldPassword: data.currentPassword,
          newPassword: data.newPassword,
        });

        toast({
          title: "Success",
          description: response.data.message || "Password updated successfully",
        });

        // Reset password fields
        form.reset({
          ...form.getValues(),
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
      }
    } catch (error: any) {
      console.error("Password change error:", error);
      toast({
        title: "Error",
        description:
          error.response?.data?.message || "Failed to update password",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="space-y-0.5 text-center mb-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">
          Profile Settings
        </h2>
        <p className="text-muted-foreground text-gray-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid gap-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-500" />
                  Basic Information
                </CardTitle>
                <CardDescription>
                  Your public profile information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="pl-10"
                            placeholder="Your username"
                            {...field}
                            disabled
                          />
                          <User className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Your username cannot be changed
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            className="pl-10"
                            placeholder="Your email"
                            type="email"
                            {...field}
                            disabled
                          />
                          <Mail className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Contact support to change your email address
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            className="min-h-[50px] pl-10 "
                            placeholder="Tell us about yourself"
                            {...field}
                          />
                          <FileText className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                        </div>
                      </FormControl>
                      <FormDescription>
                        Brief description for your profile
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
              </CardContent>
            </Card>

            {showPasswordFields && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg font-medium flex items-center gap-2">
                    <Lock className="h-5 w-5 text-gray-500" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your password securely
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <FormField
                    control={form.control}
                    name="currentPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="pl-10"
                              placeholder="Enter current password"
                              type="password"
                              {...field}
                            />
                            <Lock className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="newPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="pl-10"
                              placeholder="Enter new password"
                              type="password"
                              {...field}
                            />
                            <Lock className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormDescription>
                          Must be at least 8 characters with uppercase,
                          lowercase, and numbers
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              className="pl-10"
                              placeholder="Confirm new password"
                              type="password"
                              {...field}
                            />
                            <Lock className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            )}

            {/* <Card>
              <CardHeader>
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Bell className="h-5 w-5 text-gray-500" />
                  Notifications
                </CardTitle>
                <CardDescription>
                  Manage your notification preferences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="notifications"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">
                          Email Notifications
                        </FormLabel>
                        <FormDescription>
                          Receive email notifications when new forms are
                          submitted
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card> */}

            <div className="flex justify-end">
              <Button type="submit" className="px-8 py-2.5">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
