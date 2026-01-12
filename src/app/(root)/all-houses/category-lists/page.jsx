import { Suspense } from "react";
import ListingsPage from "./Listings";
import Loader from "@/components/ui/Loader";


export default function Page() {
  return (
    <section className="mx-auto w-full max-[1025px]:px-[20px] max-[431px]:px-[16px] pt-[20px] pb-[36px]">
      <Suspense fallback={<div className="w-full py-10 flex items-center justify-center"><Loader /></div>}>
        <ListingsPage />
      </Suspense>
    </section>
  );
}