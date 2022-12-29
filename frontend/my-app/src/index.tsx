import ReactDOM from 'react-dom/client';
import { LoginStateProvider } from './componenets/Login/LoginStateContext';
import RoutesBrowser from './componenets/RoutesBrowser';
import { RecoilRoot } from 'recoil';
import './styles/index.css';
import { UserStatusProvider } from './componenets/Login/UserStatusContext';
import { WebsocketProvider } from './componenets/Game/WebsocketContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
	<LoginStateProvider>
		<UserStatusProvider>
			<WebsocketProvider>
			<RecoilRoot>
				<RoutesBrowser />
			</RecoilRoot>
			</WebsocketProvider>
		</UserStatusProvider>
	</LoginStateProvider>
);
