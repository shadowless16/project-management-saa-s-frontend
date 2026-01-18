import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus } from "lucide-react";
import Link from "next/link";
import DashboardSummary from "./DashboardSummary";

export default async function DashboardPage() {
  const supabase = await createClient();

  const { data: userData, error: userError } = await supabase.auth.getUser();
  if (userError || !userData?.user) {
    redirect("/auth/login");
  }

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
            <div className="px-3 py-2 rounded-md bg-sidebar-primary/20 text-sidebar-primary font-medium">
              Dashboard
            </div>
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
          <div className="absolute bottom-0 left-0 w-64 p-4 border-t border-sidebar-border">
            <div className="flex items-center gap-2 text-sm text-sidebar-foreground">
              <div className="w-8 h-8 rounded-full bg-sidebar-primary/20"></div>
              <span className="truncate">{userData.user.email}</span>
            </div>
          </div>
        </div>

        {/* Main content */}
        <div className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="space-y-8">
              <div>
                <h2 className="text-3xl font-bold text-foreground">
                  Welcome back!
                </h2>
                <p className="text-muted-foreground mt-2">
                  Manage your projects and collaborate with your team
                </p>
              </div>

              <DashboardSummary />

              {/* Quick actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="hover:border-primary/50 transition cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Plus className="w-5 h-5 text-accent" />
                      New Project
                    </CardTitle>
                    <CardDescription>
                      Create a new project to get started
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/dashboard/projects/new">
                      <Button className="w-full bg-transparent" variant="outline">
                        Create Project
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Plus className="w-5 h-5 text-accent" />
                      New Organization
                    </CardTitle>
                    <CardDescription>
                      Create a new organization or team
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Link href="/dashboard/organizations/new">
                      <Button className="w-full bg-transparent" variant="outline">
                        Create Organization
                      </Button>
                    </Link>
                  </CardContent>
                </Card>

                <Card className="hover:border-primary/50 transition cursor-pointer">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <svg
                        className="w-5 h-5 text-accent"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM9 12a6 6 0 11-12 0 6 6 0 0112 0z" />
                      </svg>
                      Invite Team
                    </CardTitle>
                    <CardDescription>
                      Invite team members to collaborate
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button className="w-full bg-transparent" variant="outline" disabled>
                      Invite Members
                    </Button>
                  </CardContent>
                </Card>
              </div>

              {/* Getting started */}
              <Card>
                <CardHeader>
                  <CardTitle>Getting Started</CardTitle>
                  <CardDescription>
                    Follow these steps to set up your workspace
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-semibold">
                        1
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Create your organization
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Start by creating an organization to manage your team
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-semibold">
                        2
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Create your first project
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Create a project within your organization
                        </p>
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center text-sm font-semibold">
                        3
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          Invite your team
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Collaborate with your team members in real-time
                        </p>
                      </div>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
