'use client'

import React, { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import whatsappIcon from "../../../../public/icons/profile/whatsapp-icon.svg"
import instagramIcon from "../../../../public/icons/profile/instagram-icon.svg"
import linkedinIcon from "../../../../public/icons/profile/linkedin-icon.svg"
import agentsData from '@/components/core/AgentsData'

const Employees = () => {
  const containerRef = useRef(null)
  const [pageAtTop, setPageAtTop] = useState(true)

  useEffect(() => {
    const handleScroll = () => {
      setPageAtTop(window.scrollY === 0)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <main className="w-full h-full">
      <section
        ref={containerRef}
        className={`
          grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 
          gap-y-6 gap-x-4 
          pr-2 
          hide-scrollbar
          max-h-[80vh]
          ${pageAtTop ? 'overflow-y-auto' : 'overflow-y-hidden'}
        `}
      >
        {agentsData.map((agent, index) => (
          <Link href={`/about-us/${agent.id}`} className="group block" key={index}>
            <div className="flex flex-col items-center justify-between p-2">
              <div className="w-[140px] h-[140px]">
                <Image
                  src={agent.image}
                  alt={agent.name}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div className="flex flex-col gap-[10px] items-center mt-[20px] text-center">
                <p className="text-[20px]">{agent.fullName}</p>
                <strong className="text-[20px] text-[#02836F] font-medium">
                  {agent.role}
                </strong>
              </div>
              <div className="flex gap-2 mt-[20px]">
                <Link
                  className="w-[24px] h-[24px] bg-black rounded-full flex items-center justify-center"
                  href={"/employees"}
                >
                  <Image src={whatsappIcon} alt="whatsapp" />
                </Link>
                <Link
                  className="w-[24px] h-[24px] bg-black rounded-full flex items-center justify-center"
                  href={"/employees"}
                >
                  <Image src={instagramIcon} alt="instagram" />
                </Link>
                <Link
                  className="w-[24px] h-[24px] bg-black rounded-full flex items-center justify-center"
                  href={"/employees"}
                >
                  <Image src={linkedinIcon} alt="linkedin" />
                </Link>
              </div>
            </div>
          </Link>
        ))}
      </section>
    </main>
  )
}

export default Employees
