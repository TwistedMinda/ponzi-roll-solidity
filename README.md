## Whitepaper

### Goal

The goal is to make a Ponzi Game that will both give ultra-low rewards but also ultra-low risks, especially for new-comers.

### Rules

Entry price: Rolling the die is 0.001 ETH.

If you lose, you are feeding the Ponzi.
If you win, you earn a lifetime share of the losers money.

Rewards formula is as follow:

1. Current Round Benefits = [Current Round Losers] x [Entry Price]
2. Single Share Value = [Current Round Benefits] / [Total Winners]
3. Rewards = [Single Share Value] x [Number of Shares]

**Note**: A round lasts 1 week. After 1 week elapsed since start of the round, the first to play is responsible to trigger the logic that starts the new round. Meaning the claiming timing window shifts over time.

**Note 2**: Rewards that are not claimed are automatically redistributed to the next round, meaning users who stop coming are not using their share.

**Note 3**: Pending rewards are automatically claimed if a users plays.