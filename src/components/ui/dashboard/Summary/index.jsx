import React from 'react'
import Image from 'next/image'
import profilePhoto from "../../../../../public/images/profile/novruz.jpg"
import { Button } from '../Buttons/ProfileButtons'

const Summary = ({ isEditing, handleToggle, user }) => {
    return (
        <>
            <div className='flex justify-between w-full'>
                <div className='flex gap-[24px] items-center'>
                    <div className='w-[100px] h-[100px]'>
                        <Image src={profilePhoto} alt='profile photo' className='w-full h-full object-cover object-top rounded-full' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='text-xl font-medium'>{user?.fullName}</p>
                        <span className='text-lg text-[#02836F] capitalize'>{user?.role}</span>
                    </div>
                </div>

                <div className='flex items-center gap-[24px]'>
                    <button type='submit' onClick={handleToggle} className='bg-[#02836F] text-white font-medium py-[12px] px-[24px] rounded-lg cursor-pointer'>{isEditing ? "Yadda saxla" : "Redaktə et"}</button>
                    <Button/>
                </div>
            </div>

        </>
    )
}

export default Summary