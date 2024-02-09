import React from 'react'
import { useState } from 'react'
import './App.css'
import {
  ThirdwebProvider,
  useContract,
  metamaskWallet,
  coinbaseWallet,
  walletConnect,
  ConnectWallet
} from "@thirdweb-dev/react";
import TransferEthInput from './TransferEth'
import TransferTokenInput from './TransferToken';

const TABS = [
  {
    id: "transfer-eth",
    label: "Transfer Eth",
  },
  {
    id: "transfer-erc20",
    label: "Transfer ERC20",
  }
]

function App() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);


  return (
    <ThirdwebProvider supportedWallets={[
      metamaskWallet({
        recommended: true,
      }),
      coinbaseWallet(),
      walletConnect(),
    ]} activeChain="goerli" clientId="9aa6b3246736d8d8f1018eaca498c8dd">
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <ConnectWallet />

        <div style={{ display: "flex", alignItems: "center", marginTop: "20px", marginInline: "auto" }}>
          {TABS.map((tab) => {
            return (
              <button key={tab.id}
                style={{
                  padding: "0.4rem 1rem",
                  borderRadius: "5px",
                  backgroundColor: activeTab === tab.id ? "#fff" : "transparent",
                  color: activeTab === tab.id ? "#000" : "#fff",
                }}
                onClick={() => {
                  setActiveTab(tab.id)
                }}
              >
                {tab.label}
              </button>
            )
          })}
        </div>

        {activeTab === 'transfer-eth' &&
          <TransferEthInput />
        }

        {activeTab === 'transfer-erc20' &&
          <TransferTokenInput />
        }
      </div>

    </ThirdwebProvider>
  )
}

export default App