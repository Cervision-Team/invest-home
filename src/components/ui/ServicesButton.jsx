'use client';


import Image from 'next/image'
import React from 'react'
import { ButtonWithArrowRight } from './ButtonWithArrow'
import arrowRightPrimary from "../../../public/icons/arrow-right-primary.svg"
import arrowRightWhite from "../../../public/icons/arrow-right-white-small.svg"


const ServicesButton = ({name}) => {
  return (
    <>
      <button className='w-[600px] max-h-24 h-auto px-10 py-7 flex flex-row items-center justify-between gap-[28px] rounded-[20px]
       border border-solid border-[#26B5A0] shadow-[0_1px_0_0_#006C73]'>
         <span className='font-medium text-[18px] text-[#1B1F27]'>{name}</span>
            <ButtonWithArrowRight 
            bgColor="white"
            bgColorOnHover="#02836F"
            borderColor="#02836F"
            borderColorOnHover="white"
            icon={arrowRightPrimary}
            iconOnHover={arrowRightWhite}
            />
        
      </button>
    </>
  )
}

export default ServicesButton
