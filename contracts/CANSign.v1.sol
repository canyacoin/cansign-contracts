pragma solidity 0.4.19;

contract CANSign {
    
    struct Signer {
        address _address;
        string name;
        // uint256 dateOfBirth;
        // uint256 signedAt;
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
        address _creator, 
        uint256 _expirationDate, 
        address[] _signers,
        string[] _names) public {

        documents[_hash].hash = _hash;
        documents[_hash].creator = _creator;
        documents[_hash].expirationDate = _expirationDate;
        documents[_hash]._signers = _signers;

        addSignersToDocument(_hash, _signers, _names);
    }

    function addSignersToDocument(string _hash, address[] _signers, string[] _names) internal {
        uint arrayLength = _signers.length;
        
        for (uint i = 0; i < arrayLength; i++) {
            address signerAddress = _signers[i];
            // string memory signerName = _names[i];

            Signer memory signer = Signer({
                _address: signerAddress,
                name: _names[i]
                });

            documents[_hash].signers[signerAddress] = signer;
        }
    }

    function getDocumentSigners(string _hash) view public returns (address[]) {
        return documents[_hash]._signers;
    }

    function getSignerName(string _hash, address _signer) view public returns (string) {
        return documents[_hash].signers[_signer].name;
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










