"use client";
import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { houseData } from "@/components/core/house";
import HouseCard from "@/components/ui/HouseCard";

export default function HouseListsPage() {
  const searchParams = useSearchParams();
  const [filteredListings, setFilteredListings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const filter = searchParams.get("category") || "all";
    const announcementTypes = searchParams.get("announcementTypes")?.split(",") || [];
    const propertyTypes = searchParams.get("propertyTypes")?.split(",") || [];

    let filtered = [];
    if (filter === "all") {
      filtered = houseData;
    } else if (filter === "popular") {
      filtered = houseData.filter(
        l => l.isPopular || l.viewCount > 100 || l.favoriteCount > 10
      );
    } else {
      filtered = houseData.filter(listing => {
        const matchesAnnouncement =
          announcementTypes.length === 0 || announcementTypes.includes(listing.announcementType);
        const matchesProperty =
          propertyTypes.length === 0 || propertyTypes.includes(listing.propertyType);
        return matchesAnnouncement && matchesProperty;
      });
    }

    setFilteredListings(filtered);
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (filteredListings.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center px-[80px]">
        <h3 className="text-xl font-semibold text-gray-600 mb-2">
          Heç bir nəticə tapılmadı
        </h3>
        <p className="text-gray-500">
          Seçilmiş kateqoriya üçün elan mövcud deyil
        </p>
      </div>
    );
  }

  return (
    <section className="max-w-[1600px] mx-auto px-[80px] mt-[62px]">
      <div className="mb-6 text-sm text-gray-600">
        {filteredListings.length} nəticə tapıldı
      </div>
      <div className="grid grid-cols-4 max-[940px]:grid-cols-3 max-[769px]:grid-cols-2 gap-[24px]">
        {filteredListings.map(house => (
          <HouseCard key={house.id} house={house} />
        ))}
      </div>
    </section>
  );
}
