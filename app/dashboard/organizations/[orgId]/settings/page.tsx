import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import OrgSettings from "./OrgSettings";

export default async function OrgSettingsPage({
  params,
}: {
  params: Promise<{ orgId: string }>;
}) {
  const { orgId } = await params;
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/auth/login");
  }

  return <OrgSettings orgId={orgId} />;
}
