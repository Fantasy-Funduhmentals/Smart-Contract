const cardano = require("./cardano");

async function transfer(_senderPubKey, _senderPrivateKey, _receiverPubKey, _nftId, _amount)
{
  
const txInfo = {
  txIn: cardano.queryUtxo(_senderPubKey),
  txOut: [
    {
      address: _senderPubKey,
      value: {
        lovelace:txIn.value.lovelace - cardano.toLovelace(1.5),
      },
    },
    {
      address: _to,
      value: {
        lovelace: cardano.toLovelace(1.5),
        _nftId: _amount,
      },
    },
  ],
};

const raw = cardano.transactionBuildRaw(txInfo);

const fee = cardano.transactionCalculateMinFee({
  ...txInfo,
  txBody: raw,
  witnessCount: 1,
});

//pay the fee by subtracting it from the sender utxo
txInfo.txOut[0].value.lovelace -= fee;

//create final transaction
const tx = cardano.transactionBuildRaw({ ...txInfo, fee });

//sign the transaction
const txSigned = cardano.transactionSign({
  txBody: tx,
  signingKeys: [_senderPrivateKey],
});

//submit transaction
const txHash = cardano.transactionSubmit(txSigned);
console.log("TxHash: " + txHash);
}
