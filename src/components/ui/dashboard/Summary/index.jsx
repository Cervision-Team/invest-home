import React from 'react'
import Image from 'next/image'
import profilePhoto from "../../../../../public/images/profile/novruz.jpg"
import { Button } from '../Buttons/ProfileButtons'

const Summary = ({ isEditing, handleToggle, user }) => {
    return (
        <>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full'>
                <div className='flex gap-4 sm:gap-6 items-center'>
                    <div className='w-[72px] h-[72px] sm:w-[100px] sm:h-[100px] shrink-0'>
                        <Image src={profilePhoto} alt='profile photo' className='w-full h-full object-cover object-top rounded-full' />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p className='text-xl font-medium'>{user?.fullName}</p>
                        <span className='text-lg text-[#02836F] capitalize'>{user?.role}</span>
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6'>
                    <button type='submit' onClick={handleToggle} className='bg-[#02836F] text-white font-medium py-3 px-6 rounded-lg cursor-pointer'>{isEditing ? "Yadda saxla" : "Redaktə et"}</button>
                    <Button/>
                </div>
            </div>

        </>
    )
}

export default Summary
