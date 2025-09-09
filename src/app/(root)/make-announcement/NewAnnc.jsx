import AnncTypeButton from '@/components/ui/AnncTypeButton'
import React, { useState } from 'react'

const NewAnnc = () => {
  const [activeButton, setActiveButton] = useState(null);
  return (
    <>
      <div className=' h-full flex items-center justify-center gap-[95px] pb-[16px] border-b-[1px] border-[rgba(0,0,0,0.2)]'>
          <form action="">
            <div className='flex flex-col items-start justify-center gap-[30px]'>
              <h5 className='text-[#000] text-[24px]/[28px] font-medium'>
                Əsas məlumat
              </h5>
              <h6 className='text-[#000] text-[20px]/[24px]'>
                Yeni elan
              </h6>

              <div className='flex flex-row flex-wrap gap-x-[23px] gap-y-[32px]'>
              <AnncTypeButton
              src={"/icons/selling-black.svg"}
              srcOnHover={"/icons/selling-white.svg"}
              text={"Satıram"}
              isActive={activeButton === 'sell'}
              onClick={() => setActiveButton('sell')}
              />
              <AnncTypeButton
              src={"/icons/buying-black.svg"}
              srcOnHover={"/icons/buying-white.svg"}
              text={"Alıram"}
              isActive={activeButton === 'buy'}
              onClick={() => setActiveButton('buy')}
              />
              <AnncTypeButton
              src={"/icons/renting-black.svg"}
              srcOnHover={"/icons/renting-white.svg"}
              text={"Kirayə verirəm"}
              isActive={activeButton === 'rentOut'}
              onClick={() => setActiveButton('rentOut')}
              />
              <AnncTypeButton
              src={"/icons/searching-for-rent-black.svg"}
              srcOnHover={"/icons/searching-for-rent-white.svg"}
              text={"Kirayə axtarıram"}
              isActive={activeButton === 'rentIn'}
              onClick={() => setActiveButton('rentIn')}
              />
              
              </div>

            </div>
          </form>
      </div>
    
    </>
  )
}

export default NewAnnc
