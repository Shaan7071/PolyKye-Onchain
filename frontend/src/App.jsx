import { useState } from 'react'
import './App.css'
import WalletConnection from './components/WalletConnection'
import MoleculeViewer from './components/MoleculeViewer'
import TargetSubmissionForm from './components/TargetSubmissionForm'
import canurtaLogo from './assets/canurta_logo.jpg'

function App() {
  const [signer, setSigner] = useState(null)
  const [activeTab, setActiveTab] = useState('explore') // 'explore' or 'submit'

  const handleConnect = (connectedSigner) => {
    setSigner(connectedSigner)
  }

  return (
    <div className="app">
      <div className="app-background">
        <div className="app-overlay">
          <header className="app-header">
            <div className="logo-container">
              <div className="logo-icon">
                <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="50" cy="50" r="45" stroke="#c5d547" strokeWidth="4"/>
                  <circle cx="50" cy="50" r="30" fill="#c5d547" fillOpacity="0.3"/>
                  <path d="M50 25L70 50L50 75L30 50L50 25Z" fill="#c5d547"/>
                </svg>
              </div>
              <div className="logo-text">PolyKye Onchain</div>
            </div>
            <WalletConnection onConnect={handleConnect} />
          </header>
          
          <section className="hero-section">
            <h1>Transforming Drug Discovery with Blockchain</h1>
            <p>PolyKye Onchain is at the forefront of developing multi-target botanical drugs, utilizing AI and blockchain technology to offer innovative treatments for complex diseases.</p>
          </section>
          
          <div className="tab-container">
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
          </div>
          
          <main className="app-main">
            {activeTab === 'explore' ? (
              <MoleculeViewer />
            ) : (
              <TargetSubmissionForm signer={signer} />
            )}
          </main>
          
          <footer className="app-footer">
            <div className="footer-content">
              <p>PolyKye Onchain &copy; 2025</p>
              <div className="partnership">
                <p>Brought to you by</p>
                <img 
                  src={canurtaLogo} 
                  alt="Canurta Therapeutics" 
                  className="canurta-logo" 
                />
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default App
