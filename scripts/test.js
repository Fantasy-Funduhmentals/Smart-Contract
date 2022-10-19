const cardano = require("./cardano");
const wallet = cardano.wallet("Fasih");
const bech = require("bech32");

const address = "addr_test1qpap6vsnd5eksmqxffsqnvpqfp0wjyd4rf3vs6m59wlfj8wce4822gg09zrp2h0932v0gylm4mcxu4ea45yhrxyfzhsq05v6xj";
const vkey = "5820c2e583bf6d5afd9b2b140d1ba385c5c3d14975755dfc18dff66bae62cd63d047";
const skey = "5820187cdf15f8fe9dafc7f595421bb932f6ed708ed3103dd331a911bdd7cae1e65f";

txIn = wallet.balance().utxo;
const ID = "5c322476d9350f058ed66069c0758417e89e395a2bae1f99009eb40c.546573744e4654";
console.log("Balance: ", txIn);

const adress= wallet.paymentAddr;

const value = { ...wallet.balance().value, [ID]: txIn[0].value[ID] + 5 };

//txOut = [
   // {
//
//    }
//];

console.log("transaction out: ", txOut);
// console.log("WalletName: ", wallet.name);
// const hash1 = cardano.addressKeyHash("Fasih");
// console.log("addressKeyHash1: ", hash1);
// const addressinfo = cardano.addressInfo(address);
// console.log("addressInfo:", addressinfo);

// console.log(addressinfo.base16.toString().slice(2, 58));


// const mintScript = {
//     keyHash: cardano.addressKeyHash(wallet.name),
//     type: "sig",
//   };

// 3. Create POLICY_ID
// const POLICY_ID = cardano.transactionPolicyid(mintScript);
// console.log("policyId: ", POLICY_ID);
