import React from 'react'
import Hero from './Hero'
import Info from './Info'
import Models from './Models'
import OfficeForm from './OfficeForm'

const page = () => {
  return (
    <>
    <div className='mt-8 mb-25'>
      <Hero />
    </div>
    <div className='mb-25'>
        <Info />
    </div>
    <div className='mb-25'>
      <Models />
    </div>
    <div className='mb-[129px]'>
      <OfficeForm />
    </div>
    </>
  )
}

export default page
