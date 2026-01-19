"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { KanbanBoard } from "@/components/kanban-board";
import Link from "next/link";
import { ArrowLeft, Settings, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api-client";
import { Project } from "@/types";

import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.4 }
  }
};

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
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading project details...</p>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="space-y-4">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md border border-destructive/20">
          {error || "Project not found"}
        </div>
        <Link href="/dashboard/projects">
          <Button variant="link" className="px-0">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Projects
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Link href={`/dashboard/organizations/${project.org_id}`}>
              <Button variant="ghost" size="sm" className="gap-2 h-8 px-2 -ml-2 text-muted-foreground hover:text-primary transition-colors">
                <ArrowLeft className="w-4 h-4" />
                Back to Organization
              </Button>
            </Link>
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            {project.name}
          </h2>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[10px] font-mono bg-muted/50 text-muted-foreground px-2 py-0.5 rounded border border-border/50 uppercase tracking-wider">PROJECT {project.id.slice(0, 8)}</span>
          </div>
        </div>
        <Link href={`/dashboard/projects/${projectId}/settings`}>
          <Button variant="outline" size="sm" className="gap-2 bg-background/50 backdrop-blur-sm border-primary/20 hover:bg-primary/5 group transition-all">
            <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
            Project Settings
          </Button>
        </Link>
      </motion.div>

      {/* Kanban board */}
      <motion.div variants={itemVariants}>
        <KanbanBoard
          projectId={projectId}
          orgId={project.org_id}
          projectName={project.name}
        />
      </motion.div>
    </motion.div>
  );
}
