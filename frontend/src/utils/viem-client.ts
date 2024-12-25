import { createPublicClient, createWalletClient, custom } from 'viem';
import { sepolia } from 'viem/chains';

export const publicClient = createPublicClient({
    chain: sepolia,
    transport: custom(window.ethereum)
  });
  
  export const walletClient = createWalletClient({
    chain: sepolia,
    transport: custom(window.ethereum)
  });