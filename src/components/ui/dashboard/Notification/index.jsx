import React from 'react'
import NotificationList from './NotificationList'
import cancelIcon from "../../../../../public/icons/profile/cancel-icon.svg"
import Search from '../Search'
import Image from 'next/image'

const Notification = ({ search, setSearch, closeNotification }) => {
  return (
    <div className='w-[444px] bg-white rounded-[20px] p-7 shadow-[0px_4px_10px_0px_#00000040] absolute -top-15 -right-5 z-1000 '>
      <div className='flex justify-between items-center mb-5'>
        <span className='text-[#0A0D14] text-xl font-medium'>Bildirişlər</span>
        <button type='button' className='text-[#0A0D14] cursor-pointer' onClick={closeNotification}><Image src={cancelIcon} alt='cancel' /></button>
      </div>
      <div>
        <Search search={search} setSearch={setSearch} />
      </div>
      <div className='mt-5 text-[#1A73E8] leading-6 font-medium'>
        Bugün
      </div>
      <NotificationList />
    </div>
  )
}

export default Notification