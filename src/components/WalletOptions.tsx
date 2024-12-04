import { LoaderIcon } from "lucide-react";
import * as React from "react";
import { fantom } from "wagmi/chains";
import { Connector, useConnect } from "wagmi";

export function WalletOptions() {
  const { connectors, connect, isPending } = useConnect();

  return isPending ? (
    <div className="flex items-center gap-3">
      <LoaderIcon className="animate-spin" />
      <p>Connecting</p>
    </div>
  ) : (
    <div className="flex flex-col gap-3">
      {connectors.map((connector) => (
        <WalletOption
          key={connector.uid}
          connector={connector}
          onClick={() => connect({ connector, chainId: fantom.id })}
        />
      ))}
    </div>
  );
}

function WalletOption({
  connector,
  onClick,
}: {
  connector: Connector;
  onClick: () => void;
}) {
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    (async () => {
      const provider = await connector.getProvider();
      setReady(!!provider);
    })();
  }, [connector]);

  return (
    <button
      disabled={!ready}
      onClick={onClick}
      className="disabled:opacity-70 my-3 p-[1px] rounded-full bg-gradient-to-r from-[#14B951] to-[#14B951] group"
    >
      <div className="bg-black/85 py-2 px-7 rounded-full transition group-hover:bg-black/75 text-white">
        {connector.name}
      </div>
    </button>
  );
} 