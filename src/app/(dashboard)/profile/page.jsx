
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
import { toYMD } from '@/lib/formatDateTime';

import Chat from '@/components/ui/dashboard/Chat';
import { useUser } from '@/context/UserContext';
import Loader from '@/components/ui/Loader';

import { buildPhoneNumber, mapUserToFormDefaults } from './profileFormUtils';

const Profile = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [successText, setSuccessText] = useState("Dəyişikliklər uğurla yadda saxlanıldı.");
  const [isChat, setIsChat] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [userData, setUserData] = useState(null);
  const [selectedProfileImage, setSelectedProfileImage] = useState(null);
  const [imageResetKey, setImageResetKey] = useState(0);
  const [avatarVersion, setAvatarVersion] = useState(0);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const { fetchUser } = useUser();

  const normalizeOptional = (value) => {
    const v = typeof value === "string" ? value.trim() : value;
    return v ? v : null;
  };


  const onSubmit = async (data) => {
    if (!isEditing || isSaving) return;

    setIsSaving(true);

    try {
      const roleName = userData?.roleName ?? userData?.role ?? userData?.role?.name;
      const phoneNumber = buildPhoneNumber({
        phoneCountryCode: data?.phoneCountryCode,
        phoneLocalNumber: data?.phoneLocalNumber,
      }) || data?.phoneNumber;
      const userPayload = {
        fullName: data?.fullName,
        birthDate: toYMD(data?.birthDate),
        phoneNumber,
        location: data?.location,
        email: data?.email,
        aboutMe: normalizeOptional(data?.aboutMe),
        whatsapp: normalizeOptional(data?.whatsapp),
        instagram: normalizeOptional(data?.instagram),
        linkedin: normalizeOptional(data?.linkedin),
        ...(roleName ? { roleName } : {}),
      };

      await updateUser(userPayload);

      if (selectedProfileImage) {
        await updateUserImage(selectedProfileImage);
        setSelectedProfileImage(null);
        setImageResetKey((k) => k + 1);
        setAvatarVersion(Date.now());
      }

      const res = await getUser();
      setUserData(res.data);
      reset(mapUserToFormDefaults(res.data));
      await fetchUser({ force: true });

      setIsEditing(false);
      setSuccessText("Dəyişikliklər uğurla yadda saxlanıldı.");
      setIsOpen(true);
    } catch (err) {
      setSuccessText("Dəyişiklikləri yadda saxlamaq alınmadı. Yenidən cəhd edin.");
      setIsOpen(true);
    } finally {
      setIsSaving(false);
    }
  }

  const handleToggle = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    setIsEditing(false);
    setSelectedProfileImage(null);
    setImageResetKey((k) => k + 1);
    reset(mapUserToFormDefaults(userData));
  };

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
        reset(mapUserToFormDefaults(res.data));
        setAvatarVersion(Date.now());
        await fetchUser({ force: true });
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
    let alive = true;
    (async () => {
      setLoading(true);
      setLoadError(null);
      try {
        const res = await getUser();
        if (!alive) return;
        setUserData(res.data);
        reset(mapUserToFormDefaults(res.data));
      } catch (err) {
        if (!alive) return;
        setLoadError(err?.message || "Profil yüklənmədi");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
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

  if (loading) {
    return (
      <main className='w-full flex items-center justify-center py-16'>
        <Loader />
      </main>
    );
  }

  if (loadError) {
    return (
      <main className='w-full flex items-center justify-center py-16'>
        <div className="w-full max-w-xl py-16 flex items-center justify-center text-lg text-gray-500 border border-dashed rounded-xl bg-white">
          {loadError}
        </div>
      </main>
    );
  }

  return (
    <main className='w-full flex flex-col gap-6'>

      <section className='relative'>
        <ProfileForm isEditing={isEditing} isSubmitting={isSaving} handleSubmit={handleSubmit} onSubmit={onSubmit} register={register} errors={errors}>
          <Summary
            isChat={isChat}
            setIsChat={setIsChat}
            isEditing={isEditing}
            isSaving={isSaving}
            handleToggle={handleToggle}
            onCancelEdit={handleCancelEdit}
            user={userData}
            onImageSelected={(file) => setSelectedProfileImage(file)}
            onRequestDeleteImage={requestDeleteImage}
            imageResetKey={imageResetKey}
            avatarVersion={avatarVersion}
          />
        </ProfileForm>

        {isDeleteOpen && (
          <div
            onClick={() => !isDeleting && setIsDeleteOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-999"
          >
            <div
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-xl px-6 sm:px-10 pt-8 pb-6 w-[90%] max-w-[420px] flex flex-col items-center gap-4"
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
