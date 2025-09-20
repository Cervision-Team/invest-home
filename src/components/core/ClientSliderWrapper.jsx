'use client';
import dynamic from 'next/dynamic';

const Slider = dynamic(
  () => import('../../app/(root)/Home/Slider').then(mod => ({ default: mod.Slider })),
);

export default function ClientSliderWrapper({ initialFilters }) {
  return <Slider initialFilters={initialFilters} />;
}
