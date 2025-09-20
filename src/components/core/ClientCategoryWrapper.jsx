"use client";
import { useSearchParams } from "next/navigation";
import Category from "../../app/(root)/Home/Category";
import { houseData } from "@/components/core/house";

export default function ClientCategoryWrapper() {
  const searchParams = useSearchParams();
  const categoryId = Number(searchParams.get("categoryId")) || null;

  return <Category listings={houseData} activeId={categoryId} />;
}
