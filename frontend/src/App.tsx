import { Provider } from 'react-redux';
import { store } from './app/store';
import AppRouter from './router';
import './index.css';

export default function App() {
  return (
    <Provider store={store}>
      <AppRouter />
    </Provider>
  );
}
