"use client"
import Link from 'next/link'
import React from 'react'
import { ClockIcon, DashboardIcon, DatabaseIcon, PhoneIcon, SearchIcon, WalletIcon } from './MenuIcons';
import { usePathname } from "next/navigation";

const menuItems = [
    { title: "Profilim", href: "/dashboard", icon: DashboardIcon },
    { title: "Statistika", href: "/statistika", icon: DatabaseIcon },
    { title: "Əməkdaşlar", href: "/emekdaslar", icon: WalletIcon },
    { title: "Elan bazası", href: "/elan", icon: ClockIcon },
    { title: "Sifarişlər", href: "/sifaris", icon: SearchIcon },
    { title: "Müştərilər", href: "/musteri", icon: PhoneIcon },
];


const Sidebar = () => {
    const pathName = usePathname();
    return (
        <div>
            <nav className='w-[302px] h-full bg-[#02836F1A] rounded-t-[12px] py-[40px]'>
                <ul className='flex flex-col gap-[32px]'>
                    {
                        menuItems.map((item) => {
                            const MenuIcon = item.icon;
                            const isActive = pathName === item.href
                            return <li key={item.title}>

                                <Link href={item.href} className={`flex items-center w-full pl-[80px] py-[14px] font-medium gap-[8px] text-[#1B1F27] menu-link ${isActive ? "active" : ""}`} >
                                    <MenuIcon active={isActive} />{item.title}
                                </Link>
                            </li>
                        })
                    }
                </ul>
                <div className='px-[32px] mt-[32px]'>
                    <button className='flex justify-center py-[10px] bg-white w-full text-[#E9222C] text-[15px] font-medium rounded-[8px]'>Çıxış</button>
                </div>
            </nav>
        </div>
    )
}

export default Sidebar