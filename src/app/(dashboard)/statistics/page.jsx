import StatisticWithCircleProgressBar from '@/components/ui/dashboard/StatisticWithCircleProgressBar'
import Summary from '@/components/ui/dashboard/Summary'
import TotalStatistic from '@/components/ui/dashboard/TotalStatistic'
import TotalStatisticWithProgressbar from '@/components/ui/dashboard/TotalStatisticWithProgressbar'
import React from 'react'
import licenseIcon from "../../../../public/icons/profile/license-icon.svg"
import archiveIcon from "../../../../public/icons/profile/archive-icon.svg"
import documentIcon from "../../../../public/icons/profile/document-icon.svg"
import userIcon from "../../../../public/icons/profile/user-icon.svg"

const Statistics = () => {
  return (
    <main className='w-full flex flex-col gap-[24px]'>
   
      <section>
        <TotalStatisticWithProgressbar text="Ümumi aylıq satış sayı" count={4562} percentage={40} />
      </section>
      <section className='grid grid-cols-2 gap-[24px]'>
        <StatisticWithCircleProgressBar color={"#02836F"} count={2356} text={"Satılan evlər"} target={"3k/aylıq"} percentage={71} />
        <StatisticWithCircleProgressBar color={"#FF9D14"} count={2356} text={"Kirayə evlər"} target={"3k/aylıq"} percentage={65} />
        <TotalStatistic icon={licenseIcon} text="Ümumi elan sayı" count={4562} />
        <TotalStatistic icon={archiveIcon} text="Arxivlənmiş elanlar" count={3028} />
        <TotalStatistic icon={documentIcon} text="Ümumi sifariş sayı" count={4562} />
        <TotalStatistic icon={userIcon} text="Ümumi istifadəçi sayı" count={3028} />
      </section>
    </main>
  )
}

export default Statistics