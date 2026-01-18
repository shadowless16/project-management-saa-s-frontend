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
import { Plus, Layers3, Loader2 } from "lucide-react";
import Link from "next/link";
import { apiFetch } from "@/lib/api-client";

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
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-card min-h-screen">
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-bold bg-linear-to-r from-primary to-accent bg-clip-text text-transparent">
              TaskFlow
            </h1>
          </div>
          <nav className="p-4 space-y-2">
            <Link href="/dashboard">
              <div className="px-3 py-2 rounded-md hover:bg-accent/10 transition">
                Dashboard
              </div>
            </Link>
            <Link href="/dashboard/organizations">
              <div className="px-3 py-2 rounded-md hover:bg-accent/10 transition">
                Organizations
              </div>
            </Link>
            <div className="px-3 py-2 rounded-md bg-accent/20 text-accent font-medium">
              Projects
            </div>
          </nav>
          <div className="fixed bottom-0 w-64 p-4 border-t border-border">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-8 h-8 rounded-full bg-accent/20 border border-accent/30 flex items-center justify-center">
                {userEmail?.charAt(0).toUpperCase()}
              </div>
              <span className="truncate">{userEmail}</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-3xl font-bold">Projects</h2>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-sm font-medium text-muted-foreground">Active Organization:</span>
                    <select 
                      value={selectedOrgId} 
                      onChange={(e) => setSelectedOrgId(e.target.value)}
                      className="bg-card border border-border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {organizations.map(org => (
                        <option key={org.id} value={org.id}>{org.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <Link href="/dashboard/projects/new">
                  <Button className="gap-2 shadow-lg shadow-primary/20">
                    <Plus className="w-4 h-4" />
                    New Project
                  </Button>
                </Link>
              </div>

              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                  <p className="text-muted-foreground">Loading projects...</p>
                </div>
              ) : organizations.length === 0 ? (
                <Card className="text-center py-12 border-dashed">
                  <CardContent className="space-y-4">
                    <div className="flex justify-center mb-4">
                      <div className="rounded-full bg-accent/10 p-6">
                        <Layers3 className="w-12 h-12 text-accent" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold">No organizations yet</h3>
                    <p className="text-muted-foreground">
                      You need to be part of an organization to see projects.
                    </p>
                    <Link href="/dashboard/organizations/new">
                      <Button variant="secondary">Create Organization</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : projects.length === 0 ? (
                <Card className="text-center py-12 border-dashed">
                  <CardContent className="space-y-4">
                    <div className="flex justify-center mb-4">
                      <div className="rounded-full bg-accent/10 p-6">
                        <Layers3 className="w-12 h-12 text-accent" />
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold">No projects yet</h3>
                    <p className="text-muted-foreground">
                      Create your first project in this organization to start organizing tasks
                    </p>
                    <Link href="/dashboard/projects/new">
                      <Button variant="secondary">Create Project</Button>
                    </Link>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {projects.map((project) => (
                    <Card key={project.id} className="hover:border-primary/50 transition-all duration-300 group">
                      <CardHeader>
                        <CardTitle className="group-hover:text-primary transition-colors">{project.name}</CardTitle>
                        <CardDescription>Created on {new Date(project.created_at).toLocaleDateString()}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <Link href={`/dashboard/projects/${project.id}`}>
                          <Button variant="outline" className="w-full">View Tasks</Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {error && (
                <div className="p-4 bg-destructive/10 text-destructive rounded-md border border-destructive/20 mt-4">
                  {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
