// "use client";
// import { useContext } from "react";
// //  import { AccountContext } from "../../context/context";
// import { useRouter } from "next/navigation";
// // import Navbar from "./component/navbar";
// import AppKitProvider from "@/context";
// // import SwaperForm from "./component/swapperform";
// import { config } from '@/config'
// import { useEffect, useState } from "react";
// import { cookieToInitialState } from "wagmi";
// import React from "react";

// const Navbar = () => {
//   const [isMenuOpen, setIsMenuOpen] = useState(false);
// //   const { account, connect, disconnect } = useContext(AccountContext);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const router = useRouter();

//   useEffect(() => {
//     const did =
//       typeof window !== "undefined" ? localStorage.getItem("DID") : null;
//     if (did == null) {
//       setIsAuthenticated(false);
//       router.push("/login");
//     } else {
//       setIsAuthenticated(true);
//     }
//   }, [router]);

//   return (
//     <nav className="bg-gray-950 p-4 shadow-md">
//       <div className="container mx-auto flex justify-between items-center">
//             <w3m-buttonn/>
//         <div className="flex items-center">
//           {/* <img src="/Icon_Hydra_colour.png" alt="Logo" className="h-8 w-8 mr-2" /> */}
//           <span className="text-4xl text-white">Kishan</span>
//         </div>
//         <div className="hidden md:flex items-center space-x-6">
//           <a href="#" className="text-gray-200 text-lg">
//             Swap
//           </a>
//           <a href="#" className="text-gray-200 text-lg">
//             Limit
//           </a>
//           <a href="#" className="text-gray-200 text-lg">
//             Buy
//           </a>
//         </div>
//         <div className="md:hidden">
//           <button
//             onClick={() => setIsMenuOpen(!isMenuOpen)}
//             className="text-gray-600 hover:text-gray-800 focus:outline-none"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//               xmlns="http://www.w3.org/2000/svg"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth="2"
//                 d={
//                     isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"
//                 }
//                 ></path>
//             </svg>
//           </button>
//         </div>
//       </div>
//       {isMenuOpen && (
//         <div className="md:hidden mt-4 space-y-2">
//           <a
//             href="#"
//             className="block text-gray-600 hover:text-gray-800 text-lg"
//           >
//             Swap
//           </a>
//           <a
//             href="#"
//             className="block text-gray-600 hover:text-gray-800 text-lg"
//           >
//             Limit
//           </a>
//           <a
//             href="#"
//             className="block text-gray-600 hover:text-gray-800 text-lg"
//           >
//             Buy
//           </a>
//           {/* <div className="mt-4">
//             {!account ? (
//               <button
//                 className="bg-gradient-to-r from-gray-800 via-gray-600 to-gray-800 text-white w-full px-6 py-2 rounded-lg hover:shadow-lg transition duration-300"
//                 onClick={connect}
//               >
//                 Connect
//               </button>
//             ) : (
//               <div className="flex flex-col items-center">
//                 <div className="bg-gray-200 text-gray-800 w-full text-center py-2 rounded-lg">
//                   <p className="text-sm">
//                     {account.slice(0, 6)}...{account.slice(-4)}
//                   </p>
//                 </div>
//                 <button
//                   className="bg-gray-600 text-white w-full mt-2 px-4 py-2 rounded-lg hover:shadow-lg transition duration-300"
//                   onClick={disconnect}
//                 >
//                   Disconnect
//                 </button>
//               </div>
//             )}
//           </div> */}
//         </div>
//       )}
//     </nav>
//   );
// };

// export default Navbar;



