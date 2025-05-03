import { ProfileSettings } from "@/components/ProfileSettings";

export default function AdminProfilePage() {
  const handleProfileUpdate = async (data: any) => {
    // Here you would typically make an API call to update the admin's profile
    console.log("Updating admin profile:", data);
    // Example API call:
    // await updateAdminProfile(data);
  };

  const defaultValues = {
    username: "admin",
    email: "admin@example.com",
    bio: "System administrator",
    notifications: true,
  };

  return (
    <div className="container mx-auto py-10">
      <ProfileSettings
        onSubmit={handleProfileUpdate}
        defaultValues={defaultValues}
        showPasswordFields={true}
        isAdmin={true}
      />
    </div>
  );
}
