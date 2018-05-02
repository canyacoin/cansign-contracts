let CANSign = artifacts.require('./CANSign.sol');

const bs58 = require('bs58');

contract('CANSign', accounts => {

    let cansign;
    let owner = accounts[0];

    let hash = 'QmeJ7h5CPcqpHE6QMV9N3ejEZKRAcudbAjbo8RLwNezPZ8';
    let docId;

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
    let emails = [
        'signer1@email.com',
        'signer2@email.com',
        'signer3@email.com',
    ];

    it('should add a document', () => {

        let creator = owner;
        let expirationDate = (new Date()).getTime();

        return CANSign.deployed().then(instance => {
            cansign = instance;
            return cansign.addDocument(hash, creator, expirationDate, signers);
        }).then(() => {
            return cansign.getDocumentId(hash);
        }).then(_docId => {
            docId = _docId.valueOf();
            assert.equal(docId, hash, 'docId does not match IPFS document hash');
            return cansign.getDocumentCreator(docId);
        }).then(_creator => {
            assert.equal(_creator.valueOf(), creator, 'creator does not match owner');
            return cansign.getDocumentExpirationDate(docId);
        }).then(_expirationDate => {
            assert.equal(_expirationDate.valueOf(), expirationDate, 'expirationDate does not match expirationDate');
            return cansign.getDocumentSigners(docId);
        }).then(_signers => {
            assert.equal(_signers[0].toUpperCase(), signers[0].toUpperCase(), 'document signer address does not match input signer address');
        }).catch(error => console.log(error));
    });

    it('should sign a document', () => {
        
        let creator = owner;
        let signatureTimestamp = (new Date()).getTime();

        let index = 1;
        let signer = signers[index];
        let name = names[index];
        let email = emails[index];

        return cansign.sign(docId, signatureTimestamp, email, { from: signer }).then(() => {
            return cansign.getSignerEmail(docId, signer);
        }).then(_email => {
            assert.equal(_email.valueOf(), email, 'signer email does not match input email');
            return cansign.getSignerTimestamp(docId, signer);
        }).then(_timestamp => {
            assert.equal(_timestamp.valueOf(), signatureTimestamp, 'signer timestamp does not match input timestamp');
        }).catch(error => console.log(error));
    });
});



