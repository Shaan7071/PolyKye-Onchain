// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PolyKye {
    // Events
    event TargetSubmitted(address indexed user, uint indexed targetId, string target);
    event ResultSubmitted(uint indexed targetId, string ligandSmiles, string synthesisIpfsHash, uint score);

    // Structures
    struct TargetSubmission {
        address user;
        string target;
        uint timestamp;
        bool processed;
    }

    struct Result {
        string ligandSmiles;
        string synthesisIpfsHash;
        uint score;
        uint timestamp;
        address submitter;
    }

    // State Variables
    mapping(uint => TargetSubmission) public targets;
    mapping(uint => Result) public results;
    uint public targetCount;

    // Submit a new disease target
    function submitTarget(string memory target) public returns (uint targetId) {
        targetId = targetCount++;
        targets[targetId] = TargetSubmission({
            user: msg.sender,
            target: target,
            timestamp: block.timestamp,
            processed: false
        });

        emit TargetSubmitted(msg.sender, targetId, target);
    }

    // Submit a result after off-chain computation
    function submitResult(
        uint targetId,
        string memory ligandSmiles,
        string memory synthesisIpfsHash,
        uint score
    ) public {
        require(targetId < targetCount, "Invalid targetId");
        require(!targets[targetId].processed, "Already processed");

        results[targetId] = Result({
            ligandSmiles: ligandSmiles,
            synthesisIpfsHash: synthesisIpfsHash,
            score: score,
            timestamp: block.timestamp,
            submitter: msg.sender
        });

        targets[targetId].processed = true;

        emit ResultSubmitted(targetId, ligandSmiles, synthesisIpfsHash, score);
    }

    // Retrieve result data for a target
    function getResult(uint targetId) public view returns (
        string memory ligandSmiles,
        string memory synthesisIpfsHash,
        uint score,
        uint timestamp,
        address submitter
    ) {
        Result storage result = results[targetId];
        return (
            result.ligandSmiles,
            result.synthesisIpfsHash,
            result.score,
            result.timestamp,
            result.submitter
        );
    }
}
