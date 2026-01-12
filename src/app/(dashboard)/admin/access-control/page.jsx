"use client";
import React, { useEffect, useState } from "react";
import { getAccessControl, upadteAccessControl } from "@/services/api/endpoints/accessControlService";
import { useMenuPermission } from "@/context/MenuPermissionContext";
import { ToastContainer, toast } from "react-toastify";
import { createRole, deleteRole, updateRole } from "@/services/api/endpoints/roleService";
import RoleModal from "./components/RoleModal";
import AccessControlTable from "./components/AccessControlTable";
import Loader from "@/components/ui/Loader";

const AccessControl = () => {
    const [access, setAccess] = useState([]);
    const [matrix, setMatrix] = useState({});
    const { fetchMenuPermission } = useMenuPermission();
    const [pageLoading, setPageLoading] = useState(true);
    const [pageError, setPageError] = useState(null);

    const [roleModalOpen, setRoleModalOpen] = useState(false);
    const [roleModalMode, setRoleModalMode] = useState("create");
    const [activeRoleId, setActiveRoleId] = useState(null);
    const [activeRoleName, setActiveRoleName] = useState("");
    const [roleSubmitting, setRoleSubmitting] = useState(false);

    const refreshMatrix = async (opts = {}) => {
        const { preserveAccess = true } = opts;
        const res = await getAccessControl();
        const nextMatrix = res.data;

        const baseline = (nextMatrix?.rolesClaims || []).map((item) => ({ ...item, original: true }));

        if (!preserveAccess) {
            setMatrix(nextMatrix);
            setAccess(baseline);
            return;
        }

        const prevMap = new Map(
            (access || []).map((a) => [`${a.roleId}-${a.claimId}`, a])
        );

        const mergedMap = new Map();

        for (const b of baseline) {
            const key = `${b.roleId}-${b.claimId}`;
            const prev = prevMap.get(key);
            mergedMap.set(key, prev ? { ...b, hasPermission: prev.hasPermission } : b);
        }

        for (const [key, prev] of prevMap.entries()) {
            if (!mergedMap.has(key)) mergedMap.set(key, prev);
        }

        setMatrix(nextMatrix);
        setAccess(Array.from(mergedMap.values()));
    };

    useEffect(() => {
        (async () => {
            setPageLoading(true);
            setPageError(null);
            try {
                await refreshMatrix({ preserveAccess: false });
            } catch (err) {
                console.log(err);
                setPageError(err?.message || "Məlumat yüklənmədi");
            } finally {
                setPageLoading(false);
            }
        })();
    }, []);

    const handleAccess = (roleId, claimId) => {
        setAccess((prev) => {
            const existing = prev.find((a) => a.roleId === roleId && a.claimId === claimId);

            if (existing) {
                const toggled = !existing.hasPermission;
                return prev.map((a) =>
                    a.roleId === roleId && a.claimId === claimId
                        ? { ...a, hasPermission: toggled }
                        : a
                );
            } else {
                return [...prev, { roleId, claimId, hasPermission: true, original: false }];
            }
        });
    };

    const handleSubmit = async () => {
        try {
            const payload = access
                .filter((a) => a.original || (!a.original && a.hasPermission))
                .map((a) => ({
                    roleId: a.roleId,
                    claimId: a.claimId,
                    hasPermission: a.hasPermission,
                }));
            const res = await upadteAccessControl(payload)
            fetchMenuPermission({ force: true });
            toast.success(res.data)
        } catch (err) {
            console.log(err);
        }
    };

    const openCreateRole = () => {
        setRoleModalMode("create");
        setActiveRoleId(null);
        setActiveRoleName("");
        setRoleModalOpen(true);
    };

    const openUpdateRole = (role) => {
        setRoleModalMode("update");
        setActiveRoleId(role?.id ?? null);
        setActiveRoleName(role?.name ?? "");
        setRoleModalOpen(true);
    };

    const handleRoleSubmit = async (name) => {
        setRoleSubmitting(true);
        try {
            if (roleModalMode === "create") {
                const res = await createRole({ name });
                toast.success(res?.data || "Role yaradıldı");
            } else {
                const res = await updateRole({ id: activeRoleId, name });
                toast.success(res?.data || "Role yeniləndi");
            }
            setRoleModalOpen(false);
            await refreshMatrix({ preserveAccess: true });
        } catch (err) {
            toast.error("Xəta baş verdi");
        } finally {
            setRoleSubmitting(false);
        }
    };

    const handleRoleDelete = async (roleId) => {
        try {
            await deleteRole(roleId);
            toast.success("Role silindi");
            await refreshMatrix({ preserveAccess: true });
        } catch (err) {
            toast.error("Xəta baş verdi");
        }
    };


    const groupByFirstWord = (claims) => {
        return claims.reduce((groups, claim) => {
            const firstWord = claim.name.split("_")[0];
            const key = firstWord.charAt(0).toUpperCase() + firstWord.slice(1);
            if (!groups[key]) groups[key] = [];
            groups[key].push(claim);
            return groups;
        }, {});
    };

    const groupedClaims = groupByFirstWord(
        matrix?.claims?.slice()?.sort((a, b) => a.name.localeCompare(b.name)) || []
    );


    return (
        <section className="w-full">
            <ToastContainer />
            <RoleModal
                open={roleModalOpen}
                title={roleModalMode === "create" ? "Yeni role əlavə et" : "Role yenilə"}
                initialValue={activeRoleName}
                submitText={roleModalMode === "create" ? "Əlavə et" : "Yenilə"}
                loading={roleSubmitting}
                onClose={() => setRoleModalOpen(false)}
                onSubmit={handleRoleSubmit}
            />
            {pageLoading ? (
                <div className="w-full py-16 flex items-center justify-center border border-dashed rounded-xl">
                    <Loader />
                </div>
            ) : pageError ? (
                <div className="w-full py-16 flex items-center justify-center text-lg text-gray-500 border border-dashed rounded-xl">
                    {pageError}
                </div>
            ) : (
                <AccessControlTable
                    matrix={matrix}
                    groupedClaims={groupedClaims}
                    access={access}
                    onToggleAccess={handleAccess}
                    onOpenUpdateRole={openUpdateRole}
                    onDeleteRole={handleRoleDelete}
                    onOpenCreateRole={openCreateRole}
                />
            )}

            <button
                onClick={handleSubmit}
                disabled={pageLoading}
                className="bg-primary hover:[#02836f] px-4 py-2 rounded-lg text-white mt-4 transition-all cursor-pointer"
            >
                Yadda saxla
            </button>
        </section>
    );
};

export default AccessControl;
