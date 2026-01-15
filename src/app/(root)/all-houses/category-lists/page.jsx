import { Suspense } from "react";
import ListingsPage from "./Listings";
import Loader from "@/components/ui/Loader";


export default function Page() {
  return (
    <section className="max-w-[1600px] mx-auto pt-[20px] pb-[36px]">
      <div className="px-[80px] max-w-[1600px] mx-auto max-[1025px]:px-[20px] max-[431px]:px-[16px]">
        <Suspense
          fallback={
            <div className="w-full py-10 flex items-center justify-center">
              <Loader />
            </div>
          }
        >
          <ListingsPage />
        </Suspense>
      </div>
    </section>
  );
}