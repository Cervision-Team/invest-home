import Image from 'next/image'
import React from 'react'
import doneIcon from "../../../../public/icons/profile/done-icon.svg"
import pendingIcon from "../../../../public/icons/profile/pending-icon.svg"
import dromenuIcon from "../../../../public/icons/profile/dropmenu-icon.svg"
const TransactionHistory = () => {
    return (
        <main className='w-full text-[#1B1F27]'>
            <h1 className='text-[#1B1F27] text-[30px] font-semibold mb-8'>Ödənişlərim</h1>
            <section className='flex flex-col gap-5'>
                <div className='border border-[#02836F] w-full h-[164px] rounded-2xl px-5 pt-8 pb-5'>
                    <div className="border-b flex flex-col gap-4 pb-2">
                        <div className='flex justify-between items-center'>
                            <div className='flex gap-[26px] items-center'>
                                <div className='flex gap-3'>Ödəniş <span>#4</span></div>
                                <span className='flex items-center justify-center text-[#FAFAFA] bg-[#FF9D14] rounded-[20px] w-[140px] h-8 gap-2.5'><Image src={pendingIcon} /> Gözlənilir</span>
                            </div>

                            <span className='font-medium text-2xl'>15 azn</span>
                        </div>
                        <div className='flex justify-between items-center'>
                            <span>#567841565</span>
                            <div className='flex gap-2.5'>
                                <span>10/10/2025</span>
                                <span>14:45</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end pt-4'>
                        <button className='cursor-pointer'>
                            <Image src={dromenuIcon} />
                        </button>
                    </div>
                </div>
                <div className='border border-[#02836F] w-full h-[164px] rounded-2xl px-5 pt-8 pb-5'>
                    <div className="border-b flex flex-col gap-4 pb-2">
                        <div className='flex justify-between items-center'>
                            <div className='flex gap-[26px] items-center'>
                                <div className='flex gap-3'>Ödəniş <span>#4</span></div>
                                <span className='flex items-center justify-center text-[#FAFAFA] bg-[#02836F] rounded-[20px] w-[140px] h-8 gap-2.5'><Image src={doneIcon} /> Ödənilib</span>
                            </div>

                            <span className='font-medium text-2xl'>15 azn</span>
                        </div>
                        <div className='flex justify-between items-center'>
                            <span>#567841565</span>
                            <div className='flex gap-2.5'>
                                <span>10/10/2025</span>
                                <span>14:45</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end pt-4'>
                        <button className='cursor-pointer'>
                            <Image src={dromenuIcon} />
                        </button>
                    </div>
                </div>
                <div className='border border-[#02836F] w-full h-[164px] rounded-2xl px-5 pt-8 pb-5'>
                    <div className="border-b flex flex-col gap-4 pb-2">
                        <div className='flex justify-between items-center'>
                            <div className='flex gap-[26px] items-center'>
                                <div className='flex gap-3'>Ödəniş <span>#4</span></div>
                                <span className='flex items-center justify-center text-[#FAFAFA] bg-[#02836F] rounded-[20px] w-[140px] h-8 gap-2.5'><Image src={doneIcon} /> Ödənilib</span>
                            </div>

                            <span className='font-medium text-2xl'>15 azn</span>
                        </div>
                        <div className='flex justify-between items-center'>
                            <span>#567841565</span>
                            <div className='flex gap-2.5'>
                                <span>10/10/2025</span>
                                <span>14:45</span>
                            </div>
                        </div>
                    </div>
                    <div className='flex justify-end pt-4'>
                        <button className='cursor-pointer'>
                            <Image src={dromenuIcon} />
                        </button>
                    </div>
                </div>

            </section>
        </main>
    )
}

export default TransactionHistory