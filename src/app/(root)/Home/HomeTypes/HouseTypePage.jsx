// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { houseData } from "../../../data/house";
// import HouseTypeSelector from "./HouseTypeSelector";
// import ReactPaginate from "react-paginate";
// import TypeHouseList from "./TypeHouseList";
// import LeftSvg from "../../../../../public/icons/uiw_left.svg";
// import RightSvg from "../../../../../public/icons/uiw_right.svg";
// import Image from "next/image";


// const HouseTypePage = () => {
//   const { type } = useParams();
//   const navigate = useNavigate();

//   const [activeType, setActiveTypeState] = useState("enSon");
//   const [currentPage, setCurrentPage] = useState(0);
//   const itemsPerPage = 8;

//   const setActiveType = (newType) => {
//     setActiveTypeState(newType);
//     navigate(`/${newType}`);
//   };

//   useEffect(() => {
//     if (type) {
//       setActiveTypeState(type);
//       setCurrentPage(0);
//     }
//   }, [type]);

//   const filteredHouses =
//     activeType === "enSon"
//       ? houseData
//       : houseData.filter((house) => house.type === activeType);

//   const pageCount = Math.ceil(filteredHouses.length / itemsPerPage);

//   const handlePageClick = ({ selected }) => {
//     setCurrentPage(selected);
//   };

//   const offset = currentPage * itemsPerPage;
//   const currentItems = filteredHouses.slice(offset, offset + itemsPerPage);


//   return (
//     <div className="py-8">
//       <HouseTypeSelector
//         activeType={activeType}
//         setActiveType={setActiveType}
//       />
//       <div className="px-[80px] m-auto ">
//         <div className="grid grid-cols-4 gap-[24px] mt-4">
//           {currentItems.length > 0 ? (
//             currentItems.map((house) => (
//               <TypeHouseList
//                 key={house.id}
//                 house={house}
//               />
//             ))
//           ) : (
//             <p>Bu kateqoriyada ev tapılmadı.</p>
//           )}
//         </div>

//         <div className="flex justify-center mt-10">
//           <ReactPaginate
//             previousLabel={
//               <Image src={LeftSvg.src} alt="Previous" width={24} height={24} />
//             }
//             nextLabel={
//               <Image src={RightSvg.src} alt="Next" width={24} height={24} />
//             }
//             pageCount={pageCount}
//             onPageChange={handlePageClick}
//             containerClassName={"flex gap-2"}
//             pageClassName={
//               "px-[17px] py-[4px] texr-[14px] font-[400] leading-[32px] text-[rgba(0,0,0,0.5)] border rounded border-[rgba(0,0,0,0.2)]"
//             }
//             activeClassName={"text-black border-[rgba(0,0,0,0.2)]"}
//             previousClassName={
//               "p-[8px] border-[0.5px] border-[rgba(0,0,0,0.2)]"
//             }
//             nextClassName={"p-[8px] border-[0.5px] border-[rgba(0,0,0,0.2)]"}
//             disabledClassName={"opacity-50 cursor-not-allowed"}
//           />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default HouseTypePage;
