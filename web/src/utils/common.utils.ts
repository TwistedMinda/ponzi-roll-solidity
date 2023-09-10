import { useCurrency } from 'hooks/useCurrency';

export const useTools = () => {
  const currency = useCurrency();

  const showAmount = (value: number) => {
    return `${value.toFixed(6)} ${currency}`;
  };
  return {
    showAmount
  };
};
