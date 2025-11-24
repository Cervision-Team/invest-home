'use client';

import 'slick-carousel/slick/slick.css';
import { useState, useEffect, useRef } from "react";
import HouseCard from "../../../../components/ui/HouseCard";
import HouseTypeSelector from "./HouseTypeSelector";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import { ChevronLeft, ChevronRight } from 'lucide-react';
// import { useTranslation } from "react-i18next";

import { houseData } from "../../../../components/core/house";
import RecentHousesSkeleton from '@/components/ui/skeleton/RecentHousesSkeleton';

const RecentHouses = ({ houseType }) => {
  // const { t } = useTranslation();
  const [activeType, setActiveType] = useState("enSon");
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showArrows, setShowArrows] = useState(false);
  const swiperRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    // fetch(`/api/houses?type=${activeType}`)
    //   .then((res) => res.json())
    //   .then((data) => { setHouses(data); setLoading(false); })
    //   .catch((err) => { setError(err.message); setLoading(false); });

    const filtered =
      activeType === "enSon"
        ? houseData
        : houseData.filter((house) => house.type === activeType);

    setTimeout(() => {
      setHouses(filtered);
      setLoading(false);
    }, 300);
  }, [activeType]); 

  const handlePrev = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slidePrev();
    }
  };

  const handleNext = () => {
    if (swiperRef.current && swiperRef.current.swiper) {
      swiperRef.current.swiper.slideNext();
    }
  };

  if (loading) return <RecentHousesSkeleton />;
  if (error) return <p className="text-center mt-10 text-red-500">Xəta baş verdi: {error}</p>;

  return (
    <>
      <HouseTypeSelector
        houseType={houseType}
        activeType={activeType}
        setActiveType={setActiveType}
      />

      <section 
        className="max-[431px]:mt-[10px] mt-[60px] max-w-[1600px] mx-auto px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px] max-[431px]:pr-0"
        onMouseEnter={() => setShowArrows(true)}
        onMouseLeave={() => setShowArrows(false)}
        onTouchStart={() => setShowArrows(true)}
      >
        <div className="flex flex-col overflow-visible">
          <div className="relative">
            <Swiper
              ref={swiperRef}
              spaceBetween={16}
              slidesPerView={2.2}
              loop={true}
              speed={500}
              breakpoints={{
                480: { spaceBetween: 24, slidesPerView: 2.2 },
                600: { spaceBetween: 24, slidesPerView: 3.2 },
                1024: { spaceBetween: 24, slidesPerView: 3.6 },
                1180: { spaceBetween: 24, slidesPerView:  4.0},
                1255: { spaceBetween: 24, slidesPerView: 4.4 },
              }}
            >
              {houses.map((house) => (
                <SwiperSlide key={house.id}>
                  <HouseCard house={house} />
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Left Arrow */}
{/* Left Arrow */}
<button
  onClick={handlePrev}
  className={`absolute 
    left-[-60px] 
    max-[1024px]:hidden
    top-1/2 -translate-y-1/2 z-20 
    bg-[var(--primary-color)] hover:bg-opacity-90 text-white rounded-full
    p-[10px] max-[1255px]:p-[8px] max-[1180px]:p-[6px] max-[1025px]:p-[4px]
    transition-all duration-300 ease-in-out
    ${showArrows ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-x-[-20px]'}
  `}
  aria-label="Previous slide"
  style={{ pointerEvents: showArrows ? 'auto' : 'none' }}
>
  <ChevronLeft
    className="
      w-[24px] h-[24px]
      max-[1255px]:w-[20px] max-[1255px]:h-[20px]
      max-[1180px]:w-[16px] max-[1180px]:h-[16px]
      max-[1025px]:w-[12px] max-[1025px]:h-[12px]
    "
  />
</button>

{/* Right Arrow */}
<button
  onClick={handleNext}
  className={`absolute 
    right-[-60px] 
    max-[1024px]:hidden
    top-1/2 -translate-y-1/2 z-20 
    bg-[var(--primary-color)] hover:bg-opacity-90 text-white rounded-full
    p-[10px] max-[1255px]:p-[8px] max-[1180px]:p-[6px] max-[1025px]:p-[4px]
    transition-all duration-300 ease-in-out
    ${showArrows ? 'opacity-100 visible translate-x-0' : 'opacity-0 invisible translate-x-[20px]'}
  `}
  aria-label="Next slide"
  style={{ pointerEvents: showArrows ? 'auto' : 'none' }}
>
  <ChevronRight
    className="
      w-[24px] h-[24px]
      max-[1255px]:w-[20px] max-[1255px]:h-[20px]
      max-[1180px]:w-[16px] max-[1180px]:h-[16px]
      max-[1025px]:w-[12px] max-[1025px]:h-[12px]
    "
  />
</button>
          </div>

          <div className="max-[431px]:hidden flex cursor-pointer justify-center items-center my-9 hover:text-[var(--primary-color)] transition-all duration-300 ease-in">
            <Link
              href={{
                pathname:
                  houseType === "Ən son siyahıya alınmış əmlaklar"
                    ? "/all-houses/latest-houses"
                    : houseType === "Satılıq əmlaklar"
                      ? "/all-houses/properties-for-sale"
                      : houseType === "Kirayə evlər"
                        ? "/all-houses/for-rent"
                        : "/",
              }}
              className="text-[var(--primary-color)] border border-[var(--primary-color)] w-[10rem] h-[3rem] flex justify-center items-center rounded-[6.25rem] hover:bg-[var(--primary-color)] hover:text-[var(--white)] transition-all duration-300 ease-in"
            >
              {/* {t("Hamısına bax")} */}
              Hamısına bax
            </Link>
          </div>
        </div>
      </section>
    </>
  );
};

export default RecentHouses;