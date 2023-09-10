export const PRICE_PER_GAME = 0.001;
export const TIME_PER_ROUND = 5 * 60 * 1000; //7 * 24 * 60 * 60 * 1000

export const CHAINS_OPTIONS = [
  {
    value: 'eth',
    label: 'Optimism'
  },
  {
    value: 'solana',
    label: 'Solana'
  }
];

export const DICE_IMAGES: Record<number, any> = {
  1: require('images/dice/d1.png'),
  2: require('images/dice/d2.png'),
  3: require('images/dice/d3.png'),
  4: require('images/dice/d4.png'),
  5: require('images/dice/d5.png'),
  6: require('images/dice/d6.png')
};
