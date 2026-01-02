"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import profilePhoto from "../../../../../public/images/profile/novruz.jpg"
import editIcon from '../../../../../public/icons/profile/edit-icon.svg'
import { Button } from '../Buttons/ProfileButtons'

const defaultProfileIcon = "/icons/profile.svg";

const Summary = ({ isEditing, handleToggle, user, onImageSelected, onRequestDeleteImage, imageResetKey, avatarVersion }) => {
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    useEffect(() => {
        if (imageResetKey == null) return;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    }, [imageResetKey]);

    const avatarSrc = useMemo(() => {
        if (previewUrl) return previewUrl;

        const rawUrl = user?.image?.url;
        if (!rawUrl) return null;

        if (!avatarVersion) return rawUrl;
        const join = rawUrl.includes("?") ? "&" : "?";
        return `${rawUrl}${join}v=${avatarVersion}`;
    }, [previewUrl, user, avatarVersion]);

    const hasAvatar = Boolean(avatarSrc);

    const openPicker = () => {
        if (!isEditing) return;
        fileInputRef.current?.click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        const nextUrl = URL.createObjectURL(file);
        setPreviewUrl(nextUrl);
        onImageSelected?.(file);
    };

    const canDelete = Boolean(previewUrl || user?.image?.url);

    const roleLabel = user?.roleName;
    // const roleLabel = user?.roleName !== "USER" ? user?.roleName : null;

    return (
        <>
            <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between w-full'>
                <div className='flex gap-4 sm:gap-6 items-center'>
                    <div className='relative w-[72px] h-[72px] sm:w-[100px] sm:h-[100px] shrink-0'>
                        {hasAvatar ? (
                            <Image src={avatarSrc} alt='profile photo' fill className='h-full w-full rounded-full object-cover object-top' />
                        ) : (
                            <div className="w-full h-full rounded-full bg-(--primary-color) flex items-center justify-center">
                                <Image src={defaultProfileIcon} alt="Default avatar" width={24} height={24} />
                            </div>
                        )}

                        {isEditing && (
                            <button
                                type='button'
                                onClick={openPicker}
                                className='absolute bottom-0 right-0 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#02836F] flex items-center justify-center cursor-pointer'
                                aria-label='Profil şəklini yenilə'
                            >
                                <Image src={editIcon} alt='edit' width={18} height={18} />
                            </button>
                        )}

                        <input
                            ref={fileInputRef}
                            type='file'
                            accept='image/*'
                            onChange={handleFileChange}
                            disabled={!isEditing}
                            className='hidden'
                        />
                    </div>
                    <div className='flex flex-col gap-2'>
                        <div className='flex flex-wrap items-center gap-2'>
                            <p className='text-xl font-medium'>{user?.fullName}</p>
                            {roleLabel ? (
                                <span className='inline-flex items-center rounded-full bg-[#02836F]/10 px-3 py-1 text-xs font-semibold text-[#02836F]'>
                                    {String(roleLabel).toUpperCase()}
                                </span>
                            ) : null}
                        </div>

                        {isEditing && canDelete && typeof onRequestDeleteImage === "function" && (
                            <button
                                type='button'
                                onClick={onRequestDeleteImage}
                                className='w-fit text-sm font-medium text-red-600 hover:text-red-700 underline'
                            >
                                Şəkli sil
                            </button>
                        )}
                    </div>
                </div>

                <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6'>
                    {isEditing ? (
                        <button type='submit' className='bg-[#02836F] text-white font-medium py-3 px-6 rounded-lg cursor-pointer'>Yadda saxla</button>
                    ) : (
                        <button
                            type='button'
                            onClick={(e) => {
                                e.preventDefault();
                                handleToggle?.();
                            }}
                            className='bg-[#02836F] text-white font-medium py-3 px-6 rounded-lg cursor-pointer'
                        >
                            Redaktə et
                        </button>
                    )}
                    <Button />
                </div>
            </div>

        </>
    )
}

export default Summary
