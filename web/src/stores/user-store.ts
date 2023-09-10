import create from 'zustand';
import { persist } from 'zustand/middleware';

export type ChainType = 'eth' | 'solana';
export type UserStore = {
  name: string;
  setName: (_: string) => void;

  chainType: ChainType;
  setChainType: (_: ChainType) => void;
};
export const useUserStore = create(
  persist<UserStore>(
    (set) => ({
      name: 'Anonymous',
      chainType: 'eth',
      setName: (name: string) => set((_) => ({ name })),
      setChainType: (chainType: ChainType) => set((_) => ({ chainType }))
    }),
    {
      name: 'user-store',
      partialize: (state): any => ({ chainType: state.chainType })
    }
  )
);
