import React from 'react'
import profilePhoto from "../../../../../../../public/images/profile/novruz.jpg"
import Image from 'next/image'

const ChatPreview = () => {
    return (
        <div className='bg-[#02836F0D] px-3 py-1.5 rounded-[20px]'>
            <div className='flex gap-[13px]'>
                <div className='w-[68px] h-[68px]'>
                    <Image src={profilePhoto} alt='profile photo' className='w-full h-full object-cover rounded-full object-top' />
                </div>
                <div className='flex flex-col justify-between flex-1 py-1.5'>
                    <div className='flex justify-between items-center'>
                        <span className='pl-[13px] text-lg font-semibold leading-[27px]'>Novruz Huseynov</span>
                        <span className='text-[14px] font-medium text-[#00000099]'>13:00</span>
                    </div>
                    <div className='flex justify-between'>
                        <div className='flex items-center gap-1'>
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <path d="M3 9.675L5.35725 12.375L11.25 5.625M15 5.67225L8.571 12.4222L8.25 12" stroke="#0A0D14" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                            </svg>
                            <span className='text-[#00000099] leading-[18px]'>
                                Ok, ele ise baslayaq 😉
                            </span>
                        </div>
                        <span className='w-5 h-5 bg-[#02836F] rounded-full flex justify-center items-center text-[14px] text-white font-semibold pt-0.5'>1</span>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default ChatPreview