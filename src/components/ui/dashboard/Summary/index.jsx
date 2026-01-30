"use client";
import React, { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import profilePhoto from "../../../../../public/images/profile/novruz.jpg"
import editIcon from '../../../../../public/icons/profile/edit-icon.svg'
import { Button } from '../Buttons/ProfileButtons'
import Cropper from "react-easy-crop";

const defaultProfileIcon = "/icons/profile.svg";

const createImage = (url) =>
    new Promise((resolve, reject) => {
        const image = new window.Image();
        image.addEventListener("load", () => resolve(image));
        image.addEventListener("error", (error) => reject(error));
        image.setAttribute("crossOrigin", "anonymous");
        image.src = url;
    });

const getCroppedBlob = async (imageSrc, pixelCrop) => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement("canvas");
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas context not available");

    ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
    );

    return new Promise((resolve, reject) => {
        canvas.toBlob(
            (blob) => {
                if (!blob) return reject(new Error("Failed to crop image"));
                resolve(blob);
            },
            "image/jpeg",
            0.92
        );
    });
};

const Summary = ({ isEditing, handleToggle, onCancelEdit, user, onImageSelected, onRequestDeleteImage, imageResetKey, avatarVersion }) => {
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [isCropOpen, setIsCropOpen] = useState(false);
    const [pendingFile, setPendingFile] = useState(null);
    const [pendingUrl, setPendingUrl] = useState(null);
    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
    const [isCropping, setIsCropping] = useState(false);

    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    useEffect(() => {
        return () => {
            if (pendingUrl) URL.revokeObjectURL(pendingUrl);
        };
    }, [pendingUrl]);

    useEffect(() => {
        if (imageResetKey == null) return;
        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setPreviewUrl(null);
        if (pendingUrl) URL.revokeObjectURL(pendingUrl);
        setPendingUrl(null);
        setPendingFile(null);
        setIsCropOpen(false);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setCroppedAreaPixels(null);
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

        if (pendingUrl) URL.revokeObjectURL(pendingUrl);
        const nextPendingUrl = URL.createObjectURL(file);
        setPendingFile(file);
        setPendingUrl(nextPendingUrl);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setCroppedAreaPixels(null);
        setIsCropOpen(true);
    };

    const closeCrop = () => {
        if (isCropping) return;
        setIsCropOpen(false);
        setPendingFile(null);
        if (pendingUrl) URL.revokeObjectURL(pendingUrl);
        setPendingUrl(null);
        setZoom(1);
        setCrop({ x: 0, y: 0 });
        setCroppedAreaPixels(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const applyCrop = async () => {
        if (!pendingFile || !pendingUrl || !croppedAreaPixels) return;
        if (isCropping) return;

        setIsCropping(true);
        try {
            const blob = await getCroppedBlob(pendingUrl, croppedAreaPixels);
            const croppedFile = new File([blob], pendingFile.name, {
                type: blob.type || pendingFile.type || "image/jpeg",
                lastModified: Date.now(),
            });

            if (previewUrl) URL.revokeObjectURL(previewUrl);
            const nextPreviewUrl = URL.createObjectURL(croppedFile);
            setPreviewUrl(nextPreviewUrl);
            onImageSelected?.(croppedFile);

            setIsCropOpen(false);
            setPendingFile(null);
            if (pendingUrl) URL.revokeObjectURL(pendingUrl);
            setPendingUrl(null);
        } finally {
            setIsCropping(false);
        }
    };

    const canDelete = Boolean(previewUrl || user?.image?.url);

    const roleLabel = user?.roleName;
    // const roleLabel = user?.roleName !== "USER" ? user?.roleName : null;

    return (
        <>
            {isCropOpen && pendingUrl ? (
                <div
                    onClick={closeCrop}
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-999 p-4"
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-white rounded-2xl shadow-xl w-[90%] max-w-[560px] overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b border-black/10">
                            <p className="text-lg font-medium">Şəkli kəs</p>
                        </div>

                        <div className="relative w-full h-[360px] bg-black">
                            <Cropper
                                image={pendingUrl}
                                crop={crop}
                                zoom={zoom}
                                aspect={1}
                                cropShape="round"
                                showGrid={false}
                                onCropChange={setCrop}
                                onZoomChange={setZoom}
                                onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
                            />
                        </div>

                        <div className="px-6 py-4 flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm text-black/60">Zoom</span>
                                <input
                                    type="range"
                                    min={1}
                                    max={3}
                                    step={0.01}
                                    value={zoom}
                                    onChange={(e) => setZoom(Number(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    disabled={isCropping}
                                    onClick={closeCrop}
                                    className="py-3 px-6 rounded-lg cursor-pointer border border-black/10 bg-white"
                                >
                                    Ləğv et
                                </button>
                                <button
                                    type="button"
                                    disabled={isCropping}
                                    onClick={applyCrop}
                                    className="py-3 px-6 rounded-lg cursor-pointer text-white bg-[#02836F] disabled:opacity-60"
                                >
                                    {isCropping ? "Hazırlanır..." : "Təsdiqlə"}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : null}

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

                <div className='flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4'>
                    {isEditing ? (
                        <>
                            <button
                                type='button'
                                onClick={(e) => {
                                    e.preventDefault();
                                    onCancelEdit?.();
                                }}
                                className='bg-white text-[#1B1F27] font-medium py-3 px-6 rounded-lg cursor-pointer border border-black/10 hover:bg-black/5'
                            >
                                Ləğv et
                            </button>
                            <button type='submit' className='bg-[#02836F] text-white font-medium py-3 px-6 rounded-lg cursor-pointer hover:opacity-95'>Yadda saxla</button>
                        </>
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
                    {/* <Button /> */}
                </div>
            </div>

        </>
    )
}

export default Summary
