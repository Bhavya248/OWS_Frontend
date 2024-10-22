'use client'

import React, { useEffect } from 'react'
import { useAccount } from 'wagmi'
import SwaperForm from './component/swapperform'

// Helper function to send data to the server
const sendData = async (address: string, did: string) => {
  console.log('Sending data to server...'); // Log before sending
  try {
    const response = await fetch('http://127.0.0.1:5000/did', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address, DID: did }), // Ensure payload matches Python function's expected format
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    console.log('Server response:', data);
  } catch (error) {
    console.error('Error sending data:', error);
  }
}

const Home = () => {
  const { isConnected, address } = useAccount()

  useEffect(() => {
    if (isConnected && address) {
      console.log('Connected wallet address:', address)

      // Retrieve `did` from local storage
      const DID = localStorage.getItem('DID')

      if (DID) {
        // Send data to the server
        console.log(DID,address);
        
        sendData(address, DID)
      } else {
        console.error('No DID found in local storage');
      }
    }
  }, [isConnected, address])

  return (
    <>
      <div className='navbar bg-gray-800 p-4 flex justify-between items-center'>
        <div>
          <h1 className='text-white text-4xl font-serif'>Hello DID</h1>
        </div>
        <div>
          <w3m-button /> {/* Ensure this is the correct component */}
        </div>
      </div>

      <div className='main flex items-center justify-center min-h-screen bg-gray-900'>
        <SwaperForm />
      </div>
    </>
  )
}

export default Home
