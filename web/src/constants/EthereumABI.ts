export const CONTRACT_INTERFACE = [
  {
    inputs: [
      { internalType: 'address', name: 'randomizerAddress', type: 'address' }
    ],
    stateMutability: 'nonpayable',
    type: 'constructor'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'address',
        name: 'bidder',
        type: 'address'
      },
      { indexed: false, internalType: 'bool', name: 'win', type: 'bool' },
      { indexed: false, internalType: 'uint256', name: 'bet', type: 'uint256' },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'result',
        type: 'uint256'
      }
    ],
    name: 'GameEnded',
    type: 'event'
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: false,
        internalType: 'uint256',
        name: 'requestId',
        type: 'uint256'
      }
    ],
    name: 'RollStarted',
    type: 'event'
  },
  {
    inputs: [],
    name: 'claim',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [],
    name: 'currentRound',
    outputs: [
      { internalType: 'uint256', name: 'id', type: 'uint256' },
      { internalType: 'uint256', name: 'benefits', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [
      { internalType: 'uint256', name: 'requestId', type: 'uint256' },
      { internalType: 'uint256', name: 'dieResult', type: 'uint256' }
    ],
    name: 'diceRolled',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'player', type: 'address' }],
    name: 'getClaimableAmount',
    outputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: 'player', type: 'address' }],
    name: 'getPendingBet',
    outputs: [{ internalType: 'uint8', name: '', type: 'uint8' }],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'lastRound',
    outputs: [
      { internalType: 'uint256', name: 'winners', type: 'uint256' },
      { internalType: 'uint256', name: 'benefits', type: 'uint256' },
      { internalType: 'uint256', name: 'timestamp', type: 'uint256' },
      { internalType: 'uint256', name: 'totalClaimed', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint8', name: 'bet', type: 'uint8' }],
    name: 'play',
    outputs: [],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'address', name: '', type: 'address' }],
    name: 'players',
    outputs: [
      { internalType: 'uint256', name: 'lastClaimedRound', type: 'uint256' },
      { internalType: 'uint256', name: 'totalClaimed', type: 'uint256' },
      { internalType: 'uint256', name: 'nbShares', type: 'uint256' },
      { internalType: 'uint256', name: 'currentRoundShares', type: 'uint256' },
      { internalType: 'uint256', name: 'lastWinRound', type: 'uint256' },
      { internalType: 'uint256', name: 'payback', type: 'uint256' },
      { internalType: 'uint256', name: 'pendingRollId', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ internalType: 'uint256', name: '', type: 'uint256' }],
    name: 'rolls',
    outputs: [
      { internalType: 'bool', name: 'exists', type: 'bool' },
      { internalType: 'uint8', name: 'dieBet', type: 'uint8' },
      { internalType: 'address', name: 'player', type: 'address' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [],
    name: 'stats',
    outputs: [
      { internalType: 'uint256', name: 'totalClaimed', type: 'uint256' },
      { internalType: 'uint256', name: 'totalWinners', type: 'uint256' },
      { internalType: 'uint256', name: 'totalRolls', type: 'uint256' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const;
