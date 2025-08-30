'use client';
import React from 'react'
import Image from 'next/image'
import { useMediaQuery } from '@/hooks/useMediaQuery';
import TabBarBg from '../../../../public/images/tab-bar.svg'
import Link from 'next/link';

const TabBar = () => {
    const isMobile = useMediaQuery('(max-width: 430px)');

    return (
        <>
            {isMobile ?
                <section className="relative z-99 h-[125px]">
                    <div className="fixed bottom-0 w-full">
                        <button
                            className="absolute rounded-full w-[61px] h-[61px] bg-[#02836F] border-none left-1/2 translate-x-[-50%] top-[-30.5px]">
                            <i className="text-white text-[40px] fa-solid fa-plus"></i>
                        </button>
                        <div className="flex justify-center">
                            <div className="bg-[#02836F] w-full h-[71px]"></div>
                            <Image
                                src={TabBarBg}
                                alt="bg"
                                width={0}
                                height={0}
                                className='max-w-none'
                            />
                            <div className="bg-[#02836F] w-full h-[71px]"></div>
                        </div>
                        <div
                            className="gap-[60px] box-border p-[12px] flex justify-between absolute top-0 h-[71px] w-full">
                            <div className="flex justify-between w-[146px]">
                                <div className="basis-[63px]">
                                    <Link href={'/'} className='flex flex-col justify-between items-center h-full'>
                                        <Image
                                            priority
                                            height={24}
                                            width={24}
                                            src={"/icons/home.svg"}
                                            alt='home'
                                        />
                                        <span className="text-white text-[12px] font-[400]">Home</span>
                                    </Link>
                                </div>
                                <div className="basis-[63px]">
                                    <Link href={'/favorites'} className='flex flex-col justify-between items-center h-full'>
                                        <Image
                                            priority
                                            height={24}
                                            width={24}
                                            src={"/icons/heart.svg"}
                                            alt='heart'
                                        />
                                        <span className="text-white text-[12px] font-[400]">Sevimlilər</span>
                                    </Link>
                                </div>
                            </div>
                            <div className="flex justify-between w-[127px]">
                                <div className="basis-[31px]">
                                    <Link href={'/contact'} className='flex flex-col justify-between items-center h-full'>
                                        <Image
                                            priority
                                            height={24}
                                            width={24}
                                            src={"/icons/notification.svg"}
                                            alt='notification'
                                        />
                                        <span className="text-white text-[12px] font-[400]">Əlaqə</span>
                                    </Link>
                                </div>
                                <div className="basis-[63px]">
                                    <Link href={'/login'} className='flex flex-col justify-between items-center h-full'>
                                        <Image
                                            priority
                                            height={24}
                                            width={24}
                                            src={"/icons/profile.svg"}
                                            alt='profile'
                                        />
                                        <span className="text-white text-[12px] font-[400]">Profil</span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section >
                : ''}
        </>
    )
}

export default TabBar