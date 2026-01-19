import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import DashboardContent from "./DashboardContent";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  
  return <DashboardContent userEmail={userData?.user?.email || ""} />;
}
