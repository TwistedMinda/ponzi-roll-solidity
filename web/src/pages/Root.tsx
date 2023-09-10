import { Outlet } from 'react-router-dom';
import { useUserStore } from 'stores/user-store';
import { useEffect } from 'react';
import Header from 'components/Header';
import Environment from 'components/Environment';
import { FinishPopup } from 'popups/FinishPopup';
import PlayPopup from 'popups/PlayPopup';
import './Root.scss';

export default function Root() {
  const chainType = useUserStore((state) => state.chainType);
  /*
	const navigate = useNavigate()
	const location = useLocation()
	const isMatch = (loc: string) => {
		return loc === location.pathname
	}
	*/

  useEffect(() => {
    document.getElementById('above')?.classList.add('hidden');
  }, []);

  return (
    <div id="root-layout" key={chainType}>
      <div id="root-content">
        <Header />
        <Outlet />
        <Environment />
      </div>

      <PlayPopup />
      <FinishPopup />
    </div>
  );
}
