"use client";

import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { apiFetch } from "@/lib/api-client";
import { Building2, FolderKanban, ListChecks, Loader2 } from "lucide-react";
import { motion, Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.4,
      ease: "easeOut"
    }
  }
};

export default function DashboardSummary() {
  const [stats, setStats] = useState({ orgs: 0, projects: 0, tasks: 0 });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [orgs, projects, tasks] = await Promise.all([
          apiFetch<any[]>("/api/orgs"),
          apiFetch<any[]>("/api/projects"),
          apiFetch<any[]>("/api/tasks")
        ]);

        setStats({
          orgs: orgs.length,
          projects: projects.length,
          tasks: tasks.length
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
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <Card className="hover:border-primary/50 transition-all group overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-primary opacity-0 group-hover:opacity-100 transition-opacity" />
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
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="hover:border-accent/50 transition-all group overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-accent opacity-0 group-hover:opacity-100 transition-opacity" />
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
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="hover:border-green-500/50 transition-all group overflow-hidden relative">
          <div className="absolute top-0 left-0 w-1 h-full bg-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
          <CardHeader className="pb-2">
            <CardDescription className="flex items-center gap-2">
              <ListChecks className="w-4 h-4 text-green-500" />
              Active Tasks
            </CardDescription>
            <CardTitle className="text-4xl font-bold group-hover:text-green-500 transition-colors">
              {stats.tasks}
            </CardTitle>
          </CardHeader>
        </Card>
      </motion.div>
    </motion.div>
  );
}
