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
import { Plus, LayoutGrid, Users, Loader2, ArrowLeft, Settings, CreditCard } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { apiFetch } from "@/lib/api-client";
import { Organization, Project } from "@/types";

export default function OrgDetail({ orgId, userEmail }: { orgId: string, userEmail: string | undefined }) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orgData, projectsData] = await Promise.all([
          apiFetch<Organization>(`/api/orgs/${orgId}`),
          apiFetch<Project[]>(`/api/projects?orgId=${orgId}`)
        ]);
        setOrganization(orgData);
        setProjects(projectsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [orgId]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading organization details...</p>
      </div>
    );
  }

  if (error || !organization) {
    return (
      <div className="p-8">
        <div className="bg-destructive/10 text-destructive p-4 rounded-md border border-destructive/20">
          {error || "Organization not found"}
        </div>
        <Link href="/dashboard/organizations">
          <Button variant="link" className="mt-4">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Organizations
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Link href="/dashboard/organizations" className="text-muted-foreground hover:text-foreground transition">
                Organizations
              </Link>
              <span className="text-muted-foreground">/</span>
              <span className="font-semibold">{organization.name}</span>
            </div>
            <div className="flex items-center gap-3">
              <h1 className="text-4xl font-bold">{organization.name}</h1>
              <Badge variant={organization.plan === 'pro' ? 'default' : 'secondary'} className="h-6">
                {organization.plan === 'pro' ? 'Pro Plan' : 'Free Plan'}
              </Badge>
            </div>
          </div>
          <div className="flex gap-3">
            <Link href={`/dashboard/organizations/${orgId}/billing`}>
              <Button variant="outline" className="gap-2">
                <CreditCard className="w-4 h-4" />
                Billing
              </Button>
            </Link>
            <Link href={`/dashboard/organizations/${orgId}/settings`}>
              <Button variant="outline" className="gap-2">
                <Settings className="w-4 h-4" />
                Settings
              </Button>
            </Link>
            <Link href={`/dashboard/projects/new?orgId=${orgId}`}>
              <Button className="gap-2 shadow-lg shadow-primary/20">
                <Plus className="w-4 h-4" />
                New Project
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Main Info */}
          <div className="md:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <LayoutGrid className="w-5 h-5 text-primary" />
                Projects
              </h2>
            </div>

            {projects.length === 0 ? (
              <Card className="border-dashed py-12 text-center">
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground">No projects found in this organization.</p>
                  <Link href={`/dashboard/projects/new?orgId=${orgId}`}>
                    <Button variant="outline">Create Initial Project</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <Card key={project.id} className="hover:border-primary/50 transition-all duration-300 group">
                    <CardHeader>
                      <CardTitle className="group-hover:text-primary transition-colors">{project.name}</CardTitle>
                      <CardDescription>
                        Created on {new Date(project.created_at).toLocaleDateString()}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Link href={`/dashboard/projects/${project.id}`}>
                        <Button variant="ghost" className="w-full justify-between">
                          View Tasks
                          <ArrowLeft className="w-4 h-4 rotate-180" />
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar Info */}
          <div className="space-y-6">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                Team
              </h2>
              <Card>
                <CardContent className="pt-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Owner</span>
                    <span className="text-sm text-muted-foreground truncate max-w-[150px]">{userEmail}</span>
                  </div>
                  <Button variant="outline" className="w-full text-xs" disabled>
                    Manage Members
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-muted/50 border-none">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Organization ID</h3>
                <code className="text-xs break-all bg-background p-2 rounded block">{orgId}</code>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
