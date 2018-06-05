let CANSign = artifacts.require('./CANSign.sol');

contract('CANSign', accounts => {

    let cansign;
    let owner = accounts[0];

    let hash = 'QmeJ7h5CPcqpHE6QMV9N3ejEZKRAcudbAjbo8RLwNezPZ8';
    let docId;

    let signers = [
        '0xB864604A52e2f780aDDD1526a4d13600818a66C7',
        '0xbBc0c81CaA3b0811b531Cf494994291b7FA19Fc0',
        '0x27FA1096C0e8B7E5f457f8cB95410C07c45D3447'
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
        let name = 'my-file.pdf';
        let lastModified = (new Date()).getTime();
        let uploadedAt = (new Date()).getTime();
        let expirationDate = (new Date()).getTime();

        return CANSign.deployed().then(instance => {
            cansign = instance;
            return cansign.addDocument(
                hash, 
                name, 
                lastModified, 
                uploadedAt, 
                expirationDate, 
                signers);
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
            return cansign.getSignerStatus(docId, signers[0]);
        }).then(_status => {
            assert.equal(_status, 'pending', 'signer status does not match "pending" status');
            return cansign.getDocumentName(docId);
        }).then(_name => {
            assert.equal(_name, name, 'document name does not match input name');
            return cansign.getDocumentLastModifiedDate(docId);
        }).then(_lastModified => {
            assert.equal(_lastModified.valueOf(), lastModified, 'lastModified timestamp does not match input timestamp');
            return cansign.getDocumentUploadedAtDate(docId);
        }).then(_uploadedAt => {
            assert.equal(_uploadedAt.valueOf(), uploadedAt, 'uploadedAt timestamp does not match input timestamp');
        }).catch(error => console.log(error));
    });

    it('should sign a document', () => {
        
        let creator = owner;
        let signatureTimestamp = (new Date()).getTime();

        let index = 1;
        let signer = signers[index];
        let name = names[index];
        let email = emails[index];
        let blockNumber = 1;

        return cansign.sign(docId, signatureTimestamp, email, { from: signer }).then(() => {
            return cansign.getSignerEmail(docId, signer);
        }).then(_email => {
            assert.equal(_email.valueOf(), email, 'signer email does not match input email');
            return cansign.getSignerTimestamp(docId, signer);
        }).then(_timestamp => {
            assert.equal(_timestamp.valueOf(), signatureTimestamp, 'signer timestamp does not match input timestamp');
            return cansign.getSignerStatus(docId, signer);
        }).then(_status => {
            assert.equal(_status, 'signed', 'signer status does not match "signed" status');
            return cansign.getSignerBlockNumber(docId, signer);
        }).then(_blockNumber => {
            console.log(_blockNumber)
            assert.equal(_blockNumber.valueOf(), blockNumber, 'signer status does not match "signed" status');
        }).catch(error => console.log(error));
    });
});



