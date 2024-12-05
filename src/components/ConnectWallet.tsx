import { useAccount, useDisconnect } from 'wagmi';
import { WalletOptions } from './WalletOptions';
import { UnlinkIcon } from 'lucide-react';
import { useState } from 'react';

function truncateAddress(address: string) {
  return `${address.substring(0, 5)}...${address.substring(address.length - 4)}`;
}

function DisconnectButton() {
  const { address } = useAccount();
  const { disconnect } = useDisconnect();
  
  return (
    <div>
      <button
        className="whitespace-nowrap p-[1px] z-10 rounded-full bg-gradient-to-r from-[#14B951] to-[#14B951] group"
        onClick={() => disconnect()}
        title="Disconnect Wallet"
      >
        <div className="bg-black/85 py-2 px-7 rounded-full transition group-hover:bg-black/75 text-white flex items-center gap-2">
          <UnlinkIcon size={18} />
          {address && truncateAddress(address)}
        </div>
      </button>
    </div>
  );
}

export function ConnectWallet() {
  const { isConnected } = useAccount();
  const [isOpen, setIsOpen] = useState(false);

  if (isConnected) {
    return <DisconnectButton />;
  }

  return (
    <>
      <button
        className="whitespace-nowrap p-[1px] z-10 rounded-full bg-gradient-to-r from-[#14B951] to-[#14B951] group"
        onClick={() => setIsOpen(true)}
      >
        <div className="bg-black/85 py-2 px-7 rounded-full transition group-hover:bg-black/75 text-white">
          Connect Wallet
        </div>
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-black p-6 rounded-lg max-w-[425px] w-full mx-4">
            <div className="mb-4">
              <p className="text-gray-400">Choose your wallet of choice.</p>
            </div>
            <WalletOptions />
            <button
              onClick={() => setIsOpen(false)}
              className="mt-4 text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
} 