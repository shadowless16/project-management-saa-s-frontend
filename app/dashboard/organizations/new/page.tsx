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
import { useState } from "react";
import { apiFetch } from "@/lib/api-client";

export default function NewOrganizationPage() {
  const [orgName, setOrgName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await apiFetch("/api/orgs", {
        method: "POST",
        body: JSON.stringify({ name: orgName }),
      });
      router.push("/dashboard/organizations");
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
                  Create Organization
                </h2>
                <p className="text-muted-foreground mt-2">
                  Set up a new organization to manage your projects and team
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Organization Details</CardTitle>
                  <CardDescription>
                    Provide basic information about your organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCreate} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="orgName" className="font-medium">
                        Organization Name
                      </Label>
                      <Input
                        id="orgName"
                        type="text"
                        placeholder="e.g., Acme Corporation"
                        required
                        value={orgName}
                        onChange={(e) => setOrgName(e.target.value)}
                        className="h-10"
                      />
                      <p className="text-xs text-muted-foreground">
                        This is the name of your organization that will be
                        visible to all team members.
                      </p>
                    </div>

                    {error && (
                      <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
                        {error}
                      </div>
                    )}

                    <div className="flex gap-3 pt-4">
                      <Link href="/dashboard/organizations" className="flex-1">
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full bg-transparent"
                        >
                          Cancel
                        </Button>
                      </Link>
                      <Button type="submit" className="flex-1" disabled={isLoading}>
                        {isLoading
                          ? "Creating..."
                          : "Create Organization"}
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
