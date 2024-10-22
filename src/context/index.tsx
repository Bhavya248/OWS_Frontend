// 'use client'
// import React, { ReactNode } from 'react'
// import { config, projectId, metadata } from '@/config'
// import { createWeb3Modal } from '@web3modal/wagmi/react'
// import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import { State, WagmiProvider } from 'wagmi'
// import { arbitrum } from 'viem/chains'
// import MyContractComponent from "../app/component/MyContractComponent";
// import { useAccount } from 'wagmi';
//  const queryClient = new QueryClient()
// // console.log(queryClient);
// if (!projectId) throw new Error('Project ID is not defined')

// // Create modal
// const client = createWeb3Modal({
//   metadata,
//   wagmiConfig: config,
//   projectId,
//   enableAnalytics: true // Optional - defaults to your Cloud configuration
// })
// export default function AppKitProvider({
//   children,
//   initialState
// }: {
//   children: ReactNode
//   initialState?: State
// }) {

//   return (
//     <WagmiProvider config={config} initialState={initialState}>
//       <QueryClientProvider client={queryClient}>
        
//         {children}
// {
//   <MyContractComponent />
// }
//       </QueryClientProvider>
//     </WagmiProvider>
//   )
  
// }



'use client'

import React, { ReactNode } from 'react'
import { config, projectId, metadata } from '@/config'

import { createWeb3Modal } from '@web3modal/wagmi/react'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { State, WagmiProvider } from 'wagmi'
import { arbitrum } from 'viem/chains'




// Setup queryClient
const queryClient = new QueryClient()

// console.log(queryClient);

if (!projectId) throw new Error('Project ID is not defined')

// Create modal
const client = createWeb3Modal({
  metadata,
  wagmiConfig: config,
  projectId,
  enableAnalytics: true // Optional - defaults to your Cloud configuration
})



export default function AppKitProvider({
  children,
  initialState
}: {
  children: ReactNode
  initialState?: State

  
  
  
}) {
  console.log(client.getIsConnectedState());
  return (
    <WagmiProvider config={config} initialState={initialState}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}




