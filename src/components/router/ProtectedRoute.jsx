"use client";

import { hasAccessUrl } from "@/lib/auth/checkAccess";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const role = "admin"; 

  useEffect(() => {
    const hasAccess = hasAccessUrl(role, pathname);
    console.log("access",hasAccess)
    if (!hasAccess) router.replace("/access-denied");
  }, [pathname, role]);

  return <>{children}</>;
}
