import { useState, useEffect } from 'react'
import { ethers } from 'ethers'

// Your contract ABI and address
const CONTRACT_ADDRESS = "0x88e61d6439c5beFA49f6372101F4d7136fe48853"
const CONTRACT_ABI = [
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_initialFee",
				"type": "uint256"
			}
		],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "targetId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ligandSmiles",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "ResultSubmitted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "targetId",
				"type": "uint256"
			},
			{
				"internalType": "string",
				"name": "smiles",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			}
		],
		"name": "submitResult",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "target",
				"type": "string"
			}
		],
		"name": "submitTarget",
		"outputs": [
			{
				"internalType": "uint256",
				"name": "targetId",
				"type": "uint256"
			}
		],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"indexed": true,
				"internalType": "uint256",
				"name": "targetId",
				"type": "uint256"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "target",
				"type": "string"
			}
		],
		"name": "TargetSubmitted",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "_newFee",
				"type": "uint256"
			}
		],
		"name": "updateSubmissionFee",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "withdrawFees",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "targetId",
				"type": "uint256"
			}
		],
		"name": "getResult",
		"outputs": [
			{
				"internalType": "string",
				"name": "ligandSMILES",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "results",
		"outputs": [
			{
				"internalType": "string",
				"name": "ligandSMILES",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "ipfsHash",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "submissionFee",
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
		"inputs": [],
		"name": "targetCount",
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
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			}
		],
		"name": "targets",
		"outputs": [
			{
				"internalType": "address",
				"name": "user",
				"type": "address"
			},
			{
				"internalType": "string",
				"name": "target",
				"type": "string"
			},
			{
				"internalType": "uint256",
				"name": "timestamp",
				"type": "uint256"
			},
			{
				"internalType": "bool",
				"name": "processed",
				"type": "bool"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
]

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
