"use client";

import React, { useEffect, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import HouseTypeSelector from "../../Home/HomeTypes/HouseTypeSelector";
import HouseCard from "@/components/ui/HouseCard";
import Loader from "@/components/ui/Loader";
import PaginationControls from "@/components/ui/PaginationControls";
import { getAnnouncementFilter } from "@/services/api/endpoints/announcementService";

function parsePage(raw) {
  const num = Number(raw);
  if (!Number.isFinite(num) || num <= 0) return 1;
  return Math.floor(num);
}

function extractTotalPages(response) {
  const fromNested = response?.page?.totalPages;
  const fromTop = response?.totalPages;

  const total =
    typeof fromNested === "number"
      ? fromNested
      : typeof fromTop === "number"
        ? fromTop
        : 1;

  return total > 0 ? total : 1;
}


const Page = () => {
  const [activeType, setActiveType] = useState("enSon");
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [houses, setHouses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 8;
  const topRef = useRef(null);

  const [page, setPage] = useState(() => parsePage(searchParams.get("page")));

  useEffect(() => {
    setPage(parsePage(searchParams.get("page")));
  }, [searchParams]);

  const updateUrlPage = (nextPage) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));

    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  useEffect(() => {
    let cancelled = false;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      setHouses([]);
      setTotalPages(1);

      try {
        const res = await getAnnouncementFilter(
          { saleType: ["rent"] },
          { page: page - 1, size: pageSize }
        );

        if (cancelled) return;
        setHouses(res?.content || []);
        setTotalPages(extractTotalPages(res));
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Xəta baş verdi");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      cancelled = true;
    };
  }, [page]);

  const handlePageChange = (nextPage) => {
    const safeNext = Math.max(1, Math.min(nextPage, totalPages));
    if (safeNext === page) return;

    setPage(safeNext);
    updateUrlPage(safeNext);
  };

  if (loading)
    return (
      <div className="mt-10 flex items-center justify-center">
        <Loader />
      </div>
    );
  if (error)
    return (
      <p className="text-center mt-10 text-red-500">Xəta baş verdi: {error}</p>
    );


  return (
    <>
      <HouseTypeSelector
        houseType="Kirayə evlər"
        activeType={activeType}
        setActiveType={setActiveType}
      />
      <section className="max-w-[1600px] mx-auto">
        <div
          ref={topRef}
          className="px-[80px] max-w-[1600px] mx-auto max-[1025px]:px-[20px] max-[431px]:px-[16px] max-[431px]:mt-[32px] mt-[62px]"
        >
          {!houses?.length ? (
            <div className="w-full py-16 flex items-center justify-center text-lg text-gray-500 border border-dashed rounded-xl">
              Hazırda elan yoxdur
            </div>
          ) : (
            <>
              <div className="w-full grid grid-cols-4 max-[940px]:grid-cols-3 max-[769px]:grid-cols-2 max-[431px]:grid-cols-1 max-[431px]:gap-x-[8px] gap-[24px]">
                {houses.map((house) => (
                  <HouseCard key={house.id} house={house} />
                ))}
              </div>

              <PaginationControls
                page={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                scrollTargetRef={topRef}
                scrollOffset={110}
              />
            </>
          )}
        </div>
      </section>
    </>
  );
};

export default Page;
