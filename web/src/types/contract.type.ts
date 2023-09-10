import { fromBigNumber, toEther } from 'utils/eth.utils';

export type Stats = {
  totalWinners: number;
  totalClaimed: number;
  totalRolls: number;
};

export type CurrentRound = {
  id: number;
  benefits: number;
};

export type LastRound = {
  winners: number;
  benefits: number;
  totalClaimed: number;
  timestamp: number;
};

export type PlayerState = {
  lastClaimedRound: number;
  nbShares: number;
  totalClaimed: number;
};

export const filterAccountInfo = <ContractInput>(
  item: ContractInput
): PlayerState => {
  const accountInfo = item as any;
  return {
    lastClaimedRound: fromBigNumber(accountInfo.lastClaimedRound),
    nbShares: fromBigNumber(accountInfo.nbShares),
    totalClaimed: toEther(accountInfo.totalClaimed)
  };
};

export const filterStats = <ContractInput>(item: ContractInput): Stats => {
  const round = item as any;
  return {
    totalWinners: fromBigNumber(round.totalWinners),
    totalRolls: fromBigNumber(round.totalRolls),
    totalClaimed: toEther(round.totalClaimed)
  };
};

export const filterCurrentRound = <ContractInput>(
  item: ContractInput
): CurrentRound => {
  const round = item as any;
  return {
    id: fromBigNumber(round.id),
    benefits: toEther(round.benefits)
  };
};

export const filterLastRound = <ContractInput>(
  item: ContractInput
): LastRound => {
  const round = item as any;
  return {
    winners: fromBigNumber(round.winners),
    benefits: toEther(round.benefits),
    totalClaimed: toEther(round.totalClaimed),
    timestamp: fromBigNumber(round.timestamp)
  };
};
