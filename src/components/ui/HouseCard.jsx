"use client";

import React from "react";
import { CiLocationOn } from "react-icons/ci";
import { LuHeart } from "react-icons/lu";
import Image from "next/image";
import HoverLabel from "../../app/(root)/Home/HomeTypes/HoverLabel";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const Imagesvg = "/icons/image.svg";
const PaintIcon = "/icons/paint.svg";
const ClipboardIcon = "/icons/clipboard.svg";
const MetroIcon = "/icons/metro.svg";
const SquareMetersIcon = "/icons/Square Meters.svg";
const ShareSvg = "/icons/share.svg";
const BedIcon = "/icons/guidance_hotel-room.svg";
const FloorIcon = "/icons/ph_building-light.svg";
const Manat = "/icons/fa6-solid_manat-sign.svg";
const VideoSvg = "/icons/lets-icons_video-fill.svg";
const DefaultProfileIcon = "/icons/profile.svg";

/**
 * HouseCard Component
 *
 * @param {Object} props
 * @param {Object} props.house 
 * @param {boolean} props.isFavorite
 * @param {function} props.onToggleFavorite 
 */
const HouseCard = ({ house, isFavorite = false, onToggleFavorite, isActive = true }) => {
  const [activeSlide, setActiveSlide] = React.useState(0);
  const images = house?.medias?.filter((media) => !!media?.imageUrl) ?? [];
  const hasPublisherImage = Boolean(house?.publisher?.imageUrl);
  const publisherName = house?.publisher?.fullName?.trim() || "Elan sahibi";
  

  const handleFavClick = (e) => {
    e.preventDefault();
    onToggleFavorite?.(house.id);

    // if (isFavorite) {
    //   await fetch(`/api/favorites/${house.id}`, { method: "DELETE" });
    // } else {
    //   await fetch(`/api/favorites`, {
    //     method: "POST",
    //     body: JSON.stringify({ id: house.id }),
    //   });
    // }
  };

  return (
    <Link href={`/house-detail/${house.id}`} className="group">
      <style jsx>{`
        .dynamic-dots {
          display: flex;
          align-items: center;
          gap: 3px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background-color: rgba(217, 217, 217, 0.5);
          cursor: pointer;
          transition: background-color 0.3s ease;
        }

        .dot.active {
          background-color: #d9d9d9cc;
        }
      `}</style>
      <div className="mb-3 card shadow-[0_2px_8px_rgba(0,0,0,0.15)] overflow-hidden rounded-[8px] select-none cursor-pointer">
        <div className="img-container overflow-hidden rounded-[8px] relative">
          <Swiper
            modules={[Navigation, Pagination]}
            slidesPerView={1}
            loop={images.length > 1}
            speed={500}
            spaceBetween={5}
            onSlideChange={(swiper) => {
              setActiveSlide(swiper.realIndex);
            }}
            navigation={{
              nextEl: `.custom-next-${house.id}`,
              prevEl: `.custom-prev-${house.id}`,
            }}
            pagination={{
              el: `.custom-pagination-${house.id}`,
              clickable: true,
              renderBullet: function (index, className) {
                const isMobile =
                  typeof window !== "undefined" && window.innerWidth <= 425;
                const size = isMobile ? 5 : 8;
                const margin = isMobile ? 2 : 4;
                return `
                  <span
                    class="${className} bullet-dot"
                    style="
                      margin: 0 ${margin}px;
                      width: ${size}px;
                      height: ${size}px;
                      border-radius: 50%;
                      display: inline-block;
                      background-color: #D9D9D9CC;">
                  </span>`;
              },
            }}
            className="w-full"
          >
            <div className={`card custom-prev-${house.id} opacity-0 group-hover:opacity-100 transition-opacity swiper-button-prev drop-shadow-md`}></div>
            <div className={`card custom-next-${house.id} opacity-0 group-hover:opacity-100 transition-opacity swiper-button-next drop-shadow-md `}></div>
            {images.length
              ? images.map((media, index) => {
                const imageUrl = media.imageUrl;
                return <SwiperSlide key={`${house.id}-${index}`}>
                  <div className="relative aspect-[302/262]">
                    <Image
                      src={imageUrl}
                      alt={`house_image_${index}`}
                      fill
                      sizes="(max-width: 768px) 100vw, 302px"
                      className="object-cover"
                    />
                  </div>

                </SwiperSlide>;

              })
              : (
                <SwiperSlide>
                  <div className="relative aspect-[302/262] bg-[rgba(0,0,0,0.04)]">
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-2">
                      <span className="text-[12px] font-[500] text-[var(--text-color-3)] opacity-80">
                        Şəkil mövcud deyil
                      </span>
                    </div>
                  </div>
                </SwiperSlide>
              )}
          </Swiper>

          <div
            onClick={handleFavClick}
            className="cursor-pointer max-[431px]:w-6 max-[431px]:h-6 w-[30px] h-[30px] flex items-center justify-center absolute bg-[rgba(246,246,246,0.62)] z-10 rounded-full top-[13px] right-[11px]"
          >
            <LuHeart
              className={`${isFavorite ? "fill-red-500 text-red-500" : "fill-transparent"
                } text-[20px] max-[431px]:text-[16px]`}
            />
          </div>

          <div
            onClick={(e) => e.preventDefault()}
            className="z-1 icons top-[12px] left-[8px] absolute flex flex-col max-[431px]:flex-row gap-[9px]"
          >
            <HoverLabel iconSrc={PaintIcon} label="Təmirli" bgColor="#FFC700" />
            <HoverLabel iconSrc={ClipboardIcon} label="Çıxarış" bgColor="#5DAA7E" />
          </div>

          <div className="flex items-center gap-[7px] z-1 max-[769px]:bottom-[7px] bottom-[12px] max-[769px]:right-[50%] max-[769px]:translate-x-[50%] right-[8px] absolute arrow-dot-container">
            <div
              onClick={(e) => e.preventDefault()}
              className="dynamic-dots"
            >
              {images?.map((_, index) => (
                <div
                  key={index}
                  className={`dot ${index === activeSlide ? "active" : ""}`}
                ></div>
              ))}
            </div>
            <div
              onClick={(e) => {
                e.preventDefault();
                alert("video clicked!");
              }}
              className="max-[769px]:hidden flex items-center gap-[3px]"
            >
              <Image src={VideoSvg} alt="Invest Home" width={18} height={18} />
              <span className="text-white text-[10px]">1</span>
            </div>
          </div>

          <div className="z-1 metro bottom-[12px] left-[8px] absolute max-[769px]:hidden flex items-center gap-[3px] bg-white py-[2.5px] px-[10px] rounded-[8px]">
            <Image src={MetroIcon} alt="Metro" width={18} height={18} className="h-auto" />
            <span className="font-[400] text-[var(--text-color-3)] text-[10px] whitespace-nowrap">
              N.Nərimanov
            </span>
          </div>
        </div>

        <div className="overflow-hidden content-container max-[769px]:mx-[5px] mx-[8px] max-[769px]:py-[14px] py-[16px] flex flex-col gap-[6px] max-[769px]:border-b-0 border-b border-[rgba(0,0,0,0.2)]">
          <div className="flex justify-between items-center gap-[16px]">
            <div className="hidden max-[769px]:flex items-center gap-[5px]">
              <span className="text-[14px] font-[600]">{house.price}</span>
              <Image src={Manat} alt="Manat" width={10} height={10} />
            </div>
            <div className="name max-[769px]:hidden shrink min-w-0 overflow-hidden">
              <h3 className="whitespace-nowrap font-[500] text-[16px] text-[#111111]">
                {house.propertyType}
              </h3>
            </div>
            <div className="shrink-0 share cursor-pointer">
              <Image src={ShareSvg} alt="Share" width={20} height={20} />
            </div>
          </div>

          <div className="flex items-center gap-[11px]">
            <CiLocationOn className="text-[var(--text-color-3)] hidden max-[769px]:inline-block" />
            <span className="font-[500] text-[var(--text-color-3)] text-[14px] whitespace-nowrap max-[769px]:hidden">
              {house.selectedAddress}
            </span>
            <Image
              src={MetroIcon}
              alt="Metro"
              width={18}
              height={18}
              className="w-[18px] h-auto hidden max-[769px]:block"
            />
            <span className="font-[500] text-[var(--text-color-3)] text-[10px] whitespace-nowrap hidden max-[769px]:block">
              N.Nərimanov
            </span>
          </div>

          <div className="flex max-[769px]:gap-[8px] gap-[12px] items-center font-[300] text-[12px]">
            <div className="beds flex max-[769px]:gap-[4px] gap-[6px] items-center">
              <Image src={BedIcon} alt="Beds" width={10} height={10} className="h-auto" />
              <span className="max-[769px]:text-[8px] font-[400] whitespace-nowrap">
                {house.rooms} <span className="max-[769px]:hidden">beds</span>
              </span>
            </div>
            <div className="floor flex max-[769px]:gap-[4px] gap-[6px] items-center">
              <Image src={FloorIcon} alt="Floor" width={10} height={10} className="h-auto" />
              <span className="max-[769px]:text-[8px] font-[400] whitespace-nowrap">
                {house.floor}
              </span>
            </div>
            <div className="field flex max-[769px]:gap-[4px] gap-[6px] items-center">
              <Image src={SquareMetersIcon} alt="Field" width={10} height={10} className="h-auto" />
              <span className="max-[769px]:text-[8px] font-[400] whitespace-nowrap">
                {house.area}
              </span>
            </div>
          </div>
        </div>

        <div className="max-[769px]:hidden px-[8px] py-[16px] flex justify-between gap-[8px]">
          {
            isActive &&
            <div className="flex items-center gap-[8px] shrink min-w-0 overflow-hidden">
              <div className="w-10 h-10">
                {hasPublisherImage ? (
                  <Image
                    className="max-[1024px]:hidden w-full h-full rounded-full object-cover object-top"
                    src={house?.publisher?.imageUrl}
                    alt="Author"
                    width={35}
                    height={35}
                  />
                ) : (
                  <div className="max-[1024px]:hidden w-full h-full rounded-full bg-[var(--primary-color)] flex items-center justify-center">
                    <Image src={DefaultProfileIcon} alt="Default avatar" width={20} height={20} />
                  </div>
                )}
              </div>

              <span className="whitespace-nowrap text-[14px] text-[#111] font-[500]">
                {publisherName}
              </span>

            </div>
          }
          <div className="flex items-center gap-[5px] shrink min-w-0 overflow-hidden">
            <span className="text-[16px] font-[600] max-[1200]:text-[16px]">
              {house.price}
            </span>
            <Image src={Manat} alt="Manat" width={12} height={12} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HouseCard;
