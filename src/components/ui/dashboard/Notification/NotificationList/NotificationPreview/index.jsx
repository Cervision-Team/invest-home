"use client"

import React from 'react'
import profilePhoto from "../../../../../../../public/images/profile/novruz.jpg"
import Image from 'next/image'
import { useUser } from '@/context/UserContext'

const NotificationPreview = ({ isRead }) => {
  const { user } = useUser();
  const avatarSrc = user?.image?.url || null;
  const hasAvatar = Boolean(avatarSrc);
  const defaultProfileIcon = "/icons/profile.svg";
  return (
    <div className='bg-[#02836F0D] px-3 py-1.5 rounded-[20px] text-[#0A0D14]' style={{ backgroundColor: isRead ? "#FAFAFA" : "" }}>
      <div className='flex gap-[13px]'>
        <div className='w-12 h-12 relative'>
          {hasAvatar ? (
            <Image src={avatarSrc} alt='profile photo' fill className='h-full w-full rounded-full object-cover object-top' />
          ) : (
            <div className="w-full h-full rounded-full bg-(--primary-color) flex items-center justify-center">
              <Image src={defaultProfileIcon} alt="Default avatar" width={24} height={24} />
            </div>
          )}
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