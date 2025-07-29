'use-client'
import React, { useEffect, useRef, useState } from 'react'
import Image from "next/image";
import X_Icon from "../../../../public/icons/x.svg"
import Link from 'next/link';
import { useLang } from '@/context/LangContext';

const HamBar = ({ state, setState }) => {
    const { handleSelect, flags } = useLang();
    const menuRef = useRef(null);

    const navLinks = [
        { href: "/about-us", label: "Haqqımızda" },
        { href: "/services", label: "Xidmətlərimiz" },
        { href: "/blog", label: "Bloq" },
        { href: "/contact", label: "Əlaqə" },
        { href: "/my-account", label: "Kabinetim" },
    ];

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setState(false);
            }
        };

        const handleResize = () => {
            if (window.innerWidth > 1024) {
                setState(false);
            }
        };

        if (state) {
            document.addEventListener("mousedown", handleClickOutside);
            window.addEventListener("resize", handleResize);
        }

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            window.removeEventListener("resize", handleResize);
        };
    }, [state, setState]);


    return (
        <>
            {state && (
                <section key={"hambar"} className={`bg-[rgba(0,0,0,0.3)] w-[100%] h-[100vh] fixed bottom-0 left-[0] z-999`}>
                    <div ref={menuRef} className='overflow-scroll bg-white h-[80vh] w-[266px] fixed bottom-0 left-[0]'>
                        <div className="sticky top-0 bg-white head py-[22px] px-[16px] flex items-center justify-between">
                            <div className='flex items-center'>
                                <Image
                                    src={"/images/logo.png"}
                                    alt='logo'
                                    height={28}
                                    width={28}
                                />
                                <h1 className='font-[600] text-[16px] main-logo-style'>INVEST HOME</h1>
                            </div>
                            <div onClick={() => { setState(false) }} className="x-icon h-[24px] w-[24px] flex items-center justify-center cursor-pointer">
                                <Image
                                    src={X_Icon}
                                    width={13}
                                    height={13}
                                    alt='x_icon'
                                />
                            </div>
                        </div>
                        <div className="nav">
                            <ul>
                                {navLinks.map((link) => {
                                    return (
                                        <>
                                            <li key={link.href} className='border-b-[1px] border-b-[#C8C7C752]'>
                                                <Link
                                                    className='px-[16px] py-[8px] w-[100%] inline-block'
                                                    href={link.href}
                                                >
                                                    {link.label}
                                                </Link>
                                            </li>
                                        </>
                                    )
                                })}
                            </ul>
                        </div>
                        <div className="lang">
                            <ul>
                                {flags.map((flag) => (
                                    <li
                                        key={flag.name}
                                        onClick={() => handleSelect(flag.name)}
                                        className={"px-[16px] py-[8px] flex items-center gap-[10px]"}
                                    >
                                        <div>
                                            <Image
                                                src={flag.flag}
                                                alt={flag.name}
                                                width={24}
                                                height={24}
                                            />
                                        </div>
                                        <span className='text-[14px] text-[#888888] font-[500]'>{flag.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </section>
            )}
        </>
    )
}

export default HamBar