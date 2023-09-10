import { FaTrophy } from 'react-icons/fa';
import useCounter from 'hooks/useCounter';
import './Header.scss';
import { useRoundInfo } from 'hooks/useRoundInfo';
import { useTools } from 'utils/common.utils';

const Counter = () => {
  const { remaining, isEnded } = useCounter();
  return (
    <div className="counter col center small-gap">
      <div className="top-title">Next rewards in</div>
      <div>{remaining}</div>
      {isEnded && <div className="ended">Play to restart timer!</div>}
    </div>
  );
};
const Header = () => {
  const { currentRound, stats } = useRoundInfo();
  const { showAmount } = useTools();

  const currentWinners = stats?.totalWinners || 0;
  const currentBenef = currentRound?.benefits || 0;
  const trophyValue =
    currentWinners === 0 ? currentBenef : currentBenef / currentWinners;
  return (
    <div className="header col center">
      <Counter />

      <div className="top-formula row center">
        <FaTrophy className="formula-icon" />
        <span className="formula-icon-op important">=</span>
        <div className="row center">
          <b>{showAmount(trophyValue)}</b>
        </div>
      </div>
    </div>
  );
};

export default Header;
