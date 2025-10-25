"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/css";
import { blogData } from "../../../components/core/BlogsData";
import BlogCard from "@/components/ui/BlogCard";

const Blogs = () => {
  const [blogs, setBlogs] = useState(blogData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /*
    useEffect(() => {
      const fetchBlogs = async () => {
        setLoading(true);
        try {
          const res = await fetch("/api/blogs");
          if (!res.ok) throw new Error("Failed to fetch blogs");
          const data = await res.json();
          setBlogs(data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchBlogs();
    }, []);
  */

  if (loading) {
    return (
      <section className="py-20 text-center text-white bg-gray-800">
        Loading blogs…
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-20 text-center text-red-500 bg-gray-800">
        {error}
      </section>
    );
  }

  return (
    <section className="max-[431px]:hidden [background:linear-gradient(180deg,_#02836F_0%,_#001D19_100%)]">
      <div className="max-w-[1600px] mx-auto">
        <div className="w-full mx-auto items-center pt-[100px] px-[80px] max-[1025px]:px-[20px] pb-[210px]">
          <p className="text-white text-[19.4px] font-medium tracking-[2.91px] uppercase text-center">
            Trenddə nədir ?
          </p>
          <h2 className="mb-[40px] text-white text-[39.8px]/[47px] font-semibold mt-[30px] text-center">
            Ən son Bloqlar və Yazılar
          </h2>

          <div className="flex flex-row">
            <Swiper
              modules={[Autoplay]}
              loop
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              slidesPerView={1}
              speed={500}
              spaceBetween={20}
              className="w-full blog-swiper"
              breakpoints={{
                550: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 20 },
                1024: { slidesPerView: 3, spaceBetween: 20 },
              }}
            >
              {blogs.map((data, index) => (
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
      </div>
    </section>
  );
};

export default Blogs;
