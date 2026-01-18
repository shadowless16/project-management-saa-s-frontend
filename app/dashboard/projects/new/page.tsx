"use client";

import React from "react"

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api-client";

export default function NewProjectPage() {
  const [projectName, setProjectName] = useState("");
  const [projectKey, setProjectKey] = useState("");
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [selectedOrgId, setSelectedOrgId] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const data = await apiFetch<any[]>("/api/orgs");
        setOrganizations(data);
        if (data.length > 0) setSelectedOrgId(data[0].id);
      } catch (err: any) {
        console.error("Failed to fetch organizations", err);
      }
    };
    fetchOrgs();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!selectedOrgId) throw new Error("Please select an organization");
      
      await apiFetch("/api/projects", {
        method: "POST",
        body: JSON.stringify({ 
          name: projectName,
          orgId: selectedOrgId 
        }),
      });
      router.push("/dashboard/projects");
    } catch (error: unknown) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 border-r border-border bg-sidebar">
          <div className="p-6 border-b border-sidebar-border">
            <h1 className="text-xl font-bold text-sidebar-foreground">
              TaskFlow
            </h1>
          </div>
          <nav className="p-4 space-y-2">
            <Link href="/dashboard">
              <div className="px-3 py-2 rounded-md hover:bg-sidebar-accent/20 text-sidebar-foreground cursor-pointer transition">
                Dashboard
              </div>
            </Link>
            <Link href="/dashboard/organizations">
              <div className="px-3 py-2 rounded-md hover:bg-sidebar-accent/20 text-sidebar-foreground cursor-pointer transition">
                Organizations
              </div>
            </Link>
            <Link href="/dashboard/projects">
              <div className="px-3 py-2 rounded-md hover:bg-sidebar-accent/20 text-sidebar-foreground cursor-pointer transition">
                Projects
              </div>
            </Link>
          </nav>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8 max-w-2xl">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Create Project
                </h2>
                <p className="text-muted-foreground mt-2">
                  Set up a new project to organize your tasks and team
                  collaboration
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                  <CardDescription>
                    Provide information about your new project
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreate} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="orgId" className="font-medium">
                        Organization
                      </Label>
                      <select 
                        id="orgId"
                        value={selectedOrgId} 
                        onChange={(e) => setSelectedOrgId(e.target.value)}
                        className="w-full flex h-10 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        required
                      >
                        {organizations.length === 0 && <option value="">No organizations found</option>}
                        {organizations.map(org => (
                          <option key={org.id} value={org.id}>{org.name}</option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectName" className="font-medium">
                        Project Name
                      </Label>
                      <Input
                        id="projectName"
                        type="text"
                        placeholder="e.g., Website Redesign"
                        required
                        value={projectName}
                        onChange={(e) => setProjectName(e.target.value)}
                        className="h-10"
                      />
                      <p className="text-xs text-muted-foreground">
                        The name of your project
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="projectKey" className="font-medium">
                        Project Key
                      </Label>
                      <Input
                        id="projectKey"
                        type="text"
                        placeholder="e.g., WEB"
                        maxLength={10}
                        required
                        value={projectKey}
                        onChange={(e) =>
                          setProjectKey(e.target.value.toUpperCase())
                        }
                        className="h-10"
                      />
                      <p className="text-xs text-muted-foreground">
                        A short identifier for your project (e.g., WEB-123)
                      </p>
                    </div>

                    {error && (
                      <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Link href="/dashboard/projects" className="flex-1">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          Cancel
                        </Button>
                      </Link>
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading ? "Creating..." : "Create Project"}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
