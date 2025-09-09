'use client';

import Image from "next/image";
import Link from "next/link";
import { FaLinkedinIn, FaInstagram } from "react-icons/fa";
import InvestHomeLogo from "../../../../public/images/logo.png";
import LocationBlack from "../../../../public/icons/locationBlack.svg";
import PhoneBlack from "../../../../public/icons/phoneBlack.svg";
import MailBlack from "../../../../public/icons/mailBlack.svg";
import Arrow from "../../../../public/icons/Arrow 2.svg"
import FooterIcon from '../../ui/FooterIcon';
import { FaWhatsapp } from "react-icons/fa";
import { useMediaQuery } from "@/hooks/useMediaQuery";



const Footer = () => {
  const isMobile = useMediaQuery('(max-width: 430px)');

  return (
    <>
      {isMobile ? '' : <section className="mt-[120px] bg-[#E4E7F5]">
        <div className="relative mx-auto max-w-[1600px]">
          {/* Background overlay */}
          <div className="absolute inset-0 bg-[#4361EE] opacity-10 -z-10"></div>

          {/* Footer Container */}
          <div className="relative z-10 font-medium px-6 sm:px-10 lg:px-20 py-16
  grid grid-cols-1 gap-12
  sm:grid-cols-2
  lg:grid-cols-4">

            {/* Logo and Contact Info */}
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-3">
                <Image src={InvestHomeLogo} alt="Invest Home" width={50} height={50} />
                <span className="text-[var(--text-color-2)] font-semibold text-xl main-logo-style">INVEST <span className="text-[var(--primary-color)]">HOME</span></span>
              </div>
              <div className="flex flex-col gap-4 text-2">
                <div className="flex items-center gap-2">
                  <Image src={LocationBlack} alt="Location" width={20} height={20} />
                  <span>Rusel Plaza, Babək pr.</span>
                </div>
                <div className="flex items-center gap-2">
                  <Image src={PhoneBlack} alt="Phone" width={20} height={20} />
                  <a href="tel:+994552224120">+994 55 222 41 20</a>
                </div>
                <div className="flex items-center gap-2">
                  <Image src={MailBlack} alt="Mail" width={20} height={20} />
                  <a href="mailto:investhomaz@gmail.com">investhomaz@gmail.com</a>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6">
              <span className="text-[var(--text-color-1)] text-lg">Bakı, Azərbaycan</span>
              <ul className="flex flex-col gap-2 text-[var(--text-color-2)]">
                {["Nizami", "Narimanov", "Xatai", "Nasimi", "Sebail", "Xazar", "Suraxani", "Yasamal", "Sabunchu", "Binagadi"].map((place) => (
                  <li key={place}>
                    <Link href="/">{place}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick Links */}
            <div className="flex flex-col gap-6">
              <span className="text-[var(--text-color-1)] text-lg">Quick Links</span>
              <ul className="flex flex-col gap-2 text-[var(--text-color-2)]">
                {[
                  { name: "Ev Alqı-satqı", href: "/" },
                  { name: "Kirayə", href: "/" },
                  { name: "Haqqımızda", href: "/about-us" },
                  { name: "Xidmətlər", href: "/" },
                  { name: "Bloq", href: "/" },
                  { name: "Agent ol", href: "/become-agent" },
                ].map((link) => (
                  <li key={link.name}>
                    <Link href={link.href}>{link.name}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Email Subscription + Socials */}
            <div className="flex flex-col gap-6">
              <span className="text-[var(--text-color-1)] text-lg">Təkliflərinizi bizimlə bölüşün!</span>

              <div className="relative w-full max-w-sm">
                <input
                  type="text"
                  placeholder="Email Adress"
                  className="w-full h-12 pl-5 pr-16 rounded-full bg-white shadow-md outline-none placeholder-gray-400"
                />
                <button className="absolute top-1.5 right-2 w-10 h-10 rounded-full bg-[var(--primary-color)] flex items-center justify-center">
                  <Image src={Arrow} alt="Submit" width={20} height={20} />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[var(--text-color-1)] text-lg">Follow Us On</span>
                <div className='w-auto h-auto flex flex-row items-center justify-center gap-[20px]'>
                  <FooterIcon
                    icon={
                      <FaWhatsapp />
                    }
                    backgroundColor="#28E55F" />
                  <FooterIcon
                    icon={
                      <FaInstagram />
                    }
                    backgroundColor="linear-gradient(to right, #8a3ab9, #e95950, #fccc63)" />
                  <FooterIcon
                    icon={
                      <FaLinkedinIn />
                    }
                    backgroundColor="#0073AF" />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>}
    </>
  );
};

export default Footer;
