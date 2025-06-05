"use client";

import { usePathname, useRouter } from "next/navigation";
import { routeHelpers, ROUTES, type RoutePath } from "@/lib/router";

export const useNavigation = () => {
  const pathname = usePathname();
  const router = useRouter();

  /**
   * Navigate to a route with optional options
   */
  const navigateTo = (
    route: RoutePath | string,
    options?: { replace?: boolean }
  ) => {
    if (options?.replace) {
      router.replace(route);
    } else {
      router.push(route);
    }
  };

  /**
   * Check if current route is active
   */
  const isActiveRoute = (route: RoutePath | string, exact = false) => {
    return routeHelpers.isActiveRoute(pathname, route, exact);
  };

  /**
   * Check if current route is protected
   */
  const isProtectedRoute = () => {
    return routeHelpers.isProtectedRoute(pathname);
  };

  /**
   * Check if current route requires admin privileges
   */
  const isAdminRoute = () => {
    return routeHelpers.isAdminRoute(pathname);
  };

  /**
   * Get current route metadata
   */
  const getCurrentRouteMetadata = () => {
    return routeHelpers.getPageMetadata(pathname);
  };

  /**
   * Get breadcrumbs for current route
   */
  const getBreadcrumbs = () => {
    return routeHelpers.generateBreadcrumbs(pathname);
  };

  /**
   * Go back to previous page
   */
  const goBack = () => {
    router.back();
  };

  /**
   * Navigate to home page
   */
  const goHome = () => {
    navigateTo(ROUTES.HOME);
  };

  /**
   * Navigate to dashboard
   */
  const goToDashboard = () => {
    navigateTo(ROUTES.ADMIN_DASHBOARD);
  };

  /**
   * Navigate to login page
   */
  const goToLogin = () => {
    navigateTo(ROUTES.AUTH_LOGIN);
  };

  return {
    // Navigation functions
    navigateTo,
    goBack,
    goHome,
    goToDashboard,
    goToLogin,

    // Route checking functions
    isActiveRoute,
    isProtectedRoute,
    isAdminRoute,

    // Utility functions
    getCurrentRouteMetadata,
    getBreadcrumbs,

    // Current state
    currentPath: pathname,
  };
};

export default useNavigation;
