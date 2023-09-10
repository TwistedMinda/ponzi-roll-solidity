import { FaClock, FaGem, FaHashtag, FaStar, FaTrophy } from 'react-icons/fa';
import { useRoundInfo } from 'hooks/useRoundInfo';
import { useAccountInfo } from 'hooks/useAccountInfo';
import { useClaimable } from 'hooks/useClaimable';
import { useClaim } from 'hooks/useClaim';
import Card from 'components/Card';
import usePopup from 'hooks/usePopup';
import { PLAY_POPUP } from 'stores/popup-store';
import { useTools } from 'utils/common.utils';
import useCounter from 'hooks/useCounter';
import './Game.scss';
import { usePendingBet } from 'hooks/usePendingBet';
import { DICE_IMAGES } from 'constants/constants';

const Game = () => {
  const { show } = usePopup(PLAY_POPUP);
  const { showAmount } = useTools();
  const { currentRound, stats } = useRoundInfo();
  //const { balance = 0 } = useBalance()
  const { claim } = useClaim();
  const { claimableAmount } = useClaimable();
  const { accountInfo } = useAccountInfo();
  const { bet } = usePendingBet();
  const { remaining: counter } = useCounter();

  const claimable = claimableAmount || 0;
  const trophies = accountInfo?.nbShares || 0;
  const totalClaimed = stats?.totalClaimed || 0;
  const userTotalClaimed = accountInfo?.totalClaimed || 0;
  const currentRoundId = currentRound?.id || 0;
  const currentWinners = stats?.totalWinners || 0;
  const currentBenef = currentRound?.benefits || 0;
  const trophyValue =
    currentWinners === 0 ? currentBenef : currentBenef / currentWinners;
  const currentRewards = trophyValue * trophies;

  const averageByTrophy =
    currentWinners == 0 ? 0 : totalClaimed / currentWinners;

  return (
    <>
      <div className="mini-box-list">
        <div className="mini-box">
          <FaTrophy className="mini-box-icon" />
          <div className="mini-box-title">You have</div>
          <div className="mini-box-title">
            <span className="light">{trophies} trophies</span>
          </div>
        </div>

        <div className="mini-box">
          <FaStar className="mini-box-icon" />
          <div className="mini-box-title">You will earn</div>
          <div className="mini-box-title">
            <span className="light">{showAmount(currentRewards)}</span>
          </div>
        </div>

        <div className="mini-box">
          <FaGem className="mini-box-icon" />
          <div className="mini-box-title">You claimed</div>
          <div className="mini-box-title">
            <span className="light">{showAmount(userTotalClaimed)}</span>
          </div>
        </div>
      </div>

      {!!bet && (
        <Card
          className="top-space bot-space"
          onClick={show}
          walletHandlerIfNeeded
          active
        >
          <img src={DICE_IMAGES[bet]} className="pending-dice" /> Waiting your
          results... (up to 2mins)
        </Card>
      )}

      <Card
        className="top-space bot-space"
        onClick={show}
        walletHandlerIfNeeded
      >
        <FaTrophy className="text-icon" />
        {` Earn +1 trophy `}
        <FaTrophy className="text-icon" />
      </Card>

      <Card
        disabled={claimable <= 0}
        className="bot-space"
        onClick={claim}
        walletLabelIfNeeded
        walletHandlerIfNeeded
      >
        <FaStar className="text-icon" />
        {` Claim ${showAmount(claimable)} `}
        <FaStar className="text-icon" />
      </Card>

      <div className="box">
        <div className="box-section">
          <div className="box-section-title">Current round</div>
          <div className="box-row">
            <div className="box-title">Round n°</div>
            <div>
              {currentRoundId} <FaHashtag className="text-icon" />
            </div>
          </div>
          <div className="box-row">
            <div className="box-title">Ends in</div>
            <div>
              {counter} <FaClock className="text-icon" />
            </div>
          </div>
          <div className="box-row">
            <div className="box-title">Total trophies</div>
            <div>
              {currentWinners} <FaTrophy className="text-icon" />
            </div>
          </div>
          <div className="box-row">
            <div className="box-title">Total benefits</div>
            <div>{showAmount(currentBenef)}</div>
          </div>

          <div className="box-row">
            <div className="box-title">Trophy value</div>
            <div>
              <FaTrophy className="text-icon" /> = {showAmount(trophyValue)}
            </div>
          </div>
        </div>
      </div>

      <div className="box">
        <div className="box-section">
          <div className="box-section-title">Tokenomics</div>
          <div className="box-title box-subtitle">
            How are the benefits generated?
          </div>
          <div className="box-title box-text">
            {'All rewards come from the '}
            <span className="light">losers money</span>
            {', there is absolutely '}
            <span className="light">no fees</span>
            {' applied!'}
          </div>
        </div>
        <div className="box-section">
          <div className="box-title box-subtitle">What's a trophy worth?</div>
          <div className="box-title box-text">
            {"It's an "}
            <span className="light">equally distributed share</span>
            {' of all benefits, '}
            <span className="light">claimable weekly</span>
            {', and for a'}
            <span className="light"> lifetime</span>
          </div>
        </div>
      </div>

      <div className="box">
        <div className="box-section">
          <div className="box-section-title">You may ask</div>
          <div className="box-title box-subtitle">
            How successful is Ponzi Roll?
          </div>
          <div className="box-title box-text">
            {'During the last '}
            <span className="light">{currentRoundId} rounds</span>
            {', people have claimed a total of '}
            <span className="light">{showAmount(totalClaimed)}</span>
            {', and it is '}
            <span className="light">still going!</span>
          </div>
          <div className="box-title box-text">
            {'Average by trophy: '}
            <span className="light">{showAmount(averageByTrophy)}</span>
          </div>
        </div>
        <div className="box-section">
          <div className="box-title box-subtitle">Why you should try it?</div>
          <div className="box-title box-text">
            {"Because it's "}
            <span className="light">cheap</span>
            {', '}
            <span className="light">not time consuming</span>
            {', and anyway '}
            <span className="light">what do you have to lose?</span>
          </div>
        </div>
        <div className="box-section">
          <div className="box-title box-subtitle">Anything I should know?</div>
          <div className="box-title box-text">
            {'Yes, when your '}
            <span className="light">rewards</span>
            {' are available, '}
            <span className="light">don't forget</span>
            {' to '}
            <span className="light">claim</span>
            {', or they will be '}
            <span className="light">redistributed next round</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Game;
