const fs = require('fs');
const { keyStores, connect } = require('near-api-js');
const os = require('os');
const path = require('path');

const CREDENTIALS_DIR = '.near-credentials';
const ACCOUNT_ID = 'near-example.testnet';
const WASM_PATH = path.join(__dirname, '/wasm-files/status_message.wasm');
const credentialsPath = path.join(os.homedir(), CREDENTIALS_DIR);
const keyStore = new keyStores.UnencryptedFileSystemKeyStore(credentialsPath);

const config = {
    keyStore,
    networkId: 'testnet',
    nodeUrl: 'https://rpc.testnet.near.org',
};

async function deployContract(accountId, wasmPath) { 
    const near = await connect(config);
    const account = await near.account(accountId);
    return account.deployContract(fs.readFileSync(wasmPath));
}

if (require.main === module) {
    (async function () {
        const deployment = await deployContract(ACCOUNT_ID, WASM_PATH);
        console.log({ deployment });
    }());
}
