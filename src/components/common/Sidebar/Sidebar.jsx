"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import userAdmin from "../../../../public/images/profile/novruz.jpg";
import { LogoutIcon } from "@/components/ui/MenuIcons";

import {
  documentIcon,
  livingRoomRentalIcon,
  tenancyAgreementIcon,
  depositAgreementIcon,
  handoverAgreementIcon,
  deedOfHandoverIcon,
  ProfileIcon,
  StatisticIcon,
  EmployeesIcon,
  DatabaseIcon,
  OrderIcon,
  CustomerIcon,
  WalletIcon,
} from "@/components/ui/MenuIcons";

const iconMap = {
  document: documentIcon,
  livingRoomRental: livingRoomRentalIcon,
  tenancyAgreement: tenancyAgreementIcon,
  depositAgreement: depositAgreementIcon,
  handoverAgreement: handoverAgreementIcon,
  deedOfHandover: deedOfHandoverIcon,
  profile: ProfileIcon,
  statistic: StatisticIcon,
  employees: EmployeesIcon,
  database: DatabaseIcon,
  order: OrderIcon,
  customer: CustomerIcon,
  wallet: WalletIcon,
};

const Sidebar = ({ items, variant }) => {
  const pathName = usePathname();

  return (
    <div>
      <nav className="w-[302px] h-fit bg-white rounded-xl pb-[54px] items-center border-2 border-[#02836F] shadow-[0px_4px_30px_0px_#0000000D]"
      style={{paddingTop: variant === "dashboard" ? "24px" : "54px"}}>
        {variant === "dashboard" && (
        <div className="flex justify-center items-center gap-3 mb-6">
          <div className="w-[50px] h-[50px]">
            <Image
              className="rounded-full w-[50px] h-[50px] object-cover object-top"
              src={userAdmin}
              alt="profile image"
            />
          </div>
          <span className="font-medium text-lg">Novruz</span>
        </div>
        )}

        <ul className="flex flex-col gap-4">
          {items.map(({ title, href, icon }) => {
            const MenuIcon = iconMap[icon]; 
            const isActive = pathName === href;

            return (
              <li key={title} className="px-2">
                <Link
                  href={href}
                  className={`flex items-center w-full py-3.5 font-medium gap-2 text-[#1B1F27] menu-link rounded-sm ${
                    isActive ? "active" : ""
                  }`}
                  style={{paddingLeft: variant === "services" ? "28px" : "85px"}}
                >
                  {MenuIcon && <MenuIcon active={isActive} />}
                  {title}
                </Link>
              </li>
            );
          })}
        </ul>
      {variant === "dashboard" && (
        <div className="px-8 mt-8">
          <button className="flex justify-center py-2.5 bg-white w-full text-[#E9222C] text-[15px] font-medium rounded-lg gap-[15px] items-center">
            <LogoutIcon /> Çıxış
          </button>
        </div>
      )}
      </nav>
    </div>
  );
};

export default Sidebar;
