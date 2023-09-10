import { createBrowserRouter } from 'react-router-dom';

import Root from './pages/Root';
import Error from './pages/Error';
import Game from './pages/Game';
import Whitepaper from 'pages/Whitepaper';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    errorElement: <Error />,
    children: [
      {
        path: '/',
        element: <Game />
      },
      {
        path: '/whitepaper',
        element: <Whitepaper />
      }
    ]
  }
]);
