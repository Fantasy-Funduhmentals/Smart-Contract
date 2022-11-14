const cardano = require("./cardano");

const senderAddress = 'addr_test1qzjq58nukgyr7ck927w2nllgyy9jp0xmx552jr3udaz2t6yqejhltyhdn3z00cwrv0gvza9etkg20rzars058qgzqhcqzk0aq6';
const receiverAddress = 'addr_test1qpap6vsnd5eksmqxffsqnvpqfp0wjyd4rf3vs6m59wlfj8wce4822gg09zrp2h0932v0gylm4mcxu4ea45yhrxyfzhsq05v6xj';
const senderPrivateKey = './priv/wallet/Bilal/Bilal.payment.skey';
const senderUtxo = cardano.queryUtxo(senderAddress);
const receiverUtxo = cardano.queryUtxo(receiverAddress);
const txInfo = {
    txIn: senderUtxo,
    txOut:
    [
      {
        address:senderAddress.toString(),
        value: 
        {...senderUtxo[0].value, lovelace: senderUtxo[0].value.lovelace - cardano.toLovelace(5)}
      },
      {
        address:receiverAddress.toString(),
        value:{lovelace: cardano.toLovelace(5)}
      }
    ]
}

const raw = cardano.transactionBuildRaw(txInfo);
const fee = cardano.transactionCalculateMinFee({
  ...txInfo,
  txBody: raw,
  witnessCount: 1,
});

txInfo.txOut[0].value.lovelace -= fee;
const tx = cardano.transactionBuildRaw({ ...txInfo, fee });
const txSigned = cardano.transactionSign({
  txBody: tx,
  signingKeys: [senderPrivateKey],
});
const txHash = cardano.transactionSubmit(txSigned);
console.log("TxHash: " + txHash);
