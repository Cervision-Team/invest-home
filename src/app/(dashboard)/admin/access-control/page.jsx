"use client"
import React, { useEffect, useState } from 'react'
import axios from 'axios'



const AccessControl = () => {
    const [access, setAccess] = useState([]);
    const [matrix, setMatrix] = useState({});

    useEffect(() => {
        (async () => {
            const res = await axios.get("http://192.168.0.192:8081/v1/role-claim/matrix")
            setMatrix(res.data)
            setAccess(res.data.rolesClaims.map(item => ({ ...item, original: true })));
        })()
    }, [])


    const handleAccess = (roleId, claimId) => {
        setAccess(prev => {
            const existing = prev.find(a => a.roleId === roleId && a.claimId === claimId);

            if (existing) {
                const toggled = !existing.hasPermission;
                return prev.map(a =>
                    a.roleId === roleId && a.claimId === claimId
                        ? { ...a, hasPermission: toggled }
                        : a
                );
            } else {
                return [...prev, { roleId, claimId, hasPermission: true, original: false }];
            }
        });
    };


    const handleSubmit = async() => {

        const payload = access
        .filter(a => (a.original) || (!a.original && a.hasPermission))
        .map(a => ({ roleId: a.roleId, claimId: a.claimId, hasPermission: a.hasPermission }));
        
        const res = await axios.put("http://192.168.0.192:8081/v1/role-claim",payload)
            
            
        console.log("Payload to send:", payload);
    };
    console.log(matrix);

    return (
        <section className='w-full'>
            <table className="w-full border-collapse border border-gray-300">
                <thead >
                    <tr>
                        <th className="w-[200px] text-left p-2 border">Role & Permission</th>
                        {matrix?.roles?.map(role => <th key={role?.id} className="text-left p-2 border">{role.name}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {
                        matrix?.claims?.map(claim => (
                            <tr key={claim.id}>
                                <td className="p-2 border font-medium">{claim.name}</td>
                                {
                                    matrix?.roles?.map(role => {
                                        const currentAccess = access?.find(
                                            (a) =>
                                                a.roleId === role.id && a.claimId === claim.id
                                        )?.hasPermission;
                                        console.log(matrix?.rolesClaims);

                                        return (
                                            <td key={`${role.id}-${claim.id}`} className="p-2 border text-center">
                                                <input
                                                    type="checkbox"
                                                    checked={currentAccess || false}
                                                    onChange={(e) => handleAccess(role.id, claim.id, e.target.checked)} />
                                            </td>
                                        )
                                    }
                                    )
                                }
                            </tr>

                        ))
                    }
                </tbody>
            </table>
            <button onClick={handleSubmit} className='bg-green-400 px-3 py-1 rounded-xl text-white mt-4 cursor-pointer'>Yadda saxla</button>
        </section>
    )
}

export default AccessControl