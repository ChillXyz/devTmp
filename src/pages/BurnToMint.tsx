import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
import { useAccount, useWriteContract, useContractReads } from 'wagmi';
import { ConnectButton } from '@rainbow-me/rainbowkit';
import Navbar from '../components/Navbar';
import '../assets/css/burn-to-mint.css';

// ERC721 ABI for tokenOfOwnerByIndex, tokenURI, setApprovalForAll, and isApprovedForAll functions
const erc721ABI = [
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "index",
        "type": "uint256"
      }
    ],
    "name": "tokenOfOwnerByIndex",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      }
    ],
    "name": "balanceOf",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "to",
        "type": "address"
      },
      {
        "internalType": "bool",
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "setApprovalForAll",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "owner",
        "type": "address"
      },
      {
        "internalType": "address",
        "name": "operator",
        "type": "address"
      }
    ],
    "name": "isApprovedForAll",
    "outputs": [
      {
        "internalType": "bool",
        "name": "",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

interface NFT {
  id: string;
  image: string;
  tokenId: number;
}

const FANTOM_FROG_ADDRESS = '0xa70aa1f9da387b815facd5b823f284f15ec73884' as const;
const TINY_FROGS_ADDRESS = '0x7e6eef5388261973b0a1aa14e1ca5bbb11cc9a90' as const;
const FROG_BURNER_ADDRESS = '0x16BDf5c8395c3CBBBa559Cd1A7beA668c23B7c33' as const;

const BurnToMint = () => {
//   const navigate = useNavigate();
  const { address } = useAccount();
  const [selectedFrogs, setSelectedFrogs] = useState<string[]>([]);
  const [fantomFrogFamily, setFantomFrogFamily] = useState<NFT[]>([]);
  const [tinyFrogs, setTinyFrogs] = useState<NFT[]>([]);
  const [isLoadingFFF, setIsLoadingFFF] = useState(true);
  const [isLoadingTiny, setIsLoadingTiny] = useState(true);
  const [errorFFF, setErrorFFF] = useState<string | null>(null);
  const [errorTiny, setErrorTiny] = useState<string | null>(null);
  const [isApprovedFFF, setIsApprovedFFF] = useState(false);
  const [isApprovedTiny, setIsApprovedTiny] = useState(false);
  const [isApprovingFFF, setIsApprovingFFF] = useState(false);
  const [isApprovingTiny, setIsApprovingTiny] = useState(false);
  
  const { writeContract} = useWriteContract();

  // Create contract config for balance checks
  const { data: balanceData } = useContractReads({
    contracts: [
      {
        address: FANTOM_FROG_ADDRESS,
        abi: erc721ABI,
        functionName: 'balanceOf',
        args: [address!],
      },
      {
        address: TINY_FROGS_ADDRESS,
        abi: erc721ABI,
        functionName: 'balanceOf',
        args: [address!],
      }
    ],
    query: {
      enabled: !!address,
    }
  });

  // Check approvals
  const { data: approvalData } = useContractReads({
    contracts: [
      {
        address: FANTOM_FROG_ADDRESS,
        abi: erc721ABI,
        functionName: 'isApprovedForAll',
        args: [address!, FROG_BURNER_ADDRESS],
      },
      {
        address: TINY_FROGS_ADDRESS,
        abi: erc721ABI,
        functionName: 'isApprovedForAll',
        args: [address!, FROG_BURNER_ADDRESS],
      }
    ],
    query: {
      enabled: !!address,
    }
  });

  // Update approval states when data changes
  useEffect(() => {
    if (approvalData) {
      setIsApprovedFFF(!!approvalData[0]?.result);
      setIsApprovedTiny(!!approvalData[1]?.result);
    }
  }, [approvalData]);

  // Handle approvals
  const handleApproveFFF = async () => {
    if (!address) return;
    setIsApprovingFFF(true);
    try {
      await writeContract({
        address: FANTOM_FROG_ADDRESS,
        abi: erc721ABI,
        functionName: 'setApprovalForAll',
        args: [FROG_BURNER_ADDRESS, true],
      });
      setIsApprovedFFF(true);
    } catch (error) {
      console.error('Error approving FFF:', error);
      setErrorFFF('Failed to approve FFF collection');
    } finally {
      setIsApprovingFFF(false);
    }
  };

  const handleApproveTiny = async () => {
    if (!address) return;
    setIsApprovingTiny(true);
    try {
      await writeContract({
        address: TINY_FROGS_ADDRESS,
        abi: erc721ABI,
        functionName: 'setApprovalForAll',
        args: [FROG_BURNER_ADDRESS, true],
      });
      setIsApprovedTiny(true);
    } catch (error) {
      console.error('Error approving Tiny Frogs:', error);
      setErrorTiny('Failed to approve Tiny Frogs collection');
    } finally {
      setIsApprovingTiny(false);
    }
  };

  // Fetch NFTs when balance is available
  useEffect(() => {
    const fetchNFTs = async (
      contractAddress: string, 
      balance: number, 
      prefix: string,
      folderName: string,
      setNFTs: (nfts: NFT[]) => void,
      setError: (error: string | null) => void,
      setLoading: (loading: boolean) => void
    ) => {
      try {
        const nfts: NFT[] = [];
        const BATCH_SIZE = 5; // Process 5 tokens at a time

        // Process tokens in batches
        for (let batchStart = 0; batchStart < balance; batchStart += BATCH_SIZE) {
          const batchEnd = Math.min(batchStart + BATCH_SIZE, balance);
          
          // Create batch of contract calls
          const tokenIndexCalls = Array.from(
            { length: batchEnd - batchStart }, 
            (_, i) => {
              const currentIndex = batchStart + i;
              // Encode the function signature: tokenOfOwnerByIndex(address,uint256)
              const functionSelector = '0x2f745c59';
              // Pad address to 32 bytes (remove 0x and pad to 64 chars with leading zeros)
              const paddedAddress = address!.slice(2).toLowerCase().padStart(64, '0');
              // Pad index to 32 bytes (convert to hex without 0x, pad to 64 chars with leading zeros)
              const paddedIndex = currentIndex.toString(16).padStart(64, '0');
              
              return {
                jsonrpc: '2.0',
                id: currentIndex,
                method: 'eth_call',
                params: [{
                  to: contractAddress,
                  data: `${functionSelector}${paddedAddress}${paddedIndex}`
                }, 'latest']
              };
            }
          );

          // Fetch token IDs for this batch
          const tokenIdsResponse = await fetch('https://rpc.ftm.tools/', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(tokenIndexCalls),
          });

          const tokenIdsData = await tokenIdsResponse.json();
          console.log('Token IDs response:', tokenIdsData);

          // Process the batch results
          if (!Array.isArray(tokenIdsData)) {
            console.error('Invalid response format:', tokenIdsData);
            throw new Error('Invalid response format from RPC');
          }

          const batchTokenIds = tokenIdsData
            .filter(result => result && result.result && !result.error)
            .map((result: { result: string }) => {
              const hexValue = result.result;
              if (!hexValue || hexValue === '0x') {
                console.warn('Invalid hex value:', hexValue);
                return null;
              }
              try {
                const tokenId = parseInt(hexValue.slice(2), 16);
                console.log('Parsed token ID:', tokenId);
                return tokenId;
              } catch (error) {
                console.warn('Failed to parse hex value:', hexValue, error);
                return null;
              }
            })
            .filter((id): id is number => id !== null && !isNaN(id));

          // Add the batch results to the NFTs array
          nfts.push(...batchTokenIds.map((tokenId: number) => ({
            id: `${prefix}-${tokenId}`,
            image: `/nfts/${folderName}/${tokenId}.png`,
            tokenId
          })));

          // Add a small delay between batches to avoid rate limiting
          await new Promise(resolve => setTimeout(resolve, 100));
        }

        console.log('All parsed token IDs:', nfts.map(nft => nft.tokenId));

        if (nfts.length === 0 && balance > 0) {
          setError('No NFTs found in your wallet.');
        } else {
          setError(null);
        }

        setNFTs(nfts);
      } catch (error) {
        console.error('Error fetching NFTs:', error);
        setError('Failed to load NFTs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const init = async () => {
      if (!address || !balanceData) return;

      console.log('Balance data:', balanceData);

      // Fetch Fantom Frog Family NFTs
      const fffBalance = Number(balanceData[0].result || 0);
      console.log('FFF Balance:', fffBalance);
      
      if (fffBalance > 0) {
        setIsLoadingFFF(true);
        await fetchNFTs(
          FANTOM_FROG_ADDRESS,
          fffBalance,
          'fff',
          'fantom-frog-family',
          setFantomFrogFamily,
          setErrorFFF,
          setIsLoadingFFF
        );
      } else {
        setFantomFrogFamily([]);
        setIsLoadingFFF(false);
      }

      // Fetch Tiny Frogs NFTs
      const tinyBalance = Number(balanceData[1].result || 0);
      console.log('Tiny Balance:', tinyBalance);
      
      if (tinyBalance > 0) {
        setIsLoadingTiny(true);
        await fetchNFTs(
          TINY_FROGS_ADDRESS,
          tinyBalance,
          'tiny',
          'tiny-frogs',
          setTinyFrogs,
          setErrorTiny,
          setIsLoadingTiny
        );
      } else {
        setTinyFrogs([]);
        setIsLoadingTiny(false);
      }
    };

    init();
  }, [address, balanceData]);

  const handleSelectAll = () => {
    const allFrogIds = [...fantomFrogFamily, ...tinyFrogs].map(frog => frog.id);
    setSelectedFrogs(prevSelected => 
      prevSelected.length === allFrogIds.length ? [] : allFrogIds
    );
  };

  const handleSelect = (id: string) => {
    setSelectedFrogs(prev => 
      prev.includes(id) 
        ? prev.filter(frogId => frogId !== id)
        : [...prev, id]
    );
  };

  // Helper function to check if all selected collections are approved
  const isApprovedForSelected = () => {
    const hasFFF = selectedFrogs.some(id => id.startsWith('fff-'));
    const hasTiny = selectedFrogs.some(id => id.startsWith('tiny-'));
    
    if (hasFFF && !isApprovedFFF) return false;
    if (hasTiny && !isApprovedTiny) return false;
    
    return true;
  };

  // Handle burning
  const handleBurn = async () => {
    if (!address || !isApprovedForSelected()) return;
    
    try {
      const fffTokenIds = selectedFrogs
        .filter(id => id.startsWith('fff-'))
        .map(id => BigInt(parseInt(id.split('-')[1])));
      
      const tinyTokenIds = selectedFrogs
        .filter(id => id.startsWith('tiny-'))
        .map(id => BigInt(parseInt(id.split('-')[1])));

      writeContract({
        address: FROG_BURNER_ADDRESS,
        abi: [
          {
            inputs: [
              {
                internalType: "uint256[]",
                name: "fffTokenIds",
                type: "uint256[]"
              },
              {
                internalType: "uint256[]",
                name: "tinyTokenIds",
                type: "uint256[]"
              }
            ],
            name: "burnFrogs",
            outputs: [],
            stateMutability: "nonpayable",
            type: "function"
          }
        ],
        functionName: 'burnFrogs',
        args: [fffTokenIds, tinyTokenIds]
      });

      // Reset selections and refresh NFT lists
      setSelectedFrogs([]);
      // Trigger NFT list refresh...
    } catch (error) {
      console.error('Error burning frogs:', error);
      setErrorFFF('Failed to burn frogs');
    }
  };

  return (
    <>
      <Navbar />
      <div className="section-froq-header">
        <div className="padding-global">
          <div className="container-froq-header">
            <div className="w-layout-vflex flex-block-5">
              <h1 className="h2-projects align-left">
                <span className="red">Burn</span>
                <br />
                to <span className="green">mint</span>
              </h1>
              <p className="paragraph">
                The Burn-to-Mint Event is here! Burn your Fantom Frog Family or Tinyfrog NFTs and receive $FROQ,
                the token powering Froqorion's universe.
              </p>
            </div>

            <div className="w-layout-vflex web3thingydesoputitinherewowpauseimeannvm">
              <div className="w-layout-vflex flex-block-6">
                <div className="subtitle" style={{ fontSize: '1.2vw' }}>
                  BURN <span className="green">FROGS</span> FOR <span className="green">$FROQ</span>
                </div>
                <ConnectButton.Custom>
                  {({
                    account,
                    chain,
                    openConnectModal,
                    openAccountModal,
                    mounted,
                  }) => {
                    const connected = mounted && account && chain;

                    return (
                      <div
                        {...(!mounted && {
                          'aria-hidden': true,
                          style: {
                            opacity: 0,
                            pointerEvents: 'none',
                            userSelect: 'none',
                          },
                        })}
                        onClick={connected ? openAccountModal : openConnectModal}
                        className="connectwallet"
                        style={{ cursor: 'pointer' }}
                      >
                        <div className="body-text black">
                          {connected ? account.displayName : 'Connect wallet'}
                        </div>
                      </div>
                    );
                  }}
                </ConnectButton.Custom>
              </div>

              {/* Fantom Frog Family Section */}
              <div className="w-layout-hflex flex-block-10">
                <p className="paragraph" style={{ color: '#fff', marginBottom: '1vw' }}>
                  Fantom Frog Family {isLoadingFFF ? '(Loading...)' : errorFFF ? `(${errorFFF})` : ''}
                </p>
                <div className="div-block-3"></div>
                <div className="w-layout-vflex" style={{ gap: '1vw' }}>
                  <div className="w-layout-hflex flex-block-12">
                    {fantomFrogFamily.map((frog) => (
                      <button
                        key={frog.id}
                        className={`w-inline-block ${selectedFrogs.includes(frog.id) ? 'selected' : ''}`}
                        onClick={() => handleSelect(frog.id)}
                      >
                        <img src={frog.image} loading="lazy" alt={`Frog #${frog.tokenId}`} className="image-8" />
                      </button>
                    ))}
                  </div>
                  {address && !isApprovedFFF && selectedFrogs.some(id => id.startsWith('fff-')) && (
                    <button
                      onClick={handleApproveFFF}
                      disabled={isApprovingFFF}
                      style={{
                        background: '#14B951',
                        color: 'black',
                        border: 'none',
                        padding: '0.5vw 1vw',
                        borderRadius: '100vw',
                        cursor: isApprovingFFF ? 'wait' : 'pointer',
                        alignSelf: 'center'
                      }}
                    >
                      {isApprovingFFF ? 'Approving...' : 'Approve Fantom Frog Family'}
                    </button>
                  )}
                </div>
              </div>

              {/* Tiny Frogs Section */}
              <div className="w-layout-hflex flex-block-10">
                <p className="paragraph" style={{ color: '#fff', marginBottom: '1vw' }}>
                  tinyfrogs {isLoadingTiny ? '(Loading...)' : errorTiny ? `(${errorTiny})` : ''}
                </p>
                <div className="div-block-3"></div>
                <div className="w-layout-vflex" style={{ gap: '1vw' }}>
                  <div className="w-layout-hflex flex-block-12">
                    {tinyFrogs.map((frog) => (
                      <button
                        key={frog.id}
                        className={`w-inline-block ${selectedFrogs.includes(frog.id) ? 'selected' : ''}`}
                        onClick={() => handleSelect(frog.id)}
                      >
                        <img src={frog.image} loading="lazy" alt={`Frog #${frog.tokenId}`} className="image-8" />
                      </button>
                    ))}
                  </div>
                  {address && !isApprovedTiny && selectedFrogs.some(id => id.startsWith('tiny-')) && (
                    <button
                      onClick={handleApproveTiny}
                      disabled={isApprovingTiny}
                      style={{
                        background: '#14B951',
                        color: 'black',
                        border: 'none',
                        padding: '0.5vw 1vw',
                        borderRadius: '100vw',
                        cursor: isApprovingTiny ? 'wait' : 'pointer',
                        alignSelf: 'center'
                      }}
                    >
                      {isApprovingTiny ? 'Approving...' : 'Approve Tiny Frogs'}
                    </button>
                  )}
                </div>
              </div>

              

              <div className="w-layout-hflex flex-block-11">
                <button className="button-dapp" onClick={handleSelectAll}>
                  <div className="body-text black">
                    {selectedFrogs.length === fantomFrogFamily.length + tinyFrogs.length ? 'Deselect all' : 'Select all'}
                  </div>
                </button>
                <button className="button-dapp" 
                  onClick={handleBurn}
                  disabled={!isApprovedForSelected()}
                  style={{
                    background: !isApprovedForSelected() ? '#666' : '#14B951',
                    cursor: !isApprovedForSelected() ? 'not-allowed' : 'pointer',
                  }}
                >

                <div className="body-text black"> {!isApprovedForSelected() ? 'Approve Collections First' : 'Burn frogs for $FROQ' }</div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BurnToMint; 