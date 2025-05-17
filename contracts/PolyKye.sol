// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
contract PolyKye is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    // Events
    event TargetSubmitted(address indexed user, uint indexed targetId, string target);
    event ResultSubmitted(uint indexed targetId, string ligandSmiles, string ipfsHash);
 
    // Structures
    struct TargetSubmission {
        address user;
        string target;
        uint timestamp;
        bool processed;
    }
 
    struct Result {
        string ligandSMILES;       // Just the SMILES string
        string ipfsHash;     // All other data stored in IPFS
        uint timestamp;
    }
 
    // State Variables
    mapping(uint => TargetSubmission) public targets;
    mapping(uint => Result) public results;
    uint public targetCount;
    uint256 public submissionFee;
 
    function initialize(uint256 _initialFee) public initializer {
    __Ownable_init(msg.sender);
    __UUPSUpgradeable_init();
    submissionFee = _initialFee;
}
 
 
    // Owner function to update the fee
    function updateSubmissionFee(uint256 _newFee) public onlyOwner {
        submissionFee = _newFee;
    }
 
    // Owner function to allow withdrawal of collected fees
    function withdrawFees() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner()).transfer(balance);
    }
 
    // submitTarget function with paywall
    function submitTarget(string memory target) public payable returns (uint targetId) {
        // Check if the sent amount is sufficient
        require(msg.value >= submissionFee, "Insufficient payment for target submission");
        // Create the target submission
        targetId = targetCount++;
        targets[targetId] = TargetSubmission(msg.sender, target, block.timestamp, false);
        emit TargetSubmitted(msg.sender, targetId, target);
        // Return excess payment if any
        uint256 excess = msg.value - submissionFee;
        if (excess > 0) {
            payable(msg.sender).transfer(excess);
        }
    }
 
     // Submit a result after off-chain computation
    function submitResult(
        uint targetId,
        string memory smiles,
        string memory ipfsHash
    ) public onlyOwner{
        require(targetId < targetCount, "Invalid targetId");
        require(!targets[targetId].processed, "Already processed");
 
        results[targetId] = Result({
            ligandSMILES: smiles,
            ipfsHash: ipfsHash,
            timestamp: block.timestamp
        });
 
        targets[targetId].processed = true;
 
        emit ResultSubmitted(targetId, smiles, ipfsHash);
    }
 
    // Retrieve result data for a target
    function getResult(uint targetId) public view returns (
        string memory ligandSMILES,
        string memory ipfsHash,
        uint timestamp
    ) {
        Result storage result = results[targetId];
        return (
            result.ligandSMILES,
            result.ipfsHash,
            result.timestamp
        );
    }
    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}
 
}