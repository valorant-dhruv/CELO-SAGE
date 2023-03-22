//SPDX-License-Identifier:MIT

pragma solidity >=0.5.0 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";

//This is the contract address
//0x6e815890eD4eD4D9CfAb12526c5292AFC012E3Ce

//This contract is ownable and the ownership will be transferred to the address that deploys this smart contract
contract Usercontract is Ownable{

    event Assigned(address sender,uint256 number);

    //This is the global count variable
    uint private count=0;


    //Firstly this smart contract is for the user only so all the functions will be called by the user itself
    //The first is a mapping for all the merkle roots that the user will store
    mapping(uint256=>bytes32) private merkleroots;

    //Now this is the function to assign the merkle roots
    function assign(bytes32 _root) public onlyOwner{
        count=count+1;
        merkleroots[count]=_root;

        emit Assigned(msg.sender, count);
    }

    //Now this is the function where the str is checked whether it exists or not
     function check(bytes32[] calldata proof, uint64 num,bytes32 leaf) view public onlyOwner returns (bool){
        // bytes32 leaf = keccak256(abi.encode(msg.sender, maxAllowanceToMint));
        bytes32 merkleRoot=merkleroots[num];
        bool verified = MerkleProof.verify(proof, merkleRoot, leaf);
        return verified;
    }
}