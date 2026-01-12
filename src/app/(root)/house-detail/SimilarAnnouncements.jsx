"use client";
import React, { useEffect, useState } from "react";
import HouseCard from "@/components/ui/HouseCard";
import Loader from "@/components/ui/Loader";

const SimilarAnnouncements = () => {
  const [houses, setHouses] = useState([]);     // dynamic data
  const [loading, setLoading] = useState(true); // loading state
  const [error, setError] = useState(null);     // error state

  useEffect(() => {
    /*
      fetch("/api/houses/similar")
        .then(res => {
          if (!res.ok) throw new Error("Failed to fetch houses");
          return res.json();
        })
        .then(data => setHouses(data))
        .catch(err => setError(err.message))
        .finally(() => setLoading(false));
    */

    import("@/components/core/house").then(module => {
      setHouses(module.houseData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <section className="max-w-[1600px] mx-auto px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]">
        <div className="w-full flex items-center justify-center py-10">
          <Loader />
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="max-w-[1600px] mx-auto px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]">
        <p className="text-center text-red-500 py-10">{error}</p>
      </section>
    );
  }

  return (
    <section className="max-w-[1600px] mx-auto">
      <div className="px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]">
        <h1 className="text-[#111] text-[24px] sm:text-[28px] font-medium mb-6">
          Oxşar elanlar
        </h1>

        <div className="w-full grid grid-cols-4 max-[1025px]:grid-cols-3 max-[769px]:grid-cols-2 max-[431px]:gap-x-[8px] gap-[24px]">
          {houses.map((house) => (
            <HouseCard key={house.id} house={house} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SimilarAnnouncements;
