"use client"

import Image from 'next/image'
import React from 'react'
import InvestHomeLogo from "../../../../public/images/logo.png"
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const EntryGate = () => {

    const path = usePathname();
    console.log(path);


    return (
        <>
            <div className='flex flex-col gap-[35px]'>
                <div className='flex flex-col gap-[40px]'>
                    <div className='flex flex-col gap-[12px]'>
                        <div className='flex justify-center'>
                            <Image
                                src={InvestHomeLogo}
                                width={100}
                                height={100}
                                className="rounded-full"
                                alt="logo"
                            />
                        </div>
                        <span className='text-[20px] font-[500] text-center text-white'>Invest Home</span>
                    </div>
                    <div>
                        <h1 className='text-[36px] font-[500] text-center text-white'>
                            “Yeni evinizi tapmağa bir addım yaxınsınız”
                        </h1>
                    </div>
                </div>
                <div className='flex flex-col gap-[24px] items-center'>
                    <span className='text-[16px] font-[400] text-center text-white'>{path === '/login' ? "Hesabınız yoxdur? Qeydiyyatdan keçin." : "Hesabınız varmı? Daxil olun."}</span>
                    <Link className='py-[12px] border-[1px] rounded-[8px] border-white text-white w-full max-w-[361px]' href={`${path === '/login' ? "/register" : "/login"}`}>
                        <button className='cursor-pointer w-full'>{path === '/login' ? "Qeydiyyat" : "Daxil Ol"}</button>
                    </Link>
                </div>
            </div>
        </>
    )
}

export default EntryGate