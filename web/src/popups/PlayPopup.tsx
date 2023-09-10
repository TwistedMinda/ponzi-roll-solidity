import { useEffect, useState } from 'react';
import { usePlay } from 'hooks/usePlay';
import { useBalance } from 'hooks/useBalance';
import { FaTimes, FaTrophy } from 'react-icons/fa';
import { DICE_IMAGES, PRICE_PER_GAME } from 'constants/constants';
import { useFinishCallback } from 'hooks/useFinishCallback';
import { FINISH_POPUP, PLAY_POPUP } from 'stores/popup-store';
import Card from 'components/Card';
import usePopup from 'hooks/usePopup';
import Popup from 'reactjs-popup';
import './PlayPopup.scss';
import { useTools } from 'utils/common.utils';

const PlayPopup = () => {
  const { showAmount } = useTools();
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(1);
  const { join, isLoading: enrolling } = usePlay(value);
  const { balance } = useBalance();
  const { shown, hide: hidePlay } = usePopup(PLAY_POPUP);
  const { show: showFinish } = usePopup(FINISH_POPUP);

  useFinishCallback((isWin, dieBet, dieResult) => {
    hidePlay();
    showFinish({ isWin, dieBet, dieResult });
  });

  useEffect(() => {
    if (shown) setLoading(false);
  }, [shown]);

  const pay = async () => {
    setLoading(true);
    try {
      await join();
    } catch (err: any) {
      setLoading(false);
    }
  };

  const next = () => {
    if (value === 6) setValue(1);
    else setValue(value + 1);
  };

  const canPay = () => {
    if (!balance) return false;
    return balance > PRICE_PER_GAME;
  };

  return (
    <Popup open={shown} onClose={hidePlay}>
      <div className="slider">
        <div className="box-section-title popup-title">Play now</div>
        <div className="box-row">
          <div className="box-title">Entry price</div>
          <div className="fail">{showAmount(-PRICE_PER_GAME)}</div>
        </div>

        <div className="box-row">
          <div className="box-title">Cash price</div>
          <div className="align-right success">
            <div>+{showAmount(PRICE_PER_GAME)}</div>
            <div style={{ marginTop: 8 }}>
              +1 <FaTrophy className="text-icon" />
            </div>
          </div>
        </div>

        <div className="box-row slider-row" onClick={next}>
          <div className="box-title">
            <div>Your prediction</div>
            <div className="note">Click to turn!</div>
          </div>
          <img className="die-img" src={DICE_IMAGES[value]} />
        </div>

        <Card
          className="top-space"
          disabled={loading || enrolling || !canPay()}
          onClick={pay}
        >
          {enrolling
            ? 'Confirm your transaction'
            : loading
            ? 'Checking your prediction...'
            : "I know I'm right 🔮"}
        </Card>
      </div>
      <div className="popup-close" onClick={hidePlay}>
        <FaTimes />
      </div>
    </Popup>
  );
};

export default PlayPopup;
