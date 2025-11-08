import React from 'react'
import profilePhoto from "../../../../../../../public/images/profile/novruz.jpg"
import Image from 'next/image'

const NotificationPreview = ({ isRead }) => {
  return (
    <div className='bg-[#02836F0D] px-3 py-1.5 rounded-[20px] text-[#0A0D14]' style={{ backgroundColor: isRead ? "#FAFAFA" : "" }}>
      <div className='flex gap-[13px]'>
        <div className='w-12 h-12'>
          <Image src={profilePhoto} alt='profile photo' className='w-full h-full object-cover rounded-full object-top' />
        </div>
        <div className='flex flex-col justify-between flex-1 py-1.5'>
          <div className='flex justify-between items-center'>
            <span className='text-lg font-medium leading-6 mb-1'>Yeni mesaj Alexdən</span>
          </div>
          <div className='flex flex-col'>
            <div className='flex items-center'>
              <span className='text-sm leading-[18px] mb-2'>
                Hey? Tomorrow is meeting. Don’t forget.
              </span>
            </div>
            <div className='flex justify-between items-center pr-1'>
              <span className='text-xs '>5 dq əvvəl</span>
              {
                !isRead &&
                <span className='w-3 h-3 bg-[#02836F] rounded-full flex justify-center items-center text-[14px] text-white font-semibold pt-0.5'></span>
              }
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}

export default NotificationPreview