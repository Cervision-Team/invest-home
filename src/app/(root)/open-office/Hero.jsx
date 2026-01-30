import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
    <>
      <section className='w-full'>
        <div className='max-w-[1600px] mx-auto px-20 max-[1025px]:px-5 max-[431px]:px-4 flex flex-col items-center justify-center'>
        <h2 className='text-[#1B1F27] text-center text-2xl sm:text-3xl md:text-[32px] leading-tight sm:leading-[45px] md:leading-[57px] font-medium'>
          İndi Birlikdə Qalib gəlməyin vaxtıdır!
        </h2>
        <h4 className='max-w-full sm:max-w-[540px] md:max-w-[440px] text-[#3F444D] text-center text-sm sm:text-base md:text-[16px] leading-relaxed md:leading-[21px] mt-2 px-4 sm:px-0'>
          Daşınmaz əmlak bazarında bir lider olan İnvest Home-də ofis açmaq istərdinizmi?
        </h4>
        <div className='w-full grid grid-cols-1 lg:grid-cols-2 items-start gap-6 lg:gap-10 mt-6 sm:mt-8 md:mt-9 mb-10 md:mb-16'>
          <div className='w-full'>
            <div
              className='relative w-full rounded-[20px] sm:rounded-[25px] md:rounded-[30px] overflow-hidden'
              style={{ aspectRatio: '520 / 345' }}
            >
              <Image
                src="/images/open-office/office-1.jpg"
                alt="office-1"
                fill
                sizes="(max-width: 1024px) 100vw, 720px"
                className='object-cover'
                priority
              />
            </div>
          </div>

          <div className='flex flex-col gap-3 sm:gap-4 md:gap-5 lg:pt-2'>
            <h3 className='text-black text-xl sm:text-2xl md:text-[30px] leading-snug sm:leading-relaxed md:leading-10 font-medium'>
              Peşekarlar arasında öz yerinizi tutun!
            </h3>
            <p className='text-[#3F444D] text-sm sm:text-base md:text-[18px] leading-relaxed sm:leading-7 md:leading-7'>
              Azərbaycanın qlobal daşınmaz əmlak məsləhətçi brendi olan İnvest Home 2022-ci ildə yaradılıb. Azərbaycanda fəaliyyətə yeni
              başlayan Invest Home, daşınmaz əmlak sahəsində müasir yanaşma və peşəkar komanda ilə qurulmuş bir şirkətdir. Qısa müddət ərzində
              bazarda etibar və keyfiyyət prinsipləri ilə seçilərək, yaşayış və kommersiya daşınmaz əmlaklarının satışı, icarəsi və
              investisiya məsləhətçiliyi sahəsində xidmət göstərir. İnvest Home - un məqsədi müştərilərinin arzularını gerçəkləşdirmək və daşınmaz
              əmlak sektorunda etibarlı tərəfdaş kimi fərqlənməkdir.
            </p>
          </div>
        </div>

       <a href="#office-form" className='w-full flex justify-center items-center'>
        <button className='w-full sm:w-[250px] md:w-[220px] h-12 sm:h-[50px] flex justify-center items-center rounded-lg bg-primary hover:opacity-90 transition-opacity'>
          <span className='text-white text-center text-sm sm:text-base md:text-[16px] leading-6 md:leading-6 font-medium'>
            Forma kliklə
          </span>
        </button>
       </a>
        </div>
      </section>
    </>
  )
}

export default Hero