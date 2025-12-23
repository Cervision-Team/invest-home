"use client";

import Link from "next/link";

export default function ProfileMenu({ userName, isLogin }) {
    if (!isLogin) {
        return (
            <Link href="/login">
                <button className="text-black flex justify-center items-center gap-[10px] text-[18px] cursor-pointer">
                    <div className="profile-icon">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                            <path d="M5.5 14.5C5.5 12.0147 7.51472 10 10 10C12.4853 10 14.5 12.0147 14.5 14.5"
                                stroke="#1B1F27" strokeWidth="1.6" strokeLinecap="round" />
                            <path d="M10.0008 9.99998C11.492 9.99998 12.7008 8.79119 12.7008 7.29998C12.7008 5.80882 11.492 4.59998 10.0008 4.59998C8.50957 4.59998 7.30078 5.80882 7.30078 7.29998C7.30078 8.79119 8.50957 9.99998 10.0008 9.99998Z"
                                stroke="#1B1F27" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z"
                                stroke="#1B1F27" strokeWidth="1.6" />
                        </svg>
                    </div>
                    <span className="max-[1440px]:hidden text-[16px] font-[500]">Daxil ol</span>
                </button>
            </Link>
        );
    }

    return (
        <Link href="/profile">
            <button className="text-black flex justify-center items-center gap-[10px] text-[18px] cursor-pointer">
                <div className="profile-icon">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M5.5 14.5C5.5 12.0147 7.51472 10 10 10C12.4853 10 14.5 12.0147 14.5 14.5"
                            stroke="#1B1F27" strokeWidth="1.6" strokeLinecap="round" />
                        <path d="M10.0008 9.99998C11.492 9.99998 12.7008 8.79119 12.7008 7.29998C12.7008 5.80882 11.492 4.59998 10.0008 4.59998C8.50957 4.59998 7.30078 5.80882 7.30078 7.29998C7.30078 8.79119 8.50957 9.99998 10.0008 9.99998Z"
                            stroke="#1B1F27" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                        <path d="M10 19C14.9706 19 19 14.9706 19 10C19 5.02944 14.9706 1 10 1C5.02944 1 1 5.02944 1 10C1 14.9706 5.02944 19 10 19Z"
                            stroke="#1B1F27" strokeWidth="1.6" />
                    </svg>
                </div>
                <span className="max-[1440px]:hidden text-[16px] font-[500]">{userName}</span>
            </button>
        </Link>
    );
}
