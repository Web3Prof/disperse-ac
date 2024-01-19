import React from 'react'
import { useState } from 'react'
import './App.css'
import {
  ThirdwebProvider,
  metamaskWallet,
  walletConnect,
  ConnectWallet
} from "@thirdweb-dev/react"
import TransferEth from './TransferEth'
import TransferToken from './TransferToken'

const tabs = [
  {
    id: "eth",
    label: "Transfer ETH"
  },
  {
    id: "erc20",
    label: "Transfer ERC20 Token"
  }
]

function App() {

  const [activeTab, setActiveTab] = useState(tabs[0].id);

  return (
    <ThirdwebProvider supportedWallets={[
      metamaskWallet(),
      walletConnect()
    ]} activeChain="goerli" clientId="">

      <ConnectWallet style={{ width: "50px" }} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div style={{ display: "flex" }}>
          {tabs.map((tab) => {
            return (
              <button key={tab.id} style={{
                backgroundColor: activeTab === tab.id ? "#fff" : "transparent",
                color: activeTab === tab.id ? "#000" : "#fff",
              }}
                onClick={() => { setActiveTab(tab.id) }}>
                {tab.label}
              </button>
            )
          })}
        </div>

        {activeTab === "eth" && <TransferEth />}
        {activeTab === "erc20" && <TransferToken />}

      </div>

    </ThirdwebProvider>
  )
}

export default App
