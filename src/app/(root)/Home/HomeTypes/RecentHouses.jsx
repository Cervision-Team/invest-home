'use client';

import 'slick-carousel/slick/slick.css';
import { useState, useRef } from "react";
import { houseData } from "../../../../components/core/house";
import HouseCard from "../../../../components/ui/HouseCard";
import HouseTypeSelector from "./HouseTypeSelector";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
// import { useTranslation } from "react-i18next";

const RecentHouses = () => {
  // const {t}=useTranslation()
  const [activeType, setActiveType] = useState("enSon");

  return (
    <>
      <HouseTypeSelector
        activeType={activeType}
        setActiveType={setActiveType}
      />
      <section className='mt-[60px] max-w-[1600px] mx-auto max-[1025px]:px-[20px] max-[426px]:px-[16px] px-[80px]'>
        <div className="flex flex-col overflow-hidden">
          <div>
            <Swiper
              spaceBetween={16}
              slidesPerView={2.2}
              loop={true}
              speed={500}
              breakpoints={{
                480: {
                  spaceBetween: 24,
                  slidesPerView: 2.2
                },
                600: {
                  spaceBetween: 24,
                  slidesPerView: 3.2
                },
                1024: {
                  spaceBetween: 24,
                  slidesPerView: 4.2
                }
              }}
            >
              {houseData.map((house, i) => (
                <SwiperSlide key={i}>
                  <HouseCard house={house} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="max-[426px]:hidden flex cursor-pointer justify-center items-center my-[3rem]  hover:text-[var(--primary-color)] transition-all duration-300 ease-in">
            <Link
              href={`/${activeType}`}
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
