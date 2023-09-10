import Card from 'components/Card';
import { DICE_IMAGES, PRICE_PER_GAME } from 'constants/constants';
import usePopup from 'hooks/usePopup';
import { FaHeart, FaTimes, FaTrophy } from 'react-icons/fa';
import Popup from 'reactjs-popup';
import 'reactjs-popup/dist/index.css';
import { FINISH_POPUP } from 'stores/popup-store';
import { useTools } from 'utils/common.utils';

export const FinishPopup = () => {
  const { showAmount } = useTools();
  const { shown, data, hide } = usePopup(FINISH_POPUP);
  const isWin = data.isWin || false;
  const dieResult = data.dieResult || 1;
  const dieBet = data.dieBet || 1;
  return (
    <Popup open={shown} onClose={hide}>
      <div className="box-section-title">
        {isWin ? 'Its a win!' : 'Its a loss!'}
      </div>
      <div className="box-row aligned">
        <div className="box-title">Result</div>
        <img className="die-img" src={DICE_IMAGES[dieResult]} />
      </div>
      <div className="box-row aligned">
        <div className="box-title">Your choice</div>
        <img className="die-img" src={DICE_IMAGES[dieBet]} />
      </div>
      <div className="box-row aligned">
        <div className="box-title">Cost</div>
        <div className="fail">{showAmount(-PRICE_PER_GAME)}</div>
      </div>
      {isWin && (
        <div className="box-row aligned">
          <div className="box-title align-right">Rewards</div>
          <div className="align-right success">
            <div>+{showAmount(PRICE_PER_GAME)}</div>
            <div style={{ marginTop: 8 }}>
              +1 <FaTrophy className="text-icon" />
            </div>
          </div>
        </div>
      )}
      <Card className="top-space" onClick={hide}>
        {isWin ? 'Enjoy your rewards' : 'Better luck next time'}{' '}
        <FaHeart className="text-icon" />
      </Card>
      <div className="popup-close" onClick={hide}>
        <FaTimes />
      </div>
    </Popup>
  );
};
