import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ProjectDetail from "./ProjectDetail";

interface ProjectPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { projectId } = await params;

  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/auth/login");
  }

  return <ProjectDetail projectId={projectId} userEmail={userData.user.email} />;
}
