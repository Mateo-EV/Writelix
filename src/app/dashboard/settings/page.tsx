import { ProfileForm } from "@/components/ProfileForm";
import { DashboardContainer } from "@/components/dashboard/DashboardContainer";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { getSession } from "@/lib/auth";

export const metadata = {
  title: "Settings",
};

export default async function DashboardSettingsPage() {
  const currentUser = await getSession();
  return (
    <DashboardContainer>
      <DashboardHeader
        heading="Settings"
        text="Manage your account information"
      />
      <ProfileForm name={currentUser!.user.name} />
    </DashboardContainer>
  );
}
