import React from "react";

export const DashboardIcon = ({ active }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={`menu-icon ${active ? "active" : ""}`}

        >
            <path d="M10 2H2V12H10V2Z" stroke="#1B1F27" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M10 16H2V22H10V16Z" stroke="#1B1F27" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M22 12H14V22H22V12Z" stroke="#1B1F27" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M22 2H14V8H22V2Z" stroke="#1B1F27" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
};


export const DatabaseIcon = ({ active }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            className={`menu-icon ${active ? "active" : ""}`}
        >
            <ellipse cx="12" cy="5" rx="8" ry="3" stroke="#1B1F27" strokeWidth="1.5" />
            <path d="M20 12C20 13.6569 16.4183 15 12 15C7.58172 15 4 13.6569 4 12" stroke="#1B1F27" strokeWidth="1.5" />
            <path d="M20 5V19C20 20.6569 16.4183 22 12 22C7.58172 22 4 20.6569 4 19V5" stroke="#1B1F27" strokeWidth="1.5" />
            <path d="M8 8V10.5" stroke="#1B1F27" strokeWidth="1.5" />
            <path d="M8 15V17.5" stroke="#1B1F27" strokeWidth="1.5" />
        </svg>

    );
};


export const WalletIcon = ({ active }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={`menu-icon ${active ? "active" : ""}`}>
            <path d="M16 14C16 14.8284 16.6716 15.5 17.5 15.5C18.3284 15.5 19 14.8284 19 14C19 13.1716 18.3284 12.5 17.5 12.5C16.6716 12.5 16 13.1716 16 14Z" stroke="#141B34" strokeWidth="1.5" />
            <path d="M18.9 8C18.9656 7.67689 19 7.34247 19 7C19 4.23858 16.7614 2 14 2C11.2386 2 9 4.23858 9 7C9 7.34247 9.03443 7.67689 9.10002 8" stroke="#141B34" strokeWidth="1.5" />
            <path d="M7 8.00005H22V22H2.00005L2 4H10" stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
};

export const ClockIcon = ({ active }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={`menu-icon ${active ? "active" : ""}`}>
            <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C7.52232 2 3.77426 4.94289 2.5 9H5.5" stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M12 7V12L14.5 14.5" stroke="#141B34" strokeWidth="1.5" />
            <path d="M2 12C2 12.3373 2.0152 12.6709 2.04494 13M9 22C8.6584 21.8876 8.32471 21.7564 8 21.6078M3.20939 17C3.01655 16.6284 2.84453 16.2433 2.69497 15.8462M4.83122 19.3065C5.1369 19.6358 5.46306 19.9441 5.80755 20.2292" stroke="#141B34" strokeWidth="1.5" strokeLinecap="square" strokeLinejoin="round" />
        </svg>
    );
};

export const SearchIcon = ({ active }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={`menu-icon ${active ? "active" : ""}`}>
            <path d="M17.5 17.5L22 22" stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round" />
            <path d="M20 11C20 6.02944 15.9706 2 11 2C6.02944 2 2 6.02944 2 11C2 15.9706 6.02944 20 11 20C15.9706 20 20 15.9706 20 11Z" stroke="#141B34" strokeWidth="1.5" strokeLinejoin="round" />
        </svg>
    );
};

export const PhoneIcon = ({ active }) => {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" className={`menu-icon ${active ? "active" : ""}`}>
            <path d="M2.08793 7.57126L1.3527 7.71937L1.35275 7.71962L2.08793 7.57126ZM8 8L8.51137 8.54863L8.92208 8.16582L8.67048 7.6639L8 8ZM4.99233 2L5.6628 1.6639C5.56084 1.4605 5.37205 1.31438 5.14958 1.26667C4.92711 1.21896 4.69501 1.27483 4.51861 1.41855L4.99233 2ZM7.37927 16.6207L7.9098 16.0906L7.90941 16.0902L7.37927 16.6207ZM16.4285 21.9122L16.2801 22.6474L16.2804 22.6474L16.4285 21.9122ZM15.9997 16.0001L16.3358 15.3296L15.8339 15.078L15.4511 15.4887L15.9997 16.0001ZM21.9997 19.0078L22.5812 19.4815C22.7249 19.3051 22.7808 19.073 22.7331 18.8505C22.6854 18.6281 22.5392 18.4393 22.3358 18.3373L21.9997 19.0078ZM2.08793 7.57126L1.35275 7.71962C1.64441 9.16491 2.13033 10.5909 3.11985 12.3156L3.77038 11.9424L4.42092 11.5692C3.51363 9.98777 3.08368 8.71413 2.82311 7.42289L2.08793 7.57126ZM3.77038 11.9424L4.28176 12.491L8.51137 8.54863L8 8L7.48863 7.45137L3.25901 11.3938L3.77038 11.9424ZM8 8L8.67048 7.6639L5.6628 1.6639L4.99233 2L4.32185 2.3361L7.32952 8.3361L8 8ZM4.99233 2L4.51861 1.41855C3.00645 2.65052 0.736597 4.66102 1.3527 7.71937L2.08793 7.57126L2.82316 7.42315C2.40334 5.33917 3.88184 3.87213 5.46605 2.58145L4.99233 2ZM3.77038 11.9424L3.11985 12.3156C4.11578 14.0515 5.39178 15.695 6.84914 17.1513L7.37927 16.6207L7.90941 16.0902C6.53943 14.7212 5.34646 13.1824 4.42092 11.5692L3.77038 11.9424ZM16.4285 21.9122L16.5768 21.177C15.2856 20.9164 14.012 20.4865 12.4306 19.5792L12.0574 20.2297L11.6841 20.8803C13.4088 21.8698 14.8348 22.3557 16.2801 22.6474L16.4285 21.9122ZM12.0574 20.2297L12.606 20.7411L16.5484 16.5115L15.9997 16.0001L15.4511 15.4887L11.5087 19.7184L12.0574 20.2297ZM15.9997 16.0001L15.6636 16.6706L21.6636 19.6783L21.9997 19.0078L22.3358 18.3373L16.3358 15.3296L15.9997 16.0001ZM21.9997 19.0078L21.4183 18.5341C20.1276 20.1183 18.6606 21.5968 16.5766 21.177L16.4285 21.9122L16.2804 22.6474C19.3387 23.2635 21.3492 20.9937 22.5812 19.4815L21.9997 19.0078ZM12.0574 20.2297L12.4306 19.5792C10.8174 18.6537 9.27883 17.4606 7.9098 16.0906L7.37927 16.6207L6.84874 17.1509C8.305 18.6082 9.94815 19.8843 11.6841 20.8803L12.0574 20.2297Z" fill="#141B34" />
            <path d="M14 3V5.8M18.9502 5.05078L16.9703 7.03068M21 10H18.2" stroke="#141B34" strokeWidth="1.5" />
        </svg>
    );
};
