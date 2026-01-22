import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import openOfficeImg from '../../../../public/images/openoffice.jpg'

const OpenOffice = () => {
  return (
    <>
      <div className='w-full h-auto px-4 sm:px-6 lg:px-20'>
        <div className='relative flex w-full h-auto flex-col items-center justify-start gap-10 px-4 py-8 sm:px-7 sm:py-9 md:flex-row md:gap-[60px]'>
          <div className='relative w-full max-w-[485px] aspect-485/324'>
            <Image
              src={openOfficeImg}
              alt='OpenOffice Logo'
              fill
              sizes='(max-width: 768px) 100vw, 485px'
              className='object-cover'
              unoptimized
            />
          </div>

          <div className='max-w-[550px] flex flex-col justify-center items-start gap-[33px]'>
            <h2 className='text-[30px]/[36px] text-black md:text-[40px]/[47px] font-semibold'>Ofis açmaq istəyirsən?  Elə isə doğru ünvandasan!</h2>

            <p className='max-w-[415px] text-[#2B2B2B] text-[16px]/[26px] font-normal'>
              Fusce venenatis tellus a felis scelerisque, non pulvinar est pellentesque.
            </p>
            <Link href="/open-office" className='w-full sm:w-auto'>
              <button className='w-full sm:w-[305px] h-[62px] bg-primary rounded-[30px] flex justify-center items-center cursor-pointer'>
                <span className='text-white text-[20px]/[24px] font-normal'>Ofis Aç</span>
              </button>
            </Link>
          </div>


          <svg className='pointer-events-none hidden md:block absolute -top-3 -left-3 -z-10' xmlns="http://www.w3.org/2000/svg" width="54" height="54" viewBox="0 0 54 54" fill="none">
            <circle opacity="0.5" cx="26.6666" cy="26.6666" r="26.6666" transform="matrix(0.300111 0.953904 -0.957985 0.286819 44.3203 -6.5166)" fill="url(#paint0_linear_8815_41851)" />
            <defs>
              <linearGradient id="paint0_linear_8815_41851" x1="26.6666" y1="0" x2="26.6666" y2="53.3332" gradientUnits="userSpaceOnUse">
                <stop stopColor="#02836F" />
                <stop offset="1" stopColor="#4361EE" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <svg className='pointer-events-none hidden lg:block absolute top-[46px] right-[300px] -z-10' xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 61 61" fill="none">
            <ellipse opacity="0.5" cx="30.1998" cy="30.1998" rx="30.1998" ry="30.1998" transform="matrix(0.0827705 0.996569 -0.997623 0.0689059 57.8633 -2.00781)" fill="url(#paint0_linear_8815_41856)" />
            <defs>
              <linearGradient id="paint0_linear_8815_41856" x1="30.1998" y1="0" x2="30.1998" y2="60.3996" gradientUnits="userSpaceOnUse">
                <stop stopColor="#02836F" />
                <stop offset="1" stopColor="#4361EE" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <svg className='pointer-events-none hidden md:block absolute right-0 bottom-[17px] -z-10' xmlns="http://www.w3.org/2000/svg" width="153" height="156" viewBox="0 0 153 156" fill="none">
            <ellipse opacity="0.5" cx="77" cy="77" rx="77" ry="77" transform="matrix(0.655431 -0.755255 0.746068 0.665869 -31.4492 84.4128)" fill="url(#paint0_linear_8815_41852)" />
            <defs>
              <linearGradient id="paint0_linear_8815_41852" x1="77" y1="0" x2="77" y2="154" gradientUnits="userSpaceOnUse">
                <stop stopColor="#02836F" />
                <stop offset="1" stopColor="#4361EE" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          <svg className='pointer-events-none hidden md:block absolute right-0 bottom-[65px] -z-10' xmlns="http://www.w3.org/2000/svg" width="66" height="66" viewBox="0 0 66 66" fill="none">
            <circle opacity="0.5" cx="32.7889" cy="32.7889" r="32.7889" transform="matrix(0.862514 -0.506033 0.493991 0.869467 -11.8828 21.0745)" fill="url(#paint0_linear_8815_41853)" />
            <defs>
              <linearGradient id="paint0_linear_8815_41853" x1="32.7889" y1="0" x2="32.7889" y2="65.5778" gradientUnits="userSpaceOnUse">
                <stop stopColor="#02836F" />
                <stop offset="1" stopColor="#4361EE" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    </>
  )
}

export default OpenOffice
