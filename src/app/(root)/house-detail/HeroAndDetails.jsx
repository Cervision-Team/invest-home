"use client"

import React, { useState, useEffect, useRef, useMemo } from 'react'
import { houseData } from "@/components/core/house";
import ShareWhite from "../../../../public/icons/ShareWhite.svg"
import Image from 'next/image'
import RoundedBlackButton from '@/components/ui/RoundedBlackButton'
import ConnectionButton from '@/components/ui/ConnectionButton'
import PrimarySimpleButton from '@/components/ui/PrimarySimpleButton'
import { LuHeart, LuX } from "react-icons/lu"
import Loading from './Loading';
import { Swiper, SwiperSlide } from "swiper/react";
import { useMediaQuery } from '@/hooks/useMediaQuery';
import HouseDetailsMetro from "../../../../public/icons/HouseDetailsMetro.svg"
import HouseDetailsRoom from "../../../../public/icons/HouseDetailsRoom.svg"
import HouseDetailsFloor from "../../../../public/icons/HouseDetailsFloor.svg"
import HouseDetailsSquare from "../../../../public/icons/HouseDetailsSquare.svg"
import HouseDetailsPaint from "../../../../public/icons/HouseDetailsPaint.svg"
import HouseDetailsDocument from "../../../../public/icons/HouseDetailsDocument.svg"
import Elevator from "../../../../public/icons/elevator.svg"
import Security from "../../../../public/icons/security.svg"
import Parking from "../../../../public/icons/parking.svg"
import WaterHeater from "../../../../public/icons/water-heater.svg"
import AirConditioner from "../../../../public/icons/air-conditioner.svg"
import { getAnnouncementById } from '@/services/api/endpoints/announcementService';
import Map from './Map';
import SimilarAnnouncements from './SimilarAnnouncements';
import Link from 'next/link';
import { hasAccessUrl } from "@/lib/auth/checkAccess";
import { useMenuPermission } from "@/context/MenuPermissionContext";
import { extractMenuPaths, normalizePath } from "@/lib/auth/menuPermissionUtils";
import { formatDateTime, formatTimeAgo } from "@/lib/formatDateTime";

const defaultProfileIcon = "/icons/profile.svg";

const HeroAndDetails = ({ id }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [naturalSize, setNaturalSize] = useState({ width: 0, height: 0 });
  const [fav, setFav] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [house, setHouse] = useState(null);
  const textRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 430px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  // const house = houseData.find(h => h.id === Number(id));
  const [containerWidth, setContainerWidth] = useState(0);
  const containerRef = useRef(null);
  const thumbnailContainerRef = useRef(null);
  const thumbnailRefs = useRef([]);
  const { menuPermission, fetchMenuPermission, menuLoading, menuLoaded } = useMenuPermission();

  const token = typeof window !== "undefined" ? localStorage.getItem("access-token") : null;

  useEffect(() => {
    if (!token) return;
    if (!menuLoaded && !menuLoading) {
      fetchMenuPermission();
    }
  }, [token, menuLoaded, menuLoading, fetchMenuPermission]);

  const allowedPaths = useMemo(() => {
    const raw = extractMenuPaths(menuPermission);
    return raw
      .map(normalizePath)
      .filter((p) => typeof p === "string" && p.length > 0);
  }, [menuPermission]);

  const canSeeActivateButton = useMemo(() => {
    if (!token) return false;
    if (!menuLoaded) return false;
    const targetPath = normalizePath(`/confirmation-announcement/${id}`);
    return hasAccessUrl(allowedPaths, targetPath);
  }, [token, menuLoaded, allowedPaths, id]);

  useEffect(() => {
    (async () => {
      const houseDetail = await getAnnouncementById(id)
      setHouse(houseDetail)
      console.log("houseDetail", houseDetail);

    })()
  }, [])

  // Each thumbnail is 70px wide + 4px gap = 74px per thumbnail (except last one which doesn't need gap)
  const thumbnailWidth = 70;
  const gap = 4;
  const maxVisibleThumbnails = useMemo(() => {
    if (containerWidth === 0) return house?.medias.length;
    const availableWidth = containerWidth - 5; // Account for padding
    const count = Math.floor((availableWidth + gap) / (thumbnailWidth + gap));
    return Math.max(1, Math.min(count, house?.medias.length));
  }, [containerWidth, house?.medias.length]);

  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        setContainerWidth(entry.contentRect.width);
      }
    });

    resizeObserver.observe(containerRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  const agentName = useMemo(() => {
    const name = house?.agent?.fullName;
    return typeof name === "string" && name.trim() ? name.trim() : "Agent";
  }, [house?.agent?.fullName]);

  const agentAvatarSrc = useMemo(() => {
    return (
      house?.agent?.image?.url || null
    );
  }, [house?.agent]);

  const hasAgentAvatar = Boolean(agentAvatarSrc);

  useEffect(() => {
    if (textRef.current) {
      const el = textRef.current;
      const currentClamp = el.classList.contains("line-clamp-4");

      if (currentClamp) el.classList.remove("line-clamp-4");

      const isOver = el.scrollHeight > el.clientHeight;
      setIsOverflowing(isOver);

      if (currentClamp) el.classList.add("line-clamp-4");
    }
  }, []);

  useEffect(() => {
    if (thumbnailContainerRef.current && thumbnailRefs.current[selectedIndex]) {
      const container = thumbnailContainerRef.current;
      const thumbnail = thumbnailRefs.current[selectedIndex];

      const containerRect = container.getBoundingClientRect();
      const thumbnailRect = thumbnail.getBoundingClientRect();

      const thumbnailLeft = thumbnailRect.left - containerRect.left + container.scrollLeft;
      const thumbnailRight = thumbnailLeft + thumbnailRect.width;
      const containerScrollLeft = container.scrollLeft;
      const containerWidth = container.clientWidth;

      const padding = 100;

      if (thumbnailLeft < containerScrollLeft + padding) {
        const newScrollLeft = Math.max(0, thumbnailLeft - padding);
        container.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth'
        });
      } else if (thumbnailRight > containerScrollLeft + containerWidth - padding) {
        const maxScrollLeft = container.scrollWidth - containerWidth;
        const newScrollLeft = Math.min(maxScrollLeft, thumbnailRight - containerWidth + padding);
        container.scrollTo({
          left: newScrollLeft,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedIndex]);

  useEffect(() => {
    if (!previewImage) return;
    if (!naturalSize.width || !naturalSize.height) return;

    const update = () => {
      setDimensions(computeScaledDimensions(naturalSize.width, naturalSize.height));
    };

    update();
    window.addEventListener('resize', update);
    window.addEventListener('orientationchange', update);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('orientationchange', update);
    };
  }, [previewImage, naturalSize.width, naturalSize.height]);

  if (!house) {
    return Loading()
  }

  const isFavorite = fav.includes(house.id);

  const handleFavToggle = () => {
    if (isFavorite) {
      setFav(fav.filter((favId) => favId !== house.id));
    } else {
      setFav([...fav, house.id]);
    }
  };

  const openPreview = (image) => {
    setPreviewImage(image);
    setDimensions({ width: 0, height: 0 });
    setNaturalSize({ width: 0, height: 0 });
  };

  const closePreview = () => {
    setPreviewImage(null);
    setDimensions({ width: 0, height: 0 });
    setNaturalSize({ width: 0, height: 0 });
  };

  const computeScaledDimensions = (w, h) => {
    if (!w || !h) return { width: 0, height: 0 };
    if (typeof window === 'undefined') return { width: 0, height: 0 };

    const maxWidth = window.innerWidth * 0.85;
    const maxHeight = window.innerHeight - 180;
    const scale = Math.min(maxWidth / w, maxHeight / h);
    return {
      width: Math.max(1, Math.floor(w * scale)),
      height: Math.max(1, Math.floor(h * scale)),
    };
  };

  const goToPreviewIndex = (nextIndex) => {
    const safeIndex = Math.max(0, Math.min(nextIndex, (house?.medias?.length ?? 1) - 1));
    setSelectedIndex(safeIndex);
    setPreviewImage(house?.medias?.[safeIndex]?.imageUrl ?? null);
    setDimensions({ width: 0, height: 0 });
    setNaturalSize({ width: 0, height: 0 });
  };

  return (
    <>
      <section className='max-w-[1600px] mx-[auto]'>
        <div className='mt-[20px] px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]'>
          <div className='flex justify-between items-start gap-4 min-w-0'>
            <h1 className='flex-1 min-w-0 break-words text-[#111] text-[22px] lg:text-[32px] leading-[1.2] font-medium max-[431px]:text-[14px]'>
              {house?.announcementType?.displayName},{" "}
              {house?.buildingType == "newBuilding" ? "Yeni tikili" : "kohne tikili"},{" "}
              {house?.rooms} otaq,{" "}
              {house?.area} m2,{" "}
              {house?.selectedSettlement}
            </h1>

            <div className='flex flex-row items-center gap-[14px] max-[431px]:hidden'>
              <RoundedBlackButton
                icon={<Image src={ShareWhite} alt="Share" width={20} height={20} />}
                backgroundColor="#02836F"
              />
              <div onClick={handleFavToggle}>
                <RoundedBlackButton
                  icon={
                    <LuHeart
                      className={`${isFavorite ? "fill-red-500 text-red-500" : "fill-transparent"} text-[1.2rem]`}
                    />
                  }
                  backgroundColor="#02836F"
                />
              </div>
            </div>
          </div>
        </div>

        <div className='mt-[20px] relative flex flex-col-reverse lg:flex-row gap-[20px] lg:justify-between items-start px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]'>
          <div className='w-full min-w-0 lg:basis-[708px] lg:flex-1 max-[431px]:px-[0]'>
            <div ref={containerRef} className='min-[431px]:p-[20px] min-[430px]:rounded-[20px] min-[431px]:bg-[rgba(255,255,255,0.50)] min-[431px]:shadow-[0px_4px_10px_0px_rgba(2,131,111,0.10)] flex flex-col gap-[30px]'>

              {isMobile ? (
                <div>
                  <Swiper
                    loop={false}
                    slidesPerView={1}
                    speed={500}
                    spaceBetween={8}
                  >
                    {house?.medias.map((image) => (
                      <SwiperSlide key={image.id}>
                        <div
                          className='relative w-full h-[233px] cursor-pointer'
                          onClick={() => {
                            const idx = house?.medias?.findIndex((m) => m?.id === image?.id) ?? 0;
                            setSelectedIndex(idx >= 0 ? idx : 0);
                            openPreview(image.imageUrl);
                          }}
                        >
                          <Image
                            alt={"house_image"}
                            src={image.imageUrl}
                            fill={true}
                            className={`object-cover`}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : (
                <div className="flex flex-col gap-[10px] w-full items-center">
                  <div
                    className="relative w-full h-[434px] rounded-[8px] overflow-hidden cursor-pointer"
                    onClick={() => openPreview(house?.medias[selectedIndex].imageUrl)}
                  >
                    <Image
                      alt={"house_image"}
                      src={house?.medias[selectedIndex].imageUrl}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div
                    ref={thumbnailContainerRef}
                    className="flex gap-[4px] w-full max-w-full min-w-0 overflow-x-auto overflow-y-hidden [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                  >
                    {house?.medias.slice(0, maxVisibleThumbnails).map((image, idx) => {
                      const isLastVisible = idx === maxVisibleThumbnails - 1;
                      const remainingCount = house?.medias.length - maxVisibleThumbnails;
                      const shouldShowOverlay = isLastVisible && remainingCount > 0;

                      return (
                        <div
                          key={idx}
                          ref={(el) => (thumbnailRefs.current[idx] = el)}
                          className="relative shrink-0 min-w-[70px] w-[70px] h-[50px] rounded-[4px] overflow-hidden cursor-pointer transition-opacity hover:opacity-80"
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={() => {
                            setSelectedIndex(idx);
                            openPreview(image.imageUrl);
                          }}
                        >
                          <Image
                            alt={`house_thumbnail_${idx}`}
                            src={image.imageUrl}
                            fill
                            className="object-cover"
                          />
                          {shouldShowOverlay && (
                            <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center">
                              <span className="text-white font-semibold text-lg">
                                +{remainingCount}
                              </span>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className='mt-[60px] max-[431px]:mt-[20px]'>
              <div className="w-full flex flex-col items-start justify-center">
                <h1 className="text-2xl sm:text-3xl font-bold">Elan haqqında</h1>

                <div className="flex flex-wrap gap-4 sm:gap-6 mt-6">
                  <PrimarySimpleButton icon={HouseDetailsMetro} name={house?.selectedDistrict} />
                  <PrimarySimpleButton icon={HouseDetailsRoom} name={`${house?.rooms} Otaq`} />
                  <PrimarySimpleButton icon={HouseDetailsFloor} name={`${house?.floor}/${house?.totalFloors}`} />
                  <PrimarySimpleButton icon={HouseDetailsSquare} name={`${house?.area} m2`} />
                  {
                    house?.repairStatus?.code === "RENEWED" ?
                      <PrimarySimpleButton icon={HouseDetailsPaint} name="Tam Təmirli" />
                      :
                      <PrimarySimpleButton icon={HouseDetailsPaint} name="Təmirsiz" />
                  }
                  {
                    house?.exit === "theres" ?
                      <PrimarySimpleButton icon={HouseDetailsDocument} name="Çıxarışı var" />
                      :
                      <PrimarySimpleButton icon={HouseDetailsDocument} name="Çıxarışı yoxdur" />
                  }
                </div>

                <p
                  ref={textRef}
                  className={`text-black text-base sm:text-lg leading-[28px] tracking-[0.2px] mt-5 ${showMore ? "" : "max-[431px]:line-clamp-4"}`}
                >
                  {house?.description}
                </p>
                {isOverflowing && (
                  <div className="flex justify-end w-full">
                    {!showMore ? (
                      <button
                        onClick={() => setShowMore(true)}
                        className="text-[12px] text-[#450CCB]"
                      >
                        daha çox
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowMore(false)}
                        className="text-[12px] text-[#450CCB]"
                      >
                        daha az
                      </button>
                    )}
                  </div>
                )}
              </div>

              <div className="w-full mt-10 mb-[64px]">
                <h1 className="text-[#111] text-[24px] sm:text-[28px] font-medium mb-8">
                  Xüsusiyyətlər
                </h1>

                <div className="flex flex-col ">
                  {house?.features.map((item, idx) => (
                    <ul key={idx} className="flex flex-row gap-3 items-center text-[#2B2B2B] text-base sm:text-[20px]">
                      {/* <Image
                        src={item}
                        alt={item}
                        width={24}
                        height={24}
                        unoptimized
                      /> */}
                      <li className='list-disc ml-6'>{item.displayName}</li>
                    </ul>
                  ))}
                  {/* {[
                    { icon: Elevator, label: "Lift" },
                    { icon: Security, label: "Təhlükəsizlik" },
                    { icon: Parking, label: "Parkinq" },
                    { icon: WaterHeater, label: "İstilik sistemi" },
                    { icon: AirConditioner, label: "Soyutma sistemi" },
                  ].map((item, idx) => (
                    <div key={idx} className="flex flex-row gap-3 items-center text-[#2B2B2B] text-base sm:text-[20px]">
                      <Image
                        src={item.icon}
                        alt={item.label}
                        width={24}
                        height={24}
                        unoptimized
                      />
                      <p>{item.label}</p>
                    </div>
                  ))} */}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:sticky lg:flex-[0_0_500px] top-[95px] w-full min-w-0 rounded-[20px] bg-white shadow-[0px_2px_10px_0px_rgba(2,131,111,0.15)] max-[431px]:px-[16px] max-[431px]:py-[20px] px-[34px] py-[32px] flex flex-col gap-[41px] self-start">
            <div className='max-[431px]:items-center flex flex-col w-full min-[431px]:gap-[41px] max-[431px]:flex-row-reverse max-[431px]:justify-between max-[431px]:gap-6'>
              <div className='flex flex-col gap-4 relative max-[431px]:flex-1 max-[431px]:min-w-0'>
                {canSeeActivateButton && (
                  <Link
                    href={`/confirmation-announcement/${id}`}
                    className='static lg:absolute lg:right-0 lg:top-0 mt-4 lg:mt-0 ml-auto w-35 max-[500px]:w-32 max-[431px]:w-28 h-10 max-[431px]:h-9 rounded-xl border border-solid border-primary group overflow-hidden'
                  >
                    <div className='absolute inset-0 w-0 h-full transition-all duration-800 group-hover:w-full'
                      style={{
                        background: 'linear-gradient(90deg, #02836F 0%, #1A1919 100%)',
                      }}></div>
                    <button className='relative z-10 w-full h-full flex items-center justify-center text-primary text-base max-[500px]:text-sm font-medium cursor-pointer transition-colors duration-800 group-hover:text-[#FFFEFE]'>
                      Agent seç
                    </button>
                  </Link>
                )}
                <h1 className="max-[431px]:text-[20px] text-[32px] font-[500] leading-none">
                  {house?.price} AZN
                </h1>

                <p className="max-[431px]:text-[14px] text-[20px] font-[400] leading-none">
                  {Math.floor(house?.price / house?.area)} AZN / m2
                </p>
              </div>

              <div className="flex gap-[14px] max-h-[62px] shrink-0">
                <div className='relative h-[62px] w-[62px] max-[431px]:h-[50px] max-[431px]:w-[50px]'>
                  {hasAgentAvatar ? (
                    <Image
                      src={agentAvatarSrc}
                      alt={agentName ? `${agentName} foto` : "Agent foto"}
                      fill
                      className='h-full w-full rounded-full object-cover object-top'
                    />
                  ) : (
                    <div className="w-full h-full rounded-full bg-(--primary-color) flex items-center justify-center">
                      <Image
                        src={defaultProfileIcon}
                        alt="Default avatar"
                        width={24}
                        height={24}
                      />
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-between">
                  <p className="text-[#111] max-[431px]:text-[16px] text-[20px] font-[500] leading-none ">{agentName}</p>
                  <p className="text-black max-[431px]:text-[12px] text-[14px] font-[500] leading-none">Agent</p>
                  <p className="text-black/50 max-[431px]:text-[10px] text-[12px] font-[500] leading-none text-[rgba(0, 0, 0, 0.5)]">{formatTimeAgo(house?.createdAt, { absoluteStyle: "az-long" })}</p>
                </div>
              </div>
            </div>

            <div className="max-[431px]:hidden w-full flex justify-between items-stretch gap-4">
              <ConnectionButton name="Zəng et" />
              <ConnectionButton name="Mesaj yaz" />
            </div>
          </div>
        </div>
      </section>

      {previewImage && (
        <div
          className="fixed inset-0 z-[9999] bg-black flex flex-col"
          onClick={closePreview}
        >
          <div className="w-full bg-white px-4 py-2.5 flex items-center justify-between gap-3 shadow-md" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <h1 className='text-[#111] text-[16px] leading-[1.2] font-medium truncate'>
                {house?.announcementType?.displayName},{" "}
                {house?.buildingType == "newBuilding" ? "Yeni tikili" : "kohne tikili"},{" "}
                {house?.rooms} otaq,{" "}
                {house?.area} m2,{" "}
                {house?.selectedSettlement}
              </h1>
            </div>

            <div className="flex items-center gap-3 flex-shrink-0 flex-wrap justify-end">
              <div className="flex flex-col items-end gap-0.5">
                <h2 className="text-[18px] font-[500] leading-none">{house?.price} AZN</h2>
                <p className="text-[13px] font-[400] leading-none text-gray-600">{Math.floor(house?.price / house?.area)} AZN / m2</p>
              </div>


              <div className="flex gap-2">
                <div className="scale-90">
                  <RoundedBlackButton
                    icon={<Image src={ShareWhite} alt="Share" width={16} height={16} />}
                    backgroundColor="#02836F"
                  />
                </div>
                <div onClick={handleFavToggle} className="scale-90">
                  <RoundedBlackButton
                    icon={
                      <LuHeart
                        className={`${isFavorite ? "fill-red-500 text-red-500" : "fill-transparent"} text-[1rem]`}
                      />
                    }
                    backgroundColor="#02836F"
                  />
                </div>
              </div>

              <div className="hidden md:flex gap-2 scale-90">
                <ConnectionButton name="Zəng et" />
                <ConnectionButton name="Mesaj yaz" />
              </div>

              <button
                className="text-black hover:text-gray-600 transition-colors p-1"
                onClick={(e) => {
                  e.stopPropagation();
                  closePreview();
                }}
              >
                <LuX size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center w-full relative px-4 py-2">
            <button
              className="cursor-pointer absolute left-2 sm:left-4 z-[10001] text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-1.5 sm:p-2 hover:bg-black/70"
              onClick={(e) => {
                e.stopPropagation();
                const count = house?.medias?.length ?? 0;
                if (!count) return;
                const next = selectedIndex > 0 ? selectedIndex - 1 : count - 1;
                goToPreviewIndex(next);
              }}
            >
              <svg width="26" height="26" className="sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>

            {dimensions.width > 0 && dimensions.height > 0 ? (
              <div
                className="relative"
                style={{
                  width: `${dimensions.width}px`,
                  height: `${dimensions.height}px`,
                  maxWidth: "85vw",
                  maxHeight: "calc(100vh - 180px)",
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <Image
                  alt="Preview"
                  src={previewImage}
                  fill
                  className="object-contain"
                />
              </div>
            ) : (
              <Image
                alt="Preview"
                src={previewImage}
                width={1}
                height={1}
                className="opacity-0"
                onLoadingComplete={(img) => {
                  const naturalWidth = img.naturalWidth;
                  const naturalHeight = img.naturalHeight;
                  setNaturalSize({ width: naturalWidth, height: naturalHeight });
                  setDimensions(computeScaledDimensions(naturalWidth, naturalHeight));
                }}
              />
            )}

            <button
              className="cursor-pointer absolute right-2 sm:right-4 z-[10001] text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-1.5 sm:p-2 hover:bg-black/70"
              onClick={(e) => {
                e.stopPropagation();
                const count = house?.medias?.length ?? 0;
                if (!count) return;
                const next = selectedIndex < count - 1 ? selectedIndex + 1 : 0;
                goToPreviewIndex(next);
              }}
            >
              <svg width="26" height="26" className="sm:w-8 sm:h-8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 18l6-6-6-6" />
              </svg>
            </button>
          </div>

          <div
            className="w-full pb-3 flex justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div ref={thumbnailContainerRef} className="max-w-[85vw] flex gap-[4px] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
              {house?.medias.map((image, idx) => (
                <div
                  key={idx}
                  ref={(el) => thumbnailRefs.current[idx] = el}
                  className={`relative shrink-0 min-w-[70px] w-[70px] h-[50px] rounded-[4px] overflow-hidden cursor-pointer transition-all ${selectedIndex === idx
                    ? 'opacity-100'
                    : 'opacity-60 hover:opacity-100'
                    }`}
                  onMouseEnter={() => {
                    goToPreviewIndex(idx);
                  }}
                >
                  <Image
                    alt={`thumbnail_${idx}`}
                    src={image.imageUrl}
                    fill
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      <Map lat={house?.latitude} lng={house?.longitude} />
      <SimilarAnnouncements />
    </>
  );
};

export default HeroAndDetails;