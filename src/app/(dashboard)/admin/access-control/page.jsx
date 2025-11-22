"use client";
import React, { useEffect, useState } from "react";
import { getAccessControl, upadteAccessControl } from "@/services/api/endpoints/accessControlService";
import { useMenuPermission } from "@/context/MenuPermissionContext";
import { ToastContainer, toast } from "react-toastify";

const AccessControl = () => {
    const [access, setAccess] = useState([]);
    const [matrix, setMatrix] = useState({});
    const { fetchMenuPermission } = useMenuPermission();

    useEffect(() => {
        (async () => {
            const res = await getAccessControl();
            setMatrix(res.data);
            setAccess(res.data.rolesClaims.map((item) => ({ ...item, original: true })));
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
            fetchMenuPermission();
            toast.success(res.data)
        } catch (err) {
            console.log(err);
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
            <table className="w-full">
                <thead>
                    <tr>
                        <th className="w-[200px] text-left p-2 py-6">Role & Permission</th>
                        {matrix?.roles?.map((role) => (
                            <th key={role?.id} className="p-2  ">
                                {role.name}
                            </th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {Object.entries(groupedClaims).map(([section, claimsInGroup]) => (
                        <React.Fragment key={section}>
                            <tr className="">
                                <td
                                    colSpan={matrix?.roles?.length + 1}
                                    className="font-semibold p-2  text-white uppercase bg-[#02836f99]  rounded-2xl"
                                >
                                    {section}
                                </td>
                            </tr>

                            {claimsInGroup.map((claim) => (
                                <tr key={claim.id}>
                                    <td className="p-2 font-medium ">{claim.displayName}</td>
                                    {matrix?.roles?.map((role) => {
                                        const currentAccess = access?.find(
                                            (a) => a.roleId === role.id && a.claimId === claim.id
                                        )?.hasPermission;

                                        return (
                                            <td key={`${role.id}-${claim.id}`} className="p-2 text-center ">

                                                <label className="relative inline-flex items-center cursor-pointer">
                                                    <input
                                                        className="sr-only peer"
                                                        type="checkbox"
                                                        checked={currentAccess || false}
                                                        // className="w-[15px] h-[15px] cursor-pointer"
                                                        onChange={() => handleAccess(role.id, claim.id)}
                                                    />
                                                    <div className="w-11 h-6 bg-gray-300 peer-focus:outline-none 
                                                        peer-focus:ring-2 peer-focus:ring-[#02836f] rounded-full peer 
                                                        peer-checked:after:translate-x-full peer-checked:after:border-white 
                                                        after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
                                                        after:bg-white after:border-gray-300 after:border after:rounded-full 
                                                        after:h-5 after:w-5 after:transition-all peer-checked:bg-[#02836f]"></div>
                                                </label>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <button
                onClick={handleSubmit}
                className="bg-[#02836f] hover:[#02836f] px-4 py-2 rounded-lg text-white mt-4 transition-all cursor-pointer"
            >
                Yadda saxla
            </button>
        </section>
    );
};

export default AccessControl;
