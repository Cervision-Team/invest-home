'use client';


import { useRef, useEffect } from "react";
// import { useTranslation, Trans } from "react-i18next";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Filter from "../../../components/ui/Filter";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import slider1 from "../../../../public/images/slider-2-1.png";
import slider2 from "../../../../public/images/slider-2-2.png";
import slider3 from "../../../../public/images/slider-2-3.png";
import slider4 from "../../../../public/images/slider-2-4.png";


const Slider = () => {
  const swiperRef = useRef(null);
  // const { t } = useTranslation();

  useEffect(() => {
    const swiperInstance = swiperRef.current?.swiper;

    if (swiperInstance) {
      swiperInstance.on("slideChangeTransitionStart", () => {
        const currentSlide = swiperInstance.slides[swiperInstance.activeIndex];
        const img = currentSlide.querySelector(".img");
        if (img) {
          img.style.transition = "transform 0.3s ease-out";
          img.style.transform = "translateX(-30px)";
        }
      });

      swiperInstance.on("slideChangeTransitionEnd", () => {
        const currentSlide = swiperInstance.slides[swiperInstance.activeIndex];
        const img = currentSlide.querySelector(".img");
        if (img) {
          img.style.transition = "transform 0.5s ease-in";
          img.style.transform = "translateX(0px)";
        }
      });
    }
  }, []);

  return (
    <section id="slider" className=" max-[580px]:hidden overflow-hidden">
      <Swiper
        ref={swiperRef}
        modules={[Pagination, Autoplay]}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2500, disableOnInteraction: false }}
        loop={true}
        speed={1800}
        spaceBetween={0}
        className="slider-header w-full h-[400px]
          [&_.swiper-pagination-bullet-active]:!w-[38px]
          [&_.swiper-pagination-bullet]:!w-[20px]
          [&_.swiper-pagination-bullet]:!h-[5px]
          [&_.swiper-pagination-bullet]:opacity-80
          [&_.swiper-pagination-bullet]:!rounded-full
          [&_.swiper-pagination]:!absolute
          [&_.swiper-pagination]:!top-[24px]
          [&_.swiper-pagination-bullet]:!bg-white
          [&_.swiper-pagination-bullet]:transition-all
          [&_.swiper-pagination-bullet]:duration-1500
          [&_.swiper-pagination-bullet]:ease-linear
          [&_.swiper-pagination-bullet-active]:!bg-[#3A0CA3]
          max-xl:h-[350px]"
      >
        {[
          slider1.src,
          slider2.src,
          slider3.src,
          slider4.src,
        ].map((src, index) => (
          <SwiperSlide key={index} className="sw-slide overflow-hidden ">
            <div
              style={{
                background: `linear-gradient(0deg, rgba(0, 0, 0, 0.14) 9.13%, rgba(32, 32, 32, 0.70) 100%), url(${src})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              className="w-full h-full object-fill transition-transform duration-500 ease-in-out img"
            ></div>
          </SwiperSlide>
        ))}
        <div className="w-full absolute top-[68px] left-[0px] z-10 text-white">
          <div className="mx-auto max-w-[1600px] max-[1025px]:px-[20px] px-[80px]">
            <h5 className="">
              {/* <Trans i18nKey="slider.title" /> */}
            </h5>
            <h1 className="text-[44px] font-[600] leading-[1.2]">
              {/* <Trans i18nKey="slider.subtitle"> */}
              İnvestisiyanın etibarlı ünvanı...
              {/* </Trans> */}
            </h1>
            <p className="text-[20px] font-[400] leading-[1.7]">
              {/* <Trans i18nKey="slider.description"> */}
              Dəyərləriniz qədər incə, arzularınız qədər geniş məkanlar. 
              <br />
              Mekanları dəyişirik, arzuları gerçəkləşdiririk.
              {/* </Trans> */}
            </p>
          </div>
        </div>
        <div className="w-[100%] absolute bottom-0 left-1/2 -translate-x-1/2 z-10">
          <Filter />
        </div>
      </Swiper>
    </section>
  );
};

export { Slider };
