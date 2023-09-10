import { useEffect } from 'react';
import { useUserStore } from 'stores/user-store';
import { toAddress, toEther, useEthereumConfig } from 'utils/eth.utils';
import { useContractRead } from 'wagmi';
import { useAddress } from './useAddress';

const useClaimableEthereum = () => {
  const { address } = useAddress();
  const cfg = useEthereumConfig();
  const { data, isLoading, error, refetch } = useContractRead({
    ...cfg,
    functionName: 'getClaimableAmount',
    args: address ? [toAddress(address || '')] : undefined,
    select: (data) => toEther(data),
    watch: true
  });

  return {
    claimableAmount: data,
    isLoading,
    error,
    refresh: refetch
  };
};

const useClaimableSolana = () => {
  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    void 0;
  };

  return {
    claimableAmount: null,
    isLoading: false,
    error: null,
    refresh
  };
};

export const useClaimable = () => {
  const chainType = useUserStore((state) => state.chainType);
  return chainType === 'eth' ? useClaimableEthereum() : useClaimableSolana();
};
