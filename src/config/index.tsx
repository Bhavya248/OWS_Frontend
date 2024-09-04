'use client'

import { defaultWagmiConfig } from '@web3modal/wagmi/react/config'

import { cookieStorage, createStorage } from 'wagmi'
import {arbitrum  } from 'wagmi/chains'

// Get projectId from https://cloud.walletconnect.com
export const projectId = '1194c2e76381b544fcd30c9b917497bb'

if (!projectId) throw new Error('Project ID is not defined')

export const metadata = {
  name: 'AppKit',
  description: 'AppKit Example',
  url: 'https://web3modal.com', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

// Create wagmiConfig
const chains = [arbitrum] as const
export const config = defaultWagmiConfig({
  chains,
  projectId,
  metadata,
  ssr: true,
  auth: {
    email: false, // default to true
    socials: [],
    showWallets: true, // default to true
    walletFeatures: true // default to true
  },
  storage: createStorage({
    storage: cookieStorage
  }),
})