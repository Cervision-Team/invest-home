"use client";

import { hasAccessUrl } from "@/lib/auth/checkAccess";
import { getMenu } from "@/services/api/endpoints/menuService";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProtectedRoute({ children }) {
    const [menu, setMenu] = useState([]);
    const pathname = usePathname();
    const router = useRouter();

    const extractPaths = (menuList = []) => {
        return menuList.flatMap((item) => [
            item.path,
            ...(item?.subMenuEntities?.length ? extractPaths(item.subMenuEntities) : []),
        ]);
    };

    useEffect(() => {
        (async () => {
            const res = await getMenu();
            setMenu(res ?? [])

        })()
    }, [])

    useEffect(() => {
        if (!menu?.length) return;
        const paths = extractPaths(menu).filter(Boolean);
        console.log("paths", paths);
        
        if (!paths.length) return;
        const hasAccess = hasAccessUrl(paths, pathname);
        console.log("hasAccess",hasAccess);
        
        console.log("access", hasAccess)
        if (!hasAccess) router.replace("/access-denied");
    }, [pathname, menu]);

    return <>{children}</>;
}
