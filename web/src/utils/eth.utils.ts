import { CONTRACT_ADDRESS_FANTOM_DEV } from 'constants/addresses';
import Web3 from 'web3';
import { ethers } from 'ethers';
import { BigNumber } from 'ethers';
import { fantomTestnet } from 'wagmi/chains';
import { useNetwork } from 'wagmi';
import { CONTRACT_INTERFACE } from 'constants/EthereumABI';

const DEFAULT_ETH_CHAIN = fantomTestnet.id;

const web3 = new Web3(Web3.givenProvider);
export const eth = web3.eth;
export type EthereumAddress = `0x${string}`;

export const addrs: Record<number, Record<string, string>> = {
  [fantomTestnet.id]: {
    addr: CONTRACT_ADDRESS_FANTOM_DEV,
    currency: 'FTM'
  }
};
export const getEthereumCurrency = (type: number = DEFAULT_ETH_CHAIN) => {
  if (!addrs[type]) return addrs[DEFAULT_ETH_CHAIN].currency;
  return addrs[type].currency;
};
export const getEthereumAddress = (type: number = DEFAULT_ETH_CHAIN) => {
  if (!addrs[type]) return addrs[DEFAULT_ETH_CHAIN].addr;
  return addrs[type].addr;
};

export const toEther = (wei: string | BigNumber) => {
  const str = typeof wei === 'string' ? wei : wei.toString();
  return Number(ethers.utils.formatEther(str));
};

export const toAddress = (address: string) => {
  return ethers.utils.getAddress(address);
};

export const parseEther = (ether: string) => {
  return ethers.utils.parseEther(ether);
};

export const toBigNumber = (val: number) => {
  return BigNumber.from(val);
};
export const fromBigNumber = (val: BigNumber) => {
  return val.toNumber();
};

export const useEthereumConfig = () => {
  const { chain: currentChain } = useNetwork();
  return {
    address: getEthereumAddress(currentChain?.id),
    abi: CONTRACT_INTERFACE,
    enabled: !!addrs[currentChain?.id || 0]
  };
};
