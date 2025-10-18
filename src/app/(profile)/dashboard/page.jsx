"use client"
// import StatisticWithCircleProgressBar from '@/components/ui/profile/StatisticWithCircleProgressBar'
import Summary from '@/components/ui/profile/Summary'
// import TotalStatistic from '@/components/ui/profile/TotalStatistic'
// import TotalStatisticWithProgressbar from '@/components/ui/profile/TotalStatisticWithProgressbar'
import React from 'react'
import { useForm } from 'react-hook-form';
// import licenseIcon from "../../../../public/icons/profile/license-icon.svg"
// import archiveIcon from "../../../../public/icons/profile/archive-icon.svg"



const Dashboard = () => {
  const { register, handleSubmit } = useForm();

  return (
    <main className='w-full flex flex-col gap-[24px]'>
      <section className='bg-white py-[12px] px-[20px]  shadow-[0px_4px_10px_0px_#0000001A] rounded-xl'>
        <Summary />

        <section className='w-[706px] border-t border-[#00000033] pt-[12px] mt-[28px] '>
          
          <div className='py-[12px]  '>
            <form className='grid grid-cols-2 w-full gap-x-[28px] gap-y-[20px] text-[#6C707A]'>
              <div className='flex flex-col gap-[8px]'>
                <label htmlFor="">Ad/Soyad</label>
                <input className='border border-[#6C707A] text-[#6C707A] text-[14px] px-[14px] py-[12px] bg-[#F8F9FC] rounded-[8px]' {...register("fullName")} type="text" />
              </div>

              <div className='flex flex-col gap-[8px]'>
                <label htmlFor="">Doğum tarixi</label>
                <input className='border border-[#6C707A] text-[#6C707A] text-[14px] px-[14px] py-[12px] bg-[#F8F9FC] rounded-[8px]' {...register("fullName")} type="text" />
              </div>

              <div className='flex flex-col gap-[8px]'>
                <label htmlFor="">Telefon</label>
                <input className='border border-[#6C707A] text-[#6C707A] text-[14px] px-[14px] py-[12px] bg-[#F8F9FC] rounded-[8px]' {...register("fullName")} type="text" />
              </div>

              <div className='flex flex-col gap-[8px]'>
                <label htmlFor="">Yaşayış ünvanı</label>
                <input className='border border-[#6C707A] text-[#6C707A] text-[14px] px-[14px] py-[12px] bg-[#F8F9FC] rounded-[8px]' {...register("fullName")} type="text" />
              </div>

              <div className='flex flex-col gap-[8px]'>
                <label htmlFor="">Email</label>
                <input className='border border-[#6C707A] text-[#6C707A] text-[14px] px-[14px] py-[12px] bg-[#F8F9FC] rounded-[8px]' {...register("fullName")} type="text" />
              </div>

              <div className='flex flex-col gap-[8px]'>
                <label htmlFor="">Vəzifəsi</label>
                <input className='border border-[#6C707A] text-[#6C707A] text-[14px] px-[14px] py-[12px] bg-[#F8F9FC] rounded-[8px]' {...register("fullName")} type="text" />
              </div>
            </form>
          </div>
        </section>
      </section>


      {/* <section>
        <TotalStatisticWithProgressbar text="Ümumi aylıq satış sayı"count={4562} percentage={40}/>
      </section> */}
      {/* <section className='grid grid-cols-2 gap-[24px]'>
        <StatisticWithCircleProgressBar color={"#02836F"} count={2356} text={"Satılan evlər"} target={"3k/aylıq"} percentage={71} />
        <StatisticWithCircleProgressBar color={"#FF9D14"} count={2356} text={"Kirayə evlər"} target={"3k/aylıq"} percentage={65} />
        <TotalStatistic icon={licenseIcon} text="Ümumi elan sayı" count={4562} />
        <TotalStatistic icon={archiveIcon} text="Arxivlənmiş elanlar" count={3028} />
      </section> */}
    </main>
  )
}

export default Dashboard