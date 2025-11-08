import ServicesButton from '@/components/ui/ServicesButton'
import React from 'react'

const page = () => {
  return (
    <div className='flex flex-col gap-5'>
      <ServicesButton name="Qeyri-yaşayış sahəsinin alqı-satqısı üzrə"/>
      <ServicesButton name="Yaşayış sahəsinin alqı-satqısı üzrə"/>
      <ServicesButton name="Daşınmaz əmlakın icarəsi"/>
      <ServicesButton name="Daşınmaz əmlakın kirayəsi"/>
    </div>
  )
}

export default page
