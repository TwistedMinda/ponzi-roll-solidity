import { FaBitcoin, FaHandshake, FaStar, FaTrophy } from 'react-icons/fa';
import './Whitepaper.scss';

const Whitepaper = () => {
  return (
    <div className="whitepaper-content">
      <div className="box">
        <div className="box-section">
          <div className="box-section-title">Synopsis</div>
          <div className="round-text">
            The idea is to experiment a <b>risk-free</b> ponzi scheme,
            featuring:
          </div>
          <div className="box-row">
            <div className="box-title">No money waste</div>
            <div>Ultra-cheap</div>
          </div>
          <div className="box-row">
            <div className="box-title">No time waste</div>
            <div>1 Claim/week</div>
          </div>
          <div className="box-row">
            <div className="box-title">No brainwash</div>
            <div>Simple tokenomics</div>
          </div>
          <div className="box-row">
            <div className="box-title">Playful</div>
            <div>Social experiment</div>
          </div>
        </div>

        <div className="box-section">
          <div className="box-section-title">Roll like a pro</div>
          <div className="round-text">
            Here is how you should use the Ponzi Roll:
          </div>

          <div className="box-row">
            <div className="box-title">
              Get trophies <FaTrophy className="text-icon" />
            </div>
            <div>At least 1</div>
          </div>
          <div className="box-row">
            <div className="box-title">Call out your friends</div>
            <div>At least 1</div>
          </div>
          <div className="box-row">
            <div className="box-title">
              Claim rewards weekly <FaStar className="text-icon" />
            </div>
            <div>Enjoy</div>
          </div>
        </div>

        <div className="box-section">
          <div className="box-section-title">Legend</div>
          <div className="box-row">
            <div className="box-title">
              Benefits <FaBitcoin className="text-icon" />
            </div>
            <div>Losers money</div>
          </div>
          <div className="box-row">
            <div className="box-title">
              Shareholders <FaHandshake className="text-icon" />
            </div>
            <div>Trophies holders</div>
          </div>
          <div className="box-row">
            <div className="box-title">
              Trophies <FaTrophy className="text-icon" />
            </div>
            <div>Your trophies</div>
          </div>
          <div className="box-row">
            <div className="box-title">
              Rewards <FaStar className="text-icon" />
            </div>
            <div>Your gains</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Whitepaper;
