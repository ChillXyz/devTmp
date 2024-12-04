import { useState } from 'react';
import { useAccount, useBalance, useWriteContract, useChainId, useSwitchChain } from 'wagmi';
import { parseEther } from 'viem';
import { fantom } from 'wagmi/chains';
import Navbar from '../components/Navbar';
import { ConnectWallet } from '../components/ConnectWallet';
import backgroundImage from '../assets/images/Frame-961.svg';
import equalsIcon from '../assets/images/equals.png';
import vector1 from '../assets/images/Vector-1.svg';
import vector2 from '../assets/images/Vector-2.svg';
import vector from '../assets/images/Vector.svg';
import logo from '../assets/images/logowithoutbg.svg';
import presaleAbi from '../abi/presale.json';

// Constants
const HARDCAP = 90_000; // 90,000 FTM
const MAX_CONTRIBUTION = 1000; // 1,000 FTM
const CONTRACT_ADDRESS = '0x131F5AE1CBfEFe8EFbDf93dA23fa4d39F14a817c' as const;
const WHITELIST_START = new Date('2024-11-01T18:00:00Z');
const WHITELIST_END = new Date('2024-12-02T17:00:00Z');

const Froq = () => {
  const [inputAmount, setInputAmount] = useState<number>(0);
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { switchChainAsync } = useSwitchChain();
  
  const { data: balance } = useBalance({
    address,
    chainId: fantom.id,
  });

  const { writeContract, isPending } = useWriteContract();

  // const { data: totalRaisedBigInt } = useReadContract({
  //   address: CONTRACT_ADDRESS,
  //   abi: presaleAbi.abi,
  //   functionName: 'totalRaised',
  //   chainId: fantom.id,
  // });

  // Convert BigInt to number and format
  const totalRaised = 90000;
  
  // Calculate progress percentage (0-100)
  const progressPercentage = Math.min((totalRaised / HARDCAP) * 100, 100);

  const handleFrogMode = () => {
    if (!balance) return;
    
    // Convert balance to number and remove decimals
    const balanceNumber = Math.floor(Number(balance.formatted));
    
    // Set the input amount to either 1000 or the user's balance, whichever is smaller
    const maxAmount = Math.min(balanceNumber, MAX_CONTRIBUTION);
    setInputAmount(maxAmount);
  };

  const handleJoinPresale = async () => {
    if (!isConnected || inputAmount <= 0) return;

    try {
      // Check if we're on Fantom chain
      if (chainId !== fantom.id) {
        try {
          // Switch to Fantom chain if we're not on it
          await switchChainAsync({ chainId: fantom.id });
          // After switching, try to execute the transaction
          const now = new Date();
          const isWhitelistPeriod = now >= WHITELIST_START && now <= WHITELIST_END;

          writeContract({
            address: CONTRACT_ADDRESS,
            abi: presaleAbi.abi,
            functionName: isWhitelistPeriod ? 'contributeWhitelist' : 'contributePublic',
            args: [],
            value: parseEther(inputAmount.toString()),
          });
        } catch (switchError) {
          console.error('Failed to switch to Fantom chain:', switchError);
        }
        return;
      }

      // If already on Fantom chain, proceed with transaction
      const now = new Date();
      const isWhitelistPeriod = now >= WHITELIST_START && now <= WHITELIST_END;

      writeContract({
        address: CONTRACT_ADDRESS,
        abi: presaleAbi.abi,
        functionName: isWhitelistPeriod ? 'contributeWhitelist' : 'contributePublic',
        args: [],
        value: parseEther(inputAmount.toString()),
      });
    } catch (error) {
      console.error('Failed to join presale:', error);
    }
  };

  return (
    <div>
      <Navbar />
      <div className="section-froq-header">
        <div className="container-froq-header">
          <div className="flex-block-5">
            <h1 className="h2-projects align-left">$<span className="green">FROQ</span></h1>
            <p className="paragraph">Join Froqorion's next chapter by securing your $FROQ—the token powering our universe. </p>
            <p className="paragraph"> 💧 100% of funds raised go to liquidity for a strong and stable start. </p>
            <p className="paragraph">🕒 Whitelist: Dec 2, 5:45 PM UTC+1</p>
            <p className="paragraph">🕒 Public Sale: Dec 2, 6:00 PM UTC+1</p>
            <p className="paragraph"> 💰 Price: 1 $FROQ = 0.3 $FTM</p>
            <p className="paragraph">Don't miss your chance to be part of Froqorion's future!</p>
          </div>
          <div className="web3thingydesoputitinherewowpauseimeannvm">
            <div className="flex-block-6">
              <div className="subtitle">CURRENTLY RAISED</div>
              <div className="display">{totalRaised.toLocaleString()} <span className="green">$FTM</span></div>
            </div>
            <div className="ftm">
              <div 
                className="div-block-2" 
                style={{
                  width: `${progressPercentage}%`,
                  backgroundColor: '#14B951',
                  height: '100%',
                  borderRadius: '100vw',
                  transition: 'width 0.5s ease-in-out'
                }}
              ></div>
              <div className="subtitle hardcap">{HARDCAP.toLocaleString()} $FTM</div>
            </div>
            <div className="flex-block-9" style={{ display: 'flex', gap: '10px' }}>
              <button 
                onClick={handleFrogMode} 
                style={{ 
                  width: '8vw',
                  cursor: 'pointer', 
                  border: '1px solid #14B951',
                  background: '#14B951',
                  padding: '0.556vw',
                  borderRadius: '100vw',
                  color: 'black',
                  fontSize: '0.856vw',
                  fontFamily: 'inherit',
                  outline: 'none',
                  transition: 'all 0.3s ease',
                  textTransform: 'none',
                  boxShadow: 'none',
                  WebkitAppearance: 'none',
                  MozAppearance: 'none'
                }}
              >
                Frog mode
              </button>
              {isConnected && balance && (
                <div className="subtitle" style={{ color: '#14B951' }}>
                  {Number(balance.formatted).toLocaleString()} $FTM
                </div>
              )}
              <div className="flex-block-7">
                <div className="div-block" style={{ 
                  border: '1px solid #14B951',
                  borderRadius: '100vw',
                  padding: '1.111vw 1.111vw 1.111vw 2.222vw',
                  background: 'transparent',
                  width: '100%'
                }}>
                  <input
                    type="number"
                    value={inputAmount}
                    onChange={(e) => {
                      const value = Math.min(Number(e.target.value), MAX_CONTRIBUTION);
                      setInputAmount(value);
                    }}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#14B951',
                      fontSize: 'inherit',
                      fontFamily: 'inherit',
                      padding: 0,
                    }}
                    min="0"
                    max={MAX_CONTRIBUTION}
                  />
                  <div className="subtitle">$FTM</div>
                </div>
              </div>
              <ConnectWallet />
            </div>
          </div>
        </div>
      </div>
      <div className="section-contact">
        <div className="padding-global">
          <div className="container-contact">
            <div className="flex-block-4">
              <a href="https://discord.gg/cKxhykX5Yu" className="link-block-2">
                <img src={vector2} loading="lazy" alt="" className="image-5" />
              </a>
              <a href="https://x.com/Froqorion" className="link-block-2">
                <img src={vector} loading="lazy" alt="" className="image-5" />
              </a>
              <a href="https://t.me/froqorionportal" className="link-block-2">
                <img src={vector1} loading="lazy" alt="" className="image-5" />
              </a>
            </div>
            <img src={logo} loading="lazy" alt="" className="image" />
          </div>
        </div>
      </div>
      <img 
        src={backgroundImage} 
        alt="background" 
        className="image-4" 
      />
    </div>
  );
};

export default Froq;
