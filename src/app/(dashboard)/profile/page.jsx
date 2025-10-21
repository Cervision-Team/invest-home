
"use client"
import ProfileForm from '@/components/ui/dashboard/ProfileForm';
// import StatisticWithCircleProgressBar from '@/components/ui/profile/StatisticWithCircleProgressBar'
import Summary from '@/components/ui/dashboard/Summary'
// import TotalStatistic from '@/components/ui/profile/TotalStatistic'
// import TotalStatisticWithProgressbar from '@/components/ui/profile/TotalStatisticWithProgressbar'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
// import licenseIcon from "../../../../public/icons/profile/license-icon.svg"
// import archiveIcon from "../../../../public/icons/profile/archive-icon.svg"

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { register, handleSubmit } = useForm({
    defaultValues: {
      fullName: "Novruz Hüseynov",
      birthDate: "15.05.1970",
      phoneNumber: "55 333 44 55",
      address: "Heydər  Əliyev pr.",
      email: "investhome@index.com",
      role: "Rəhbər",
    }
  });


  const onSubmit = (data) => {
    if(!isEditing){
      console.log(data)
    }else{
      console.log("!!!")
    }
  }

  const handleToggle = () => {
    setIsEditing(prev => !prev)
  }

  return (
    <main className='w-full flex flex-col gap-[24px]'>
      <section className=''>
        <ProfileForm isEditing={isEditing} handleSubmit={handleSubmit} onSubmit={onSubmit} register={register}>
          <Summary isEditing={isEditing} handleToggle={handleToggle} />
        </ProfileForm>
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

export default Profile