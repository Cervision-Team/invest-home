import Image from 'next/image'
import React from 'react'

const Models = () => {
  return (
    <>
      <div className='w-full h-auto px-20 flex flex-col justify-center items-center'>
        <h2 className='text-[#1B1F27] text-center text-[32px]/[46px] font-medium'>Onlar qazandı, indi növbə səndə!</h2>
        <h4 className='text-[#3F444D] text-center text-[16px]/[20px] mt-4'>Agentlərimizin sizə ilham olacaq uğur hekayələrini dinləyin.</h4>
          <div className="flex flex-row justify-center items-center mt-15">
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
                className={`relative ${img.ml}`}
                style={{ width: img.w, height: img.h }}
              >
                <Image
                  src={`/images/open-office/${img.src}`}
                  alt={`agent-${idx + 1}`}
                  fill
                  className={` shadow-[0_2px_10px_0_rgba(128,128,128,0.50)] object-cover`}
                  style={{ borderRadius: img.r, zIndex: img.z }}
                />
              </div>
            ))}
          </div>
          <p className='w-[628px] text-[#3F444D] text-center text-[16px]/[22px] mt-11'>“Təcrübəni yenidən kəşf etməyə ehtiyac yoxdur! İnvest Home-la sınaqlardan keçmiş biliklərdən yararlan, inkişafa doğru
             addımla və uğurunu indi başlat!”</p>
          <h3 className='text-black text-center text-[32px]/[49px] font-medium mt-7'>Novruz Hüseynov</h3>
      </div>
    </>
  )
}

export default Models
