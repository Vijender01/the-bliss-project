import AppRouter from './router/AppRouter';
import InstallPWA from './components/InstallPWA';
import './index.css';

export default function App() {
  return (
    <>
      <AppRouter />
      <InstallPWA />
    </>
  );
}
