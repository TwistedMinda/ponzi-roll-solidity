import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';

require('dotenv').config();

const config: HardhatUserConfig = {
  solidity: '0.8.17',
  networks: {
    fantom: {
      url: process.env.FANTOM_DEV_URL,
      accounts: [process.env.PRIVATE_KEY || ''],
      gas: 2100000,
      gasPrice: 8000000000
    }
  },
  etherscan: {
    apiKey: {
      ftmTestnet: process.env.FANTOM_SCAN_KEY || ''
    }
  },
  mocha: {
    timeout: 100000000
  }
};

export default config;
