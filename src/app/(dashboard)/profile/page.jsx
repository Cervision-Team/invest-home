
"use client"
import ProfileForm from '@/components/ui/dashboard/ProfileForm';
// import StatisticWithCircleProgressBar from '@/components/ui/profile/StatisticWithCircleProgressBar'
import Summary from '@/components/ui/dashboard/Summary'
import { getUser, updateUser } from '@/services/api/endpoints/userService';
// import TotalStatistic from '@/components/ui/profile/TotalStatistic'
// import TotalStatisticWithProgressbar from '@/components/ui/profile/TotalStatisticWithProgressbar'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form';
import editIcon from "../../../../public/icons/profile/edit-icon.svg"
import Image from 'next/image';
import Search from '@/components/ui/dashboard/Search';

import Chat from '@/components/ui/dashboard/Chat';

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isChat, setIsChat] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [search, setSearch] = useState("");
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      fullName: "Novruz Huseynov",
      birthDate: "17.06.2004",
      phone: "+9940513888181",
      location: "baku,xetai",
      email: "nihataliyev@gmail.com",
      roleName: "rehber"
    }
  });


  const onSubmit = async (data) => {
    if (!isEditing) {
      console.log(data)
      await updateUser(data)
      setIsOpen(true)
    } else {
      console.log("!!!")
    }
  }

  const handleToggle = () => {
    setIsEditing(prev => !prev)
  }

  useEffect(() => {
    (async () => {
      const res = await getUser();
      setUserData(res.data);
      reset(res.data);
    })()
  }, [])

  const handleClose = (e) => {
    setIsOpen(false);
  };
  const openChat = () => {
    setIsChat(true)
  }
  const closeChat = () => {
    setIsChat(false)
  }
  return (
    <main className='w-full flex flex-col gap-6'>

      <section className='relative'>
        <ProfileForm isEditing={isEditing} handleSubmit={handleSubmit} onSubmit={onSubmit} register={register} user={userData}>
          <Summary isChat={isChat} setIsChat={setIsChat} isEditing={isEditing} handleToggle={handleToggle} user={userData || {
            fullName: "Novruz Huseynov",
            birthDate: "17.06.2004",
            phone: "+9940513888181",
            location: "baku,xetai",
            email: "nihataliyev@gmail.com",
            roleName: "rehber"
          }} />
        </ProfileForm>
        {isOpen && (
          <div
            id="overlay"
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-999 "
          >
            <div
              className="bg-white rounded-2xl shadow-xl px-[51px] pt-10 pb-8 h-[332px] w-[414px] flex flex-col items-center gap-5"
            >
              <Image src={editIcon} alt='edit' />
              <p className='text-center font-medium text-2xl'>Dəyişikliklər uğurla yadda saxlanıldı.</p>
              <button className='py-[18px] px-[59px] text-white bg-[#02836F] rounded-lg cursor-pointer' onClick={handleClose}>Geri qayıt</button>
            </div>
          </div>
        )}


      </section>
    </main>
  )
}

export default Profile