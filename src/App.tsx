import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { http, createConfig, WagmiProvider } from 'wagmi';
import { fantom } from 'wagmi/chains';
import { injected, metaMask, walletConnect, coinbaseWallet } from 'wagmi/connectors';
import './assets/css/styles.css';
import Home from './pages/Home';
import Froq from './pages/Froq';
import BurnToMint from './pages/BurnToMint';

const projectId = '';

const config = createConfig({
  chains: [fantom],
  connectors: [
    injected(),
    walletConnect({ projectId }),
    metaMask(),
    coinbaseWallet(),
  ],
  transports: {
    [fantom.id]: http(fantom.rpcUrls.default.http[0]),
  },
  ssr: true,
});

const queryClient = new QueryClient();

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <div className="main-wrapper">
            <div className="radial-overlay" />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/froq" element={<Froq />} />
              <Route path="/burn-to-mint" element={<BurnToMint />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default App;
