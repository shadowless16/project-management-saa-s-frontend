// Role-based access control system

export enum Role {
  ADMIN = "admin",
  MANAGER = "manager",
  MEMBER = "member",
  VIEWER = "viewer",
}

export enum Permission {
  // Organization permissions
  MANAGE_ORGANIZATION = "manage_organization",
  INVITE_MEMBERS = "invite_members",
  REMOVE_MEMBERS = "remove_members",

  // Project permissions
  CREATE_PROJECT = "create_project",
  EDIT_PROJECT = "edit_project",
  DELETE_PROJECT = "delete_project",
  MANAGE_MEMBERS = "manage_members",

  // Task permissions
  CREATE_TASK = "create_task",
  EDIT_TASK = "edit_task",
  DELETE_TASK = "delete_task",
  ASSIGN_TASK = "assign_task",
  VIEW_TASK = "view_task",
}

// Define role permissions
const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    // All permissions
    Permission.MANAGE_ORGANIZATION,
    Permission.INVITE_MEMBERS,
    Permission.REMOVE_MEMBERS,
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.DELETE_PROJECT,
    Permission.MANAGE_MEMBERS,
    Permission.CREATE_TASK,
    Permission.EDIT_TASK,
    Permission.DELETE_TASK,
    Permission.ASSIGN_TASK,
    Permission.VIEW_TASK,
  ],
  [Role.MANAGER]: [
    // Project and task management
    Permission.CREATE_PROJECT,
    Permission.EDIT_PROJECT,
    Permission.MANAGE_MEMBERS,
    Permission.CREATE_TASK,
    Permission.EDIT_TASK,
    Permission.DELETE_TASK,
    Permission.ASSIGN_TASK,
    Permission.VIEW_TASK,
  ],
  [Role.MEMBER]: [
    // Task operations
    Permission.CREATE_TASK,
    Permission.EDIT_TASK,
    Permission.VIEW_TASK,
  ],
  [Role.VIEWER]: [
    // Read-only
    Permission.VIEW_TASK,
  ],
};

export function hasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role]?.includes(permission) ?? false;
}

export function hasAnyPermission(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.some((permission) => hasPermission(role, permission));
}

export function hasAllPermissions(
  role: Role,
  permissions: Permission[]
): boolean {
  return permissions.every((permission) => hasPermission(role, permission));
}

// User type with role
export interface User {
  id: string;
  email: string;
  role: Role;
}

// Context type for access control
export interface AccessControl {
  user: User | null;
  canManageOrganization: boolean;
  canCreateProject: boolean;
  canEditProject: boolean;
  canDeleteProject: boolean;
  canCreateTask: boolean;
  canEditTask: boolean;
  canDeleteTask: boolean;
  canAssignTask: boolean;
}

export function createAccessControl(user: User | null): AccessControl {
  if (!user) {
    return {
      user: null,
      canManageOrganization: false,
      canCreateProject: false,
      canEditProject: false,
      canDeleteProject: false,
      canCreateTask: false,
      canEditTask: false,
      canDeleteTask: false,
      canAssignTask: false,
    };
  }

  return {
    user,
    canManageOrganization: hasPermission(user.role, Permission.MANAGE_ORGANIZATION),
    canCreateProject: hasPermission(user.role, Permission.CREATE_PROJECT),
    canEditProject: hasPermission(user.role, Permission.EDIT_PROJECT),
    canDeleteProject: hasPermission(user.role, Permission.DELETE_PROJECT),
    canCreateTask: hasPermission(user.role, Permission.CREATE_TASK),
    canEditTask: hasPermission(user.role, Permission.EDIT_TASK),
    canDeleteTask: hasPermission(user.role, Permission.DELETE_TASK),
    canAssignTask: hasPermission(user.role, Permission.ASSIGN_TASK),
  };
}
