import ReactDOM from 'react-dom/client';
import { LoginStateProvider } from './componenets/Login/LoginStateContext';
import RoutesBrowser from './componenets/RoutesBrowser';
import { RecoilRoot } from 'recoil';
import './styles/index.css';
import { WebsocketProvider } from './componenets/Game/WebsocketContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
	<LoginStateProvider>
			<RecoilRoot>
				<RoutesBrowser />
			</RecoilRoot>
	</LoginStateProvider>
);
