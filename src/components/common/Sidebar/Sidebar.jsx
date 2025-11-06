"use client"
import Link from 'next/link'
import React from 'react'
import { ClockIcon, ProfileIcon, DatabaseIcon, PhoneIcon, SearchIcon, WalletIcon, LogoutIcon, StatisticIcon, EmployeesIcon, OrderIcon, CustomerIcon } from './MenuIcons';
import { usePathname } from "next/navigation";
import userAdmin from "../../../../public/images/profile/novruz.jpg"
import Image from 'next/image';
const menuItems = [
    { title: "Profilim", href: "/profile", icon: ProfileIcon },
    { title: "Statistika", href: "/statistics", icon: StatisticIcon },
    { title: "Əməkdaşlar", href: "/employees", icon: EmployeesIcon },
    { title: "Elan bazası", href: "/database-table", icon: DatabaseIcon },
    { title: "Sifarişlər", href: "/orders", icon: OrderIcon },
    { title: "Müştərilər", href: "/customers", icon: CustomerIcon },
    { title: "Balansım", href: "/wallet", icon: WalletIcon },
    { title: "Ödəniş tarixçəsi", href: "/transaction-history", icon: WalletIcon },
];


const Sidebar = () => {
    const pathName = usePathname();
    return (
        <div>
            <nav className='w-[302px] h-fit bg-white rounded-xl pt-6 pb-10 items-center border-2 border-[#02836F] shadow-[0px_4px_30px_0px_#0000000D]'>
                <div className='flex justify-center items-center gap-3 mb-6'>
                    <div className='w-[50px] h-[50px]'>
                        <Image className='rounded-full w-[50px] h-[50px] object-cover object-top' src={userAdmin} alt='profile image' />
                    </div>
                    <span className='font-medium text-lg'>Novruz</span>
                </div>

                <ul className='flex flex-col gap-4'>
                    {
                        menuItems.map((item) => {
                            const MenuIcon = item.icon;
                            const isActive = pathName === item.href
                            return <li key={item.title} className='px-2'>

                                <Link href={item.href} className={`flex items-center w-full pl-20 py-3.5 font-medium gap-2 text-[#1B1F27] menu-link rounded-sm ${isActive ? "active" : ""}`} >
                                    <MenuIcon active={isActive} />{item.title}
                                </Link>
                            </li>
                        })
                    }
                </ul>
                <div className='px-8 mt-8'>
                    <button className='flex justify-center py-2.5 bg-white w-full text-[#E9222C] text-[15px] font-medium rounded-lg gap-[15px] items-center'><LogoutIcon /> Çıxış</button>
                </div>
            </nav>
        </div>
    )
}

export default Sidebar