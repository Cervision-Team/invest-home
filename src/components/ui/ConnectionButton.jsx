import React from 'react'

const ConnectionButton = ({ name, className = "", onClick, type = "button" }) => {
  return (
    <>
    <div className={`w-[248px] relative h-[60px] rounded-xl border border-solid border-primary group overflow-hidden ${className}`.trim()}>
      <div className='absolute inset-0 w-0 h-full transition-all duration-800 group-hover:w-full'
      style={{ 
        background: 'linear-gradient(90deg, #02836F 0%, #1A1919 100%)',
      }}></div>
      <button
        type={type}
        onClick={onClick}
        className='relative z-10 w-full h-full flex items-center justify-center text-primary text-base font-medium cursor-pointer transition-colors duration-800 group-hover:text-[#FFFEFE]'
      >
        {name}
      </button>
    </div>
    </>
  )
}

export default ConnectionButton