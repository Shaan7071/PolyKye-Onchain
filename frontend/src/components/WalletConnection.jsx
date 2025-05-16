import { useState } from 'react'
import { ethers } from 'ethers'

function WalletConnection({ onConnect }) {
  const [account, setAccount] = useState('')
  const [balance, setBalance] = useState('')
  const [isConnected, setIsConnected] = useState(false)

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        const provider = new ethers.BrowserProvider(window.ethereum)
        await provider.send("eth_requestAccounts", [])
        const signer = await provider.getSigner()
        const address = await signer.getAddress()
        const balance = await provider.getBalance(address)
        
        setAccount(address)
        setBalance(ethers.formatEther(balance))
        setIsConnected(true)
        
        if (onConnect) {
          onConnect(signer)
        }
      } catch (error) {
        console.error("Error connecting to MetaMask:", error)
      }
    } else {
      alert("Please install MetaMask!")
    }
  }

  return (
    <div className="wallet-connection">
      {!isConnected ? (
        <button onClick={connectWallet} className="connect-button">
          Connect Wallet
        </button>
      ) : (
        <div className="wallet-info">
          <p>Connected: {account.substring(0, 6)}...{account.substring(account.length - 4)}</p>
          <p>Balance: {parseFloat(balance).toFixed(4)} ETH</p>
        </div>
      )}
    </div>
  )
}

export default WalletConnection