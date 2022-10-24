const cardano = require("./cardano");

const sender = cardano.wallet("Fasih");
const ASSET_ID = '5c322476d9350f058ed66069c0758417e89e395a2bae1f99009eb40c.546573744e4654';

const senderAddress = 'addr_test1qpap6vsnd5eksmqxffsqnvpqfp0wjyd4rf3vs6m59wlfj8wce4822gg09zrp2h0932v0gylm4mcxu4ea45yhrxyfzhsq05v6xj';
const receiverAddress = 'addr_test1qr94r8rg0hmyrwe37up3lldkcv7hln99kwkd6gnwv2wzqq3gxj6v24vdrm9c7kt36wxe0yl8aft9vkj5kqzkjnycugjsxr3sa8';
const balanceSender = cardano.queryUtxo(senderAddress);
const balanceReceiver = cardano.queryUtxo(receiverAddress);
console.log(balanceSender);
console.log(balanceReceiver);
const txInfo = {
  txIn: balanceSender,
  txOut: [
    {
      address: senderAddress,
      value: {...balanceSender[0].value,
      lovelace: balanceSender[0].value.lovelace - cardano.toLovelace(1.5),
      [ASSET_ID]: 23
      },
    },
    {
      address: receiverAddress,
      value: {
        lovelace: cardano.toLovelace(1.5),
        [ASSET_ID]: 1,
      },
    },
  ],
};

const raw = cardano.transactionBuildRaw(txInfo);
console.log(raw);
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
  signingKeys: [sender.payment.skey],
});

//subm transaction
const txHash = cardano.transactionSubmit(txSigned);
console.log("TxHash: " + txHash);