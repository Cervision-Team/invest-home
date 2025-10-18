"use client"
import Link from 'next/link'
import React from 'react'
import { ClockIcon, ProfileIcon, DatabaseIcon, PhoneIcon, SearchIcon, WalletIcon, LogoutIcon, StatisticIcon, EmployeesIcon, OrderIcon, CustomerIcon } from './MenuIcons';
import { usePathname } from "next/navigation";
import userAdmin from "../../../../public/images/profile/user-admin.jpg"
import Image from 'next/image';
const menuItems = [
    { title: "Profilim", href: "/moderator/profile", icon: ProfileIcon },
    { title: "Statistika", href: "/moderator/statistics", icon: StatisticIcon },
    { title: "Əməkdaşlar", href: "/moderator/employees", icon: EmployeesIcon },
    { title: "Elan bazası", href: "/moderator/elan", icon: DatabaseIcon },
    { title: "Sifarişlər", href: "/moderator/orders", icon: OrderIcon },
    { title: "Müştərilər", href: "/moderator/customers", icon: CustomerIcon },
];


const Sidebar = () => {
    const pathName = usePathname();
    return (
        <div>
            <nav className='w-[302px] h-fit bg-[#fff] rounded-[12px] pt-[24px] pb-[40px] items-center border border-[#02836F] shadow-[0px_4px_30px_0px_#0000000D]'>
                <div className='flex justify-center items-center gap-[12px] mb-[24px]'>
                    <div className='w-[50px] h-[50px]'>
                        <Image className='rounded-full w-[50px] h-[50px] object-cover' src={userAdmin} alt='profile image' />
                    </div>
                    <span className='font-medium text-lg'>Süsən</span>
                </div>

                <ul className='flex flex-col gap-[16px]'>
                    {
                        menuItems.map((item) => {
                            const MenuIcon = item.icon;
                            const isActive = pathName === item.href
                            return <li key={item.title} className='px-[8px]'>

                                <Link href={item.href} className={`flex items-center w-full pl-[80px] py-[14px] font-medium gap-[8px] text-[#1B1F27] menu-link rounded-[4px] ${isActive ? "active" : ""}`} >
                                    <MenuIcon active={isActive} />{item.title}
                                </Link>
                            </li>
                        })
                    }
                </ul>
                <div className='px-[32px] mt-[32px]'>
                    <button className='flex justify-center py-[10px] bg-white w-full text-[#E9222C] text-[15px] font-medium rounded-[8px] gap-[15px] items-center'><LogoutIcon /> Çıxış</button>
                </div>
            </nav>
        </div>
    )
}

export default Sidebar