"use client";

import React, { useState, useEffect } from "react";
import HouseTypeSelector from "../../Home/HomeTypes/HouseTypeSelector";
import HouseCard from "@/components/ui/HouseCard";
import { houseData } from "@/components/core/house";


const Page = () => {
  const [activeType, setActiveType] = useState("enSon");
  const [houses, setHouses] = useState([]);        
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState(null);      

  useEffect(() => {
    // fetch("/api/houses")
    //   .then((res) => res.json())
    //   .then((data) => { setHouses(data); setLoading(false); })
    //   .catch((err) => { setError(err); setLoading(false); });

    setTimeout(() => {
      setHouses(houseData);
      setLoading(false);
    }, 300);
  }, []);

  const filteredHouses =
    activeType === "enSon"
      ? houses
      : houses.filter((house) => house.type === activeType);

  if (loading) return <p className="text-center mt-10">Yüklənir...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">Xəta baş verdi</p>;


  return (
    <>
      <HouseTypeSelector
        houseType="Kirayə evlər"
        activeType={activeType}
        setActiveType={setActiveType}
      />
      <section className="max-w-[1600px] mx-auto">
        <div className="px-[80px] max-w-[1600px] mx-auto max-[1025px]:px-[20px] max-[431px]:px-[16px] max-[431px]:mt-[32px] mt-[62px]">
          <div className="w-full grid grid-cols-4 max-[940px]:grid-cols-3 max-[769px]:grid-cols-2 max-[431px]:gap-x-[8px] gap-[24px]">
            {filteredHouses.map((house) => (
              <HouseCard key={house.id} house={house} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Page;
