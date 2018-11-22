import { expect } from 'chai';

import * as Controller from './client-request-controller';
import ClientRequest from './client-request-model';
import { createUser } from '../user/user-controller';
import { createItem } from '../item/item-controller';
import User from '../user/user-model';
import Item from '../item/baseitem-model';
import Note from '../note/note-model';
import { dbConnection, deleteCollection } from '../utils/db-test-utils';

describe.only('Client Request integration tests', () => {
    let requestorId = null;
    before(async () => {
        const requestor = await createUser({
            name: {
                first: 'Oliver',
                last: 'Queen'
            },
            email: 'oliver@qc.com',
            password: 'thegreenarrow',
            roles: ['admin', 'approver']
        });
        requestorId = requestor._id;
    });

    afterEach(async () => {
        await deleteCollection(dbConnection, Item, 'items');
        await deleteCollection(dbConnection, Note, 'notes');
        await deleteCollection(dbConnection, ClientRequest, 'clientrequests');
    });

    after(async () => await deleteCollection(dbConnection, User, 'users'));

    describe('createClientRequest()', () => {
        it('creates a client request without any items if none were provided', () => {
            const clientReqData = {
                clientId: '12345678',
                submittedBy: requestorId
            };
            return Controller.createClientRequest(clientReqData).then(request => {
                expect(request).to.be.exist;
                expect(request).to.have.property('clientId');
                expect(request).to.have.property('submittedBy');
                expect(request).to.have.property('items');
                expect(request.items).to.have.length(0);
            });
        });

        it('creates a client request when passed a single item', () => {
            const item1 = {
                clientId: '12345678',
                submittedBy: requestorId,
                itemCategory: 'Household',
                numberOfItems: 4,
                name: 'plates',
                note: 'Need some plates for a nice holiday dinner'
            };
            const clientReqData = {
                clientId: '12345678',
                submittedBy: requestorId,
                items: item1
            };
            return Controller.createClientRequest(clientReqData).then(request => {
                expect(request).to.be.exist;
                expect(request).to.have.property('clientId');
                expect(request).to.have.property('submittedBy');
                expect(request).to.have.property('items');
                expect(request.items).to.have.length(1);
            });
        });
        it('creates a client request when passed an array of items', () => {
            const item1 = {
                clientId: '12345678',
                submittedBy: requestorId,
                itemCategory: 'Household',
                numberOfItems: 4,
                name: 'plates',
                note: 'Need some plates for a nice holiday dinner'
            };
            const item2 = {
                clientId: '12345678',
                submittedBy: requestorId,
                itemCategory: 'Clothing',
                numberOfItems: 1,
                name: 'coat',
                size: 'L (42-44)',
                gender: 'M',
                note: 'Need a warm coat for the fall season'
            };
            const clientReqData = {
                clientId: '12345678',
                submittedBy: requestorId,
                items: [item1, item2]
            };
            return Controller.createClientRequest(clientReqData).then(request => {
                expect(request).to.be.exist;
                expect(request).to.have.property('clientId');
                expect(request).to.have.property('submittedBy');
                expect(request).to.have.property('items');
                expect(request.items).to.have.length(2);
            });
        });
    });
});
