import { PRICE_PER_GAME } from 'constants/constants';
import { useUserStore } from 'stores/user-store';
import {
  EthereumAddress,
  parseEther,
  useEthereumConfig
} from 'utils/eth.utils';
import { useContractWrite, usePrepareContractWrite } from 'wagmi';
import { useAddress } from './useAddress';
import { useAnchorWallet } from '@solana/wallet-adapter-react';

const usePlaySolana = (_bet: number) => {
  const wallet = useAnchorWallet();

  const join = async () => {
    if (!wallet) {
      return;
    }
  };

  return {
    join,
    isLoading: false
  };
};

export const usePlayEthereum = (bet: number) => {
  const { address } = useAddress();
  const cfg = useEthereumConfig();
  const { config } = usePrepareContractWrite({
    ...cfg,
    functionName: 'play',
    args: [bet],
    overrides: {
      from: address as EthereumAddress,
      value: parseEther(PRICE_PER_GAME.toString())
    }
  });
  const { writeAsync, isLoading } = useContractWrite(config);
  const join = async () => writeAsync?.();
  return {
    join,
    isLoading
  };
};

export const usePlay = (bet: number) => {
  const chainType = useUserStore((state) => state.chainType);
  return chainType === 'eth' ? usePlayEthereum(bet) : usePlaySolana(bet);
};
