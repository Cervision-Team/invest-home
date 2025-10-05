"use client";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { houseData } from "@/components/core/house";
import HouseCard from "@/components/ui/HouseCard";

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const filter = searchParams.get("category") || "all";
    let filtered = houseData;

    if (filter !== "all") {
      filtered = houseData.filter(h => h.category === filter);
    }

    setListings(filtered);
  }, [searchParams]);

  return (
    <div className="grid grid-cols-4 gap-6">
      {listings.map((house) => (
        <HouseCard key={house.id} house={house} />
      ))}
    </div>
  );
}