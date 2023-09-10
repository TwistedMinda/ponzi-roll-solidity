import { useWallet } from '@solana/wallet-adapter-react';
import { useUserStore } from 'stores/user-store';
import { useEthereumConfig } from 'utils/eth.utils';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useClaimable } from './useClaimable';

const useClaimEthereum = () => {
  const { claimableAmount } = useClaimable();
  const cfg = useEthereumConfig();
  const { config } = usePrepareContractWrite({
    ...cfg,
    functionName: 'claim',
    enabled: (claimableAmount || 0) > 0
  });
  const { writeAsync, isLoading } = useContractWrite(config);
  const claim = async () => writeAsync?.();
  return {
    claim,
    isLoading
  };
};

const useClaimSolana = () => {
  const { publicKey } = useWallet();

  const claim = async () => {
    if (!publicKey) return;
  };
  return {
    claim,
    isLoading: false
  };
};

export const useClaim = () => {
  const chainType = useUserStore((state) => state.chainType);
  return chainType === 'eth' ? useClaimEthereum() : useClaimSolana();
};
