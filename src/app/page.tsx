'use client'

import React from 'react'
import SwaperForm from "./component/swapperform";

const Home = () => {
  return (
    <>
      <div className='navbar bg-gray-800 p-4 flex justify-between items-center'>
        <div>
          <h1 className='text-white text-4xl font-serif'>Hello DID</h1>
        </div>
        <div>
          <w3m-button />
        </div>
      </div>
      
      <div className='main flex items-center justify-center min-h-screen bg-gray-900'>
        <SwaperForm />
      </div>
    </>
  )
}

export default Home;
