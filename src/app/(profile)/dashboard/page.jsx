import Image from 'next/image'
import React from 'react'
import profilePhoto from "../../../../public/images/profile/novruz.jpg"
import chatIcon from "../../../../public/images/profile/chat-icon.svg"
import notificationIcon from "../../../../public/images/profile/notification-icon.svg"
const Dashboard = () => {
  return (
    <section className='w-full'>
      <div className='bg-white py-[12px] px-[20px] flex justify-between w-full'>
        <div className='flex gap-[24px] items-center'>
          <div className='w-[100px] h-[100px]'>
            <Image src={profilePhoto} alt='profile photo' className='w-full h-full object-cover object-top rounded-full' />
          </div>
          <div className='flex flex-col gap-2'>
            <p className='text-xl font-medium'>Novruz Huseynov</p>
            <span className='text-lg text-[#02836F] capitalize'>founder</span>
          </div>
        </div>

        <div className='flex items-center gap-[24px]'>
          <button className='bg-[#02836F] text-white font-medium py-[12px] px-[24px] rounded-lg cursor-pointer'>Redaktə et</button>
          <button className='relative flex justify-center items-center bg-[#F5F5F5] rounded-xl w-[44px] h-[44px] cursor-pointer'>
            <span className='absolute right-[4px] top-[4px] w-[10px] h-[10px] rounded-full bg-[#FF403D]'></span>
            <Image src={chatIcon} alt='chat icon' />
          </button>
          <button className='relative flex justify-center items-center bg-[#F5F5F5] rounded-xl w-[44px] h-[44px] cursor-pointer'>
            <span className='absolute right-[4px] top-[4px] w-[10px] h-[10px] rounded-full bg-[#FF403D]'></span>
            <Image src={notificationIcon} alt='notification icon' />
          </button>

        </div>
      </div>

    </section>
  )
}

export default Dashboard