"use client";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { blogData } from "../../../components/core/BlogsData";
import BlogCard from "@/components/ui/BlogCard";

// async function fetchBlogs() {
//   const res = await fetch('https://your-backend.com/api/blogs', { cache: 'no-store' });
//   if (!res.ok) throw new Error('Failed to fetch blogs');
//   return res.json(); 
// }


const Blogs = () => {
  const scrollRef = useRef(null);
  const [scrollStep, setScrollStep] = useState(0);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const updateScrollStep = () => {
      const container = scrollRef.current;
      if (!container) return;

      const card = container.querySelector("div");
      if (card) {
        const cardWidth = card.getBoundingClientRect().width;
        const gap = parseFloat(getComputedStyle(container).gap || "0");
        setScrollStep(cardWidth + gap);
      }
    };

    updateScrollStep();
    window.addEventListener("resize", updateScrollStep);
    return () => window.removeEventListener("resize", updateScrollStep);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container || scrollStep === 0) return;

    const interval = setInterval(() => {
      const maxScrollLeft = container.scrollWidth - container.clientWidth;
      let newIndex = index + 1;
      const nextScroll = newIndex * scrollStep;

      if (nextScroll > maxScrollLeft) {
        newIndex = 0;
      }

      container.scrollTo({
        left: newIndex * scrollStep,
        behavior: "smooth",
      });

      setIndex(newIndex);
    }, 3000);

    return () => clearInterval(interval);
  }, [index, scrollStep]);

  return (
    <>
      <section className="max-[431px]:hidden [background:linear-gradient(180deg,_#02836F_0%,_#001D19_100%)]">
        <div className="max-w-[1600px] mx-[auto] w-full items-center pt-[140px] px-[80px] max-[1025px]:px-[20px]">
          <p className="text-white text-[19.4px] font-medium tracking-[2.91px] uppercase">
            Trenddə nədir ?
          </p>
          <h2 className="mb-[40px] text-white text-[39.8px]/[47px] font-semibold mt-[30px]">
            Ən son Bloqlar və Yazılar
          </h2>

          <div className="flex flex-row">
            <Swiper
              loop={true}
              slidesPerView={2}
              speed={500}
              spaceBetween={20}
              className="w-full"
              breakpoints={{
                425: {
                  slidesPerView: 1
                },
                768: {
                  slidesPerView: 2
                },
                1024: {
                  slidesPerView: 3
                }
              }}
            >
              {blogData.map((data, index) => (
                <SwiperSlide key={index}>
                  <BlogCard
                    image={data.image}
                    title={data.title}
                    description={data.description}
                    day={data.day}
                    month={data.month}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </section>
    </>
  );
};

export default Blogs;