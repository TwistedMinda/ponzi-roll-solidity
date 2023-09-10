import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useModal } from 'connectkit';
import { useUserStore } from 'stores/user-store';
import { useDisconnect } from 'wagmi';

export const useWalletConnectEthereum = () => {
  const { disconnect } = useDisconnect();
  const { setOpen } = useModal();
  return {
    disconnect: () => {
      disconnect();
    },
    connect: () => {
      setOpen(true);
    }
  };
};
export const useWalletConnectSolana = () => {
  const { disconnect: disc } = useWallet();
  const { setVisible } = useWalletModal();
  return {
    disconnect: () => {
      disc();
    },
    connect: () => {
      setVisible(true);
    }
  };
};

export const useWalletConnect = () => {
  const chainType = useUserStore((state) => state.chainType);
  return chainType === 'eth'
    ? useWalletConnectEthereum()
    : useWalletConnectSolana();
};
