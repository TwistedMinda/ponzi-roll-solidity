import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require('dotenv').config()

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
	optimismGoerli: {
		url: process.env.OPTIMISM_DEV_URL,
		accounts: [process.env.PRIVATE_KEY || ''],
	},
	mumbai: {
		url: process.env.MUMBAI_DEV_URL,
		accounts: [process.env.PRIVATE_KEY || ''],
	},
	fantom: {
		url: process.env.FANTOM_DEV_URL,
		accounts: [process.env.PRIVATE_KEY || ''],
	}
  },
  etherscan: {
    apiKey: {
      optimisticGoerli: process.env.OPTIMISM_SCAN_KEY || '',
	  polygonMumbai: process.env.MUMBAI_SCAN_KEY || '',
	  fantomTestnet: process.env.FANTOM_SCAN_KEY || '',
    }
  }
};

export default config;
 