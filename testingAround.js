const assert = require('assert');
const { EventEmitter } = require('events');
const { handleRegResultat } = require('./api_services/resultat_service');

function createMockRequest(data) {
    const req = new EventEmitter();
    process.nextTick(() => {
        req.emit('data', Buffer.from(JSON.stringify(data)));
        req.emit('end');
    });
    return req;
}

function createMockResponse() {
    return {
        statusCode: null,
        headers: null,
        data: null,
        writeHead(status, headers) {
            this.statusCode = status;
            this.headers = headers;
        },
        end(data) {
            this.data = data;
        }
    };
}

async function runTests() {
    console.log('Starting tests...\n');

    // Test cases with expected status codes and messages
    const testCases = [
        {
            name: '1. Valid registration (201 Registered)',
            data: {
                Personnummer: '19900101-1234',
                Kurskod: 'KURS100',
                Modul: 'A',
                Datum: '2025-11-10',
                Betyg: 'VG'
            },
            expectedStatus: 201,
            expectedMessage: 'registrerad'
        },
        {
            name: '2. Missing fields (400 Bad Request)',
            data: {
                Personnummer: '19900101-1234'
            },
            expectedStatus: 400,
            expectedMessage: 'hinder'
        },
        {
            name: '3. Invalid JSON (400 Bad Request)',
            data: '{invalid-json',
            expectedStatus: 400,
            expectedMessage: 'hinder'
        }
    ];

    const mockDb = {
        addResult: () => ({ changes: 1 })
    };

    for (const test of testCases) {
        console.log(`\nRunning: ${test.name}`);
        
        const req = createMockRequest(test.data);
        const res = createMockResponse();
        
        handleRegResultat(req, res, mockDb);
        
        await new Promise(resolve => setTimeout(resolve, 100));
        
        try {
            assert.strictEqual(res.statusCode, test.expectedStatus, 
                `Expected status code ${test.expectedStatus}, got ${res.statusCode}`);
            
            const responseData = JSON.parse(res.data);
            assert.strictEqual(responseData.status, test.expectedMessage, 
                `Expected message "${test.expectedMessage}", got "${responseData.status}"`);
            
            console.log(`✓ Status Code: ${res.statusCode}`);
            console.log(`✓ Status Message: ${responseData.status}`);
            console.log(`✓ Test passed`);
        } catch (err) {
            console.error(`✗ Test failed:`, err.message);
            process.exit(1);
        }
    }

    console.log('\nAll tests passed! ✓');
}

runTests().catch(err => {
    console.error('Test failed:', err);
    process.exit(1);
});