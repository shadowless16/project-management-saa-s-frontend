import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectSettings from "./ProjectSettings";

export default async function ProjectSettingsPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/auth/login");
  }

  return <ProjectSettings projectId={projectId} />;
}
