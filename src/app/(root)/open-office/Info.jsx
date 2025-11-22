import Image from 'next/image'
import React from 'react'

const InfoCard = ({image, title, description }) => {
  return (
    <div className='w-[411px] h-auto flex flex-col gap-4 items-start'>
         <div className="relative w-[411px] h-[272px] rounded-[30px] overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="411px"
        />
      </div>
        <h3 className='text-[#091226] text-[21px]/[25px] font-semibold'>{title}</h3>
        <p className='text-[#3F444D] text-[16px]/[24px]'>{description}</p>
    </div>
  )
}

const Info = () => {
  return (
    <>
      <div className='w-full h-auto px-20 flex flex-col justify-center'>
        <h2 className='text-[#141414] text-center text-[38px]/[46px] font-semibold'>
            Uğur bizim yanaşmamızın nəticəsidir.
        </h2>
        <h4 className='text-[#3F444D] text-center text-[18px]/[21px] mt-[18px]'>
            İnvest Home ilə olduğunuz zaman uğur qaçılmazdır!
        </h4>
        <div className='flex flex-row flex-wrap justify-between gap-y-13 mt-13'>
            <InfoCard 
                image="/images/open-office/office-2.jpg"
                title="Təcrübəli Komanda"
                description="Azərbaycan daşınmaz əmlak sektorunun ən dinamik komandası burada! Müasir yanaşması ilə fəaliyyətə 
                başlayan İnvest Home, beynəlxalq təcrübəni Azərbaycanda davam etdirir."
            />
            <InfoCard
                image="/images/open-office/office-3.jpg"
                title="Brendin gücü və marketinq"
                description="İnvest Home, brend tanınırlığını artırmaq və tərəfdaşlarının satış həcmini böyütmək məqsədilə bütün 
                müasir marketinq və tanıtım vasitələrindən səmərəli şəkildə istifadə edir."
                />
            <InfoCard
                image="/images/open-office/office-4.jpg"
                title="Texnologiya"
                description="İnvest Home, innovativ və etibarlı xidmətləri ilə müştərilərinə fərqli təcrübə təqdim edərək, qısa 
                zamanda bazarda peşəkarlığı və güvəni ilə seçilməyi hədəfləyir."
                />
            <InfoCard
              image="/images/open-office/office-5.jpg"
              title="Təhsil və Rəhbərlik"
              description="İnvest Home peşəkar inkişafı ön planda tutaraq, əməkdaşlarına mütəmadi təlimlər və ixtisasartırma imkanları təqdim edir."
            />
            <InfoCard
                image="/images/open-office/office-6.jpg"
                title="Əməkdaşlıqlar"
                description="İnvest Home, fəaliyyətə başladığı gündən bəritərəfdaşlarına dəyər qazandırmağı və qarşılıqlı inam 
                üzərindəgüclü əməkdaşlıqlar qurmağı özünə əsas məqsəd seçmişdir."
                />
            <InfoCard
                image="/images/open-office/office-7.jpg"
                title="Liderlik bacarığı"
                description="İnvest Home, yenilənən bazar tendensiyalarına uyğun innovativ və etibarlı xidmətləri ilə müştərilərinə 
                unikal təcrübə qazandırır."
                />
        </div>
      </div>
    </>
  )
}

export default Info
