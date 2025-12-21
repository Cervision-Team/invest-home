"use client"
import HouseCard from '@/components/ui/HouseCard';
import { Button } from '@/components/ui/dashboard/Buttons/ProfileButtons';
import Search from '@/components/ui/dashboard/Search';
import { getAnnouncementByStatus } from '@/services/api/endpoints/announcementService';
import React, { useEffect, useState } from 'react'

const PendingList = () => {
    const [search, setSearch] = useState();
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        getAnnouncementByStatus("PENDING")
            .then(res => {
                setHouses(res?.content || []);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, []);

    return (
        <main className="w-full h-full">
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-10'>
                <div className='w-full md:max-w-md'>
                    <Search search={search} setSearch={setSearch} />
                </div>
                <div className='flex gap-3 md:gap-6 md:justify-end'>
                    <Button />
                </div>
            </div>

            <h1 className='text-[#1B1F27] text-[20px] font-semibold mb-8'>Gözləyən elanlar</h1>

            {loading ? (
                <div className="w-full py-16 flex items-center justify-center text-lg text-gray-500 border border-dashed rounded-xl">
                    Yüklənir...
                </div>
            ) : error ? (
                <div className="w-full py-16 flex items-center justify-center text-lg text-gray-500 border border-dashed rounded-xl">
                    {error}
                </div>
            ) : houses?.length ? (
                <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
                    {houses?.map((house, idx) => (
                        <div key={house?.id ?? idx} className='w-full'>
                            <HouseCard house={house} isActive={false} />
                        </div>
                    ))}
                </div>
            ) : (
                <div className="w-full py-16 flex items-center justify-center text-lg text-gray-500 border border-dashed rounded-xl">
                    Hazırda elan yoxdur
                </div>
            )}
        </main>
    )
}

export default PendingList
