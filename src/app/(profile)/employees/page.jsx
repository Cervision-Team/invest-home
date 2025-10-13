import React from 'react'
import Image from 'next/image'
import user1 from "../../../../public/images/profile/user1.png"
import user2 from "../../../../public/images/profile/user2.svg"
import Link from 'next/link'
import whatsappIcon from "../../../../public/icons/profile/whatsapp-icon.svg"
import instagramIcon from "../../../../public/icons/profile/instagram-icon.svg"
import linkedinIcon from "../../../../public/icons/profile/linkedin-icon.svg"

const users = [
    {
        firstName: "Novruz",
        lastName: "Bayramov",
        role: "CEO & Founder",
        url: user1
    },
    {
        firstName: "Novruz",
        lastName: "Bayramov",
        role: "CEO & Founder",
        url: user2
    },
    {
        firstName: "Novruz",
        lastName: "Bayramov",
        role: "CEO & Founder",
        url: user1
    },
    {
        firstName: "Novruz",
        lastName: "Bayramov",
        role: "CEO & Founder",
        url: user2
    },
    {
        firstName: "Novruz",
        lastName: "Bayramov",
        role: "CEO & Founder",
        url: user1
    },
    {
        firstName: "Novruz",
        lastName: "Bayramov",
        role: "CEO & Founder",
        url: user2
    },
    {
        firstName: "Novruz",
        lastName: "Bayramov",
        role: "CEO & Founder",
        url: user1
    },
    {
        firstName: "Novruz",
        lastName: "Bayramov",
        role: "CEO & Founder",
        url: user2
    },
    {
        firstName: "Novruz",
        lastName: "Bayramov",
        role: "CEO & Founder",
        url: user1
    },
    {
        firstName: "Novruz",
        lastName: "Bayramov",
        role: "CEO & Founder",
        url: user2
    },
    {
        firstName: "Novruz",
        lastName: "Bayramov",
        role: "CEO & Founder",
        url: user1
    },
    {
        firstName: "Novruz",
        lastName: "Bayramov",
        role: "CEO & Founder",
        url: user1
    },
    {
        firstName: "Novruz",
        lastName: "Bayramov",
        role: "CEO & Founder",
        url: user1
    },
]

const Employees = () => {
    return (
        <main className='w-full'>
            <section className='grid grid-cols-4 gap-y-[20px]'>
                {
                    users.map((user) => {
                        return (
                            <div className='flex flex-col items-center justify-between '>
                                <div className='w-[140px] h-[140px]'>
                                    <Image src={user.url} alt={"user1"} className='w-full h-full object-cover rounded-full' />
                                </div>
                                <div className='flex flex-col gap-[10px] items-center mt-[20px]'>
                                    <p className='text-[20px]'>{user.firstName} {user.lastName}</p>
                                    <strong className='text-[20px] text-[#02836F] font-medium'>{user.role}</strong>
                                </div>
                                <div className='flex gap-2 mt-[20px]'>
                                    <Link className='w-[24px] h-[24px] bg-black rounded-full flex items-center justify-center' href={"/employees"}>
                                        <Image src={whatsappIcon} alt='whatsapp' />
                                    </Link>
                                    <Link className='w-[24px] h-[24px] bg-black rounded-full flex items-center justify-center' href={"/employees"}>
                                        <Image src={instagramIcon} alt='instagram' />
                                    </Link>
                                    <Link className='w-[24px] h-[24px] bg-black rounded-full flex items-center justify-center' href={"/employees"}>
                                        <Image src={linkedinIcon} alt='linkedin' />
                                    </Link>
                                </div>
                            </div>
                        )
                    })
                }


            </section>
        </main>
    )
}

export default Employees