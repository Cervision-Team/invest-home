'use client';

import React, { useRef, useState } from "react";
import Feedback from "@/components/ui/Feedback";
import CustomerFirangiz from "../../../../public/icons/CustomerFirangiz.svg";
import CustomerMusa from "../../../../public/icons/CustomerMusa.svg";
import CustomerMaryam from "../../../../public/icons/CustomerMaryam.svg";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import FourStars from "../../../../public/icons/4stars.svg"
import FiveStars from "../../../../public/icons/5stars.svg"

const feedbacks = [
  {
    firstName: "Firəngiz Babayeva",
    image: CustomerFirangiz,
    description: "Invest Home vasitəsilə mənzil aldım və prosesi sözün əsl mənasında stresssiz keçirdim. Komanda çox peşəkar və dürüstdür. Hər sualıma ətraflı cavab verdilər, sənədləşmə işləri də çox sürətli və şəffaf oldu. Təkcə satış yox, satışdan sonra da maraqlanmaqları məni heyran etdi. Təşəkkürlər, Invest Home!"
  },
  {
    firstName: "Musa Kazimov",
    image: CustomerMusa,
    description: "Qısa zamanda etibarlı və təmiz bir kirayə ev tapmaq istəyirdim. Invest Home komandası tələblərimi diqqətlə dinlədi və büdcəmə uyğun gözəl bir ev təqdim etdilər. Müqavilə və digər prosedurlar çox asan oldu. Artıq 4 aydır yaşayıram, çox razıyam. Bu şirkətə güvənmək olar!"

  },
  {
    firstName: "Məryəm Mammadli",
    image: CustomerMaryam,
    description: "Evimi satmaq üçün bir neçə agentliklə əlaqə saxladım, amma ən effektiv nəticəni Invest Home verdi. Qiymətləndirmə, təqdimat və müştəri tapma prosesi inanılmaz sürətlə getdi. Üstəlik, hüquqi dəstəkləri də var idi, bu da məni rahatlatdı. Peşəkar yanaşmanı yüksək qiymətləndirirəm."
  }
]

const CustomerFeedbacks = () => {
  const swiperRef = useRef(null);

  return (
    <>
      <section className="mt-[130px] max-w-[1600px] mx-auto max-[431px]:hidden">
        <div className="flex max-[1050px]:flex-col justify-between gap-x-[100px] gap-y-[50px] px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]">
          <div className="min-[1050px]:max-w-[415px] flex flex-col justify-center items-start">
            <h2 className="text-2 text-[39.8px]/[47px] font-semibold">
              Baxın Müştərilərimiz Nə Deyir!
            </h2>
            <p className="text-2 text-[16px]/[26px] font-normal mt-[30px]">
              Fusce venenatis tellus a felis scelerisque, non pulvinar est
              pellentesque.{" "}
            </p>

            <div className="max-[1050px]:hidden w-full flex flex-row items-center gap-[31.62px] mt-[60px]">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                className="z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none"
              >
                <div className="group relative inline-block w-[50px] h-[50px]">
                  <svg
                    className="opacity-100 group-hover:opacity-0 transition-opacity duration-200 absolute top-0 left-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                  >
                    <circle
                      cx="25"
                      cy="25"
                      r="24.5"
                      transform="rotate(180 25 25)"
                      fill="white"
                      stroke="#02836F"
                    />
                    <path
                      d="M35 26C35.5523 26 36 25.5523 36 25C36 24.4477 35.5523 24 35 24V26ZM14.2929 24.2929C13.9024 24.6834 13.9024 25.3166 14.2929 25.7071L20.6569 32.0711C21.0474 32.4616 21.6805 32.4616 22.0711 32.0711C22.4616 31.6805 22.4616 31.0474 22.0711 30.6569L16.4142 25L22.0711 19.3431C22.4616 18.9526 22.4616 18.3195 22.0711 17.9289C21.6805 17.5384 21.0474 17.5384 20.6569 17.9289L14.2929 24.2929ZM35 24H15V26H35V24Z"
                      fill="#02836F"
                    />
                  </svg>

                  <svg
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-0 left-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                  >
                    <circle
                      cx="25"
                      cy="25"
                      r="24.5"
                      transform="rotate(180 25 25)"
                      fill="#02836F"
                      stroke="#02836F"
                    />
                    <path
                      d="M35 26C35.5523 26 36 25.5523 36 25C36 24.4477 35.5523 24 35 24V26ZM14.2929 24.2929C13.9024 24.6834 13.9024 25.3166 14.2929 25.7071L20.6569 32.0711C21.0474 32.4616 21.6805 32.4616 22.0711 32.0711C22.4616 31.6805 22.4616 31.0474 22.0711 30.6569L16.4142 25L22.0711 19.3431C22.4616 18.9526 22.4616 18.3195 22.0711 17.9289C21.6805 17.5384 21.0474 17.5384 20.6569 17.9289L14.2929 24.2929ZM35 25V26H15V25V24H35V25Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </button>

              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                className="z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none"
              >
                <div className="group relative inline-block w-[50px] h-[50px]">
                  <svg
                    className="opacity-100 group-hover:opacity-0 transition-opacity duration-200 absolute top-0 left-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                  >
                    <circle
                      cx="25"
                      cy="25"
                      r="24.5"
                      fill="white"
                      stroke="#02836F"
                    />
                    <path
                      d="M15 24C14.4477 24 14 24.4477 14 25C14 25.5523 14.4477 26 15 26V24ZM35.7071 25.7071C36.0976 25.3166 36.0976 24.6834 35.7071 24.2929L29.3431 17.9289C28.9526 17.5384 28.3195 17.5384 27.9289 17.9289C27.5384 18.3195 27.5384 18.9526 27.9289 19.3431L33.5858 25L27.9289 30.6569C27.5384 31.0474 27.5384 31.6805 27.9289 32.0711C28.3195 32.4616 28.9526 32.4616 29.3431 32.0711L35.7071 25.7071ZM15 26H35V24H15V26Z"
                      fill="#02836F"
                    />
                  </svg>

                  <svg
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-0 left-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                  >
                    <circle
                      cx="25"
                      cy="25"
                      r="24.5"
                      fill="#02836F"
                      stroke="#02836F"
                    />
                    <path
                      d="M15 24C14.4477 24 14 24.4477 14 25C14 25.5523 14.4477 26 15 26V24ZM35.7071 25.7071C36.0976 25.3166 36.0976 24.6834 35.7071 24.2929L29.3431 17.9289C28.9526 17.5384 28.3195 17.5384 27.9289 17.9289C27.5384 18.3195 27.5384 18.9526 27.9289 19.3431L33.5858 25L27.9289 30.6569C27.5384 31.0474 27.5384 31.6805 27.9289 32.0711C28.3195 32.4616 28.9526 32.4616 29.3431 32.0711L35.7071 25.7071ZM15 25V26H35V25V24H15V25Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </button>
            </div>
          </div>
          <div className="relative min-[1050px]:max-w-[500px] min-w-0">
            <Swiper
              modules={[Pagination, Autoplay]}
              onSwiper={(swiper) => (swiperRef.current = swiper)}
              loop={true}
              speed={300}
              spaceBetween={10}
              className="shadow-[10px_10px_30px_0px_rgba(0,0,0,0.10)] rounded-[30px] bg-white"
            >
              {feedbacks.map((feedback, idx) => (
                <SwiperSlide key={idx} className="min-[1050px]:max-w-[500px]">
                  <Feedback key={idx} name={feedback.firstName} image={feedback.image} stars={FourStars}
                    description={feedback.description} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
          <div className="max-[1050px]:flex w-full hidden flex-row items-center gap-[31.62px]">
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                className="z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none"
              >
                <div className="group relative inline-block w-[50px] h-[50px]">
                  <svg
                    className="opacity-100 group-hover:opacity-0 transition-opacity duration-200 absolute top-0 left-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                  >
                    <circle
                      cx="25"
                      cy="25"
                      r="24.5"
                      transform="rotate(180 25 25)"
                      fill="white"
                      stroke="#02836F"
                    />
                    <path
                      d="M35 26C35.5523 26 36 25.5523 36 25C36 24.4477 35.5523 24 35 24V26ZM14.2929 24.2929C13.9024 24.6834 13.9024 25.3166 14.2929 25.7071L20.6569 32.0711C21.0474 32.4616 21.6805 32.4616 22.0711 32.0711C22.4616 31.6805 22.4616 31.0474 22.0711 30.6569L16.4142 25L22.0711 19.3431C22.4616 18.9526 22.4616 18.3195 22.0711 17.9289C21.6805 17.5384 21.0474 17.5384 20.6569 17.9289L14.2929 24.2929ZM35 24H15V26H35V24Z"
                      fill="#02836F"
                    />
                  </svg>

                  <svg
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-0 left-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                  >
                    <circle
                      cx="25"
                      cy="25"
                      r="24.5"
                      transform="rotate(180 25 25)"
                      fill="#02836F"
                      stroke="#02836F"
                    />
                    <path
                      d="M35 26C35.5523 26 36 25.5523 36 25C36 24.4477 35.5523 24 35 24V26ZM14.2929 24.2929C13.9024 24.6834 13.9024 25.3166 14.2929 25.7071L20.6569 32.0711C21.0474 32.4616 21.6805 32.4616 22.0711 32.0711C22.4616 31.6805 22.4616 31.0474 22.0711 30.6569L16.4142 25L22.0711 19.3431C22.4616 18.9526 22.4616 18.3195 22.0711 17.9289C21.6805 17.5384 21.0474 17.5384 20.6569 17.9289L14.2929 24.2929ZM35 25V26H15V25V24H35V25Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </button>

              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                className="z-30 flex items-center justify-center h-full cursor-pointer group focus:outline-none"
              >
                <div className="group relative inline-block w-[50px] h-[50px]">
                  <svg
                    className="opacity-100 group-hover:opacity-0 transition-opacity duration-200 absolute top-0 left-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                  >
                    <circle
                      cx="25"
                      cy="25"
                      r="24.5"
                      fill="white"
                      stroke="#02836F"
                    />
                    <path
                      d="M15 24C14.4477 24 14 24.4477 14 25C14 25.5523 14.4477 26 15 26V24ZM35.7071 25.7071C36.0976 25.3166 36.0976 24.6834 35.7071 24.2929L29.3431 17.9289C28.9526 17.5384 28.3195 17.5384 27.9289 17.9289C27.5384 18.3195 27.5384 18.9526 27.9289 19.3431L33.5858 25L27.9289 30.6569C27.5384 31.0474 27.5384 31.6805 27.9289 32.0711C28.3195 32.4616 28.9526 32.4616 29.3431 32.0711L35.7071 25.7071ZM15 26H35V24H15V26Z"
                      fill="#02836F"
                    />
                  </svg>

                  <svg
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 absolute top-0 left-0"
                    xmlns="http://www.w3.org/2000/svg"
                    width="50"
                    height="50"
                    viewBox="0 0 50 50"
                    fill="none"
                  >
                    <circle
                      cx="25"
                      cy="25"
                      r="24.5"
                      fill="#02836F"
                      stroke="#02836F"
                    />
                    <path
                      d="M15 24C14.4477 24 14 24.4477 14 25C14 25.5523 14.4477 26 15 26V24ZM35.7071 25.7071C36.0976 25.3166 36.0976 24.6834 35.7071 24.2929L29.3431 17.9289C28.9526 17.5384 28.3195 17.5384 27.9289 17.9289C27.5384 18.3195 27.5384 18.9526 27.9289 19.3431L33.5858 25L27.9289 30.6569C27.5384 31.0474 27.5384 31.6805 27.9289 32.0711C28.3195 32.4616 28.9526 32.4616 29.3431 32.0711L35.7071 25.7071ZM15 25V26H35V25V24H15V25Z"
                      fill="white"
                    />
                  </svg>
                </div>
              </button>
            </div>
        </div>
      </section>
    </>
  );
};

export default CustomerFeedbacks;
