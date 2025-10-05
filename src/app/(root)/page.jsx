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
import WhoAreWe from "./Home/WhoAreWe";
import ClientCategoryWrapper from "@/components/core/ClientCategoryWrapper";
import { Suspense } from "react";


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
      <Suspense fallback={<div>Loading...</div>}>
      <RecentHouses houseType="Ən son siyahıya alınmış əmlaklar" />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
      <RecentHouses houseType="Satılıq əmlaklar" />
      </Suspense>
      <Suspense fallback={<div>Loading...</div>}>
      <RecentHouses houseType="Kirayə evlər" />
      </Suspense>
      <Neighborhoods />
      <Services />
      <BeAgent />
      <WhoAreWe />
      <div className="max-[431px]:hidden">
        <Agents />
      </div>
      <Blogs />
      <CustomerFeedbacks />
    </>
  );
}