import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Combines multiple class names using clsx and tailwind-merge
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Converts a string to a URL-friendly slug
 */
export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Formats a date to a readable string
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/**
 * Truncates a string to a maximum length
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + "...";
}

/**
 * Converts HTML content to plain text and truncates it to a maximum length
 * @param content The HTML content
 * @param length The maximum length of the output string
 * @returns Truncated plain text string
 */
export function htmlToTextAndTruncate(content: string, length: number): string {
  // Remove HTML tags using a regex
  const text = content.replace(/<[^>]+>/g, "");
  if (text.length <= length) return text;
  return text.substring(0, length) + "...";
}

/**
 * Checks if a user has the required role
 */
export function hasRequiredRole(
  userRole: string,
  requiredRole: string
): boolean {
  const roleHierarchy = {
    SUPER_ADMIN: 200,
    ADMIN: 100,
    EDITOR: 50,
  };

  // @ts-ignore - We know these roles exist in our application
  return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
}

/**
 * Converts a file size in bytes to a human-readable string
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

/**
 * Extract image URLs from HTML content
 * @param content The HTML content
 * @returns Array of image URLs found in the content
 */
export function extractImagesFromContent(content: string): string[] {
  // Create a temporary DOM element to parse the HTML
  const tempElement = document.createElement("div");
  tempElement.innerHTML = content;

  // Find all image elements
  const images = tempElement.querySelectorAll("img");

  // Extract the src attribute from each image
  const imageUrls = Array.from(images).map((img) => img.src);

  return imageUrls;
}

/**
 * Extract image URLs from HTML content - server-side version
 * Uses regex to avoid DOM dependency which doesn't work on server
 * @param content The HTML content
 * @returns Array of image URLs found in the content
 */
export function extractImagesFromContentServer(content: string): string[] {
  const imgRegex = /<img[^>]+src="([^">]+)"/g;
  const urls: string[] = [];
  let match;

  while ((match = imgRegex.exec(content)) !== null) {
    urls.push(match[1]);
  }

  return urls;
}

/**
 * Centralized logging service for admin operations
 */
export class Logger {
  /**
   * Log an action to the audit log
   */
  static async logAction(data: {
    action: string;
    entity: string;
    entityId?: string;
    userId: string;
    details?: string;
    ipAddress?: string;
    userAgent?: string;
  }) {
    try {
      // Send to Nest API (no-op if endpoint not available)
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Failed to log action:', error);
    }
  }

  /**
   * Log CRUD operations with standardized format
   */
  static async logCRUD(data: {
    operation: 'CREATE' | 'READ' | 'UPDATE' | 'DELETE';
    entity: string;
    entityId: string;
    userId: string;
    entityName?: string;
    changes?: Record<string, any>;
    additionalDetails?: string;
  }) {
    const { operation, entity, entityId, userId, entityName, changes, additionalDetails } = data;
    
    let details = `${operation} ${entity}`;
    if (entityName) {
      details += ` "${entityName}"`;
    }
    
    if (changes && Object.keys(changes).length > 0) {
      details += ` - Changes: ${JSON.stringify(changes)}`;
    }
    
    if (additionalDetails) {
      details += ` - ${additionalDetails}`;
    }

    await this.logAction({
      action: operation,
      entity,
      entityId,
      userId,
      details,
    });
  }

  /**
   * Log status changes
   */
  static async logStatusChange(data: {
    entity: string;
    entityId: string;
    userId: string;
    entityName: string;
    previousStatus: string;
    newStatus: string;
  }) {
    const { entity, entityId, userId, entityName, previousStatus, newStatus } = data;
    
    await this.logAction({
      action: 'UPDATE_STATUS',
      entity,
      entityId,
      userId,
      details: `Changed ${entity} "${entityName}" status from ${previousStatus} to ${newStatus}`,
    });
  }

  /**
   * Log file operations
   */
  static async logFileOperation(data: {
    operation: 'UPLOAD' | 'DELETE' | 'UPDATE';
    entity: string;
    entityId: string;
    userId: string;
    fileName: string;
    fileSize?: number;
    additionalDetails?: string;
  }) {
    const { operation, entity, entityId, userId, fileName, fileSize, additionalDetails } = data;
    
    let details = `${operation} file "${fileName}"`;
    if (fileSize) {
      details += ` (${formatFileSize(fileSize)})`;
    }
    
    if (additionalDetails) {
      details += ` - ${additionalDetails}`;
    }

    await this.logAction({
      action: operation,
      entity,
      entityId,
      userId,
      details,
    });
  }

  /**
   * Log authentication events
   */
  static async logAuthEvent(data: {
    event: 'LOGIN_SUCCESS' | 'LOGIN_FAILED' | 'LOGOUT' | 'UNAUTHORIZED_ACCESS';
    userId: string;
    email?: string;
    ipAddress?: string;
    details?: string;
  }) {
    const { event, userId, email, ipAddress, details } = data;
    
    let logDetails = event;
    if (email) {
      logDetails += ` for ${email}`;
    }
    if (ipAddress) {
      logDetails += ` from IP ${ipAddress}`;
    }
    if (details) {
      logDetails += ` - ${details}`;
    }

    await this.logAction({
      action: event,
      entity: 'USER',
      entityId: userId,
      userId,
      details: logDetails,
      ipAddress,
    });
  }
}

export function canPublishContent(userRole: string): boolean {
  return ["SUPER_ADMIN", "ADMIN", "EDITOR"].includes(userRole);
}

export function canManageContent(userRole: string): boolean {
  return ["SUPER_ADMIN", "ADMIN"].includes(userRole);
}

export function canManageUsers(userRole: string): boolean {
  return userRole === "SUPER_ADMIN";
}

export function canAccessSystemSettings(userRole: string): boolean {
  return userRole === "SUPER_ADMIN";
}

export function canViewAuditLogs(userRole: string): boolean {
  return ["SUPER_ADMIN", "ADMIN"].includes(userRole);
}

/**
 * Get dashboard stats based on user role
 */
export function getDashboardStatsForRole(userRole: string) {
  const baseStats = ['services', 'media', 'banners'];
  const adminStats = [...baseStats, 'team', 'equipment'];
  const superAdminStats = [...adminStats, 'users', 'logs'];

  switch (userRole) {
    case 'SUPER_ADMIN':
      return superAdminStats;
    case 'ADMIN':
      return adminStats;
    case 'EDITOR':
      return baseStats;
    default:
      return [];
  }
}

/**
 * Get quick actions based on user role
 */
export function getQuickActionsForRole(userRole: string) {
  const baseActions = ['services', 'news'];
  const adminActions = [...baseActions, 'team', 'equipment'];
  const superAdminActions = [...adminActions, 'users'];

  switch (userRole) {
    case 'SUPER_ADMIN':
      return superAdminActions;
    case 'ADMIN':
      return adminActions;
    case 'EDITOR':
      return baseActions;
    default:
      return [];
  }
}

/**
 * Check if user can view specific dashboard section
 */
export function canViewDashboardSection(userRole: string, section: string): boolean {
  const sectionPermissions = {
    services: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
    news: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
    media: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
    banners: ['SUPER_ADMIN', 'ADMIN', 'EDITOR'],
    team: ['SUPER_ADMIN', 'ADMIN'],
    equipment: ['SUPER_ADMIN', 'ADMIN'],
    users: ['SUPER_ADMIN'],
    logs: ['SUPER_ADMIN', 'ADMIN'],
    contact: ['SUPER_ADMIN', 'ADMIN'],
  };

  return sectionPermissions[section as keyof typeof sectionPermissions]?.includes(userRole) || false;
}
