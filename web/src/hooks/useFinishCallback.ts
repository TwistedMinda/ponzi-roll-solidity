import { useUserStore } from 'stores/user-store';
import { fromBigNumber, useEthereumConfig } from 'utils/eth.utils';
import { useContractEvent } from 'wagmi';
import { useAddress } from './useAddress';

export type FinishCallback = (
  isWin: boolean,
  bet: number,
  dieResult: number
) => void;

const useFinishCallbackEthereum = (callback: FinishCallback) => {
  const { address } = useAddress();
  const cfg = useEthereumConfig();
  useContractEvent({
    ...cfg,
    eventName: 'GameEnded',
    listener(userAddress, isWin, bet, result) {
      if (userAddress === address) {
        const dieResult = fromBigNumber(result);
        const dieBet = fromBigNumber(bet);
        callback(isWin, dieBet, dieResult);
      }
    }
  });

  return null;
};

const useFinishCallbackSolana = (_callback: FinishCallback) => {
  return null;
};

export const useFinishCallback = (callback: FinishCallback) => {
  const chainType = useUserStore((state) => state.chainType);
  return chainType === 'eth'
    ? useFinishCallbackEthereum(callback)
    : useFinishCallbackSolana(callback);
};
