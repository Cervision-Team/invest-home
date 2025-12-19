"use client";

import { hasAccessUrl } from "@/lib/auth/checkAccess";
import { useMenuPermission } from "@/context/MenuPermissionContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectedRoute({ children }) {
    const { menuPermission, fetchMenuPermission, menuLoading } = useMenuPermission();
    const pathname = usePathname();
    const router = useRouter();

    const extractPaths = (menuList = []) => {
        return menuList.flatMap((item) => [
            item.path,
            ...(item?.subMenuEntities?.length ? extractPaths(item.subMenuEntities) : []),
        ]);
    };

    useEffect(() => {
        if (!menuPermission?.length && !menuLoading) {
            fetchMenuPermission();
        }
    }, [menuPermission?.length, menuLoading, fetchMenuPermission]);

    useEffect(() => {
        if (menuLoading) return;
        if (!menuPermission?.length) return;
        const paths = extractPaths(menuPermission).filter(Boolean);
        console.log("paths", paths);

        if (!paths.length) return;
        const hasAccess = hasAccessUrl(paths, pathname);
        console.log("hasAccess", hasAccess);

        console.log("access", hasAccess)
        if (!hasAccess) router.replace("/access-denied");
    }, [pathname, menuPermission, menuLoading]);

    return <>{children}</>;
}
