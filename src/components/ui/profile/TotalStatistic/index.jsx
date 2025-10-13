import React from 'react'
import Image from 'next/image'

const TotalStatistic = ({ icon, text, count }) => {

    return (
        <div className='bg-white p-[20px] flex gap-[24px] w-full shadow-[0px_4px_10px_0px_#0000001A] rounded-xl'>
            <div>
                <Image src={icon} alt='license' />
            </div>
            <div className='w-full flex flex-col justify-center'>
                <div className='flex justify-between items-center'>
                    <span className='text-xl font-medium'>{text}</span>
                    <span className='font-medium text-[28px]'>{count}</span>
                </div>

            </div>
        </div>
    )
}

export default TotalStatistic