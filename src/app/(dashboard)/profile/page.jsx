
"use client"
import ProfileForm from '@/components/ui/dashboard/ProfileForm';
// import StatisticWithCircleProgressBar from '@/components/ui/profile/StatisticWithCircleProgressBar'
import Summary from '@/components/ui/dashboard/Summary'
import { deleteUserImage, getUser, updateUser, updateUserImage } from '@/services/api/endpoints/userService';
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
  const [successText, setSuccessText] = useState("Dəyişikliklər uğurla yadda saxlanıldı.");
  const [isChat, setIsChat] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [imageResetKey, setImageResetKey] = useState(0);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const { register, handleSubmit, reset } = useForm();


  const onSubmit = async (data) => {
    if (!isEditing) return;

      const userPayload = {
        fullName: data?.fullName,
        birthDate: data?.birthDate,
        phoneNumber: data?.phoneNumber,
        location: data?.location,
        email: data?.email,
        roleName: data?.roleName,
      };

      await updateUser(userPayload);
      if (selectedProfileImage) {
        await updateUserImage(selectedProfileImage);
        setSelectedProfileImage(null);
        setImageResetKey((k) => k + 1);
      }

      setIsEditing(false);
      setSuccessText("Dəyişikliklər uğurla yadda saxlanıldı.");
      setIsOpen(true);
  }

  const handleToggle = () => {
    setIsEditing(true)
  }

  const requestDeleteImage = () => {
    setIsDeleteOpen(true);
  }

  const confirmDeleteImage = async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const hadServerImage = Boolean(userData?.image?.url);
      setSelectedProfileImage(null);
      setImageResetKey((k) => k + 1);

      if (hadServerImage) {
        await deleteUserImage();
        const res = await getUser();
        setUserData(res.data);
        reset(res.data);
      }

      setSuccessText("Profil şəkli silindi.");
      setIsOpen(true);
    } catch (err) {
      setSuccessText("Profil şəklini silmək alınmadı. Yenidən cəhd edin.");
      setIsOpen(true);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
    }
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
        <ProfileForm isEditing={isEditing} handleSubmit={handleSubmit} onSubmit={onSubmit} register={register}>
          <Summary
            isChat={isChat}
            setIsChat={setIsChat}
            isEditing={isEditing}
            handleToggle={handleToggle}
            user={userData}
            onImageSelected={(file) => setSelectedProfileImage(file)}
            onRequestDeleteImage={requestDeleteImage}
            imageResetKey={imageResetKey}
          />
        </ProfileForm>

        {isDeleteOpen && (
          <div
            onClick={() => !isDeleting && setIsDeleteOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-999"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl px-6 sm:px-[40px] pt-8 pb-6 w-[90%] max-w-[420px] flex flex-col items-center gap-4"
            >
              <p className='text-center font-medium text-xl'>Şəkli silmək istədiyinizə əminsiniz?</p>
              <p className='text-center text-sm text-black/60'>Bu əməliyyat geri qaytarılmır.</p>

              <div className='w-full flex gap-3 justify-center mt-2'>
                <button
                  type='button'
                  disabled={isDeleting}
                  onClick={() => setIsDeleteOpen(false)}
                  className='py-3 px-6 rounded-lg cursor-pointer border border-black/10 bg-white'
                >
                  Ləğv et
                </button>
                <button
                  type='button'
                  disabled={isDeleting}
                  onClick={confirmDeleteImage}
                  className='py-3 px-6 rounded-lg cursor-pointer text-white bg-red-600 hover:bg-red-700 disabled:opacity-60'
                >
                  {isDeleting ? "Silinir..." : "Sil"}
                </button>
              </div>
            </div>
          </div>
        )}

        {isOpen && (
          <div
            id="overlay"
            onClick={handleClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-999 "
          >
            <div
              className="bg-white rounded-2xl shadow-xl px-6 sm:px-[51px] pt-10 pb-8 w-[90%] max-w-[414px] flex flex-col items-center gap-5"
            >
              <Image src={editIcon} alt='edit' />
              <p className='text-center font-medium text-2xl'>{successText}</p>
              <button className='py-[18px] px-[59px] text-white bg-[#02836F] rounded-lg cursor-pointer' onClick={handleClose}>Geri qayıt</button>
            </div>
          </div>
        )}


      </section>
    </main>
  )
}

export default Profile
