import { useEffect } from 'react';
import { useUserStore } from 'stores/user-store';
import { toAddress, useEthereumConfig } from 'utils/eth.utils';
import { useContractRead } from 'wagmi';
import { useAddress } from './useAddress';

const usePendingBetEthereum = () => {
  const { address } = useAddress();
  const cfg = useEthereumConfig();
  const { data, isLoading, error, refetch } = useContractRead({
    ...cfg,
    functionName: 'getPendingBet',
    args: address ? [toAddress(address || '')] : undefined,
    select: (bet: number) => bet,
    watch: true
  });

  return {
    bet: data,
    isLoading,
    error,
    refresh: refetch
  };
};

const usePendingBetSolana = () => {
  useEffect(() => {
    refresh();
  }, []);

  const refresh = async () => {
    void 0;
  };

  return {
    bet: 0,
    isLoading: false,
    error: null,
    refresh
  };
};

export const usePendingBet = () => {
  const chainType = useUserStore((state) => state.chainType);
  return chainType === 'eth' ? usePendingBetEthereum() : usePendingBetSolana();
};
