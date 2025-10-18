
import StatisticWithCircleProgressBar from '@/components/ui/profile/StatisticWithCircleProgressBar'
import Summary from '@/components/ui/profile/Summary'
import TotalStatistic from '@/components/ui/profile/TotalStatistic'
import TotalStatisticWithProgressbar from '@/components/ui/profile/TotalStatisticWithProgressbar'
import React from 'react'
import licenseIcon from "../../../../../public/icons/profile/license-icon.svg"
import archiveIcon from "../../../../../public/icons/profile/archive-icon.svg"

const Profile = () => {
  return (
    <main className='w-full flex flex-col gap-[24px]'>
      <section>
        <Summary />
      </section>
      <section>
        <TotalStatisticWithProgressbar text="Ümumi aylıq satış sayı"count={4562} percentage={40}/>
      </section>
      <section className='grid grid-cols-2 gap-[24px]'>
        <StatisticWithCircleProgressBar color={"#02836F"} count={2356} text={"Satılan evlər"} target={"3k/aylıq"} percentage={71} />
        <StatisticWithCircleProgressBar color={"#FF9D14"} count={2356} text={"Kirayə evlər"} target={"3k/aylıq"} percentage={65} />
        <TotalStatistic icon={licenseIcon} text="Ümumi elan sayı" count={4562} />
        <TotalStatistic icon={archiveIcon} text="Arxivlənmiş elanlar" count={3028} />
      </section>
    </main>
  )
}

export default Profile