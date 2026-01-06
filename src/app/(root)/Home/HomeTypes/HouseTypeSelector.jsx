import React, { memo } from "react";
import { GiBackwardTime } from "react-icons/gi";
import { AiFillFire } from "react-icons/ai";
import { TbCirclePercentageFilled } from "react-icons/tb";
import Link from "next/link";
// import { useTranslation } from "react-i18next";

const HouseTypeSelector = memo(({ houseType, activeType, setActiveType }) => {
  // const {t} =useTranslation()
  // const headingText =
  //   activeType === "enSon"
  //     ? t   ("Ən son siyahıya alınmış əmlaklar")
  //     : activeType === "popular"
  //     ? t("Popular əmlaklar")
  //     : t("Endirimli evlər")

  const headingText =
    activeType === "enSon"
      ? houseType
      : activeType === "popular"
        ? "Populyar əmlaklar"
        : "Endirimli evlər"



  return (
    <>
      <section className="max-[431px]:mt-[32px] max-w-[1600px] mx-auto max-[1025px]:px-[20px] max-[431px]:px-[16px] px-[80px]">
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
        >
          <div className="hidden max-[431px]:flex justify-between items-center">
            <h1 className="font-[600] text-[16px]">{houseType}</h1>
            <i className="fa-solid fa-arrow-right text-[22px]"></i>
          </div>
        </Link>
        <div className="max-[431px]:hidden flex m-auto justify-between max-[1050px]:flex-col max-[1050px]:gap-4 ">
          <div className="flex flex-row items-end justify-between w-full">
            <h1 className="text-[var(--text-color-2)] text-[24px] font-[700] leading-[2.9rem]">
              {headingText}
            </h1>
            <div className="flex gap-4 items-center justify-center">
              <button
                onClick={() => setActiveType("enSon")}
                className={`cursor-pointer flex items-center just gap-[8px] px-[24px] py-2 rounded-[6.25rem]  border border-[var(--primary-color)] transition-colors  duration-300 ease-in-out 
          ${activeType === "enSon"
                    ? "bg-[var(--primary-color)] text-[var(--white)]"
                    : "bg-[var(--white)] text-[var(--primary-color)]"
                  }
          hover:bg-[var(--primary-color)] hover:text-[var(--white)] focus:bg-[var(--primary-color)] focus:text-[var(--white)] active:bg-[var(--primary-color)] active:text-[var(--white)]`}
              >
                <span className="text-[1.5rem] font-[500]"><GiBackwardTime /></span>
                <span className="max-[530px]:hidden font-[500] whitespace-nowrap">
                  {/* {t("Ən son")} */}
                  Ən son
                </span>
              </button>
              <button
                onClick={() => setActiveType("popular")}
                className={`cursor-pointer flex items-center gap-[10px] px-[24px] py-2 rounded-[6.25rem]  border border-[var(--primary-color)] transition-colors duration-300 ease-in-out 
          ${activeType === "popular"
                    ? "bg-[var(--primary-color)] text-[var(--white)]"
                    : "bg-[var(--white)] text-[var(--primary-color)] "
                  }
          hover:bg-[var(--primary-color)] hover:text-[var(--white)] focus:bg-[var(--primary-color)] focus:text-[var(--white)] active:bg-[var(--primary-color)] active:text-[var(--white)]`}
              >
                <span>
                  <AiFillFire className="text-[1.5rem]" />
                </span>
                <span className="max-[530px]:hidden font-[500] leading-[24px]">
                  {/* {t("Popular")} */}
                  Populyar

                </span>
              </button>
              <button
                onClick={() => setActiveType("endirimli")}
                className={`cursor-pointer flex items-center gap-[10px] px-[24px] py-2 rounded-[6.25rem]  border border-[var(--primary-color)] transition-colors duration-300 ease-in-out 
          ${activeType === "endirimli"
                    ? "bg-[var(--primary-color)] text-[var(--white)]"
                    : "bg-[var(--white)] text-[var(--primary-color)]"
                  }
          hover:bg-[var(--primary-color)] hover:text-[var(--white)] focus:bg-[var(--primary-color)] focus:text-[var(--white)] active:bg-[var(--primary-color)] active:text-[var(--white)]`}
              >
                <span>
                  <TbCirclePercentageFilled className="text-[1.5rem]" />
                </span>
                <span className="max-[530px]:hidden font-[500] leading-[24px]" >
                  {/* {t("Endirimli")} */}
                  Endirimli


                </span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
});

export default HouseTypeSelector;
