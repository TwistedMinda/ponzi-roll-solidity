import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { useUserStore } from 'stores/user-store';
import {
  CurrentRound,
  filterCurrentRound,
  filterLastRound,
  filterStats
} from 'types/contract.type';
import { useEthereumConfig } from 'utils/eth.utils';
import {
  getCurrentRound,
  getProgram,
  getProvider,
  initAppState
} from 'utils/solana.utils';
import { useContractRead } from 'wagmi';

const useRoundInfoEthereum = () => {
  const cfg = useEthereumConfig();
  const {
    data: currentRound,
    isLoading,
    error,
    refetch: refetchCurrent
  } = useContractRead({
    ...cfg,
    functionName: 'currentRound',
    select: (data) => filterCurrentRound(data),
    watch: true
  });
  const { data: lastRound, refetch: refetchLast } = useContractRead({
    ...cfg,
    functionName: 'lastRound',
    select: (data) => filterLastRound(data),
    watch: true
  });
  const { data: stats, refetch: refetchStats } = useContractRead({
    ...cfg,
    functionName: 'stats',
    select: (data) => filterStats(data),
    watch: true
  });
  return {
    currentRound,
    lastRound,
    stats,
    isLoading,
    error,
    refresh: () => {
      refetchCurrent();
      refetchLast();
      refetchStats();
    }
  };
};

const useRoundInfoSolana = () => {
  const refresh = async () => void 0;
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [currentRound, setCurrentRound] = useState<CurrentRound | null>(null);

  const _createAppState = async () => {
    if (!wallet) {
      return;
    }
    const program = getProgram(getProvider(connection, wallet));

    try {
      const current = await getCurrentRound(program);
      console.log('get', current.id);
    } catch (e) {
      await initAppState(wallet.publicKey, program);
    }
    const current = await getCurrentRound(program);
    console.log('created', current.id);
    setCurrentRound(current as CurrentRound);
  };
  useEffect(() => {
    //createAppState()
  }, [wallet]);
  return {
    currentRound: currentRound,
    lastRound: null,
    stats: null,
    isLoading: false,
    error: null,
    refresh
  };
};

export const useRoundInfo = () => {
  const chainType = useUserStore((state) => state.chainType);
  return chainType === 'eth' ? useRoundInfoEthereum() : useRoundInfoSolana();
};
