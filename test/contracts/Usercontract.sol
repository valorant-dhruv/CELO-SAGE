//SPDX-License-Identifier:MIT

pragma solidity >=0.5.0 <0.9.0;
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Context.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/MerkleProof.sol";
// import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Context.sol";


//So the dilemma is that the leaf nodes are made from the account address of the owner
//So when other person accesses nodes the owner has to give the permission to do it
//The other node can just create the leaf nodes using the account address of the owner

//This is the contract address
//0x913204Da6f144A7c5Da8f76059e687066d5B1F96

//This contract is ownable and the ownership will be transferred to the address that deploys this smart contract
contract Usercontract is Ownable{

    event Assigned(address sender,uint256 indexed number,bytes32 merkleroots,string contentid);
    event Accessed(address sender,uint256 indexed number,bool isgranted);
    event Getdata(address sender,string indexed contentid,bytes32 indexed merkleroot);

    //This is the original constructor
    constructor(string memory _contentid,bytes32 _merkleroot)
    {
        //Now we call the assign function
        assign(_merkleroot,_contentid);
        
        address _storeaccounts=0x2ECCB4caa2Fe74125CF4b6864f004525F2B2BC71;
        
        //Once these values are assigned the next task is to call the function of the storeaccounts smart contract
         (bool success, bytes memory _data)=_storeaccounts.call(abi.encodeWithSignature("storeaddress(address)",msg.sender));
        require(success==true,"The call to the function has failed");
    }

  
    //This is the global count variable
    uint private count=0;

    //When the data is stored inside the ipfs it is stored in 4 parts.
    //These 4 parts are linked to each other and based on the content id of the first part we can fetch the complete list of data
    //Now we also need to store the content id that is linked to the merkle root and the count variable

    //Now this is the modifier which checks whether the function has been called by the owner of the smart contract
    //In case it is not the owner then the account address should at least be given permission by the owner
    modifier allowed{
        bool value=_allowed();
        require(value==true,"The sender is not permissioned to call this function");
        _;
    }

    //This is the mapping for which the address is mapped to whether it is allowed to get the data or not
    mapping(address=>bool) private permissiongranted;

    function _allowed() public view returns(bool){

        if(_msgSender()==owner() || permissiongranted[_msgSender()]==true)
        {
            return true;
        }
        else{
            return false;
        }

    }


    //Firstly this smart contract is for the user only so all the functions will be called by the user itself
    //The first is a mapping for all the merkle roots that the user will store
    mapping(uint256=>bytes32) private merkleroots;
    mapping(uint256=>string) private contentids;

    //Now this is the function to assign the merkle roots
    function assign(bytes32 _root,string memory contentid) public{
        count=count+1;
        merkleroots[count]=_root;
        contentids[count]=contentid;
        emit Assigned(msg.sender,count,_root,contentid);
    }

    //This is the function to allows account addresses to the have access to the resources 
    function getdata(uint _count) external allowed returns(bytes32,string memory)
    {
        emit Getdata(msg.sender,contentids[_count],merkleroots[_count]);
        return (merkleroots[_count],contentids[_count]);
        
    }

    function giveaccess(address _account) external onlyOwner{
        permissiongranted[_account]=true;
    }

    function revokeaccess(address _account) external onlyOwner{
        permissiongranted[_account]=false;
    }

    //Now this is the function where the str is checked whether it exists or not
    //Once we get back all the data the verify function needs to be called 4 times
    //Hence for that we pass in an array of leafs
     function check(bytes32[] calldata proof, uint64 num,bytes32[] calldata leaf) public allowed view returns (bool){
        // bytes32 leaf = keccak256(abi.encode(msg.sender, maxAllowanceToMint));

         bytes32 merkleRoot=merkleroots[num];
         bool istrue=true;
        for(uint i=0;i<4;i++)
        { 
             bool verified = MerkleProof.verify(proof, merkleRoot, leaf[i]);
             if(verified==false)
             {
                 istrue=false;
                 break;
             }
        }

        return istrue;

    }
}