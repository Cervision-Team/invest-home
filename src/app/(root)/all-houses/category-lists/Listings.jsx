"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import HouseCard from "@/components/ui/HouseCard";
import Loader from "@/components/ui/Loader";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/FromShadcn/Pagination";
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
    typeof fromNested === "number" ? fromNested : typeof fromTop === "number" ? fromTop : 1;

  return total > 0 ? total : 1;
}

export default function ListingsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
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

    const getFilterData = async () => {
      setLoading(true);
      setError(null);
      setListings([]);
      setTotalPages(1);

      try {
        const announcementType = searchParams.get("announcementType");
        const propertyType = searchParams.get("propertyType");
        const popular = searchParams.get("popular");
        const mortgage = searchParams.get("mortgage");

        const filter = {
          saleType: announcementType ? [announcementType] : undefined,
          propertyType: propertyType ? [propertyType] : undefined,
          popular: popular === "true" ? true : undefined,
          mortgage: mortgage === "true" ? true : undefined,
        };

        const filtered = await getAnnouncementFilter(filter, {
          page: page - 1,
          size: pageSize,
        });
        if (cancelled) return;
        setListings(filtered?.content || []);
        setTotalPages(extractTotalPages(filtered));
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Xəta baş verdi");
      } finally {
        if (cancelled) return;
        setLoading(false);
      }
    };

    getFilterData();

    return () => {
      cancelled = true;
    };
  }, [filtersKey, page]);

  const handlePageChange = (nextPage) => {
    const safeNext = Math.max(1, Math.min(nextPage, totalPages));
    if (safeNext === page) return;

    setPage(safeNext);
    updateUrlPage(safeNext);
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <div className="w-full py-16 flex items-center justify-center border border-dashed rounded-xl">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full py-16 flex items-center justify-center text-lg text-gray-500 border border-dashed rounded-xl">
        {error}
      </div>
    );
  }

  if (!listings?.length) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center gap-4 text-lg text-gray-500 border border-dashed rounded-xl">
        <div>Hazırda bu kateqoriyada elan yoxdur</div>
        <Link
          href="/all-houses/category-lists?categoryId=1"
          className="px-6 py-2 bg-[#02836F] text-white rounded-lg hover:bg-[#026b5a] transition-colors"
        >
          Bütün elanlara bax
        </Link>
      </div>
    );
  }

  return (
    <div ref={topRef} className="w-full">
      <div className="w-full grid grid-cols-4 max-[940px]:grid-cols-3 max-[769px]:grid-cols-2 max-[431px]:grid-cols-1 max-[431px]:gap-x-[8px] gap-[24px]">
        {listings?.map((house) => (
          <HouseCard key={house.id} house={house} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-10 flex flex-col items-center gap-3">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page - 1);
                  }}
                  className={
                    page === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </PaginationItem>

              {getPaginationItems(page, totalPages).map((item, idx) => {
                if (item === "ellipsis") {
                  return (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  );
                }

                const pageNumber = item;
                const isActive = pageNumber === page;
                return (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={isActive}
                      onClick={(e) => {
                        e.preventDefault();
                        handlePageChange(pageNumber);
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                );
              })}

              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handlePageChange(page + 1);
                  }}
                  className={
                    page >= totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>

          <div className="text-sm text-gray-500">
            Səhifə {page} / {totalPages}
          </div>
        </div>
      )}
    </div>
  );
}

function getPaginationItems(currentPage, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const leftSibling = Math.max(currentPage - 1, 1);
  const rightSibling = Math.min(currentPage + 1, totalPages);
  const showLeftEllipsis = leftSibling > 2;
  const showRightEllipsis = rightSibling < totalPages - 1;

  if (!showLeftEllipsis && showRightEllipsis) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (showLeftEllipsis && !showRightEllipsis) {
    return [1, "ellipsis", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
  }

  return [1, "ellipsis", currentPage - 1, currentPage, currentPage + 1, "ellipsis", totalPages];
}