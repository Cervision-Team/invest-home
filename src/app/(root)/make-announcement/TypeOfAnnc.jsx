import AnncTypeButton from '@/components/ui/AnncTypeButton'
import React from 'react'

const TypeOfAnnc = ({ activeButton, onAnnouncementTypeChange }) => {

  const handleButtonClick = (buttonType) => {
    onAnnouncementTypeChange(buttonType);
  };

  return (
    <>
      <div className='flex flex-col justify-center gap-[30px] h-full border-b-[1px] border-[rgba(0,0,0,0.2)]'>
        <div className='flex flex-col gap-[30px]'>
          <h5 className='text-[#000] text-[24px]/[28px] font-medium'>
            Əsas məlumat
          </h5>
          <h6 className='text-[#000] text-[20px]/[24px]'>
            Elan növü
          </h6>
        </div>
        <form className='mb-[23px]'>
          <div className='grid max-[1230px]:grid-cols-1 grid-cols-[303px_303px] gap-x-[23px] gap-y-[32px]'>
            <AnncTypeButton
              src={"/icons/home-sale-black.svg"}
              srcOnHover={"/icons/home-sale-white.svg"}
              text={"Satılıq"}
              isActive={activeButton === 'sell'}
              onClick={() => handleButtonClick('sell')}
            />
            <AnncTypeButton
              src={"/icons/for-rent-black.svg"}
              srcOnHover={"/icons/for-rent-white.svg"}
              text={"Kirayə"}
              isActive={activeButton === 'rent'}
              onClick={() => handleButtonClick('rent')}
            />
            <AnncTypeButton
              src={"/icons/calendar-black.svg"}
              srcOnHover={"/icons/calendar-white.svg"}
              text={"Gündəlik"}
              isActive={activeButton === 'daily'}
              onClick={() => handleButtonClick('daily')}
            />
            <AnncTypeButton
              src={"/icons/roommate-black.svg"}
              srcOnHover={"/icons/roommate-white.svg"}
              text={"Otaq yoldaşı"}
              isActive={activeButton === 'roommate'}
              onClick={() => handleButtonClick('roommate')}
            />
          </div>
        </form>
      </div>
    </>
  )
}

export default TypeOfAnnc