import React from 'react'

const Search = ({ search, setSearch }) => {
    return (
        <div className="relative w-full">
            <input
                placeholder="Axtarış"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="shadow-[0px_4px_10px_0px_#0000001A] px-5 rounded-[20px] flex-1 w-full h-[44px] placeholder:text-black"
            />
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                className="absolute top-[30%] right-5"
                viewBox="0 0 18 18"
                fill="none"
            >
                <path
                    d="M13.666 13.667L17.416 17.417"
                    stroke="#141B34"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
                <path
                    d="M15.75 8.25C15.75 4.10786 12.3921 0.75 8.25 0.75C4.10786 0.75 0.75 4.10786 0.75 8.25C0.75 12.3921 4.10786 15.75 8.25 15.75C12.3921 15.75 15.75 12.3921 15.75 8.25Z"
                    stroke="#141B34"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                />
            </svg>
        </div>
    )
}

export default Search