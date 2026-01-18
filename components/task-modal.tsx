"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Sparkles, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api-client";

export interface TaskData {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done" | "blocked";
  priority?: "low" | "medium" | "high";
  assignee?: string;
}

interface TaskModalProps {
  open: boolean;
  orgId: string;
  task?: TaskData;
  onOpenChange: (open: boolean) => void;
  onSave?: (task: TaskData) => void;
  onDelete?: (taskId: string) => void;
  isNew?: boolean;
}

const STATUSES = [
  { value: "todo", label: "To Do" },
  { value: "in-progress", label: "In Progress" },
  { value: "done", label: "Done" },
  { value: "blocked", label: "Blocked" },
];

const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];

export function TaskModal({
  open,
  orgId,
  task,
  onOpenChange,
  onSave,
  onDelete,
  isNew,
}: TaskModalProps) {
  const [formData, setFormData] = useState<TaskData>(
    task || {
      id: `task-${Date.now()}`,
      title: "",
      description: "",
      status: "todo",
      priority: "medium",
      assignee: "",
    }
  );

  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiGenerate = async () => {
    if (!formData.title || formData.title.length < 3) {
      alert("Please enter a title (at least 3 chars) first");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await apiFetch<{ result: string }>("/api/ai/tasks", {
        method: "POST",
        body: JSON.stringify({
          type: "description",
          orgId,
          title: formData.title,
          context: formData.description
        })
      });
      setFormData(prev => ({ ...prev, description: response.result }));
    } catch (error: any) {
      console.error("AI Generation failed:", error);
      alert(error.message || "Failed to generate AI description");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (formData.title.trim()) {
      onSave?.(formData);
      onOpenChange(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this task?")) {
      onDelete?.(formData.id);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isNew ? "Create Task" : "Edit Task"}</DialogTitle>
          <DialogDescription>
            {isNew
              ? "Create a new task for your project"
              : "Update the task details below"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">
              Title
            </Label>
            <Input
              id="title"
              placeholder="Task title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              className="h-10"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="description" className="text-sm font-medium">
                Description
              </Label>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleAiGenerate}
                disabled={isGenerating}
                className="h-7 text-[10px] gap-1 text-primary hover:text-primary hover:bg-primary/10"
              >
                {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                Magic Fill
              </Button>
            </div>
            <textarea
              id="description"
              placeholder="Task description"
              value={formData.description || ""}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows={4}
              className="w-full px-3 py-2 text-sm border border-input rounded-md bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="status" className="text-sm font-medium">
                Status
              </Label>
              <Select
                value={formData.status}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    status: value as TaskData["status"],
                  })
                }
              >
                <SelectTrigger id="status" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUSES.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority" className="text-sm font-medium">
                Priority
              </Label>
              <Select
                value={formData.priority || "medium"}
                onValueChange={(value) =>
                  setFormData({
                    ...formData,
                    priority: value as TaskData["priority"],
                  })
                }
              >
                <SelectTrigger id="priority" className="h-10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIORITIES.map((p) => (
                    <SelectItem key={p.value} value={p.value}>
                      {p.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="assignee" className="text-sm font-medium">
              Assignee
            </Label>
            <Input
              id="assignee"
              placeholder="Assigned to"
              value={formData.assignee || ""}
              onChange={(e) =>
                setFormData({ ...formData, assignee: e.target.value })
              }
              className="h-10"
            />
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          {!isNew && (
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="mr-auto"
            >
              Delete
            </Button>
          )}
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            {isNew ? "Create" : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
