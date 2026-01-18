import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectsList from "./ProjectsList";

export default async function ProjectsPage() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/auth/login");
  }

  return <ProjectsList userEmail={userData.user.email} />;
}
