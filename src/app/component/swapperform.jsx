"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CustomSelect from './CustomSelect'; // Path to your custom select component

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    console.log("vvvvvvvvvvvvvvvv");
    // Check for the DID token in localStorage
    const did = typeof window !== 'undefined' ? localStorage.getItem('DID') : null;
    console.log("🚀 ~ useEffect ~ did:", did);

    if (did == null) {
      // If DID is not present, set authenticated to false and redirect to login page
      setIsAuthenticated(false);
      router.push('/login');
    } else {
      // If DID is present, set authenticated to true
      setIsAuthenticated(true);
    }
  }, [router]);

  if (!isAuthenticated) {
    // Optionally, you can show a loading spinner or some content while redirecting
    return <p>Redirecting...</p>;
  }

  return (
    <main className="mt-10 overflow-auto h-screen text-gray-100">
      <div className="bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 p-6 rounded-lg shadow-xl max-w-md mx-auto mt-6">
      <div className="mb-4">
  <label className="block text-gray-300 mb-2">Sell</label>
  <div className="flex items-center bg-gray-700 p-3 rounded-lg shadow-md">
    <input
      type="number"
      placeholder="0"
      className="bg-transparent text-4xl text-gray-100 outline-none w-full"
    />
    <div className="relative">

      <select
        className="bg-gray-600 text-gray-100 px-6 py-2 rounded-lg ml-2 flex items-center shadow-md hover:shadow-lg transition-shadow duration-300 appearance-none"
      >
        <option value="eth" className="flex items-center p-5">
          <img
            src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
            alt="ETH"
            className="h-6 w-6  inline-block mr-1"
          />
          ETH
        </option>
        <option value="eth" className="flex items-center">
          <img
            src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
            alt="ETH"
            className="h-6 w-6 inline-block mr-1"
          />
          btc
        </option>
        <option value="eth" className="flex items-center">
          <img
            src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
            alt="ETH"
            className="h-6 w-6 inline-block mr-1"
          />
          dir
        </option>
      </select>
      
      <svg
        className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-100"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M19 9l-7 7-7-7"
        ></path>
      </svg>
    </div>
  </div>
</div>



        <div className="flex justify-center my-2">
          <button className="bg-gray-600 p-2 rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">
            <svg
              className="w-6 h-6 text-gray-100"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 19V6m5 5l-5 5-5-5"
              ></path>
            </svg>
          </button>
        </div>

        <div className="mb-4">
          <label className="block text-gray-300 mb-2">Buy</label>
          <div className="flex items-center bg-gray-700 p-3 rounded-lg shadow-md">
            <input
              type="number"
              placeholder="0"
              className="bg-transparent text-4xl text-gray-100 outline-none w-full"
            />
            <button className="bg-gray-600 text-gray-100 px-3 py-1 rounded-lg ml-2 flex items-center shadow-md hover:shadow-lg transition-shadow duration-300">
              <img
                src="https://cryptologos.cc/logos/ethereum-eth-logo.png"
                alt="ETH"
                className="h-6 w-6 mr-1"
              />
              <span>ETH</span>
              <svg
                className="w-4 h-4 ml-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                ></path>
              </svg>
            </button>
          </div>
        </div>

        <button
          className="bg-gradient-to-r from-black via-gray-800 to-black text-white border border-white px-6 py-3 rounded-lg shadow-xl w-full hover:bg-gradient-to-l from-gray-800 via-black to-gray-800 transition duration-300"
        >
          Confirm
        </button>
      </div>
    </main>
  );
}
