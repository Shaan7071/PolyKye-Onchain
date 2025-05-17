import { ethers } from 'ethers'
import { useState, useEffect } from 'react';
import { POLYKYE_CONTRACT_ADDRESS, POLYKYE_CONTRACT_ABI, getPolyKyeContract } from '../config';

const CONTRACT_ADDRESS = POLYKYE_CONTRACT_ADDRESS
const CONTRACT_ABI = POLYKYE_CONTRACT_ABI

console.log("submitTarget in ABI:", CONTRACT_ABI.find(item => 
  item.type === "function" && item.name === "submitTarget"));


function TargetSubmissionForm({ signer }) {
  const [target, setTarget] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [transactionHash, setTransactionHash] = useState('')
  const [error, setError] = useState('')
  const [paymentAmount, setPaymentAmount] = useState("100") // Default value in wei
	const [submissionFee, setSubmissionFee] = useState("Loading...")

	useEffect(() => {
  const fetchSubmissionFee = async () => {
    try {
      // Use the existing signer that's passed as a prop to your component
      const contract = new ethers.Contract(
        CONTRACT_ADDRESS,
        CONTRACT_ABI,
        signer
      );
      
      const fee = await contract.submissionFee();
      setSubmissionFee(fee.toString());
    } catch (error) {
      console.error("Error fetching submission fee:", error);
      setSubmissionFee("Error loading fee");
    }
  };
  
  if (signer) {
    fetchSubmissionFee();
  }
}, [signer]);



  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!signer) {
      setError("Please connect your wallet first")
      return
    }
    
    if (!target.trim()) {
      setError("Please enter a disease target")
      return
    }
    
    setIsSubmitting(true)
    setError('')
    
    try {
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer)
      
      // Submit the target
      const tx = await contract.submitTarget(target, {
      value: ethers.parseUnits(paymentAmount, "wei")
    });

      
      setTransactionHash(tx.hash)
      
      // Wait for transaction to be mined
      await tx.wait()
      
      setTarget('')
      setIsSubmitting(false)
      alert("Target submitted successfully!")
    } catch (error) {
      console.error("Error submitting target:", error)
      setError(error.message || "Error submitting target")
      setIsSubmitting(false)
    }
  }

  return (
    <div className="target-submission">
      <h2>Submit New Disease Target</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="target">Disease Target:</label>
          <input
            type="text"
            id="target"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="Enter disease target (e.g., Pancreatic Cancer)"
            disabled={isSubmitting}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="payment">Payment Amount (wei):</label>
          <input
            type="number"
            id="payment"
            value={paymentAmount}
            onChange={(e) => setPaymentAmount(e.target.value)}
            placeholder="Enter amount in wei (minimum 100)"
            min="100"
            disabled={isSubmitting}
            required
          />
        </div>
				<div className="fee-display">
					<p><strong>Current submission fee:</strong> {submissionFee} wei</p>
				</div>

        {error && <div className="error-message">{error}</div>}
        
        <button type="submit" disabled={isSubmitting || !signer}>
          {isSubmitting ? 'Submitting...' : 'Submit Target'}
        </button>
        
        {transactionHash && (
          <div className="transaction-info">
            <p>Transaction submitted: </p>
            <a 
              href={`https://etherscan.io/tx/${transactionHash}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View on Etherscan
            </a>
          </div>
        )}
      </form>
    </div>
  )
}

export default TargetSubmissionForm