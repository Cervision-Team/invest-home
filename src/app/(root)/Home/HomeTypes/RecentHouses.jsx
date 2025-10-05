'use client';

import 'slick-carousel/slick/slick.css';
import { useState, useEffect } from "react";
import HouseCard from "../../../../components/ui/HouseCard";
import HouseTypeSelector from "./HouseTypeSelector";
import Link from "next/link";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
// import { useTranslation } from "react-i18next";

import { houseData } from "../../../../components/core/house";

const RecentHouses = ({ houseType }) => {
  // const { t } = useTranslation();
  const [activeType, setActiveType] = useState("enSon");
  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  if (loading) return <p className="text-center mt-10">Yüklənir...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Xəta baş verdi: {error}</p>;

  return (
    <>
      <HouseTypeSelector
        houseType={houseType}
        activeType={activeType}
        setActiveType={setActiveType}
      />

      <section className="max-[431px]:mt-[10px] mt-[60px] max-w-[1600px] mx-auto px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px] max-[431px]:pr-0">
        <div className="flex flex-col overflow-hidden">
          <div>
            <Swiper
              spaceBetween={16}
              slidesPerView={2.2}
              loop={true}
              speed={500}
              breakpoints={{
                480: { spaceBetween: 24, slidesPerView: 2.2 },
                600: { spaceBetween: 24, slidesPerView: 3.2 },
                1024: { spaceBetween: 24, slidesPerView: 4.4 },
              }}
            >
              {houses.map((house) => (
                <SwiperSlide key={house.id}>
                  <HouseCard house={house} />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          <div className="max-[431px]:hidden flex cursor-pointer justify-center items-center my-[3rem] hover:text-[var(--primary-color)] transition-all duration-300 ease-in">
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
