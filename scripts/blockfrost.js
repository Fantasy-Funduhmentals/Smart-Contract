const Blockfrost = require('@blockfrost/blockfrost-js');
const Serializer = require('@emurgo/cardano-serialization-lib-nodejs');
const namiapi = require('nami-wallet-api');



async function initializeBlockfrost()
{
    const API = new Blockfrost.BlockFrostAPI({
        apiUrl: 'https://cardano-preprod.blockfrost.io/preprodcOZRhcJ7l3Y5aXnJlpLXdPBnuYmc2t9y/v0',
        projectId: 'preprodcOZRhcJ7l3Y5aXnJlpLXdPBnuYmc2t9y',
    });
    return API;
}

async function getBalance()
{
    const API = await initializeBlockfrost();
    const balance = await API.addresses('addr_test1qzx3x2n8nxqa2erfkkgezv5346dxc5v774cchfwrcad7klsyucya4vd0j2mh2q0v27tpupnjfh53h2t6edkmjycereeqtffxgm');
    console.log(balance);
}
async function main()
{
    await getBalance();
}
main();
