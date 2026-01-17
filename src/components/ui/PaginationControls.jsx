"use client";

import React, { useCallback, useMemo, useRef } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/FromShadcn/Pagination";

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
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

export default function PaginationControls({
  page,
  totalPages,
  onPageChange,
  scrollTargetRef,
  scrollOffset = 0,
  showSummary = true,
}) {
  const scrollTokenRef = useRef(0);
  const items = useMemo(
    () => getPaginationItems(page, totalPages),
    [page, totalPages]
  );

  const scrollToTarget = useCallback(() => {
    if (typeof window === "undefined") return;

    const prefersReducedMotion = window.matchMedia?.(
      "(prefers-reduced-motion: reduce)"
    )?.matches;
    const behavior = prefersReducedMotion ? "auto" : "smooth";

    if (scrollTargetRef?.current) {
      const el = scrollTargetRef.current;
      const elementTop = el.getBoundingClientRect().top + window.scrollY;
      const top = Math.max(0, elementTop - (scrollOffset || 0));

      window.scrollTo({ top, behavior });
      return;
    }

    window.scrollTo({ top: 0, behavior });
  }, [scrollOffset, scrollTargetRef]);

  const scheduleScroll = useCallback(() => {
    const token = ++scrollTokenRef.current;

    requestAnimationFrame(() => {
      if (token !== scrollTokenRef.current) return;
      requestAnimationFrame(() => {
        if (token !== scrollTokenRef.current) return;
        scrollToTarget();
      });
    });

    setTimeout(() => {
      if (token !== scrollTokenRef.current) return;
      scrollToTarget();
    }, 180);
  }, [scrollToTarget]);

  const handleChange = useCallback(
    (nextPage) => {
      const safeNext = Math.max(1, Math.min(nextPage, totalPages));
      if (safeNext === page) return;

      onPageChange?.(safeNext);
      scheduleScroll();
    },
    [onPageChange, page, scheduleScroll, totalPages]
  );

  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="mt-10 flex flex-col items-center gap-3">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href="#"
              onClick={(e) => {
                e.preventDefault();
                handleChange(page - 1);
              }}
              className={page === 1 ? "pointer-events-none opacity-50" : ""}
            />
          </PaginationItem>

          {items.map((item, idx) => {
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
                    handleChange(pageNumber);
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
                handleChange(page + 1);
              }}
              className={
                page >= totalPages ? "pointer-events-none opacity-50" : ""
              }
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>

      {showSummary && (
        <div className="text-sm text-gray-500">
          Səhifə {page} / {totalPages}
        </div>
      )}
    </div>
  );
}
