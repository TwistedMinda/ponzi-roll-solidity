import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

require('dotenv').config()

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  networks: {
	optimismDev: {
		url: process.env.RPC_DEV_URL,
		accounts: [process.env.PRIVATE_KEY || ''],
	}
  },
  etherscan: {
    apiKey: {
      optimisticGoerli: process.env.ALCHEMY_DEV_KEY || '',
    }
  }
};

export default config;
 