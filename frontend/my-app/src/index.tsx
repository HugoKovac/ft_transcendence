import ReactDOM from 'react-dom/client';
import { LoginStateProvider } from './componenets/Login/LoginStateContext';
import RoutesBrowser from './componenets/RoutesBrowser';
import { RecoilRoot } from 'recoil';
import './styles/index.css';
import { WebsocketProvider } from './componenets/Game/WebsocketContext';
import { CustomiseProvider } from './componenets/Game/Private/CustomiseContext';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
	<LoginStateProvider>
		<CustomiseProvider>
			<RecoilRoot>
				<RoutesBrowser />
			</RecoilRoot>
		</CustomiseProvider>
	</LoginStateProvider>
);
