import Image from 'next/image'
import React from 'react'

const Hero = () => {
  return (
    <>
      <div className='w-full h-auto flex flex-col items-center justify-center px-20'>
        <h2 className='text-[#1B1F27] text-center text-[32px]/[57px] font-medium'>İndi Birlikdə Qalib gəlməyin vaxtıdır!</h2>
        <h4 className='max-w-[440px] text-[#3F444D] text-center text-[16px]/[21px] mt-2'>Daşınmaz əmlak bazarında bir lider olan  İnvest Home-də ofis açmaq istərdinizmi?</h4>
        <div className=' flex flex-row items-start justify-center gap-6 mt-9 mb-13'>
            <Image className='rounded-[30px]' src="/images/open-office/office-1.jpg" alt="office-1" width={520} height={345} />
            <div className=' flex flex-col gap-5'>
              <h3 className='text-black text-[30px]/[40px] font-medium'>Peşekarlar arasında öz yerinizi tutun!</h3>
              <h5 className='text-[#3F444D] text-[18px]/[28px]'>Azərbaycanın  qlobal daşınmaz əmlak məsləhətçi brendi olan İnvest Home 2022-ci ildə yaradılıb. Azərbaycanda fəaliyyətə yeni 
                başlayan Invest Home, daşınmaz əmlak sahəsində müasir yanaşma və peşəkar komanda ilə qurulmuş bir şirkətdir.Qısa müddət ərzində
                 bazarda etibar və keyfiyyət prinsipləri ilə seçilərək, yaşayış və kommersiya daşınmaz əmlaklarının satışı, icarəsi və 
                 investisiya məsləhətçiliyi sahəsində xidmət göstərir. İnvest Home - un məqsədi müştərilərinin arzularını gerçəkləşdirmək və daşınmaz 
                 əmlak sektorunda etibarlı tərəfdaş kimi fərqlənməkdir.</h5>
            </div>
        </div>

        <button className='w-[220px] h-[50px] flex justify-center items-center rounded-lg bg-primary'>
          <span className='text-white text-center text-[16px]/[24px] font-medium'>Forma kliklə</span>
        </button>
      </div>
    </>
  )
}

export default Hero
