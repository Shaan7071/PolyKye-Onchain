import { useState, useEffect } from 'react'
import { ethers } from 'ethers'
import { POLYKYE_CONTRACT_ADDRESS, POLYKYE_CONTRACT_ABI, getPolyKyeContract } from '../config';

const CONTRACT_ADDRESS = POLYKYE_CONTRACT_ADDRESS
const CONTRACT_ABI = POLYKYE_CONTRACT_ABI
function MoleculeViewer() {
  const [molecules, setMolecules] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadMolecules = async () => {
      try {
        // Connect to provider (read-only is fine for viewing)
        const provider = new ethers.BrowserProvider(window.ethereum || 
          "https://mainnet.infura.io/v3/YOUR_INFURA_KEY")
        
        const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, provider)
        
        // Get the total number of targets 
        const targetCount = await contract.targetCount()
        
        // Fetch all molecules
        const moleculeData = []
        for (let i = 0; i < targetCount; i++) {
          try {
            const result = await contract.getResult(i)
            moleculeData.push({
              targetId: i,
              target: (await contract.targets(i)).target,
              ligandSmiles: result.ligandSmiles,
              synthesisIpfsHash: result.synthesisIpfsHash,
              score: result.score.toString(),
              timestamp: new Date(result.timestamp * 1000).toLocaleString()
            })
          } catch (error) {
            console.log(`No result for target ${i} yet`)
          }
        }
        
        setMolecules(moleculeData)
        setLoading(false)
      } catch (error) {
        console.error("Error loading molecules:", error)
        setLoading(false)
      }
    }

    loadMolecules()
  }, [])

  if (loading) {
    return <div>Loading molecules...</div>
  }

  return (
    <div className="molecule-viewer">
      <h2>Molecule Explorer</h2>
      <div className="molecule-grid">
        {molecules.length > 0 ? (
          molecules.map((molecule) => (
            <div key={molecule.targetId} className="molecule-card">
              <h3>Target ID: {molecule.targetId}</h3>
              <p><strong>Disease Target:</strong> {molecule.target}</p>
              <p><strong>Ligand SMILES:</strong> {molecule.ligandSmiles}</p>
              <p><strong>Score:</strong> {molecule.score}</p>
              <p><strong>Submitted:</strong> {molecule.timestamp}</p>
              <a 
                href={`https://ipfs.io/ipfs/${molecule.synthesisIpfsHash}`} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View Synthesis Pathway
              </a>
            </div>
          ))
        ) : (
          <p>No molecules found. Be the first to submit a target!</p>
        )}
      </div>
    </div>
  )
}

export default MoleculeViewer
