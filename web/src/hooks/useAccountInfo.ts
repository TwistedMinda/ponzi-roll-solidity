import { useUserStore } from 'stores/user-store';
import { filterAccountInfo } from 'types/contract.type';
import { toAddress, useEthereumConfig } from 'utils/eth.utils';
import { useContractRead } from 'wagmi';
import { useAddress } from './useAddress';
import {
  getPlayerState,
  getProgram,
  getProvider
} from 'utils/solana.utils';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';
import { PlayerState } from 'types/contract.type';

const useAccountInfoEthereum = () => {
  const { address } = useAddress();
  const cfg = useEthereumConfig();
  const { data, isLoading, error, refetch } = useContractRead({
    ...cfg,
    functionName: 'players',
    args: address ? [toAddress(address)] : undefined,
    select: (data) => filterAccountInfo(data),
    watch: true
  });
  return {
    accountInfo: data,
    isLoading,
    error,
    refresh: refetch
  };
};

const useAccountInfoSolana = () => {
  const { connection } = useConnection();
  const wallet = useAnchorWallet();
  const [info, setInfo] = useState<PlayerState | null>(null);
  const refresh = async () => void 0;

  const createPlayer = async () => {
    if (!wallet) {
      return;
    }
    const program = getProgram(getProvider(connection, wallet));

    try {
      await getPlayerState(wallet.publicKey, program);
    } catch (e) {
      //await initPlayer(wallet.publicKey, program);
    }
    const player = await getPlayerState(wallet.publicKey, program);
    setInfo(player as PlayerState);
    console.log('created player', player.bet);
  };

  useEffect(() => {
    createPlayer();
  }, [wallet]);

  return {
    accountInfo: info,
    isLoading: false,
    error: null,
    refresh
  };
};

export const useAccountInfo = () => {
  const chainType = useUserStore((state) => state.chainType);
  return chainType === 'eth'
    ? useAccountInfoEthereum()
    : useAccountInfoSolana();
};
