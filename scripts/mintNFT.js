const cardano = require("./cardano");

async function selfMint(_policyId, _assetName, _amount, _assetImg, _assetDes, _signerAddress, _signerPath)
{
  var tx;
  let accountInfo = cardano.addressInfo(_signerAddress);
  let _accountInfo = accountInfo.base16;
  let _keyhash = _accountInfo.toString().slice(2, 58);
  const mintScript = {
    keyHash: _keyhash,
    type: "sig",
  };

const POLICY_ID = _policyId.toString();

const ASSET_NAME = _assetName.toString();

const ASSET_NAME_HEX = ASSET_NAME.split("")
  .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
  .join("");

const ASSET_ID = POLICY_ID + "." + ASSET_NAME_HEX;

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

const _balance = await cardano.queryUtxo(_signerAddress);
assetExists = await ifExists();
if(assetExists)
{
  tx = {
    txIn: _balance,
    txOut: [
        {
          address: _signerAddress,
          value: {..._balance[0].value, [ASSET_ID]: _balance[0].value[ASSET_ID] + _amount}
        }
    ],
    mint: [
        { action: "mint", quantity: _amount, asset: ASSET_ID, script: mintScript },
      ],
    metadata,
    witnessCount: 2
  }
}
else
{
  tx = {
    txIn: _balance,
    txOut: [
        {
          address: _signerAddress,
          value: {..._balance[0].value, [ASSET_ID]: _amount}
        }
    ],
    mint: [
        { action: "mint", quantity: _amount, asset: ASSET_ID, script: mintScript },
      ],
    metadata,
    witnessCount: 2
  }
}

// 8. Build transaction
const buildTransaction = (tx) => {

  const raw = cardano.transactionBuildRaw(tx);
  const fee = cardano.transactionCalculateMinFee({
      ...tx,
      txBody: raw
  });

  tx.txOut[0].value.lovelace -= fee;

  return cardano.transactionBuildRaw({ ...tx, fee });
}

const raw = buildTransaction(tx);
// 9. Sign transaction
const signTransaction = (_signerPath, tx) => {

    return cardano.transactionSign({
        signingKeys: [_signerPath, _signerPath],
        txBody: tx
    })
};

const signed = signTransaction(_signerPath, raw);

const txHash = cardano.transactionSubmit(signed);

console.log(txHash);
}

//--------------------------------------//////----------------------------------------------------

async function mintTo(_policyId, _assetName, _amount, _assetImg, _assetDes, _signerAddress, _receiverAddress, _signerPath)
{
  let accountInfo = cardano.addressInfo(_signerAddress);
  let _accountInfo = accountInfo.base16;
  let _keyhash = _accountInfo.toString().slice(2, 58);
  const mintScript = {
    keyHash: _keyhash,
    type: "sig",
  };

const POLICY_ID = _policyId.toString();

const ASSET_NAME = _assetName.toString();

const ASSET_NAME_HEX = ASSET_NAME.split("")
  .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
  .join("");

const ASSET_ID = POLICY_ID + "." + ASSET_NAME_HEX;

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

const _balanceSigner = await cardano.queryUtxo(_signerAddress);
const _balanceReceiver = await cardano.queryUtxo(_receiverAddress);


// minting to other address along with some ADA... 
const tx = {
    txIn: _balanceSigner,
    txOut: [
      {
        address:_signerAddress.toString(),
        value: {..._balanceSigner[0].value, lovelace: _balanceSigner[0].value.lovelace - cardano.toLovelace(1.5)}
      },
      {
        address:_receiverAddress.toString(),
        value:{..._balanceReceiver[0].value,lovelace: cardano.toLovelace(1.5), [ASSET_ID]: _amount}
      }
    ],
    mint: [
        { action: "mint", quantity: _amount, asset: ASSET_ID, script: mintScript },
      ],
    metadata,
    witnessCount: 2
  }
// console.log("updated balance: ", _balanceReceiver);
// 8. Build transaction
const buildTransaction = (tx) => {

  const raw = cardano.transactionBuildRaw(tx);
  const fee = cardano.transactionCalculateMinFee({
    ...tx,
    txBody: raw
  });

  tx.txOut[0].value.lovelace -= fee;

  return cardano.transactionBuildRaw({ ...tx, fee });
}
const raw = buildTransaction(tx);

// 9. Sign transaction
const signTransaction = (_signerPath, tx) => {
    return cardano.transactionSign({
        signingKeys: [_signerPath, _signerPath],
        txBody: tx
    })
};
const signed = signTransaction(_signerPath, raw);
const txHash = cardano.transactionSubmit(signed);
console.log(txHash);
}

// selfMint('5c322476d9350f058ed66069c0758417e89e395a2bae1f99009eb40c', 'TestNFT', 1, 'ipfs://QmUxRuzTi3UZS33rfqXzbD4Heut7zwtGUhuD7qSv7Qt584', 'Time Warp Berry NFT', 'addr_test1qpap6vsnd5eksmqxffsqnvpqfp0wjyd4rf3vs6m59wlfj8wce4822gg09zrp2h0932v0gylm4mcxu4ea45yhrxyfzhsq05v6xj', './priv/wallet/Fasih/Fasih.payment.skey');
mintTo('5c322476d9350f058ed66069c0758417e89e395a2bae1f99009eb40c', 'TestNFT', 1, 'ipfs://QmUxRuzTi3UZS33rfqXzbD4Heut7zwtGUhuD7qSv7Qt584', 'Time Warp Berry NFT', 'addr_test1qpap6vsnd5eksmqxffsqnvpqfp0wjyd4rf3vs6m59wlfj8wce4822gg09zrp2h0932v0gylm4mcxu4ea45yhrxyfzhsq05v6xj', 'addr_test1qr94r8rg0hmyrwe37up3lldkcv7hln99kwkd6gnwv2wzqq3gxj6v24vdrm9c7kt36wxe0yl8aft9vkj5kqzkjnycugjsxr3sa8','./priv/wallet/Fasih/Fasih.payment.skey');

async function ifExists(_utxo, _asset)
{
  const response = _utxo[0].value[_asset];
  if(response == undefined)
  {
    return false;
  }
  else
  {
    return true;
  }
}