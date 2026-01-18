import { ReactNode } from "react";
import { Role, Permission, hasPermission, hasAnyPermission } from "@/lib/permissions";

interface PermissionGuardProps {
  role: Role | null;
  requires?: Permission | Permission[];
  requireAll?: boolean;
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Conditionally renders children based on user role and required permissions
 * @param role - The user's role
 * @param requires - A single permission or array of permissions required
 * @param requireAll - If true, user must have ALL permissions (default: false = ANY)
 * @param children - Content to render if user has permission
 * @param fallback - Content to render if user doesn't have permission
 */
export function PermissionGuard({
  role,
  requires,
  requireAll = false,
  children,
  fallback,
}: PermissionGuardProps) {
  if (!role || !requires) {
    return children;
  }

  const permissions = Array.isArray(requires) ? requires : [requires];

  const hasAccess = requireAll
    ? permissions.every((p) => hasPermission(role, p))
    : hasAnyPermission(role, permissions);

  return hasAccess ? children : fallback;
}

interface RoleGuardProps {
  role: Role | null;
  allowedRoles: Role | Role[];
  children: ReactNode;
  fallback?: ReactNode;
}

/**
 * Conditionally renders children based on user role
 * @param role - The user's current role
 * @param allowedRoles - Role(s) that are allowed to see the content
 * @param children - Content to render if user's role is allowed
 * @param fallback - Content to render if user's role is not allowed
 */
export function RoleGuard({
  role,
  allowedRoles,
  children,
  fallback,
}: RoleGuardProps) {
  if (!role) {
    return fallback;
  }

  const roles = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
  const hasAccess = roles.includes(role);

  return hasAccess ? children : fallback;
}
