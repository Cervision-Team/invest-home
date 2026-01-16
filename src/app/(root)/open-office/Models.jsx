import Image from 'next/image'
import React from 'react'

const Models = () => {
  return (
    <>
      <div className='w-full h-auto px-4 sm:px-8 lg:px-20 flex flex-col justify-center items-center'>
        <h2 className='text-[#1B1F27] text-center text-2xl sm:text-3xl lg:text-[32px] leading-tight lg:leading-[46px] font-medium'>Onlar qazandı, indi növbə səndə!</h2>
        <h4 className='text-[#3F444D] text-center text-sm sm:text-base lg:text-[16px] leading-relaxed lg:leading-[20px] mt-3 sm:mt-4'>Agentlərimizin sizə ilham olacaq uğur hekayələrini dinləyin.</h4>

          <div className="w-full flex justify-center mt-10 sm:mt-15">
            <div className="flex flex-nowrap items-center justify-center overflow-x-auto md:overflow-visible px-2 md:px-0 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {[
              { src: 'agent-1.jpg', w: 136, h: 146, r: 68, z: 1, ml: '' },
              { src: 'agent-2.jpg', w: 146, h: 154, r: 80, z: 2, ml: '-ml-6' },
              { src: 'agent-3.jpg', w: 174, h: 188, r: 113, z: 3, ml: '-ml-6' },
              { src: 'agent-4.jpg', w: 241, h: 253, r: 121, z: 4, ml: '-ml-6' },
              { src: 'agent-5.jpg', w: 174, h: 188, r: 125, z: 3, ml: '-ml-6' },
              { src: 'agent-6.jpg', w: 146, h: 154, r: 80, z: 2, ml: '-ml-6' },
              { src: 'agent-7.jpg', w: 136, h: 146, r: 68, z: 1, ml: '-ml-6' },
            ].map((img, idx) => (
              <div
                key={idx}
                className={`relative ${idx === 0 ? '' : '-ml-4 sm:-ml-5 lg:-ml-6'}`}
                style={{
                  width: `clamp(84px, 18vw, ${img.w}px)`,
                  height: `clamp(90px, 19vw, ${img.h}px)`,
                }}
              >
                <Image
                  src={`/images/open-office/${img.src}`}
                  alt={`agent-${idx + 1}`}
                  fill
                  className={` shadow-[0_2px_10px_0_rgba(128,128,128,0.50)] object-cover`}
                  style={{ borderRadius: `clamp(44px, 9vw, ${img.r}px)`, zIndex: img.z }}
                />
              </div>
            ))}
            </div>
          </div>
          <p className='w-full max-w-[628px] text-[#3F444D] text-center text-sm sm:text-base lg:text-[16px] leading-relaxed lg:leading-[22px] mt-8 sm:mt-11 px-2'>“Təcrübəni yenidən kəşf etməyə ehtiyac yoxdur! İnvest Home-la sınaqlardan keçmiş biliklərdən yararlan, inkişafa doğru
             addımla və uğurunu indi başlat!”</p>
          <h3 className='text-black text-center text-2xl sm:text-3xl lg:text-[32px] leading-tight lg:leading-[49px] font-medium mt-5 sm:mt-7'>Novruz Hüseynov</h3>
      </div>
    </>
  )
}

export default Models
