import { ProfileSettings } from "@/components/ProfileSettings";

export default function UserProfilePage() {
  const handleProfileUpdate = async (data: any) => {
    // Here you would typically make an API call to update the user's profile
    console.log("Updating user profile:", data);
    // Example API call:
    // await updateUserProfile(data);
  };

  const defaultValues = {
    username: "user123",
    email: "user@example.com",
    bio: "Regular user account",
    notifications: true,
  };

  return (
    <div className="container mx-auto py-10">
      <ProfileSettings
        onSubmit={handleProfileUpdate}
        defaultValues={defaultValues}
        showPasswordFields={true}
        isAdmin={false}
      />
    </div>
  );
}
