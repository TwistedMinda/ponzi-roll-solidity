export const networkConfig = {
  default: {
    name: 'hardhat',
    fee: '100000000000000000',
    keyHash:
      '0xd89b2bf150e3b9e13446986e571fb9cab24b13cea0a43ea20a6049a85cc807cc',
    jobId: '29fa9aa13bf1468788b7cc4a500a45b8',
    fundAmount: '100000000000000000000',
    automationUpdateInterval: '30'
  },
  4002: {
    name: 'Fantom',
    subscriptionId: 141,
    vrfCoordinator: '0xbd13f08b8352A3635218ab9418E340c60d6Eb418',
    keyHash:
      '0x121a143066e0f2f08b620784af77cccb35c6242460b4a8ee251b4b416abaebd4'
  }
};

export const developmentChains = ['hardhat', 'localhost'];
export const VERIFICATION_BLOCK_CONFIRMATIONS = 6;
