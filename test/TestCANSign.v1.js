let CANSign = artifacts.require('./CANSign.sol');

const bs58 = require('bs58');

contract('CANSign', accounts => {

    let owner = accounts[0];

    it('should add a document', () => {
        let cansign;

        let hash = 'QmeJ7h5CPcqpHE6QMV9N3ejEZKRAcudbAjbo8RLwNezPZ8';
        let creator = owner;
        let expirationDate = (new Date()).getTime();
        let signers = [
            '0xc1C5A5819FA352Aa974e49aE3F7b05380C0A95Ee',
            '0x5A12A8fbb117eEb46f1E8aa9B266FcC10Be19136',
            '0x3C34e38883Cd1c6d4FdaC3A2f6CD91C5b3735420'
        ];
        let names = [
            'Chuchito Pérez',
            'E. Charles White',
            'Mirta Stapunk'
        ];

        let docId;

        return CANSign.deployed().then(instance => {
            cansign = instance;
            return cansign.addDocument(hash, creator, expirationDate, signers, names);
        }).then(() => {
            return cansign.getDocumentId(hash);
        }).then(_docId => {
            docId = _docId.valueOf();
            assert.equal(docId, hash, 'docId does not match IPFS document hash');
            console.log(docId);
            return cansign.getDocumentCreator(docId);
        }).then(_creator => {
            console.log(_creator.valueOf());
            assert.equal(_creator.valueOf(), creator, 'creator does not match owner');
            return cansign.getDocumentExpirationDate(docId);
        }).then(_expirationDate => {
            console.log(_expirationDate.valueOf());
            assert.equal(_expirationDate.valueOf(), expirationDate, 'expirationDate does not match expirationDate');
            return cansign.getDocumentSigners(docId);
        }).then(_signers => {
            console.log(_signers);
            return cansign.getSignerName(docId, _signers[1]);
        }).then(_name => {
            console.log(_name.valueOf());
        }).catch(error => console.log(error));
    });
});



