pragma solidity 0.4.19;

contract CANSign {
    
    struct Signer {
        address _address;
        uint256 timestamp;
        uint256 dateOfBirth;
        string name;
        string email;
    }
    
    struct Document {
        string hash;
        address creator;
        uint256 expirationDate;
        address[] _signers;
        mapping (address => Signer) signers;
    }
    
    mapping (string => Document) documents;
    
    function CANSign() public {}
    
    function addDocument(
        string _hash, 
        uint256 _expirationDate, 
        address[] _signers) public {

        documents[_hash].hash = _hash;
        documents[_hash].creator = msg.sender;
        documents[_hash].expirationDate = _expirationDate;
        documents[_hash]._signers = _signers;

        addSignersToDocument(_hash, _signers);
    }

    function sign(string _hash, uint256 _timestamp, string _email) public {
        Signer storage signer = documents[_hash].signers[msg.sender];

        signer.timestamp = _timestamp;

        signer.email = _email;
    }

    function addSignersToDocument(string _hash, address[] _signers) internal {
        uint arrayLength = _signers.length;
        
        for (uint i = 0; i < arrayLength; i++) {
            address signerAddress = _signers[i];

            documents[_hash].signers[signerAddress]._address = signerAddress;
        }
    }

    function getDocumentSigners(string _hash) view public returns (address[]) {
        return documents[_hash]._signers;
    }

    function getSignerEmail(string _hash, address _signer) view public returns (string) {
        return documents[_hash].signers[_signer].email;
    }

    function getSignerName(string _hash, address _signer) view public returns (string) {
        return documents[_hash].signers[_signer].name;
    }

    function getSignerTimestamp(string _hash, address _signer) view public returns (uint256) {
        return documents[_hash].signers[_signer].timestamp;
    }

    function getDocumentId(string _hash) view public returns (string) {
        return documents[_hash].hash;
    }

    function getDocumentCreator(string _hash) view public returns (address) {
        return documents[_hash].creator;
    }

    function getDocumentExpirationDate(string _hash) view public returns (uint256) {
        return documents[_hash].expirationDate;
    }
    
}










