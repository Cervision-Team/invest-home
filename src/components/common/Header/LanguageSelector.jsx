"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import ArrowDown from "../../../../public/icons/ArrowDown.svg";
import { useLang } from "@/context/LangContext";

const LanguageSelector = () => {
  const { selectedLang, handleSelect, currentFlag, flags } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="flex" ref={dropdownRef}>
      <div className="relative">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="cursor-pointer flex flex-row items-center text-[14px] text-white dark:text-[var(--main-color)] rounded-md focus:outline-none"
        >
          <Image
            src={currentFlag}
            alt={selectedLang}
            width={20}
            height={20}
            className="mr-[6px]"
          />
          {selectedLang}
          <Image
            src={ArrowDown}
            alt="Arrow Down"
            width={26}
            height={26}
            className={`transition-transform duration-300 ${
              isOpen ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {isOpen && (
          <ul className="absolute z-999 bg-white text-center right-0 mt-1 border border-gray-300 rounded-md shadow-lg">
            {flags.map((flag) => (
              <li
                key={flag.name}
                onClick={() => {
                  handleSelect(flag.name);
                  setIsOpen(false); // Close dropdown after selection
                }}
                className={`${
                  selectedLang === flag.name
                    ? "text-[var(--primary-color)]"
                    : "text-gray-400"
                } px-3 py-1 rounded-md cursor-pointer hover:bg-[#f3f4f6]`}
              >
                
                {flag.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LanguageSelector;
