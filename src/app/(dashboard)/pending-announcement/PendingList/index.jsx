"use client"
import HouseCard from '@/components/ui/HouseCard';
import { getAnnouncementFilter } from '@/services/api/endpoints/announcementService';
import React, { useEffect, useState } from 'react'

const PendingList = () => {

    const [activeType, setActiveType] = useState("enSon");
    const [houses, setHouses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showArrows, setShowArrows] = useState(false);
    const [houseData, setHouseData] = useState([]);

    useEffect(() => {
        setLoading(true);
        setError(null);

        getAnnouncementFilter()
            .then(res => {
                const mapped = res?.content?.map((item, index) => ({
                    ...item,
                    type: activeType,
                }));

                setHouseData(mapped);

                const filtered =
                    activeType === "enSon"
                        ? mapped
                        : mapped.filter((house) => house.type === activeType);

                setHouses(filtered);
            })
            .catch(err => setError(err.message))
            .finally(() => setLoading(false));
    }, [activeType]);

    return (
        <div className='grid grid-cols-3 gap-6'>
            {
                houses?.length !== 0 &&
                houses?.map((house) => (
                    <div className='w-[300px]'>
                        <HouseCard house={house} isActive={false}/>
                    </div>
                ))
            }
        </div>
    )
}

export default PendingList