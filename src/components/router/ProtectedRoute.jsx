"use client";

import { hasAccessUrl } from "@/lib/auth/checkAccess";
import { useMenuPermission } from "@/context/MenuPermissionContext";
import { extractMenuPaths, normalizePath } from "@/lib/auth/menuPermissionUtils";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";
import Loader from "@/components/ui/Loader";

export default function ProtectedRoute({ children }) {
    const { menuPermission, fetchMenuPermission, menuLoading, menuLoaded } = useMenuPermission();
    const pathname = usePathname();
    const router = useRouter();

    const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;

    const normalizedPathname = useMemo(() => normalizePath(pathname), [pathname]);
    const allowedPaths = useMemo(() => {
        const raw = extractMenuPaths(menuPermission);
        return raw
            .map(normalizePath)
            .filter((p) => typeof p === "string" && p.length > 0);
    }, [menuPermission]);

    const hasAccess = useMemo(() => {
        if (!menuLoaded) return null; 
        return hasAccessUrl(allowedPaths, normalizedPathname);
    }, [allowedPaths, normalizedPathname, menuLoaded]);

    useEffect(() => {
        if (!token) return;
        if (!menuLoaded && !menuLoading) {
            fetchMenuPermission();
        }
    }, [token, menuLoaded, menuLoading, fetchMenuPermission]);

    useEffect(() => {
        if (!token) {
            router.replace("/login");
            return;
        }

        if (!menuLoaded) return;
        if (hasAccess === null) return;

        if (!hasAccess) {
            router.replace("/access-denied");
        }
    }, [token, menuLoaded, hasAccess, router]);

    if (!token || !menuLoaded || menuLoading || hasAccess === null) {
        return (
            <div className="min-h-[60vh] w-full flex items-center justify-center bg-white">
                <Loader />
            </div>
        );
    }

    if (hasAccess === false) {
        return (
            <div className="min-h-[60vh] w-full flex items-center justify-center bg-white">
                <Loader />
            </div>
        );
    }

    return <>{children}</>;
}
