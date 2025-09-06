"use client"
import AccordionPlus from '../../../public/icons/accordion-plus.svg'
import AccordionMinus from '../../../public/icons/accordion-minus.svg'
import Image from 'next/image'
import { useState } from 'react'

const InformationAccordion = () => {
  const [isAccordionOpen, setIsAccordionOpen] = useState(false)

  return (
    <>
      <div
        className='min-w-0 h-auto  max-[465px]:p-5 p-10 max-[465px]:rounded-[25px] rounded-[45px] border border-solid border-[#B3E5DD] shadow-[0_3px_0_0_#B3E5DD] transition-all duration-500 ease-in-out transform hover:scale-[1.02] hover:shadow-[0_6px_0_0_#B3E5DD]'
        style={{ backgroundColor: isAccordionOpen ? '#02836F' : '#26B5A0' }}
      >
        <div className='flex flex-row items-center justify-between'>
          <div className='flex flex-row items-center justify-center max-[400px]:gap-[12px] gap-[25px] font-medium'>
            <h2 className='text-[#F8F9FC] text-[60px] max-[477px]:text-[48px] max-[386px]:text-[34px] transition-all duration-300 ease-in-out'>01</h2>
            <h4 className='text-[#FAFAFA] text-[34px]/[46px] max-[522px]:text-[28px]/[46px] max-[386px]:text-[20px]/[35px] transition-all duration-300 ease-in-out'>
              Agent ol nədir? <br />Nə üçündür?
            </h4>
          </div>

          <div
            className='max-[327px]:w-[35px] max-[327px]:h-[35px] max-[417px]:w-[40px] max-[417px]:h-[40px] w-[58px] h-[58px] rounded-full border border-solid border-dark bg-[#F3F3F3] flex items-center justify-center cursor-pointer transition-all duration-300 ease-in-out hover:bg-white hover:scale-110 active:scale-95 shadow-md hover:shadow-lg'
            onClick={() => setIsAccordionOpen(!isAccordionOpen)}
          >
            <div className='transition-transform duration-300 ease-in-out'>
              <Image
                src={isAccordionOpen ? AccordionMinus : AccordionPlus}
                width={20}
                height={20}
                alt='AccordionPlus'
                className='transition-all duration-300 ease-in-out'
              />
            </div>
          </div>
        </div>

        <hr className='w-full h-[1px] text-[#FAFAFA] mt-[30px] max-[464px]:mt-[20px] transition-all duration-300 ease-in-out' />

        <div
          className={`overflow-hidden transition-all duration-500 ease-in-out ${isAccordionOpen
              ? 'max-h-[200px] opacity-100 mt-5'
              : 'max-h-0 opacity-0 mt-0'
            }`}
        >
          <p className='text-[#FAFAFA] text-[18px] transform transition-all duration-500 ease-in-out'>
            "Agent ol" – əmlak elanlarını paylaşaraq satışdan qazanc əldə etmə yoludur.
            Buradakı əsas məqsəd müştərilərə arzuladıqları əmlakı doğru, tez və asan bir şəkildə tapmaqdır.
          </p>
        </div>
      </div>
    </>
  )
}

export default InformationAccordion