"use client";
import Image from "next/image";
import React, { useState } from "react";
import chatIcon from "../../../../../public/icons/profile/chat-icon.svg";
import notificationIcon from "../../../../../public/icons/profile/notification-icon.svg";
import Chat from "../Chat";

export const Button = () => {
  const [isChat, setIsChat] = useState(false);
  const [search, setSearch] = useState("");
  const openChat = () => {
    setIsChat(true)
  }
  const closeChat = () => {
    setIsChat(false)
  }
  return (
    <div className="flex gap-6 relative">
      <button onClick={openChat} type="button" className="relative flex justify-center items-center bg-[#F5F5F5] rounded-xl w-11 h-11 cursor-pointer">
        <span className="absolute right-1 top-1 w-2.5 h-2.5 rounded-full bg-[#FF403D]"></span>
        <Image src={chatIcon} alt="chat icon" />
      </button>
      <button type="button" className="relative flex justify-center items-center bg-[#F5F5F5] rounded-xl w-11 h-11 cursor-pointer">
        <span className="absolute right-1 top-1 w-2.5 h-2.5 rounded-full bg-[#FF403D]"></span>
        <Image src={notificationIcon} alt="notification icon" />
      </button>
      {
        isChat &&
        <Chat search={search} setSearch={setSearch} closeChat={closeChat} />
      }

    </div>
  );
};
export const TypeOfHouse = ({ src, srcOnHover, text, isActive, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  return (
    <>
      <div
        className={`h-[46px] flex justify-center items-center gap-2 border border-solid rounded-2 transition-colors duration-200 cursor-pointer
        ${isActive
            ? "border-primary bg-primary text-white"
            : "border-[#E9E9E9] bg-[#FAFAFA] text-black hover:border-[#26B5A0] hover:bg-primary hover:text-white"
          }`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <Image
          src={(isHovered || isActive) && srcOnHover ? srcOnHover : src}
          alt="house-icon"
          width={24}
          height={24}
        />
        <span className="text-[14px]">{text}</span>
      </div>
    </>
  );
};
{
  /* Pagination */
}
{
  /* <div className="flex justify-between items-center mt-6">
        <button
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] bg-[var(--primary-color)] text-white hover:opacity-90 transition-all duration-200"
        >
          <Image src={arrowLeftWhite} alt="Arrow Left White" />
          <span className="font-[500] text-[16px]">Geri Qayıt</span>
        </button>
        <span>
          Səhifə {table.getState().pagination.pageIndex + 1} /{" "}
          {table.getPageCount()}
        </span>
        <button
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          className="cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-[12px] rounded-[8px] py-[12px] px-[34px] bg-[var(--primary-color)] text-white hover:opacity-90 transition-all duration-200"

        >
          <span className="font-[500] text-[16px]">Növbəti</span>
          <Image src={arrowRightWhite} alt="Arrow Right White" />
        </button>
      </div> */
}
// const table = useReactTable({
//     data: filteredData,
//     columns,
//     getCoreRowModel: getCoreRowModel(),
//     getPaginationRowModel: getPaginationRowModel(),
//     initialState: {
//       pagination: {
//         pageIndex: 0,
//         pageSize: 5,
//       },
//     },
//   });
