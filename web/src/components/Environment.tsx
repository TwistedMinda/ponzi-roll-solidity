import { useUserStore } from 'stores/user-store';
import { FaDice, FaGithub } from 'react-icons/fa';
import { useAddress } from 'hooks/useAddress';
import { useWalletConnect } from 'hooks/useWalletConnect';
import Button from 'components/Button';
import Select from 'components/Select';
import { CHAINS_OPTIONS } from 'constants/constants';
import './Environment.scss';

const Environment = () => {
  const { address } = useAddress();
  const { connect, disconnect } = useWalletConnect();
  const chainType = useUserStore((state) => state.chainType);
  const setChainType = useUserStore((state) => state.setChainType);

  return (
    <div className="environment">
      <div className="box">
        <div className="box-section-title">Environment</div>
        <div className="box-row env-info">
          <div className="box-title">Project name</div>
          <div>
            <a
              className="source-link"
              target={'_blank'}
              href="https://github.com/TwistedMinda/RollTheDice-front"
            >
              <FaDice className="text-icon" /> Ponzi Roll{' '}
              <FaDice className="flip text-icon" />
            </a>
          </div>
        </div>
        <div className="box-row env-info">
          <div className="box-title">Source & Whitepaper</div>
          <div>
            <a
              className="source-link"
              target={'_blank'}
              href="https://github.com/TwistedMinda/RollTheDice-front"
            >
              <FaGithub className="text-icon" /> Github
            </a>
          </div>
        </div>
        <div className="box-row env-info">
          <div className="box-title">Select your chain</div>
          <Select
            options={CHAINS_OPTIONS}
            value={chainType}
            onChange={setChainType}
          />
        </div>
        <div className="box-row env-info">
          <div className="box-title">Manage your wallet</div>
          <div>
            <Button onClick={address ? disconnect : connect}>
              {address ? 'Logout 👋' : 'Connect 🚀'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Environment;
