"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { apiFetch } from "@/lib/api-client";
import { Building2, FolderKanban, ListChecks, Loader2 } from "lucide-react";

export default function DashboardSummary() {
  const [stats, setStats] = useState({ orgs: 0, projects: 0, tasks: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orgs, projects] = await Promise.all([
          apiFetch<any[]>("/api/orgs"),
          apiFetch<any[]>("/api/projects")
        ]);

        // For tasks, we would ideally have a global endpoint, but for now we'll just show orgs and projects
        // since projects are tied to orgs and tasks to projects.
        setStats({
          orgs: orgs.length,
          projects: projects.length,
          tasks: 0 // Fetching all tasks would require looping projects, skipping for now
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="h-24 bg-muted/50"></CardHeader>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
      <Card className="hover:border-primary/50 transition-all group">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" />
            Organizations
          </CardDescription>
          <CardTitle className="text-4xl font-bold group-hover:text-primary transition-colors">
            {stats.orgs}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="hover:border-primary/50 transition-all group">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <FolderKanban className="w-4 h-4 text-accent" />
            Projects
          </CardDescription>
          <CardTitle className="text-4xl font-bold group-hover:text-accent transition-colors">
            {stats.projects}
          </CardTitle>
        </CardHeader>
      </Card>

      <Card className="hover:border-primary/50 transition-all group">
        <CardHeader className="pb-2">
          <CardDescription className="flex items-center gap-2">
            <ListChecks className="w-4 h-4 text-green-500" />
            Active Tasks
          </CardDescription>
          <CardTitle className="text-4xl font-bold group-hover:text-green-500 transition-colors">
            {stats.tasks}
          </CardTitle>
          <CardDescription className="text-xs pt-2 italic">Global task count coming soon</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
