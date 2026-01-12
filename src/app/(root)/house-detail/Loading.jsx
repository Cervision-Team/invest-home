import React from 'react'
import Loader from "@/components/ui/Loader";

const Loading = () => {
  return (
    <div className="w-full py-16 flex items-center justify-center">
      <Loader />
    </div>
  )
}

export default Loading