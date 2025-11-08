'use client';

import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // For Next.js routing
// import { useNavigate } from "react-router-dom"; // For React Router (alternative)
import {
  All,
  Building,
  Datcha,
  Land,
  Neighbour,
  Office,
  Popular,
  Rent,
  Sale,
  Store,
  Mortgage
} from "../../../components/core/Svg";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export const SampleNextArrow = ({ swiperRef }) => {
  return (
    <button
      className="cursor-pointer" onClick={() => swiperRef.current?.slideNext()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="42"
        viewBox="0 0 21 42"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M17.7746 22.2442L7.87489 32.144L5.40039 29.6695L14.0629 21.007L5.40039 12.3445L7.87489 9.87L17.7746 19.7697C18.1027 20.0979 18.287 20.543 18.287 21.007C18.287 21.471 18.1027 21.9161 17.7746 22.2442Z"
          fill="#02836F"
        />
      </svg>
    </button>
  );
}

export const SamplePrevArrow = ({ swiperRef }) => {
  return (
    <button
      className="cursor-pointer" onClick={() => swiperRef.current?.slidePrev()}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="21"
        height="42"
        viewBox="0 0 21 42"
        fill="none"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.22536 19.7558L13.1251 9.856L15.5996 12.3305L6.93711 20.993L15.5996 29.6555L13.1251 32.13L3.22536 22.2303C2.89729 21.9021 2.71298 21.457 2.71298 20.993C2.71298 20.529 2.89729 20.0839 3.22536 19.7558Z"
          fill="#02836F"
        />
      </svg>
    </button>
  );
}

const categories = [
  { 
    id: 1, 
    label: "Bütün", 
    icon: All,
    filter: "all",
    route: "/listings", 
    announcementTypes: ["sell", "rent", "daily", "roommate"],
    propertyTypes: ["apartment", "house", "office", "object", "land", "garage"]
  },
  {
    id: 2,
    label: "İpoteka",
    icon: Mortgage,
    filter: "mortgage",
    route: "/listings",
    announcementTypes: ["sell", "rent", "daily", "roommate"],
    propertyTypes: ["apartment", "house", "office", "object", "land", "garage"]
  },
  { 
    id: 3, 
    label: "Satılıq", 
    icon: Sale,
    filter: "sell",
    route: "/listings",
    announcementTypes: ["sell"],
    propertyTypes: ["apartment", "house", "office", "object", "land", "garage"]
  },
  { 
    id: 4, 
    label: "Kirayə", 
    icon: Rent,
    filter: "rent",
    route: "/listings",
    announcementTypes: ["rent", "daily", "roommate"],
    propertyTypes: ["apartment", "house", "office", "object"]
  },
  { 
    id: 5, 
    label: "Populyar elanlar", 
    icon: Popular,
    filter: "popular",
    route: "/listings",
    announcementTypes: ["sell", "rent", "daily"],
    propertyTypes: ["apartment", "house", "office", "object"]
  },
  { 
    id: 6, 
    label: "Qonşuluq əmlakları", 
    icon: Neighbour,
    filter: "roommate",
    route: "/listings",
    announcementTypes: ["roommate"],
    propertyTypes: ["apartment"]
  },
  { 
    id: 7, 
    label: "Mənzil", 
    icon: Building,
    filter: "apartment",
    route: "/listings",
    announcementTypes: ["sell", "rent", "daily", "roommate"],
    propertyTypes: ["apartment"]
  },
  { 
    id: 8, 
    label: "Bağ Evi", 
    icon: Datcha,
    filter: "house",
    route: "/listings",
    announcementTypes: ["sell", "rent", "daily"],
    propertyTypes: ["house"]
  },
  { 
    id: 9, 
    label: "Obyekt", 
    icon: Store,
    filter: "object",
    route: "/listings",
    announcementTypes: ["sell", "rent"],
    propertyTypes: ["object"]
  },
  { 
    id: 10, 
    label: "Torpaq", 
    icon: Land,
    filter: "land",
    route: "/listings",
    announcementTypes: ["sell"],
    propertyTypes: ["land"]
  },
  { 
    id: 11, 
    label: "Ofis", 
    icon: Office,
    filter: "office",
    route: "/listings",
    announcementTypes: ["sell", "rent"],
    propertyTypes: ["office"]
  },
];

function Category({ 
  listings = [],
  loading = false,
  showNavigation = true, 
  onCategoryChange,
  activeId: externalActiveId, 
}) {
  const [activeId, setActiveId] = useState(externalActiveId || null);
  const [hover, setHover] = useState(-1);
  const [categoriesWithCount, setCategoriesWithCount] = useState(categories);
  const swiperRef = useRef(null);
  const isMobile = useMediaQuery('(max-width: 430px)');
  const router = useRouter(); 
  // const navigate = useNavigate();

  useEffect(() => {
    if (externalActiveId !== undefined && externalActiveId !== activeId) {
      setActiveId(externalActiveId);
    }
  }, [externalActiveId]);

  useEffect(() => {
    if (listings && listings.length > 0) {
      const updatedCategories = categories.map(category => {
        let count = 0;
        
        if (category.filter === "all") {
          count = listings.length;
        } else if (category.filter === "popular") {
          count = listings.filter(listing => 
            listing.isPopular || 
            listing.viewCount > 100 || 
            listing.favoriteCount > 10
          ).length;
        } else {
          count = listings.filter(listing => {
            const matchesAnnouncementType = category.announcementTypes.includes(listing.announcementType);
            const matchesPropertyType = category.propertyTypes.includes(listing.propertyType);
            return matchesAnnouncementType && matchesPropertyType;
          }).length;
        }

        return {
          ...category,
          count: count
        };
      });

      setCategoriesWithCount(updatedCategories);
    }
  }, [listings]);

const handleCategoryClick = (categoryId) => {
  setActiveId(categoryId);
  const selectedCategory = categories.find(cat => cat.id === categoryId);

  if (showNavigation && selectedCategory) {
    const searchParams = new URLSearchParams({
      category: selectedCategory.filter,
      announcementTypes: selectedCategory.announcementTypes.join(','),
      propertyTypes: selectedCategory.propertyTypes.join(','),
      categoryId: categoryId.toString()
    });
    router.push(`/all-houses/category-lists?${searchParams.toString()}`);
  }
};
return (
    <>
      {isMobile ? 
        '' 
        :
        <section className="max-[1200px]:mt-[60px] max-[1000px]:mt-[50px] mt-[89px] max-w-[1600px] mx-auto px-[80px] max-[1025]:px-[20px] max-[426px]:px-[16px]">
          <div className="w-full flex justify-start">
            <div className="flex gap-[84px] max-[1200px]:gap-[50px] max-[1000px]:gap-[25px] items-center relative w-full max-w-full">
              <SamplePrevArrow swiperRef={swiperRef} />
              <Swiper
                loop={false}
                slidesPerView="auto"
                speed={500}
                spaceBetween={16}
                onSwiper={(swiper) => (swiperRef.current = swiper)}
              >
                {categoriesWithCount.map((cat) => {
                  const isActive = activeId === cat.id;
                  const isHover = hover === cat.id;
                  const Icon = cat.icon;

                  return (
                    <SwiperSlide key={cat.id} className="!w-auto">
                      <div
                        onMouseEnter={() => setHover(cat.id)}
                        onMouseLeave={() => setHover(-1)}
                        onClick={() => handleCategoryClick(cat.id)}
                        className={`rounded-[8px] h-[46px] px-[20px] flex items-center gap-[8px] cursor-pointer select-none transition-colors duration-200
                          ${isActive
                            ? "bg-primary text-white"
                            : "bg-white text-black hover:bg-primary hover:text-white"
                          }
                          ${loading ? 'pointer-events-none opacity-50' : ''}
                        `}
                      >
                        <Icon isHover={isHover} isActive={isActive} />
                        <span className="font-[500] text-[12px] md:text-[14px] whitespace-nowrap">
                          {cat.label}
                        </span>
                        {loading && isActive && (
                          <div className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin ml-1" />
                        )}
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
              <SampleNextArrow swiperRef={swiperRef} />
            </div>
          </div>
        </section>
      }
    </>
  );
}

export default Category;

