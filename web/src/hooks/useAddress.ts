import { useWallet } from '@solana/wallet-adapter-react';
import { useUserStore } from 'stores/user-store';
import { useAccount } from 'wagmi';

export const useAddressEthereum = () => {
  const { address } = useAccount();
  return { address };
};
export const useAddressSolana = () => {
  const { publicKey } = useWallet();
  return {
    address: publicKey?.toString()
  };
};

export const useAddress = () => {
  const chainType = useUserStore((state) => state.chainType);
  return chainType === 'eth' ? useAddressEthereum() : useAddressSolana();
};
