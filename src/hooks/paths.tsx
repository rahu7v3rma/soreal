import { authPaths, dashboardPaths } from "@/constants/paths";
import { usePathname } from "next/navigation";

const usePaths = () => {
  const pathname = usePathname();

  const isDashboardPath = dashboardPaths.includes(pathname);
  const isApiDocsPath = pathname.startsWith("/api-docs");
  const isAuthPath = authPaths.includes(pathname);

  const isActivePath = (path: string) => pathname === path;

  return { isDashboardPath, isApiDocsPath, isActivePath, isAuthPath };
};

export default usePaths;
