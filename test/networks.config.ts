export const networkConfig = {
    default: {
        name: "hardhat",
        fee: "100000000000000000",
        keyHash: "0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc",
        jobId: "29fa9aa13bf1468788b7cc4a500a45b8",
        fundAmount: "100000000000000000000",
        automationUpdateInterval: "30",
    },
	80001: {
		name: "polygon mumbai",
		subscriptionId: 2831,
        linkToken: "0x326C977E6efc84E512bB9C30f76E30c160eD06FB",
        vrfCoordinator: "0x8C7382F9D8f56b33781fE506E897a4F1e2d17255",
        keyHash: "0x6e75b569a01ef56d18cab6a8e71e6600d6ce853834d4a5748b720d06f878b3a4",
	},
    137: {
        name: "polygon",
        linkToken: "0xb0897686c545045afc77cf20ec7a532e3120e0f1",
        ethUsdPriceFeed: "0xF9680D99D6C9589e2a93a78A04A279e509205945",
        oracle: "0x0a31078cd57d23bf9e8e8f1ba78356ca2090569e",
        jobId: "12b86114fa9e46bab3ca436f88e1a912",
        fee: "100000000000000",
        fundAmount: "100000000000000",
    },
}

export const developmentChains = ["hardhat", "localhost"]
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6