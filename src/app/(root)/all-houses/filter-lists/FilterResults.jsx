"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import HouseCard from "@/components/ui/HouseCard";
import Loader from "@/components/ui/Loader";
import PaginationControls from "@/components/ui/PaginationControls";
import { getAnnouncementFilter } from "@/services/api/endpoints/announcementService";
import { buildAnnouncementSearchFilterDto } from "@/services/helpers/announcementSearchDto";


function parsePage(raw) {
  const num = Number(raw);
  if (!Number.isFinite(num) || num <= 0) return 1;
  return Math.floor(num);
}

function extractTotalPages(response) {
  const fromNested = response?.page?.totalPages;
  const fromTop = response?.totalPages;

  const total =
    typeof fromNested === "number" ? fromNested : typeof fromTop === "number" ? fromTop : 1;

  return total > 0 ? total : 1;
}

function extractTotalElements(response) {
  const fromNested = response?.page?.totalElements;
  const fromTop = response?.totalElements;

  const total =
    typeof fromNested === "number" ? fromNested : typeof fromTop === "number" ? fromTop : 0;

  return total >= 0 ? total : 0;
}

function collectAppliedFilters(searchParams) {
  const filters = {};
  for (const [key, value] of searchParams.entries()) {
    if (key === "propertyTypes" || key === "propertyType") {
      if (!filters.propertyTypes) filters.propertyTypes = [];
      filters.propertyTypes.push(value);
      continue;
    }

    if (key === "rooms") {
      if (!filters.rooms) filters.rooms = [];
      filters.rooms.push(value);
      continue;
    }

    filters[key] = value;
  }
  return filters;
}

const FilterResults = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [appliedFilters, setAppliedFilters] = useState({});

  const pageSize = 8;
  const topRef = useRef(null);

  const [page, setPage] = useState(() => parsePage(searchParams.get("page")));

  useEffect(() => {
    setPage(parsePage(searchParams.get("page")));
  }, [searchParams]);

  const filtersKey = useMemo(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("page");
    return params.toString();
  }, [searchParams]);

  const prevFiltersKeyRef = useRef(filtersKey);

  const updateUrlPage = (nextPage) => {
    const params = new URLSearchParams(searchParams.toString());
    if (nextPage <= 1) params.delete("page");
    else params.set("page", String(nextPage));
    const qs = params.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  };

  useEffect(() => {
    let cancelled = false;

    if (prevFiltersKeyRef.current !== filtersKey) {
      prevFiltersKeyRef.current = filtersKey;
      if (page !== 1) {
        setPage(1);
        updateUrlPage(1);
        return () => {
          cancelled = true;
        };
      }
    }

    const fetchFiltered = async () => {
      setLoading(true);
      setError(null);
      setListings([]);
      setTotalPages(1);
      setTotalElements(0);
      setAppliedFilters(collectAppliedFilters(searchParams));

      try {
        const body = buildAnnouncementSearchFilterDto(searchParams);

        const res = await getAnnouncementFilter(body, {
          page: page - 1,
          size: pageSize,
        });

        if (cancelled) return;
        setListings(res?.content || []);
        setTotalPages(extractTotalPages(res));
        setTotalElements(extractTotalElements(res));
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Xəta baş verdi");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };

    fetchFiltered();

    return () => {
      cancelled = true;
    };
  }, [filtersKey, page]);

  const handlePageChange = (nextPage) => {
    const safeNext = Math.max(1, Math.min(nextPage, totalPages));
    if (safeNext === page) return;
    setPage(safeNext);
    updateUrlPage(safeNext);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    
    if (appliedFilters.announcementType && appliedFilters.announcementType !== 'all') count++;
    if (appliedFilters.propertyTypes && appliedFilters.propertyTypes.length > 0) count++;
    if (appliedFilters.location) count++;
    if (appliedFilters.priceMin || appliedFilters.priceMax) count++;
    if (appliedFilters.rooms && appliedFilters.rooms.length > 0) count++;
    
    Object.entries(appliedFilters).forEach(([key, value]) => {
      if (value !== '' && value !== null && value !== undefined && 
          !['announcementType', 'propertyTypes', 'location', 'priceMin', 'priceMax', 'rooms'].includes(key)) {
        count++;
      }
    });
    
    return count;
  };

  const handleClearFilters = () => {
    window.location.href = '/';
  };

  return (
    <section className="max-w-[1600px] mx-auto">
      <div className="px-20 max-w-[1600px] mx-auto max-[1025px]:px-5 max-[431px]:px-4 max-[431px]:mt-8 mt-[62px]">
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Axtarış Nəticələri
          </h1>
          <p className="text-gray-600">
            Seçdiyiniz meyarlara uyğun əmlak elanları
          </p>
        </div>

        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <div className="text-sm text-gray-600">
              <span className="font-semibold">{loading ? '...' : totalElements}</span> nəticə tapıldı
            </div>
            
            {getActiveFilterCount() > 0 && (
              <div className="flex items-center gap-2">
                <span className="w-1 h-1 bg-gray-400 rounded-full hidden sm:block"></span>
                <span className="text-sm text-[#02836F] font-medium">
                  {getActiveFilterCount()} aktiv filter
                </span>
                <button 
                  onClick={handleClearFilters}
                  className="text-sm text-gray-500 hover:text-[#02836F] underline transition-colors"
                >
                  Təmizlə
                </button>
              </div>
            )}
          </div>

          {/* Sort Options */}
          {/* <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-500">Çeşidlə:</span>
            <select className="border border-gray-200 rounded-lg px-3 py-1 text-sm focus:outline-none focus:border-[#02836F]">
              <option value="newest">Ən yeni</option>
              <option value="oldest">Ən köhnə</option>
              <option value="price_low">Qiymət (aşağı)</option>
              <option value="price_high">Qiymət (yüksək)</option>
              <option value="area_large">Sahə (böyük)</option>
              <option value="area_small">Sahə (kiçik)</option>
            </select>
          </div> */}
        </div>

        {getActiveFilterCount() > 0 && (
          <div className="mb-6 flex flex-wrap gap-2">
            {appliedFilters.announcementType && appliedFilters.announcementType !== 'all' && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-[#02836F]/10 text-[#02836F] text-sm rounded-full">
                {appliedFilters.announcementType === 'sell' ? 'Satılıq' : 
                 appliedFilters.announcementType === 'rent' ? 'Kirayə' :
                 appliedFilters.announcementType === 'daily' ? 'Günlük' : appliedFilters.announcementType}
              </span>
            )}
            
            {appliedFilters.propertyTypes && appliedFilters.propertyTypes.length > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-full">
                {appliedFilters.propertyTypes.length} əmlak növü
              </span>
            )}

            {(appliedFilters.priceMin || appliedFilters.priceMax) && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-50 text-green-700 text-sm rounded-full">
                {appliedFilters.priceMin || '0'} - {appliedFilters.priceMax || '∞'} AZN
              </span>
            )}

            {appliedFilters.rooms && appliedFilters.rooms.length > 0 && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-purple-50 text-purple-700 text-sm rounded-full">
                {appliedFilters.rooms.length} otaq seçimi
              </span>
            )}

            {appliedFilters.location && (
              <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 text-sm rounded-full">
                 {appliedFilters.location}
              </span>
            )}
          </div>
        )}

        {loading && (
          <div className="flex justify-center items-center py-20">
            <Loader />
          </div>
        )}
        
        {!loading && !error && listings.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              Heç bir nəticə tapılmadı
            </h3>
            <p className="text-gray-500 mb-6 max-w-md">
              Axtarış meyarlarınıza uyğun əmlak mövcud deyil. Filterlərizi dəyişərək yenidən cəhd edin.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={handleClearFilters}
                className="px-6 py-2 border border-gray-300 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Ana səhifəyə qayıt
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-[#02836F] text-white rounded-lg hover:bg-[#026b5a] transition-colors"
              >
                Yenidən yüklə
              </button>
            </div>
          </div>
        )}

        {!loading && !error && listings.length > 0 && (
          <div className="w-full grid grid-cols-4 max-[940px]:grid-cols-3 max-[769px]:grid-cols-2 max-[431px]:gap-x-2 gap-6">
            {listings.map((house) => (
              <HouseCard key={house.id} house={house} />
            ))}
          </div>
        )}

        {!loading && !error && totalPages > 1 && (
          <div className="mt-10" ref={topRef}>
            <PaginationControls
              page={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              scrollTargetRef={topRef}
              scrollOffset={110}
            />
          </div>
        )}
      </div>
    </section>
  );
};

export default FilterResults;