import ReactDOM from 'react-dom/client';
import { LoginStateProvider } from './componenets/LoginStateContext';
import RoutesBrowser from './componenets/RoutesBrowser';
import { RecoilRoot } from 'recoil';
import './styles/index.css';

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
