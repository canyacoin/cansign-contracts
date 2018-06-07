let CANSign = artifacts.require('./CANSign.sol');

contract('CANSign', accounts => {

    let cansign;
    let owner = accounts[0];

    let hash = 'QmeJ7h5CPcqpHE6QMV9N3ejEZKRAcudbAjbo8RLwNezPZ8';
    let docId;

    let signers = accounts.slice(1, 3);
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

    describe('Add a document', () => {
        it('should add a document', () => {

            let creator = owner;

            let timestamp;

            return CANSign.deployed().then(instance => {
                cansign = instance;
                return cansign.addDocument(
                    hash,
                    signers);
            }).then(() => {
                OnAddDocumentEvent = cansign.OnAddDocument({});
                OnAddDocumentEvent.get((error, result) => {
                    console.log('EVENT: OnAddDocument');
                    
                    if (error) {
                        console.log(error);
                        return false;
                    }

                    timestamp = result[0].args._timestamp.valueOf();
                });
                return cansign.getDocumentId(hash);
            }).then(_docId => {
                docId = _docId.valueOf();
                assert.equal(docId, hash, 'docId does not match IPFS document hash');
                return cansign.getDocumentCreator(docId);
            }).then(_creator => {
                assert.equal(_creator, creator, 'creator does not match creator');
                return cansign.getDocumentSigners(docId);
            }).then(_signers => {
                assert.equal(_signers[0].toUpperCase(), signers[0].toUpperCase(), 'document signer address does not match input signer address');
                return cansign.getDocumentTimestamp(docId);
            }).then(_timestamp => {
                assert.equal(_timestamp.valueOf(), timestamp, 'timestamp does not match timestamp');
            }).catch(error => console.log(error));
        });

        it('should NOT add a document', () => {

            let creator = owner;

            let timestamp;

            return CANSign.deployed().then(instance => {
                cansign = instance;
                return cansign.addDocument(
                    hash,
                    signers);
            }).then(() => {
                return cansign.getDocumentId(hash);
            }).then(docId => {
                console.log(docId, typeof docId);
            }).catch(error => console.log(error));
        });
    })

    describe('Sign a document', () => {
        it('should sign a document', () => {

            let creator = owner;
            let signatureTimestamp = (new Date()).getTime();

            let index = 0;
            let signer = signers[index];

            let name = names[index];
            let email = emails[index];
            let blockNumber = 1;

            let timestamp;

            return CANSign.deployed().then(instance => {
                cansign = instance;
                return cansign.sign(hash, { from: signer });
            }).then(_signers => {
                OnSignDocumentEvent = cansign.OnSignDocument({});
                OnSignDocumentEvent.get((error, result) => {
                    console.log('EVENT: OnSignDocument');
                    
                    if (error) {
                        console.log(error);
                        return false;
                    }

                    timestamp = result[0].args._timestamp.valueOf();
                });
                
                return cansign.getSignerStatus(hash, signer);
            }).then(_status => {
                assert.equal(_status, 'signed', 'status does not match status');
                return cansign.getSignerTimestamp(docId, signer);
            }).then(_timestamp => {
                assert.equal(_timestamp.valueOf(), timestamp, 'timestamp does not match timestamp');
            }).catch(error => console.log(error));
        });

        it('should fail when signing a document', () => {

            let creator = owner;

            let index = 0;
            let signer = accounts[5];

            return CANSign.deployed().then(instance => {
                cansign = instance;
                return cansign.sign(hash, { from: signer });
            }).catch(error => {
                assert.include(
                    error.message,
                    `Transaction: ${error.tx} exited with an error (status 0).`
                )
            });
        });
    })
});



