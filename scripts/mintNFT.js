const cardano = require("./cardano");

async function mintNFT(_assetName, _assetImg, _assetDes, _signerAddress, _signerKey, _amount, _policyId)
{
  accountInfo = cardano.addressInfo(_signerAddress);
  accountInfo = accountInfo.base16.toString().trim(2, 58);
  const mintScript = {
    keyHash: accountInfo,
    type: "sig",
  };

// 3. Create POLICY_ID
// const POLICY_ID = cardano.transactionPolicyid(mintScript);
const POLICY_ID = _policyId.toString();
console.log("policyId: ",POLICY_ID);

// 4. Define ASSET_NAME
const ASSET_NAME = _assetName.toString();
console.log("assetName: ", ASSET_NAME);

// Convert Asset ASCII name to HEX
const ASSET_NAME_HEX = ASSET_NAME.split("")
  .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
  .join("");
console.log("asset hex name: ", ASSET_NAME_HEX);

// 5. Create ASSET_ID
const ASSET_ID = POLICY_ID + "." + ASSET_NAME_HEX;
console.log("asset id: ", ASSET_ID);

// 6. Define metadata
const metadata = {
  721: {
    [POLICY_ID]: {
      [ASSET_NAME]: {
        name: ASSET_NAME,
        image: _assetImg,
        description: _assetDes,
        // type: "image/png",
        // src: "ipfs://QmUxRuzTi3UZS33rfqXzbD4Heut7zwtGUhuD7qSv7Qt584",
        // // other properties of your choice
        // authors: ["PIADA", "SBLYR"],
      },
    },
  },
};
console.log("metadata: ", metadata);

// 7. Define transaction
const _balance = await cardano.queryUtxo(_signerAddress);
console.log(_balance);
const tx = {
  txIn: _balance,
  txOut: [
      {
          address: _signerAddress,
          value: {..._balance.value, [ASSET_ID]: _balance[0].value[ASSET_ID] + _amount}
      }
  ],
  mint: [
      { action: "mint", quantity: _amount, asset: ASSET_ID, script: mintScript },
    ],
  metadata,
  witnessCount: 2
}



console.log("transaction: ", tx);
const raw = cardano.transactionBuildRaw(tx);
//   const fee = cardano.transactionCalculateMinFee({
//     ...tx,
//     txBody: raw,
//   });

// console.log("raw: ", raw);
// 8. Build transaction
// const buildTransaction = (tx) => {
//   const raw = cardano.transactionBuildRaw(tx);
//   const fee = cardano.transactionCalculateMinFee({
//     ...tx,
//     txBody: raw,
//   });
//   tx.txOut[0].value.lovelace -= fee;
//   return cardano.transactionBuildRaw({ ...tx, fee });
// };

// const raw = buildTransaction(tx);
// console.log("raw build transaction: ", raw);

// // 9. Sign transaction

// const txSigned = cardano.transactionSign({
//     signingKeys: [_signerKey, _signerKey],
//     txBody: tx,
//   });
// const txHash = cardano.transactionSubmit(txSigned);
// console.log(txHash);
}

mintNFT("TestNFT", "ipfs://QmUxRuzTi3UZS33rfqXzbD4Heut7zwtGUhuD7qSv7Qt584", "Time Warp Berry NFT", "addr_test1qpap6vsnd5eksmqxffsqnvpqfp0wjyd4rf3vs6m59wlfj8wce4822gg09zrp2h0932v0gylm4mcxu4ea45yhrxyfzhsq05v6xj", "5820187cdf15f8fe9dafc7f595421bb932f6ed708ed3103dd331a911bdd7cae1e65f", 1, "5c322476d9350f058ed66069c0758417e89e395a2bae1f99009eb40c");