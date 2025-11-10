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

const HeroAndDetails = ({ id }) => {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [fav, setFav] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
  const [showMore, setShowMore] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  const textRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 430px)');
  const isTablet = useMediaQuery('(max-width: 768px)');

  const house = houseData.find(h => h.id === Number(id));
const [containerWidth, setContainerWidth] = useState(0);
const containerRef = useRef(null);
const thumbnailContainerRef = useRef(null);
const thumbnailRefs = useRef([]);

// Each thumbnail is 70px wide + 4px gap = 74px per thumbnail (except last one which doesn't need gap)
const thumbnailWidth = 70;
const gap = 4;
const maxVisibleThumbnails = useMemo(() => {
  if (containerWidth === 0) return house.images.length;
  const availableWidth = containerWidth; // Account for padding
  const count = Math.floor((availableWidth + gap) / (thumbnailWidth + gap));
  return Math.max(1, Math.min(count, house.images.length));
}, [containerWidth, house.images.length]);

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
  };

  const closePreview = () => {
    setPreviewImage(null);
    setDimensions({ width: 0, height: 0 }); 
  };

  return (
    <>
      <section className='max-w-[1600px] mx-[auto]'>
        <div className='mt-[20px] px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]'>
          <div className='flex justify-between items-start gap-4'>
            <h1 className='text-[#111] text-[22px] lg:text-[32px] leading-[1.2] font-medium max-[431px]:text-[14px]'>
              Satılır, yeni tikili, 3 otaq, 160 m2, Nərimanov
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

        <div className='mt-[20px] relative flex max-[769px]:flex-col-reverse gap-[20px] justify-between items-start px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]'>
          <div className='basis-[708px] max-[431px]:px-[0]'>
            <div ref={containerRef} className='min-[431px]:p-[20px] min-[430px]:rounded-[20px] min-[431px]:bg-[rgba(255,255,255,0.50)] min-[431px]:shadow-[0px_4px_10px_0px_rgba(2,131,111,0.10)] flex flex-col gap-[30px]'>
            
              {isMobile ? (
                <div>
                  <Swiper
                    loop={false}
                    slidesPerView={1}
                    speed={500}
                    spaceBetween={8}
                  >
                    {house.images.map((image) => (
                      <SwiperSlide key={image.id}>
                        <div 
                          className='relative w-full h-[233px] cursor-pointer'
                          onClick={() => openPreview(image)}
                        >
                          <Image
                            alt={"house_image"}
                            src={image}
                            fill={true}
                            className={`object-cover`}
                          />
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              ) : (
                <div className="flex flex-col gap-[10px] w-full">
                  <div 
                    className="relative w-full h-[434px] rounded-[8px] overflow-hidden cursor-pointer"
                    onClick={() => openPreview(house.images[selectedIndex])}
                  >
                    <Image
                      alt={"house_image"}
                      src={house.images[selectedIndex]}
                      fill
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex gap-[4px] overflow-hidden">
                    {house.images.slice(0, maxVisibleThumbnails).map((image, idx) => {
                      const isLastVisible = idx === maxVisibleThumbnails - 1;
                      const remainingCount = house.images.length - maxVisibleThumbnails;
                      const shouldShowOverlay = isLastVisible && remainingCount > 0;
                      
                      return (
                        <div 
                          key={idx}
                          className="relative min-w-[70px] w-[70px] h-[50px] rounded-[4px] overflow-hidden cursor-pointer transition-opacity hover:opacity-80"
                          onMouseEnter={() => setSelectedIndex(idx)}
                          onClick={() => openPreview(image)}
                        >
                          <Image
                            alt={`house_thumbnail_${idx}`}
                            src={image}
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
                  <PrimarySimpleButton icon={HouseDetailsMetro} name="N.Nərimanov" />
                  <PrimarySimpleButton icon={HouseDetailsRoom} name="3 Otaq" />
                  <PrimarySimpleButton icon={HouseDetailsFloor} name="3/12" />
                  <PrimarySimpleButton icon={HouseDetailsSquare} name="160 m2" />
                  <PrimarySimpleButton icon={HouseDetailsPaint} name="Tam Təmirli" />
                  <PrimarySimpleButton icon={HouseDetailsDocument} name="Çıxarışı var" />
                </div>

                <p
                  ref={textRef}
                  className={`text-black text-base sm:text-lg leading-[28px] tracking-[0.2px] mt-5 ${showMore ? "" : "max-[431px]:line-clamp-4"}`}
                >
                  Nəsimi rayonu Fətəli xan Xoyski küçəsi Nərimanov metrosunun yaxınlığı, 12 mərtəbəli binanın 3-cü mərtəbəsi ümumi
                  sahəsi 160 kv m olan 3 otaqlı dubleks təmirli əşyalı mənzil. Mənzildə üç geniş yataq otağı, zal, mətbəx, sanuzel,
                  sanitar qovşağı mövcuddur. Mənzilin balkonunda yay mətbəxi mövcuddur. Böyük terası var. Ətrafında market, məktəb,
                  baxçabir sıra iaşə obyektləri var. Maraqlanan şəxslər buyurub müraciət edə bilər.
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

                <div className="flex flex-col gap-4">
                  {[
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
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="min-[769px]:sticky min-[768px]:basis-[411px] top-[95px] max-[769px]:w-full rounded-[20px] bg-white shadow-[0px_2px_10px_0px_rgba(2,131,111,0.15)] max-[431px]:px-[16px] max-[431px]:py-[20px] px-[34px] py-[32px] flex flex-col gap-[41px] self-start">
            <div className='max-[431px]:items-center flex flex-col min-[431px]:gap-[41px] max-[431px]:flex-row-reverse max-[431px]:justify-between'>
              <div className='flex flex-col gap-[16px]'>
                <h1 className="max-[431px]:text-[20px] text-[32px] font-[500] leading-none">
                  280,000 AZN
                </h1>

                <p className="max-[431px]:text-[14px] text-[20px] font-[400] leading-none">
                  1781 AZN / m2
                </p>
              </div>

              <div className="flex gap-[14px] max-h-[62px]">
                <div className='relative h-[62px] w-[62px] max-[431px]:h-[50px] max-[431px]:w-[50px]'>
                  <Image
                    src={"/icons/HouseDetailAgent.svg"}
                    alt="agent"
                    fill
                    className='h-full w-full'
                  />
                </div>
                <div className="flex flex-col justify-between">
                  <p className="text-[#111] max-[431px]:text-[16px] text-[20px] font-[500] leading-none ">Amin Bağırov</p>
                  <p className="text-black max-[431px]:text-[12px] text-[14px] font-[500] leading-none">Agent</p>
                  <p className="text-black/50 max-[431px]:text-[10px] text-[12px] font-[500] leading-none text-[rgba(0, 0, 0, 0.5)]">1 saat əvvəl</p>
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
        className="fixed inset-0 z-[9999] bg-black flex flex-col items-center justify-center p-4"
        onClick={closePreview}
      >
        <div className="fixed inset-0 pointer-events-none z-[10000]">
          <button
            className="absolute top-6 right-5 text-white hover:text-gray-300 transition-colors pointer-events-auto"
            onClick={(e) => {
              e.stopPropagation();
              closePreview();
            }}
          >
            <LuX size={40} />
          </button>
        </div>
    
        <div className="flex-1 flex items-center justify-center w-full relative">
          <button
            className="cursor-pointer absolute left-4 z-[10001] text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3 hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) => (prev > 0 ? prev - 1 : house.images.length - 1));
              setPreviewImage(house.images[selectedIndex > 0 ? selectedIndex - 1 : house.images.length - 1]);
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
    
          {dimensions.width > 0 && dimensions.height > 0 ? (
            <div
              className="relative"
              style={{
                width: `${dimensions.width}px`,
                height: `${dimensions.height}px`,
                maxWidth: "90vw",
                maxHeight: "calc(90vh - 120px)",
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
                const maxWidth = window.innerWidth * 0.9;
                const maxHeight = (window.innerHeight * 0.9) - 120;
    
                const scale = Math.min(
                  maxWidth / naturalWidth,
                  maxHeight / naturalHeight
                );
    
                setDimensions({
                  width: naturalWidth * scale,
                  height: naturalHeight * scale,
                });
              }}
            />
          )}
    
          <button
            className="cursor-pointer absolute right-4 z-[10001] text-white hover:text-gray-300 transition-colors bg-black/50 rounded-full p-3 hover:bg-black/70"
            onClick={(e) => {
              e.stopPropagation();
              setSelectedIndex((prev) => (prev < house.images.length - 1 ? prev + 1 : 0));
              setPreviewImage(house.images[selectedIndex < house.images.length - 1 ? selectedIndex + 1 : 0]);
            }}
          >
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
    
        <div 
          className="w-full max-w-[90vw] mt-4 pb-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div ref={thumbnailContainerRef} className="flex gap-[4px] overflow-x-hidden justify-center scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
            {house.images.map((image, idx) => (
              <div
                key={idx}
                ref={(el) => thumbnailRefs.current[idx] = el}
                className={`relative flex-shrink-0 min-w-[70px] w-[70px] h-[50px] rounded-[4px] overflow-hidden cursor-pointer transition-all ${
                  selectedIndex === idx 
                    ? 'opacity-100' 
                    : 'opacity-60 hover:opacity-100'
                }`}
                onMouseEnter={() => {
                  setSelectedIndex(idx);
                  setPreviewImage(image);
                  setDimensions({ width: 0, height: 0 });
                }}
              >
                <Image
                  alt={`thumbnail_${idx}`}
                  src={image}
                  fill
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default HeroAndDetails;