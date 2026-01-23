"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import HamMenu from "./HamMenu";
import { useEffect, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import ProfileMenu from "./ProfileDropdown";
import { useUser } from "@/context/UserContext";
// import { useTranslation } from "i18next";

const Header = () => {
  // const { t } = useTranslation();
  const [isLogin, setIsLogin] = useState(false);
  const pathname = usePathname();

  const [isOpen, setOpen] = useState(false);
  const { user, fetchUser } = useUser();
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 430px)');


  const navLinks = [
    { href: "/all-houses/latest-houses", label: "Alqı-satqı" },
    { href: "/all-houses/for-rent", label: "Kirayə" },
    { href: "/about-us", label: "Haqqımızda" },
    { href: "/contract-services/rental-agreement", label: "Xidmətlər" },
    { href: "/blogs", label: "Bloq" },
    { href: "/become-agent/information", label: "Agent Ol" },
    { href: "/open-office", label: "Ofis Aç" }
  ];
  useEffect(() => {
    const isToken = Boolean(localStorage.getItem("access-token"));
    setIsLogin(isToken)
  }, [])



  useEffect(() => {
    const isToken = Boolean(localStorage.getItem("access-token"));
    if (isToken) {
      fetchUser();
    }
  }, [fetchUser]);

  return (
    <>
      <HamMenu state={isOpen} setState={setOpen} />
      <section className="sticky z-998 top-0 bg-white">
        <div className="max-w-[1600px] w-auto mx-auto px-[80px] max-[1025px]:px-[20px] max-[431px]:px-[16px]">
          <div className="flex justify-between items-center py-[10px]">
            <div className="max-[431px]:w-[100%] h-full flex max-[930px]:justify-between justify-center items-center gap-[34px] max-[1327px]:gap-[0px] max-[1020px]:gap-[8px]">
              <Link className="" href="/">
                <div className="w-auto h-full flex justify-center items-center gap-[15px] max-[431px]:gap-[7px]">
                  {isMobile ?
                    <Image
                      src={"/images/logo.png"}
                      alt="Invest Home Logo"
                      width={32}
                      height={32}
                      priority
                      className="flex-shrink-0"
                    />
                    :
                    isTablet
                      ?
                      <Image
                        src={"/images/logo.png"}
                        alt="Invest Home Logo"
                        width={50}
                        height={50}
                        priority
                        className="flex-shrink-0"
                      />
                      :
                      <Image
                        src={"/images/InvestHomeLogo.png"}
                        alt="Invest Home Logo"
                        width={60}
                        height={55}
                        priority
                        className="flex-shrink-0"
                      />
                  }
                  <p translate="no" className="main-logo-style max-[1270px]:hidden max-[1130px]:block max-[580px]:hidden max-[431px]:block max-[431px]:text-[16px] text-[20px] font-semibold text-xl whitespace-nowrap">
                    INVEST <span className="text-[var(--primary-color)]">HOME</span>
                  </p>
                </div>
              </Link>
              <div className="max-[1130px]:hidden">
                <ul className="flex">
                  {navLinks.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className={`whitespace-nowrap cursor-pointer max-[1020px]:px-[8px] px-[16px] text-[16px] transition-all font-[500] ${pathname === link.href ? "text-[#FF9D14]" : ""
                          }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              <div onClick={() => { setOpen(true) }} className="w-[24px] h-[24px] hidden max-[431px]:flex items-center justify-center">
                <Image
                  src={"/icons/hamburger-menu.svg"}
                  alt="ham-menu"
                  width={24}
                  height={24}
                />
              </div>
            </div>

            <div className="max-[431px]:hidden flex gap-[24px] max-[1327px]:gap-[12px] max-[1270px]:gap-[24px] items-center">
              <Link href="/favorites">
                <div className="heart-icon cursor-pointer">
                  <svg
                    className=""
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <path
                      d="M7.5 3.44981C8.17024 3.44981 8.80175 3.57317 9.40039 3.81992L9.65527 3.93418C10.3381 4.26088 10.9134 4.70399 11.3887 5.26621L12 5.98887L12.6104 5.26719C13.0263 4.77557 13.5194 4.37457 14.0938 4.06309L14.3447 3.93516C15.0184 3.61295 15.734 3.45047 16.5 3.44981C17.8675 3.44981 18.9683 3.89959 19.8594 4.79063C20.7504 5.68166 21.2002 6.78253 21.2002 8.15C21.2002 9.84841 20.5795 11.4233 19.2764 12.8951C18.0565 14.2728 16.6892 15.6598 15.1738 17.0563L14.5156 17.6549L14.5107 17.6588L12.8105 19.2086L12.7969 19.2213L12.7842 19.234C12.6853 19.3329 12.5769 19.4008 12.4521 19.4439C12.2872 19.5009 12.1374 19.525 12 19.525C11.8635 19.525 11.714 19.501 11.5488 19.4439C11.4238 19.4007 11.3147 19.3326 11.2148 19.233L11.1895 19.2096L9.46484 17.6344C7.93428 16.2338 6.53591 14.8449 5.26855 13.4684L4.7334 12.8795C3.42338 11.4169 2.79921 9.8473 2.7998 8.15L2.80566 7.89707C2.85826 6.64595 3.3052 5.62605 4.14062 4.79063C5.03166 3.89959 6.13253 3.44981 7.5 3.44981Z"
                      stroke="black"
                      strokeWidth="1.6"
                    />
                  </svg>
                </div>
              </Link>
              <ProfileMenu
                userName={user?.fullName?.split(' ')[0] ? `Salam, ${user?.fullName?.split(' ')[0]}` : ""}
                isLogin={isLogin}
                avatarSrc={user?.image?.url}
              />

              {/* {
                isLogin ?
                  <Link href="/profile">
                    <button className="text-black flex justify-center items-center gap-[10px] text-[18px] cursor-pointer">
                      <div className="profile-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M5.5 14.5C5.5 12.0147 7.51472 10 10 10C12.4853 10 14.5 12.0147 14.5 14.5"
                            stroke="#1B1F27"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                          <path
                            d="M10.0008 9.99998C11.492 9.99998 12.7008 8.79119 12.7008 7.29998C12.7008 5.80882 11.492 4.59998 10.0008 4.59998C8.50957 4.59998 7.30078 5.80882 7.30078 7.29998C7.30078 8.79119 8.50957 9.99998 10.0008 9.99998Z"
                            stroke="#1B1F27"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z"
                            stroke="#1B1F27"
                            strokeWidth="1.6"
                          />
                        </svg>
                      </div>
                      <span className="max-[1440px]:hidden text-[16px] flex-shrink-0 font-[500]">Profile</span>
                    </button>
                  </Link>
                  :
                  <Link href="/login">

                    <button className="text-black flex justify-center items-center gap-[10px] text-[18px] cursor-pointer">
                      <div className="profile-icon">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          viewBox="0 0 20 20"
                          fill="none"
                        >
                          <path
                            d="M5.5 14.5C5.5 12.0147 7.51472 10 10 10C12.4853 10 14.5 12.0147 14.5 14.5"
                            stroke="#1B1F27"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                          />
                          <path
                            d="M10.0008 9.99998C11.492 9.99998 12.7008 8.79119 12.7008 7.29998C12.7008 5.80882 11.492 4.59998 10.0008 4.59998C8.50957 4.59998 7.30078 5.80882 7.30078 7.29998C7.30078 8.79119 8.50957 9.99998 10.0008 9.99998Z"
                            stroke="#1B1F27"
                            strokeWidth="1.6"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z"
                            stroke="#1B1F27"
                            strokeWidth="1.6"
                          />
                        </svg>
                      </div>
                      <span className="max-[1440px]:hidden text-[16px] flex-shrink-0 font-[500]">Daxil ol</span>
                    </button>
                  </Link>
              } */}

              <Link href="/make-announcement">
                <button className="shrink-0 py-[12px] max-[1440px]:px-[12px] px-[26px] rounded-[50px] bg-[#FF9D14] text-white flex justify-center items-center gap-[20px] max-[769px]:gap-[12px] cursor-pointer">
                  <svg width="22" height="22" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clip-path="url(#clip0_7459_56767)">
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M0 10C0 4.477 4.477 0 10 0C15.523 0 20 4.477 20 10C20 15.523 15.523 20 10 20C4.477 20 0 15.523 0 10ZM10 2C7.87827 2 5.84344 2.84285 4.34315 4.34315C2.84285 5.84344 2 7.87827 2 10C2 12.1217 2.84285 14.1566 4.34315 15.6569C5.84344 17.1571 7.87827 18 10 18C12.1217 18 14.1566 17.1571 15.6569 15.6569C17.1571 14.1566 18 12.1217 18 10C18 7.87827 17.1571 5.84344 15.6569 4.34315C14.1566 2.84285 12.1217 2 10 2Z" fill="white" />
                      <path fill-rule="evenodd" clip-rule="evenodd" d="M11 5C11 4.73478 10.8946 4.48043 10.7071 4.29289C10.5196 4.10536 10.2652 4 10 4C9.73478 4 9.48043 4.10536 9.29289 4.29289C9.10536 4.48043 9 4.73478 9 5V9H5C4.73478 9 4.48043 9.10536 4.29289 9.29289C4.10536 9.48043 4 9.73478 4 10C4 10.2652 4.10536 10.5196 4.29289 10.7071C4.48043 10.8946 4.73478 11 5 11H9V15C9 15.2652 9.10536 15.5196 9.29289 15.7071C9.48043 15.8946 9.73478 16 10 16C10.2652 16 10.5196 15.8946 10.7071 15.7071C10.8946 15.5196 11 15.2652 11 15V11H15C15.2652 11 15.5196 10.8946 15.7071 10.7071C15.8946 10.5196 16 10.2652 16 10C16 9.73478 15.8946 9.48043 15.7071 9.29289C15.5196 9.10536 15.2652 9 15 9H11V5Z" fill="white" />
                    </g>
                    <defs>
                      <clipPath id="clip0_7459_56767">
                        <rect width="20" height="20" fill="white" />
                      </clipPath>
                    </defs>
                  </svg>

                  <span className="text-[16px] font-[500]">Elan ver</span>
                </button>
              </Link>
              <div onClick={() => { setOpen(true) }} className="w-[24px] h-[24px] hidden max-[431px]:hidden max-[1130px]:flex items-center justify-center">
                <i className="text-[24px] fa-solid fa-bars"></i>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Header;
