"use client"

import React, { useState } from 'react'
import { houseData } from "@/components/core/house";
import ShareWhite from "../../../../public/icons/ShareWhite.svg"
import Image from 'next/image'
import RoundedBlackButton from '@/components/ui/RoundedBlackButton'
import { LuHeart, LuX } from "react-icons/lu"
import Loading from './Loading';
import { Swiper, SwiperSlide } from "swiper/react";
import { useMediaQuery } from '@/hooks/useMediaQuery';

const Hero = ({ id }) => {

  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });


  const isMobile = useMediaQuery('(max-width: 430px)');

  const house = houseData.find(h => h.id === Number(id));

  if (!house) {
    return Loading()
  }

  const [fav, setFav] = useState([]);
  const [previewImage, setPreviewImage] = useState(null);
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
        <div className='px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[0]'>
          <div className='min-[431px]:p-[20px] min-[430px]:rounded-[20px] min-[431px]:bg-[rgba(255,255,255,0.50)] min-[431px]:shadow-[0px_4px_10px_0px_rgba(2,131,111,0.10)] flex flex-col gap-[30px] mt-[20px]'>
            <div className='max-[431px]:px-[16px] flex justify-between items-start gap-4'>
              <h1 className='text-[#111] text-[24px] lg:text-[32px] leading-[1.2] font-medium max-[431px]:text-[14px]'>
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

            {isMobile
              ?
              <div>
                <Swiper
                  loop={false}
                  slidesPerView={1}
                  speed={500}
                  spaceBetween={8}
                >
                  {house.images.map((image) => {

                    return (
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
                    );
                  })}

                </Swiper>
              </div>
              :
              <div className="grid grid-cols-4 grid-rows-2 gap-x-[20px] gap-y-[14px] max-[769px]:gap-x-[10px] max-[769px]:gap-y-[7px] w-full max-h-[434px]">
                {house.images.map((image, idx) => {
                  return (
                    <>
                      <div 
                        key={idx} 
                        className={` ${idx === 0 ? "col-span-2 row-span-2" : ""} overflow-hidden relative rounded-[8px] cursor-pointer`}
                        onClick={() => openPreview(image)}
                      >
                        <div className='aspect-[3/2]'>
                          <Image
                            alt={"house_image"}
                            src={image}
                            fill
                            className={`object-cover`}
                          />
                        </div>
                      </div>
                    </>
                  )
                })}
              </div>}
          </div>
        </div>
      </section>

{previewImage && (
  <div
    className="fixed inset-0 z-[9999] bg-black flex items-center justify-center p-4"
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

    {dimensions.width > 0 && dimensions.height > 0 ? (
      <div
        className="relative"
        style={{
          width: `${dimensions.width}px`,
          height: `${dimensions.height}px`,
          maxWidth: "90vw",
          maxHeight: "90vh",
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
          const maxHeight = window.innerHeight * 0.9;

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
  </div>
)}
    </>
  );
};

export default Hero;