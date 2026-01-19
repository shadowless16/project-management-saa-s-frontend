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
import { Plus, Settings2, Loader2, Building2 } from "lucide-react";
import Link from "next/link";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { apiFetch } from "@/lib/api-client";
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

export default function OrganizationsPage({ userEmail }: { userEmail: string | undefined }) {
  const [organizations, setOrganizations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrgs = async () => {
      try {
        const data = await apiFetch<any[]>("/api/orgs");
        setOrganizations(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrgs();
  }, []);

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Organizations</h2>
          <p className="text-muted-foreground mt-2">
            Manage your organizations and teams
          </p>
        </div>
        <Link href="/dashboard/organizations/new">
          <Button className="gap-2 shadow-lg shadow-primary/20">
            <Plus className="w-4 h-4" />
            New Organization
          </Button>
        </Link>
      </motion.div>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading organizations...</p>
        </div>
      ) : organizations.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card className="text-center py-12 border-dashed">
            <CardContent className="space-y-4">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-accent/10 p-6">
                  <Building2 className="w-12 h-12 text-accent" />
                </div>
              </div>
              <h3 className="text-lg font-semibold">No organizations yet</h3>
              <p className="text-muted-foreground">
                Create your first organization to get started with TaskFlow
              </p>
              <Link href="/dashboard/organizations/new">
                <Button variant="secondary">Create Organization</Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          variants={containerVariants}
        >
          {organizations.map((org) => (
            <motion.div key={org.id} variants={itemVariants} whileHover={{ y: -4 }}>
              <Card className="hover:border-primary/50 transition-all duration-300 group overflow-hidden relative h-full">
                 <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-100 transition-opacity">
                      <Building2 className="w-8 h-8 text-primary" />
                 </div>
                <CardHeader>
                  <CardTitle className="group-hover:text-primary transition-colors pr-8">{org.name}</CardTitle>
                  <CardDescription>Created on {new Date(org.created_at).toLocaleDateString()}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={`/dashboard/organizations/${org.id}`}>
                    <Button variant="outline" className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-all">View Details</Button>
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
          className="p-4 bg-destructive/10 text-destructive rounded-md border border-destructive/20 mt-4"
        >
          {error}
        </motion.div>
      )}
    </motion.div>
  );
}
