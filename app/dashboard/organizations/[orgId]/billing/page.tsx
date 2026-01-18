import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BillingPage from "./BillingPage";

export default async function BillingServerPage({
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

  return <BillingPage orgId={orgId} userEmail={userData.user.email} />;
}
