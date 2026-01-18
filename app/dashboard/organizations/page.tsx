import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OrganizationsList from "./OrganizationsList";

export default async function OrganizationsPage() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/auth/login");
  }

  return <OrganizationsList userEmail={userData.user.email} />;
}
