import { useUserStore } from 'stores/user-store';
import { getEthereumCurrency } from 'utils/eth.utils';
import { useNetwork } from 'wagmi';

const useCurrencyEthereum = () => {
  const { chain } = useNetwork();
  return getEthereumCurrency(chain?.id);
};

const useCurrencySolana = () => {
  return 'SOL';
};

export const useCurrency = () => {
  const chainType = useUserStore((state) => state.chainType);
  return chainType === 'eth' ? useCurrencyEthereum() : useCurrencySolana();
};
