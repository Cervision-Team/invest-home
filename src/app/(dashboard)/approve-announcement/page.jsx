"use client"
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import photo from "../../../../public/images/profile/novruz.jpg"
import announcement from "../../../../public/images/profile/announcement.png"
import { Button } from '@/components/ui/dashboard/Buttons/ProfileButtons'
import Search from '@/components/ui/dashboard/Search'
import { approveAnnouncement, getAnnouncementByStatus } from '@/services/api/endpoints/announcementService'
const ApproveAnnouncmenet = () => {
    const data = Array.from({ length: 10 })
    const [search, setSearch] = useState();
    const [announcementData, setAnnouncementData] = useState(null)
    const handleStatus = async (id, status) => {
        // await approveAnnouncement(id, status)
        console.log(id, status);

    }

    useEffect(() => {
        (async () => {
            const res = await getAnnouncementByStatus("ASSIGNED_TO_AGENT");
            setAnnouncementData(res.content)
            console.log(res.content);
        })()
    }, [])
    return (
        <main className="w-full h-full">
            <div className='flex justify-between mb-10 '>
                <div className='min-w-[410px]'>
                    <Search search={search} setSearch={setSearch} />
                </div>
                <div className='flex gap-6'>
                    <Button />
                </div>
            </div>
            <h1 className='text-[#1B1F27] text-[20px] font-semibold mb-8'>Bütün müştərilər</h1>

            <div className='grid grid-cols-3 w-full gap-6 '>

                {
                    announcementData?.map((announcement, i) => (
                        <div key={announcement?.id} className='rounded-[20px] shadow-[0px_4px_10px_0px_#00000026] p-5'>
                            <div className='flex items-center border-b border-[#02836F33] pb-3 mb-[10px]'>
                                <div className='w-[55px] h-[55px] mr-5'>
                                    <Image src={photo} alt='customer photo' className='w-full h-full object-cover object-top rounded-full' />
                                </div>
                                <div className='flex flex-col gap-1.5 '>
                                    <strong className='text-[20px]  font-medium'>
                                        Sevinc Qurbanova
                                    </strong>
                                    <span className='text-[14px] text-[#02836F]  font-medium'>
                                        +99455-252-52-00
                                    </span>
                                </div>
                            </div>
                            <div className='bg-[#fafafa] flex justify-between gap-[10px] px-3 py-2 shadow-[0px_4px_10px_0px_#0000000D] '>
                                <div className='flex flex-col gap-4'>
                                    <span className='text-[14px] font-medium'>
                                        Xəzər ray. <br /> Buzovna qəsəbəsi
                                    </span>
                                    <div className='flex flex-col'>
                                        <span className='text-xs text-[#6C707A]'>Məbləğ</span>
                                        <span className='text-[14px] text-[#1B1F27] font-medium'>{announcement?.price} azn</span>
                                    </div>
                                </div>
                                <div className='w-[82px] h-[82px]'>
                                    <Image src={announcement?.medias[0]?.imageUrl} alt='announcement' className='w-full h-full' width={82} height={82}/>
                                    <div className='flex gap-2'>
                                        <span className='text-[14px] text-[#9CA3AF] font-medium'>ID</span>
                                        <span className='text-[14px] text-[#02836F] font-medium'>#567841</span>
                                    </div>
                                </div>
                            </div>

                            <div className='flex flex-col gap-2 mt-3'>
                                <button onClick={() => handleStatus(announcement?.id, "APPROVED")} className='cursor-pointer bg-green-200 py-2 rounded-sm'>Tesdiq et</button>
                                <button onClick={() => handleStatus(announcement?.id, "PENDING")} className='cursor-pointer bg-red-200 py-2 rounded-sm'>Redd et</button>
                            </div>

                        </div>

                    ))
                }
            </div>
        </main>

    )
}

export default ApproveAnnouncmenet