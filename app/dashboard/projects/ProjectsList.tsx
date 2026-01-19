"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Layers3, Loader2, FolderKanban } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";
import { Sidebar } from "@/components/dashboard/Sidebar";
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

export default function ProjectsList({ userEmail }: { userEmail: string | undefined }) {
  const [projects, setProjects] = useState<any[]>([]);
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const orgs = await apiFetch<any[]>("/api/orgs");
        setOrganizations(orgs);
        if (orgs.length > 0) {
          setSelectedOrgId(orgs[0].id);
        } else {
          setIsLoading(false);
        }
      } catch (err: any) {
        setError(err.message);
        setIsLoading(false);
      }
    };
    fetchInitialData();
  }, []);

  useEffect(() => {
    if (!selectedOrgId) return;

    const fetchProjects = async () => {
      setIsLoading(true);
      try {
        const data = await apiFetch<any[]>(`/api/projects?orgId=${selectedOrgId}`);
        setProjects(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, [selectedOrgId]);

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight">Projects</h2>
          <div className="flex items-center gap-3 bg-secondary/30 px-3 py-1.5 rounded-full border border-border/50">
             <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Viewing</span>
             <select 
                value={selectedOrgId} 
                onChange={(e) => setSelectedOrgId(e.target.value)}
                className="bg-transparent text-sm font-medium focus:outline-none cursor-pointer"
              >
                {organizations.map(org => (
                  <option key={org.id} value={org.id} className="bg-popover text-popover-foreground">{org.name}</option>
                ))}
              </select>
          </div>
        </div>
        <Link href="/dashboard/projects/new">
          <Button className="gap-2 shadow-lg shadow-primary/20 h-10 px-5">
            <Plus className="w-4 h-4" />
            New Project
          </Button>
        </Link>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium">Loading projects...</p>
        </div>
      ) : organizations.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-12 border-dashed bg-secondary/10">
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-6">
                  <Layers3 className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold">No organizations yet</h3>
              <p className="text-muted-foreground max-sm mx-auto">
                You need to be part of an organization to see projects. Create one to get started!
              </p>
              <Link href="/dashboard/organizations/new">
                <Button variant="default" className="mt-2">Create Organization</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : projects.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-12 border-dashed bg-secondary/10">
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-primary/10 p-6">
                  <FolderKanban className="w-12 h-12 text-primary" />
                </div>
              </div>
              <h3 className="text-xl font-bold">No projects yet</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Create your first project in this organization to start organizing tasks and collaboration.
              </p>
              <Link href="/dashboard/projects/new">
                <Button variant="default" className="mt-2 text-primary-foreground font-medium">Create Project</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {projects.map((project) => (
            <motion.div key={project.id} variants={itemVariants} whileHover={{ y: -4 }}>
              <Card className="hover:border-primary/50 transition-all duration-300 group overflow-hidden relative flex flex-col h-full bg-card/50 backdrop-blur-sm border-border/50">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                      <FolderKanban className="w-8 h-8 text-primary" />
                 </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors pr-8 truncate">
                    {project.name}
                  </CardTitle>
                  <CardDescription>
                    Created on {new Date(project.created_at).toLocaleDateString()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto">
                  <Link href={`/dashboard/projects/${project.id}`}>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all border-primary/20 group-hover:border-primary">
                      View Tasks
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}

      {error && (
        <motion.div 
          variants={itemVariants}
          className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 mt-4 font-medium"
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
}
