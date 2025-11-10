import ClientSliderWrapper from "@/components/core/ClientSliderWrapper";
import Agents from "./Home/Agents";
import BeAgent from "./Home/BeAgent";
import Blogs from "./Home/Blogs";
import CustomerFeedbacks from "./Home/CustomerFeedbacks";
import RecentHouses from "./Home/HomeTypes/RecentHouses";
import MobileCategory from "./Home/MobileCategory";
import MobileSearch from "./Home/MobileSearch";
import Neighborhoods from "./Home/Neighborhoods";
import Services from "./Home/Services";
import ClientCategoryWrapper from "@/components/core/ClientCategoryWrapper";
import { Suspense } from "react";
import RecentHousesSkeleton from "@/components/ui/skeleton/RecentHousesSkeleton";
import OpenOffice from "./Home/OpenOffice";
import WhoAreWe from "./Home/WhoAreWe";


export default function Home() {
  return (
    <>
      <Suspense fallback={<div>Loading...</div>}>
        <ClientSliderWrapper />
      </Suspense> 
      <Suspense fallback={<div>Loading...</div>}>
      <ClientCategoryWrapper />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
      <MobileSearch />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
      <MobileCategory />
      </Suspense>
      <Suspense fallback={<RecentHousesSkeleton />}>
      <RecentHouses houseType="Ən son siyahıya alınmış əmlaklar" />
      </Suspense>
      <Suspense fallback={<RecentHousesSkeleton />}>
      <RecentHouses houseType="Satılıq əmlaklar" />
      </Suspense>
      <Suspense fallback={<RecentHousesSkeleton />}>
      <RecentHouses houseType="Kirayə evlər" />
      </Suspense>
      <Neighborhoods />
      <Services />
      <BeAgent />
      {/* <div className="mt-[124px]">
      <OpenOffice />
      </div> */}
      <WhoAreWe />
      
      <div className="max-[431px]:hidden">
        <Agents />
      </div>
      <Blogs />
      <CustomerFeedbacks />
    </>
  );
}