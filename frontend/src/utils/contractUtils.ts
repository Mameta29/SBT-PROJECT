import { Address, Abi } from 'viem';
import contractABI from '../contracts/SoulboundToken.json';

export const CONTRACT_ADDRESS: Address = '0x4BcFb3C8687EAe61deCA1d6fD5d24E141Bb8DFf0';

export function getContractABI(): Abi {
  return contractABI.abi as Abi;
}

export const contractConfig = {
  address: CONTRACT_ADDRESS,
  abi: getContractABI(),
} as const;