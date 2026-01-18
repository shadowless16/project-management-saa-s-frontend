"use client";

import React from "react"

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, GripVertical, X, Loader2 } from "lucide-react";
import { TaskModal, type TaskData } from "./task-modal";
import { Role, hasPermission, Permission } from "@/lib/permissions";

export interface KanbanTask {
  id: string;
  title: string;
  description?: string;
  status: "todo" | "in-progress" | "done" | "blocked";
  assignee?: string;
  priority?: "low" | "medium" | "high";
}

interface KanbanBoardProps {
  projectId: string;
  orgId: string;
  projectName?: string;
  onTaskClick?: (task: KanbanTask) => void;
  userRole?: Role;
}

const STATUS_COLUMNS = [
  { id: "todo", label: "To Do", color: "bg-slate-50" },
  {
    id: "in-progress",
    label: "In Progress",
    color: "bg-blue-50",
  },
  { id: "done", label: "Done", color: "bg-green-50" },
  { id: "blocked", label: "Blocked", color: "bg-red-50" },
];

import { apiFetch } from "@/lib/api-client";
import { useEffect } from "react";

export function KanbanBoard({ projectId, orgId, projectName, onTaskClick, userRole }: KanbanBoardProps) {
  const [selectedTask, setSelectedTask] = useState<KanbanTask | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isNewTask, setIsNewTask] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newTaskStatus, setNewTaskStatus] = useState<KanbanTask["status"]>("todo");
  
  const [tasks, setTasks] = useState<KanbanTask[]>([]);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setIsLoading(true);
        const data = await apiFetch<any[]>(`/api/tasks?projectId=${projectId}`);
        // Map backend fields to frontend fields
        const mappedTasks: KanbanTask[] = data.map(t => ({
          id: t.id,
          title: t.title,
          description: t.description || "",
          status: t.status,
          assignee: t.assigned_to,
          priority: t.priority
        }));
        setTasks(mappedTasks);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTasks();
  }, [projectId]);

  const [draggedTask, setDraggedTask] = useState<KanbanTask | null>(null);

  const handleDragStart = (task: KanbanTask) => {
    setDraggedTask(task);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = async (status: string) => {
    if (draggedTask && draggedTask.status !== status) {
      const oldTasks = [...tasks];
      // Optimistic update
      setTasks(
        tasks.map((task) =>
          task.id === draggedTask.id
            ? { ...task, status: status as KanbanTask["status"] }
            : task
        )
      );

      try {
        await apiFetch(`/api/tasks/${draggedTask.id}`, {
          method: "PATCH",
          body: JSON.stringify({ status }),
        });
      } catch (err: any) {
        setTasks(oldTasks); // Rollback
        setError("Failed to update task status");
      }
    }
    setDraggedTask(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    if (userRole && !hasPermission(userRole, Permission.DELETE_TASK)) {
      console.log("[v0] User does not have permission to delete tasks");
      return;
    }

    const oldTasks = [...tasks];
    setTasks(tasks.filter((task) => task.id !== taskId));

    try {
      await apiFetch(`/api/tasks/${taskId}`, {
        method: "DELETE"
      });
    } catch (err: any) {
      setTasks(oldTasks);
      setError("Failed to delete task");
    }
  };

  const canCreateTask = !userRole || hasPermission(userRole, Permission.CREATE_TASK);
  const canEditTask = !userRole || hasPermission(userRole, Permission.EDIT_TASK);
  const canDeleteTask = !userRole || hasPermission(userRole, Permission.DELETE_TASK);

  const handleTaskClick = (task: KanbanTask) => {
    setSelectedTask(task);
    setIsNewTask(false);
    setModalOpen(true);
    onTaskClick?.(task);
  };

  const handleAddTask = (status: KanbanTask["status"]) => {
    setSelectedTask(null);
    setNewTaskStatus(status);
    setIsNewTask(true);
    setModalOpen(true);
  };

  const handleSaveTask = async (taskData: TaskData) => {
    try {
      if (isNewTask) {
        const newTask = await apiFetch<any>("/api/tasks", {
          method: "POST",
          body: JSON.stringify({
            title: taskData.title,
            description: taskData.description,
            status: newTaskStatus,
            projectId,
            priority: taskData.priority,
            assignedTo: taskData.assignee
          }),
        });
        
        setTasks([
          ...tasks,
          {
            id: newTask.id,
            title: newTask.title,
            description: newTask.description,
            status: newTask.status,
            assignee: newTask.assigned_to,
            priority: newTask.priority,
          },
        ]);
      } else {
        const updatedTask = await apiFetch<any>(`/api/tasks/${taskData.id}`, {
          method: "PATCH",
          body: JSON.stringify({
            title: taskData.title,
            description: taskData.description,
            status: taskData.status,
            priority: taskData.priority,
            assignedTo: taskData.assignee
          }),
        });

        setTasks(
          tasks.map((task) =>
            task.id === taskData.id
              ? {
                  ...task,
                  title: updatedTask.title,
                  description: updatedTask.description,
                  status: updatedTask.status,
                  assignee: updatedTask.assigned_to,
                  priority: updatedTask.priority,
                }
              : task
          )
        );
      }
    } catch (err: any) {
      setError("Failed to save task");
    }
  };

  const handleDeleteTaskModal = (taskId: string) => {
    handleDeleteTask(taskId);
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-700";
      case "medium":
        return "bg-yellow-100 text-yellow-700";
      case "low":
        return "bg-green-100 text-green-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-12 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
        <p className="text-muted-foreground">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-md border border-destructive/20 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)}><X className="w-4 h-4"/></button>
        </div>
      )}
      {projectName && (
        <div>
          <h3 className="text-xl font-semibold text-foreground">
            {projectName} Kanban Board
          </h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop tasks between columns to update their status
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STATUS_COLUMNS.map((column) => (
          <div key={column.id} className="flex flex-col min-h-96">
            <div className="mb-4">
              <h4 className="font-semibold text-foreground text-sm mb-1">
                {column.label}
              </h4>
              <div className="text-xs text-muted-foreground">
                {tasks.filter((t) => t.status === column.id).length} tasks
              </div>
            </div>

            <div
              onDragOver={handleDragOver}
              onDrop={() => handleDrop(column.id)}
              className={`flex-1 rounded-lg border-2 border-dashed border-border p-3 space-y-2 transition ${
                column.color
              } ${draggedTask?.status === column.id ? "border-primary" : ""}`}
            >
              {tasks
                .filter((task) => task.status === column.id)
                .map((task) => (
                  <Card
                    key={task.id}
                    draggable
                    onDragStart={() => handleDragStart(task)}
                    className="cursor-move hover:shadow-md transition group"
                    onClick={() => handleTaskClick(task)}
                  >
                    <CardContent className="p-3 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition" />
                        {canDeleteTask && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteTask(task.id);
                            }}
                            className="text-muted-foreground hover:text-destructive transition ml-auto"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                      <div>
                        <h5 className="font-medium text-sm text-foreground line-clamp-2">
                          {task.title}
                        </h5>
                        {task.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                            {task.description}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-2 pt-2">
                        {task.priority && (
                          <span
                            className={`text-xs px-2 py-1 rounded ${getPriorityColor(
                              task.priority
                            )}`}
                          >
                            {task.priority}
                          </span>
                        )}
                        {task.assignee && (
                          <span className="text-xs bg-accent/20 text-accent px-2 py-1 rounded">
                            {task.assignee}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}

              {tasks.filter((t) => t.status === column.id).length === 0 && (
                <div className="h-20 flex items-center justify-center text-muted-foreground text-xs">
                  Drop tasks here
                </div>
              )}
            </div>

            {canCreateTask && (
              <Button
                variant="ghost"
                className="mt-3 w-full text-xs gap-2"
                onClick={() => handleAddTask(column.id as KanbanTask["status"])}
              >
                <Plus className="w-3 h-3" />
                Add task
              </Button>
            )}
          </div>
        ))}
      </div>

      <TaskModal
        open={modalOpen}
        orgId={orgId}
        task={
          selectedTask
            ? {
                id: selectedTask.id,
                title: selectedTask.title,
                description: selectedTask.description,
                status: selectedTask.status,
                priority: selectedTask.priority,
                assignee: selectedTask.assignee,
              }
            : undefined
        }
        onOpenChange={setModalOpen}
        onSave={handleSaveTask}
        onDelete={handleDeleteTaskModal}
        isNew={isNewTask}
      />
    </div>
  );
}
