"use client";

import Image from "next/image";
import BusStopPrimary from "../../../../public/icons/bus-stop-primary.svg";
import BusStopWhite from "../../../../public/icons/bus-stop-white.svg";
import EstablishmentsButton from '@/components/ui/EstablishmentsButton';
import hospital from "../../../../public/icons/hospital-svg.svg";
import school from "../../../../public/icons/school-svg.svg";
import park from "../../../../public/icons/park-svg.svg";
import metro from "../../../../public/icons/metro-svg.svg";
import restaurant from "../../../../public/icons/restaurant-svg.svg";
import marketplace from "../../../../public/icons/marketplace-svg.svg";
import hospitalWhite from "../../../../public/icons/hospital-white.svg";
import schoolWhite from "../../../../public/icons/school-white.svg";
import parkWhite from "../../../../public/icons/park-white.svg";
import metroWhite from "../../../../public/icons/metro-white.svg";
import restaurantWhite from "../../../../public/icons/restaurant-white.svg";
import marketplaceWhite from "../../../../public/icons/marketplace-white.svg";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/components/ui/Loader";

const items = [
  { type: "bus_stop", icon: BusStopPrimary, iconHover: BusStopWhite, width: 24, height: 24, name: "Dayanacaq" },
  { type: "clinic", icon: hospital, iconHover: hospitalWhite, width: 20, height: 20, name: "Klinika" },
  { type: "school", icon: school, iconHover: schoolWhite, width: 24, height: 24, name: "Məktəb" },
  { type: "park", icon: park, iconHover: parkWhite, width: 24, height: 24, name: "Park" },
  { type: "metro", icon: metro, iconHover: metroWhite, width: 24, height: 24, name: "Metro" },
  { type: "restaurant", icon: restaurant, iconHover: restaurantWhite, width: 24, height: 24, name: "Restoran" },
  { type: "market", icon: marketplace, iconHover: marketplaceWhite, width: 24, height: 24, name: "Market" },
];

const Map = ({ lat, lng }) => {
  const [selectedType, setSelectedType] = useState("bus_stop");
  const [nearby, setNearby] = useState([]);
  const [loading, setLoading] = useState(false);

  const hasCoords = useMemo(
    () => Number.isFinite(Number(lat)) && Number.isFinite(Number(lng)),
    [lat, lng]
  );

  const selectedItem = useMemo(
    () => items.find((i) => i.type === selectedType) ?? items[0],
    [selectedType]
  );
  
  const mapSrc = useMemo(() => {
    if (lat == null || lng == null) return null;
    return `https://www.google.com/maps?q=${lat},${lng}&z=15&output=embed`;
  }, [lat, lng]);

  const formatDistance = (meters) => {
    if (!Number.isFinite(meters)) return "—";
    if (meters < 1000) return `${Math.round(meters)} m`;
    return `${(meters / 1000).toFixed(1)} km`;
  };

  useEffect(() => {
    if (!hasCoords) return;

    let cancelled = false;
    (async () => {
      try {
        setNearby([]);
        setLoading(true);
        const res = await fetch(
          `/api/nearby?lat=${encodeURIComponent(lat)}&lng=${encodeURIComponent(lng)}&type=${encodeURIComponent(selectedType)}&limit=5&radius=1500`
        );
        if (!res.ok) throw new Error("nearby request failed");
        const data = await res.json();
        if (cancelled) return;
        setNearby(Array.isArray(data?.items) ? data.items : []);
      } catch {
        if (!cancelled) setNearby([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [lat, lng, selectedType]);

  return (
    <section className='max-w-[1600px] mx-auto'>
      <div className='w-full px-4 sm:px-8 lg:px-20 flex flex-col items-start justify-center'>
        <h1 className="text-[#111] text-[24px] sm:text-[28px] font-medium">
          Yaxınlıqdakılar
        </h1>

        <div className="flex flex-wrap gap-4 sm:gap-6 mt-8 mb-[35px]">
          {items.map((item) => (
            <EstablishmentsButton
              key={item.type}
              icon={item.icon}
              iconHover={item.iconHover}
              width={item.width}
              height={item.height}
              name={item.name}
              active={selectedType === item.type}
              onClick={() => setSelectedType(item.type)}
            />
          ))}
        </div>
       
        {mapSrc ? (
          <iframe
            src={mapSrc}
            width="1060"
            height="476"
            className="w-full h-[300px] sm:h-[400px] lg:h-[476px]"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        ) : null}

        <div className="flex flex-row items-center gap-1.5 mt-[38px]">
          <Image
            src={selectedItem.icon}
            alt={selectedItem.name}
            width={24}
            height={24} />

          <h1 className="text-[#111] text-[18px]/[16px] font-medium">
            {selectedItem.name}
          </h1>
        </div>

        <div className="w-full sm:w-[411px] flex flex-col gap-4 mt-6 mb-[60px]">
          {!hasCoords ? (
            <p className="text-3 text-[14px]">Koordinat tapılmadı</p>
          ) : loading ? (
            <div className="py-2">
              <Loader />
            </div>
          ) : nearby?.length ? (
            nearby.map((place) => (
              <div key={place.id} className="flex flex-row items-center justify-between">
                <div className="flex flex-row items-center gap-1.5 min-w-0">
                  <Image
                    src={selectedItem.icon}
                    alt={selectedItem.name}
                    width={20}
                    height={20}
                  />
                  <p className="text-[#111] text-[16px]/[16px] truncate">{place.name}</p>
                </div>
                <p className="text-[#111] text-[12px]/[16px] whitespace-nowrap">{formatDistance(place.distanceMeters)}</p>
              </div>
            ))
          ) : (
            <p className="text-3 text-[14px]">Məlumat tapılmadı</p>
          )}
        </div>
      </div>
    </section>
  );
};

export default Map;
