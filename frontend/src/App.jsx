import { useState } from 'react'
import './App.css'
import WalletConnection from './components/WalletConnection'
import MoleculeViewer from './components/MoleculeViewer'
import TargetSubmissionForm from './components/TargetSubmissionForm'

function App() {
  const [signer, setSigner] = useState(null)
  const [activeTab, setActiveTab] = useState('explore') // 'explore' or 'submit'

  const handleConnect = (connectedSigner) => {
    setSigner(connectedSigner)
  }

  return (
    <div className="app">
      <header className="app-header">
        <div className="logo">PolyKye Onchain</div>
        <WalletConnection onConnect={handleConnect} />
      </header>
      
      <nav className="app-nav">
        <button 
          className={activeTab === 'explore' ? 'active' : ''} 
          onClick={() => setActiveTab('explore')}
        >
          Explore Molecules
        </button>
        <button 
          className={activeTab === 'submit' ? 'active' : ''} 
          onClick={() => setActiveTab('submit')}
        >
          Submit New Target
        </button>
      </nav>
      
      <main className="app-main">
        {activeTab === 'explore' ? (
          <MoleculeViewer />
        ) : (
          <TargetSubmissionForm signer={signer} />
        )}
      </main>
      
      <footer className="app-footer">
        <p>PolyKye Onchain &copy; 2025</p>
      </footer>
    </div>
  )
}

export default App