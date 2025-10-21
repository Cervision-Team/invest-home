import React from 'react'
import buildingIcon from "../../../../../public/icons/profile/building-icon.svg"
import Image from 'next/image'


const TotalStatisticWithProgressbar = ({text,count,percentage}) => {
    return (
        <div className='bg-white p-[20px] flex gap-[24px] w-full shadow-[0px_4px_10px_0px_#0000001A] rounded-xl'>
            <div>
                <Image src={buildingIcon} alt='building' />
            </div>
            <div className='w-full flex flex-col justify-between'>
                <div className='flex justify-between '>
                    <span className='text-xl font-medium'>{text}</span>
                    <span className='font-medium text-[28px]'>{count}</span>
                </div>
                <div className='h-[8px] bg-[#E0F5F1] rounded-xl'>
                    <div className=' bg-[#02836F] h-full rounded-xl' style={{width:`${percentage}%`}}>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TotalStatisticWithProgressbar