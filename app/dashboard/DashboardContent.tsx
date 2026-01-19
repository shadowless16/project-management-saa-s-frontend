"use client";

import React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Plus, Users, Layout } from "lucide-react";
import Link from "next/link";
import DashboardSummary from "./DashboardSummary";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
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

export default function DashboardContent({ userEmail }: { userEmail: string }) {
  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div variants={itemVariants}>
        <h2 className="text-3xl font-bold text-foreground">
          Welcome back!
        </h2>
        <p className="text-muted-foreground mt-2">
          Manage your projects and collaborate with your team
        </p>
      </motion.div>

      <motion.div variants={itemVariants}>
        <DashboardSummary />
      </motion.div>

      {/* Quick actions */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
        variants={containerVariants}
      >
        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="h-full">
          <Card className="hover:border-primary/50 transition-all cursor-pointer h-full group">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                <Plus className="w-5 h-5 text-accent" />
                New Project
              </CardTitle>
              <CardDescription>
                Create a new project to get started
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/projects/new">
                <Button className="w-full bg-transparent group-hover:bg-primary group-hover:text-primary-foreground transition-all" variant="outline">
                  Create Project
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="h-full">
          <Card className="hover:border-primary/50 transition-all cursor-pointer h-full group">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2 group-hover:text-primary transition-colors">
                <Plus className="w-5 h-5 text-accent" />
                New Organization
              </CardTitle>
              <CardDescription>
                Create a new organization or team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/dashboard/organizations/new">
                <Button className="w-full bg-transparent group-hover:bg-primary group-hover:text-primary-foreground transition-all" variant="outline">
                  Create Organization
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants} whileHover={{ y: -5 }} className="h-full">
          <Card className="hover:border-primary/50 transition-all cursor-pointer h-full group shadow-sm opacity-80 italic">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="w-5 h-5 text-accent" />
                Invite Team
              </CardTitle>
              <CardDescription>
                Collaborate with your team
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button className="w-full bg-transparent" variant="outline" disabled>
                Coming Soon
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Getting started */}
      <motion.div variants={itemVariants}>
        <Card className="border-primary/20 bg-primary/2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <Layout className="w-5 h-5 text-primary" />
                Getting Started
            </CardTitle>
            <CardDescription>
              Follow these steps to set up your workspace
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { step: 1, title: "Create Organization", desc: "Start by creating an organization to manage your team" },
                { step: 2, title: "Create Project", desc: "Create a project within your organization" },
                { step: 3, title: "Invite Team", desc: "Collaborate with your team members in real-time" }
              ].map((item) => (
                <div key={item.step} className="flex flex-col gap-2 p-4 rounded-lg bg-background border border-border/50 hover:border-primary/30 transition-all">
                   <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-bold border border-primary/20">
                     {item.step}
                   </div>
                   <h4 className="font-semibold">{item.title}</h4>
                   <p className="text-xs text-muted-foreground">{item.desc}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
