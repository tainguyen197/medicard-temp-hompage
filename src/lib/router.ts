export interface BaseRoute {
  name: string;
  href: string;
  description?: string;
}

export interface RouteItem extends BaseRoute {
  icon?: React.ComponentType;
  adminOnly?: boolean;
  protected?: boolean;
  exact?: boolean;
}

export interface AdminRoute extends BaseRoute {
  protected?: boolean;
  adminOnly?: boolean;
}

export interface RouteGroup {
  name: string;
  routes: RouteItem[];
}

// Main navigation routes for public pages
export const publicRoutes = {
  home: {
    name: "TRANG CHỦ",
    href: "/",
    description: "Trang chủ Healthcare Therapy Center",
  },
  services: {
    name: "DỊCH VỤ",
    href: "/services",
    description: "Các dịch vụ y tế và điều trị",
    children: {
      ortho: {
        name: "Y học cổ truyền",
        href: "/services/ortho",
        description: "Điều trị bằng y học cổ truyền",
      },
      rehab: {
        name: "Vật lý trị liệu",
        href: "/services/rehab",
        description: "Dịch vụ vật lý trị liệu chuyên nghiệp",
      },
      func: {
        name: "Phục hồi chức năng",
        href: "/services/func",
        description: "Phục hồi chức năng cơ thể",
      },
      transport: {
        name: "Dịch vụ đưa đón",
        href: "/services/transport",
        description: "Dịch vụ đưa đón tận nơi",
      },
    },
  },
  about: {
    name: "VỀ CHÚNG TÔI",
    href: "/about",
    description: "Thông tin về Healthcare Therapy Center",
  },
  news: {
    name: "TIN TỨC",
    href: "/news",
    description: "Tin tức và bài viết y tế",
  },
  contact: {
    name: "LIÊN HỆ",
    href: "/contact",
    description: "Thông tin liên hệ và đặt lịch",
  },
} as const;

// Admin dashboard routes
export const adminRoutes: Record<string, AdminRoute> = {
  dashboard: {
    name: "Dashboard",
    href: "/",
    description: "Trang tổng quan quản trị",
    protected: true,
  },
  posts: {
    name: "Blog Posts",
    href: "/admin/posts",
    description: "Quản lý bài viết tin tức",
    protected: true,
  },
  services: {
    name: "Services",
    href: "/admin/services",
    description: "Quản lý dịch vụ",
    protected: true,
  },
  team: {
    name: "Team Members",
    href: "/admin/team",
    description: "Quản lý thành viên đội ngũ",
    protected: true,
    adminOnly: true,
  },
  media: {
    name: "Media Library",
    href: "/admin/media",
    description: "Thư viện hình ảnh và video",
    protected: true,
  },
  settings: {
    name: "Settings",
    href: "/admin/settings",
    description: "Cài đặt hệ thống",
    protected: true,
    adminOnly: true,
  },
};

// Auth routes
export const authRoutes = {
  login: {
    name: "Đăng nhập",
    href: "/auth/login",
    description: "Đăng nhập vào hệ thống",
  },
  logout: {
    name: "Đăng xuất",
    href: "/auth/logout",
    description: "Đăng xuất khỏi hệ thống",
  },
} as const;

// Navigation items for header (public routes only)
export const navigationItems: RouteItem[] = [
  {
    name: publicRoutes.services.name,
    href: publicRoutes.services.href,
    description: publicRoutes.services.description,
  },
  {
    name: publicRoutes.about.name,
    href: publicRoutes.about.href,
    description: publicRoutes.about.description,
  },
  {
    name: publicRoutes.news.name,
    href: publicRoutes.news.href,
    description: publicRoutes.news.description,
  },
  {
    name: publicRoutes.contact.name,
    href: publicRoutes.contact.href,
    description: publicRoutes.contact.description,
  },
];

// Admin navigation items
export const adminNavigationItems: RouteItem[] = [
  {
    name: adminRoutes.dashboard.name,
    href: adminRoutes.dashboard.href,
    description: adminRoutes.dashboard.description,
  },
  {
    name: adminRoutes.posts.name,
    href: adminRoutes.posts.href,
    description: adminRoutes.posts.description,
  },
  {
    name: adminRoutes.services.name,
    href: adminRoutes.services.href,
    description: adminRoutes.services.description,
  },
  {
    name: adminRoutes.team.name,
    href: adminRoutes.team.href,
    description: adminRoutes.team.description,
    adminOnly: true,
  },
  {
    name: adminRoutes.media.name,
    href: adminRoutes.media.href,
    description: adminRoutes.media.description,
  },
  {
    name: adminRoutes.settings.name,
    href: adminRoutes.settings.href,
    description: adminRoutes.settings.description,
    adminOnly: true,
  },
];

// Service sub-routes
export const serviceRoutes = Object.values(publicRoutes.services.children);

// Footer navigation links
export const footerCompanyLinks: RouteItem[] = [
  {
    name: "Trang chủ",
    href: publicRoutes.home.href,
  },
  {
    name: "Về chúng tôi",
    href: publicRoutes.about.href,
  },
  {
    name: "Tin tức",
    href: publicRoutes.news.href,
  },
];

export const footerServiceLinks: RouteItem[] = [
  {
    name: "Y học cổ truyền",
    href: publicRoutes.services.children.ortho.href,
  },
  {
    name: "Vật lý trị liệu",
    href: publicRoutes.services.children.rehab.href,
  },
  {
    name: "Phục hồi chức năng",
    href: publicRoutes.services.children.func.href,
  },
];

// Route helper functions
export const routeHelpers = {
  /**
   * Check if a route is active based on current pathname
   */
  isActiveRoute: (
    currentPath: string,
    routePath: string,
    exact = false
  ): boolean => {
    if (exact) {
      return currentPath === routePath;
    }
    return currentPath.startsWith(routePath);
  },

  /**
   * Get route by pathname
   */
  getRouteByPath: (pathname: string): BaseRoute | null => {
    // Check public routes
    const publicRoute = Object.values(publicRoutes).find(
      (route) => route.href === pathname
    );
    if (publicRoute) return publicRoute;

    // Check service sub-routes
    const serviceRoute = Object.values(publicRoutes.services.children).find(
      (route) => route.href === pathname
    );
    if (serviceRoute) return serviceRoute;

    // Check admin routes
    const adminRoute = Object.values(adminRoutes).find(
      (route) => route.href === pathname
    );
    if (adminRoute) return adminRoute;

    return null;
  },

  /**
   * Check if route requires authentication
   */
  isProtectedRoute: (pathname: string): boolean => {
    return pathname.startsWith("/dashboard") || pathname.startsWith("/admin");
  },

  /**
   * Check if route requires admin privileges
   */
  isAdminRoute: (pathname: string): boolean => {
    // Check if it's an admin route by looking at the adminRoutes object
    const adminRoute = Object.values(adminRoutes).find(
      (route) => route.href === pathname
    );
    return adminRoute?.adminOnly === true;
  },

  /**
   * Generate breadcrumb items for a given path
   */
  generateBreadcrumbs: (pathname: string): { name: string; href: string }[] => {
    const segments = pathname.split("/").filter(Boolean);
    const breadcrumbs: { name: string; href: string }[] = [];

    // Add home
    breadcrumbs.push({ name: "Trang chủ", href: "/" });

    let currentPath = "";
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`;

      // Find route name for this path
      const route = routeHelpers.getRouteByPath(currentPath);
      if (route) {
        breadcrumbs.push({
          name: route.name,
          href: currentPath,
        });
      } else {
        // Fallback to segment name
        breadcrumbs.push({
          name: segment.charAt(0).toUpperCase() + segment.slice(1),
          href: currentPath,
        });
      }
    });

    return breadcrumbs;
  },

  /**
   * Get page metadata for SEO
   */
  getPageMetadata: (pathname: string) => {
    const route = routeHelpers.getRouteByPath(pathname);
    return {
      title: route?.name || "Healthcare Therapy Center",
      description:
        route?.description || "Trung tâm điều trị y tế chuyên nghiệp",
    };
  },
};

// Route constants for easy access
export const ROUTES = {
  // Public routes
  HOME: publicRoutes.home.href,
  SERVICES: publicRoutes.services.href,
  ABOUT: publicRoutes.about.href,
  NEWS: publicRoutes.news.href,
  CONTACT: publicRoutes.contact.href,

  // Service routes
  SERVICES_ORTHO: publicRoutes.services.children.ortho.href,
  SERVICES_REHAB: publicRoutes.services.children.rehab.href,
  SERVICES_FUNC: publicRoutes.services.children.func.href,
  SERVICES_TRANSPORT: publicRoutes.services.children.transport.href,

  // Admin routes
  ADMIN_DASHBOARD: adminRoutes.dashboard.href,
  ADMIN_POSTS: adminRoutes.posts.href,
  ADMIN_POSTS_NEW: adminRoutes.posts.href + "/new",
  ADMIN_SERVICES: adminRoutes.services.href,
  ADMIN_TEAM: adminRoutes.team.href,
  ADMIN_MEDIA: adminRoutes.media.href,
  ADMIN_SETTINGS: adminRoutes.settings.href,

  // Auth routes
  AUTH_LOGIN: authRoutes.login.href,
  AUTH_LOGOUT: authRoutes.logout.href,
} as const;

export type RouteKey = keyof typeof ROUTES;
export type RoutePath = (typeof ROUTES)[RouteKey];
