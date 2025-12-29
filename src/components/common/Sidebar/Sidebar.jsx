"use client";

import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import userAdmin from "../../../../public/images/profile/novruz.jpg";
import { AccessControlIcon, ApproveAnnouncementIcon, LogoutIcon, MyAnnouncements, PendingAnnouncementIcon, TransactionHistoryIcon } from "@/components/ui/MenuIcons";
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
import { useMenuPermission } from "@/context/MenuPermissionContext";
import { useRouter } from "next/navigation";
import { useUser } from "@/context/UserContext";

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
  transaction: TransactionHistoryIcon,
  my_announcement: MyAnnouncements,
  role: AccessControlIcon,
  pending: PendingAnnouncementIcon,
  announcement:ApproveAnnouncementIcon

};

const toSidebarHref = (value) => {
  if (typeof value !== "string") return "/";
  let path = value.trim();
  if (!path) return "/";
  if (!path.startsWith("/")) path = `/${path}`;
  path = path
    .replace(/\[[^\]]+\]/g, "")
    .replace(/:[A-Za-z0-9_]+/g, "")
    .replace(/\/id(?=\/|$)/g, "");
  path = path.replace(/\/+/g, "/");
  if (path.length > 1 && path.endsWith("/")) path = path.slice(0, -1);
  return path || "/";
};

const Sidebar = ({ variant }) => {
  const pathName = usePathname();
  const { menuPermission, fetchMenuPermission, menuLoading } = useMenuPermission();
  const { user, fetchUser } = useUser();
  const router = useRouter();
  const hasFetchedUser = useRef(false);

  useEffect(() => {
    if (!menuPermission?.length && !menuLoading) {
      fetchMenuPermission();
    }
  }, [menuPermission?.length, menuLoading, fetchMenuPermission]);

  const handleLogout = () => {
    localStorage.removeItem("access-token");
    router.push("/login");
  };


  useEffect(() => {
    if (hasFetchedUser.current) return;
    hasFetchedUser.current = true;
    fetchUser();
  }, [fetchUser]);
  const userName = user?.fullName.split(" ")[0];
  const linkPadding = variant === "services" ? "pl-7" : "pl-4 md:pl-14";
  const avatarSrc = user?.image?.url || null;
  const hasAvatar = Boolean(avatarSrc);
  const defaultProfileIcon = "/icons/profile.svg";
  return (
    <div className="w-full md:w-auto">
      <nav
        className="w-full md:w-[302px] h-fit bg-white rounded-xl pb-[54px] items-center border-2 border-[#02836F] shadow-[0px_4px_30px_0px_#0000000D]"
        style={{ paddingTop: variant === "dashboard" ? "24px" : "54px" }}
      >
        {variant === "dashboard" && (
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="w-[50px] h-[50px] relative">
              {hasAvatar ? (
                <Image
                  src={avatarSrc}
                  alt="profile image"
                  fill
                  className="h-full w-full rounded-full object-cover object-top"
                />
              ) : (
                <div className="w-full h-full rounded-full bg-(--primary-color) flex items-center justify-center">
                  <Image src={defaultProfileIcon} alt="Default avatar" width={24} height={24} />
                </div>
              )}
            </div>
            <span className="font-medium text-lg">{userName}</span>
          </div>
        )}

        <ul className="flex flex-col gap-4">
          {menuLoading ? (
            <li className="px-2 text-gray-400 animate-pulse">Yüklənir...</li>
          ) : menuPermission?.length ? (
            menuPermission
              .filter((item) => item?.isVisible === true)
              .map(({ id, name, path, icon }) => {
                const MenuIcon = iconMap[icon];
                const href = toSidebarHref(path);
                const isActive = pathName === path;

                return (
                  <li key={id ?? name} className="px-2">
                    <Link
                      href={href}
                      className={`flex items-center w-full py-3.5 font-medium gap-2 text-[#1B1F27] menu-link rounded-sm ${isActive ? "active" : ""
                        } ${linkPadding}`}
                    >
                      {MenuIcon && <MenuIcon active={isActive} />}
                      {name}
                    </Link>
                  </li>
                );
              })
          ) : (

            <li className="px-2 text-gray-400">Menyu tapılmadı</li>
          )}
        </ul>
        {variant === "dashboard" && (
          <div className="px-8 mt-8">
            <button onClick={handleLogout} className="flex justify-center py-2.5 bg-white w-full text-[#E9222C] text-[15px] font-medium rounded-lg gap-[15px] items-center cursor-pointer">
              <LogoutIcon /> Çıxış
            </button>
          </div>
        )}
      </nav>
    </div>
  );
};

export default Sidebar;
