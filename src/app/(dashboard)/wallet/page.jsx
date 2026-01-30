"use client"
import React, { useState } from 'react'
import addIcon from "../../../../public/icons/profile/add-icon.svg"
import Image from 'next/image'
import { Button } from '@/components/ui/dashboard/Buttons/ProfileButtons'

const Wallet = () => {
    const [isOpen, setIsOpen] = useState(false);

    const handleClick = () => {
        setIsOpen(true);
    };

    const handleClose = (e) => {
        if (e.target.id === "overlay") setIsOpen(false);
    };
    return (
        <main className='w-full '>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-end mb-10'>
                <div className='flex gap-3 md:gap-6 md:justify-end'>
                    {/* <Button /> */}
                </div>
            </div>
            <h1 className='text-[#1B1F27] text-[20px] font-semibold mb-8'>Balansım</h1>
            <section className='grid grid-cols-1 md:grid-cols-2 gap-4 text-2xl'>
                <div className='w-full h-[150px] rounded-2xl text-[#1B1F27] p-5 flex items-center justify-between border-2 border-[#02836F]'>
                    Hazırki balans
                    <span className='text-[32px] font-semibold '>15 azn</span>
                </div>
                <button onClick={handleClick} className='w-full h-[150px] rounded-2xl text-[#1B1F27] p-5 flex items-center justify-between border-2 border-[#02836F] cursor-pointer' >
                    Balans artır
                    <Image src={addIcon} alt='add icon' />
                </button>
            </section>

            {isOpen && (
                <div
                    id="overlay"
                    onClick={handleClose}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-999 "
                >
                    <div
                        className="bg-white rounded-2xl shadow-xl p-6 h-[90dvh] w-[90%] max-w-[640px]"
                    >
                    </div>
                </div>
            )}
        </main>
    )
}

export default Wallet
