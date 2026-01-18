"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/kanban-board";
import Link from "next/link";
import { ArrowLeft, Settings, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { Project } from "@/types";

export default function ProjectDetail({ projectId, userEmail }: { projectId: string, userEmail: string | undefined }) {
  const [project, setProject] = useState<Project | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const data = await apiFetch<Project>(`/api/projects/${projectId}`);
        setProject(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProject();
  }, [projectId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md border border-destructive/20">
          {error || "Project not found"}
        </div>
        <Link href="/dashboard/projects">
          <Button variant="link" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 space-y-8 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4 mb-2">
              <Link href={`/dashboard/organizations/${project.org_id}`}>
                <Button variant="ghost" size="sm" className="gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Organization
                </Button>
              </Link>
            </div>
            <h2 className="text-4xl font-bold text-foreground">
              {project.name}
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <span className="text-xs font-mono bg-muted px-2 py-0.5 rounded border">ID: {project.id}</span>
            </div>
          </div>
          <Link href={`/dashboard/projects/${projectId}/settings`}>
            <Button variant="outline" size="sm" className="gap-2 bg-transparent">
              <Settings className="w-4 h-4" />
              Project Settings
            </Button>
          </Link>
        </div>

        {/* Kanban board */}
        <KanbanBoard
          projectId={projectId}
          orgId={project.org_id}
          projectName={project.name}
        />
      </div>
    </div>
  );
}
