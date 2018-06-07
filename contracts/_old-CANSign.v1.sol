pragma solidity 0.4.19;

contract CANSign_v1 {
    
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
        string name;
        uint256 lastModified;
        uint256 uploadedAt;
        uint256 expirationDate;
        address[] _signers;
        mapping (address => Signer) signers;
    }
    
    mapping (string => Document) documents;
    
    function CANSign_v1() public {}
    
    function addDocument(
        string _hash, 
        string _name,
        uint256 _lastModified, 
        uint256 _uploadedAt, 
        uint256 _expirationDate, 
        address[] _signers) public {

        documents[_hash].hash = _hash;
        documents[_hash].creator = msg.sender;
        documents[_hash].name = _name;
        documents[_hash].lastModified = _lastModified;
        documents[_hash].uploadedAt = _uploadedAt;
        documents[_hash].expirationDate = _expirationDate;
        documents[_hash]._signers = _signers;

        addSignersToDocument(_hash, _signers);
    }

    function sign(string _hash, uint256 _timestamp) public {
        Signer storage signer = documents[_hash].signers[msg.sender];

        signer.timestamp = _timestamp;

        signer.blockNumber = block.number;

        signer.status = 'signed';
    }

    function addSignersToDocument(string _hash, address[] _signers) internal {
        uint arrayLength = _signers.length;
        
        for (uint i = 0; i < arrayLength; i++) {
            address signerAddress = _signers[i];

            documents[_hash].signers[signerAddress]._address = signerAddress;
            documents[_hash].signers[signerAddress].status = 'pending';
        }
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

    function getDocumentName(string _hash) view public returns (string) {
        return documents[_hash].name;
    }

    function getDocumentExpirationDate(string _hash) view public returns (uint256) {
        return documents[_hash].expirationDate;
    }

    function getDocumentLastModifiedDate(string _hash) view public returns (uint256) {
        return documents[_hash].lastModified;
    }

    function getDocumentUploadedAtDate(string _hash) view public returns (uint256) {
        return documents[_hash].uploadedAt;
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
