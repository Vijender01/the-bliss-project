import AppRouter from './router/AppRouter';
import InstallPWA from './components/InstallPWA';
import OfflineBanner from './components/OfflineBanner';
import './index.css';

export default function App() {
  return (
    <>
      <OfflineBanner />
      <AppRouter />
      <InstallPWA />
    </>
  );
}
