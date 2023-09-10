import { useEffect, useState } from 'react';
import { eth, toEther } from 'utils/eth.utils';
import { useAddress } from 'hooks/useAddress';
import { useNetwork } from 'wagmi';
import { useUserStore } from 'stores/user-store';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { toSol } from 'utils/solana.utils';
import { useFinishCallback } from './useFinishCallback';

const useBalanceEthereum = () => {
  const { address } = useAddress();
  const { chain } = useNetwork();
  const [balance, setBalance] = useState<number | undefined>(undefined);
  useFinishCallback((_) => {
    refresh();
  });

  const refresh = async () => {
    if (!address) return '0';
    const res = await eth.getBalance(address);
    setBalance(toEther(res));
  };

  useEffect(() => {
    if (address) refresh();
  }, [address, chain?.id]);

  return {
    balance,
    refresh
  };
};

const useBalanceSolana = () => {
  const { publicKey } = useWallet();
  const { connection } = useConnection();
  const [balance, setBalance] = useState<number | undefined>(undefined);

  const refresh = async () => {
    if (!publicKey) return '0';
    const res = await connection.getBalance(publicKey);
    setBalance(toSol(res));
  };

  useEffect(() => {
    if (publicKey) refresh();
  }, [publicKey]);

  return {
    balance,
    refresh
  };
};

export const useBalance = () => {
  const chainType = useUserStore((state) => state.chainType);
  return chainType === 'eth' ? useBalanceEthereum() : useBalanceSolana();
};
