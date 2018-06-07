pragma solidity 0.4.19;

contract CANSign {
    
    struct Signer {
        address _address;
        uint256 timestamp;
        uint256 blockNumber;
        uint256 dateOfBirth;
        string status;
        string name;
        string email;
    }
    
    struct Document {
        string hash;
        address creator;
        uint256 timestamp;
        address[] _signers;
        mapping (address => Signer) signers;
    }
    
    mapping (string => Document) documents;


    event OnInvalidSigner(string _hash, address _signer);
    event OnAddDocument(string _hash, uint256 _timestamp);
    event OnSignDocument(string _hash, address _signer, uint256 _timestamp);


    function _signerExists(string _hash) internal returns (bool) {
        Document memory document = documents[_hash];

        address[] memory _signers = document._signers;

        uint arrayLength = _signers.length;
        
        for (uint i = 0; i < arrayLength; i++) {
            address signerAddress = _signers[i];

            if (signerAddress == msg.sender) {
                return true;
            }
        }

        OnInvalidSigner(_hash, msg.sender);
        return false;
    }

    function _documentExists(string _hash) view internal returns (bool) {
        bytes memory tempEmptyStringTest = bytes(documents[_hash].hash);

        return (tempEmptyStringTest.length != 0) ? true : false;
    }

    function addDocument(
        string _hash, 
        address[] _signers) public {

        require(!_documentExists(_hash));

        documents[_hash].hash = _hash;
        documents[_hash].creator = msg.sender;
        documents[_hash].timestamp = block.timestamp;
        documents[_hash]._signers = _signers;

        OnAddDocument(_hash, documents[_hash].timestamp);
    }

    function sign(string _hash) public returns (bool) {
        require(_signerExists(_hash));

        Signer memory signer;

        signer.timestamp = block.timestamp;

        signer.blockNumber = block.number;

        signer.status = 'signed';

        signer._address = msg.sender;

        documents[_hash].signers[msg.sender] = signer;

        OnSignDocument(_hash, msg.sender, signer.timestamp);

        return true;
    }

    function getDocumentSigners(string _hash) view public returns (address[]) {
        return documents[_hash]._signers;
    }

    function getDocumentId(string _hash) view public returns (string) {
        return documents[_hash].hash;
    }

    function getDocumentCreator(string _hash) view public returns (address) {
        return documents[_hash].creator;
    }

    function getDocumentTimestamp(string _hash) view public returns (uint256) {
        return documents[_hash].timestamp;
    }

    function getSignerEmail(string _hash, address _signer) view public returns (string) {
        return documents[_hash].signers[_signer].email;
    }

    function getSignerName(string _hash, address _signer) view public returns (string) {
        return documents[_hash].signers[_signer].name;
    }

    function getSignerStatus(string _hash, address _signer) view public returns (string) {
        return documents[_hash].signers[_signer].status;
    }

    function getSignerTimestamp(string _hash, address _signer) view public returns (uint256) {
        return documents[_hash].signers[_signer].timestamp;
    }

    function getSignerBlockNumber(string _hash, address _signer) view public returns (uint256) {
        return documents[_hash].signers[_signer].blockNumber;
    }
}
