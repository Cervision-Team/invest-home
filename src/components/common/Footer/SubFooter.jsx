'use client'

import React from "react";
import Link from "next/link";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const SubFooter = () => {
  const isMobile = useMediaQuery('(max-width: 430px)');

  return (
    <>
      {isMobile ? '' :
        <div className="bg-[var(--text-color-1)] h-[50px] text-[var(--text-color-4)] font-[400]">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 md:px-10 flex flex-col sm:flex-row items-center justify-between h-full gap-2 sm:gap-0">
            <span className="text-center sm:text-left text-sm sm:text-base">© <span className="main-logo-style uppercase">Invest Home</span> – All rights reserved</span>
            <ul className="flex flex-wrap justify-center sm:justify-between gap-4 sm:gap-0 sm:w-[400px] text-sm">
              <li><Link href="/terms">Terms and Conditions</Link></li>
              <li><Link href="/privacy">Privacy Policy</Link></li>
              <li><Link href="/disclaimer">Disclaimer</Link></li>
            </ul>
          </div>
        </div>}
    </>
  );
};

export default SubFooter;
