"use client"
import HouseCard from '@/components/ui/HouseCard';
import { getAnnouncementByStatus, getAnnouncementFilter } from '@/services/api/endpoints/announcementService';
import React, { useEffect, useState } from 'react'

const PendingList = () => {

    const [activeType, setActiveType] = useState("enSon");
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showArrows, setShowArrows] = useState(false);
    // const [houseData, setHouseData] = useState([]);

    useEffect(() => {
        setLoading(true);
        setError(null);

        getAnnouncementByStatus("PENDING")
            .then(res => {
                setHouses(res?.content || []);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [activeType]);

    return (
        <div className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6'>
            {
                houses?.length !== 0 &&
                houses?.map((house, idx) => (
                    <div key={house?.id ?? idx} className='w-full'>
                        <HouseCard house={house} isActive={false} />
                    </div>
                ))
            }
        </div>
    )
}

export default PendingList
