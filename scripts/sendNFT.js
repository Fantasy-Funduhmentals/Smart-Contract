const cardano = require("./cardano");

const sender = cardano.wallet("Fasih");
console.log(sender.balance());
console.log(
  "Balance of Sender wallet: " +
    cardano.toAda(sender.balance().value.lovelace) +
    " ADA"
);

const receiver =
  "addr_test1qr94r8rg0hmyrwe37up3lldkcv7hln99kwkd6gnwv2wzqq3gxj6v24vdrm9c7kt36wxe0yl8aft9vkj5kqzkjnycugjsxr3sa8";

const txInfo = {
  txIn: cardano.queryUtxo(sender.paymentAddr),
  txOut: [
    {
      address: sender.paymentAddr,
      value: {
        lovelace: sender.balance().value.lovelace - cardano.toLovelace(1.5),
      },
    },
    {
      address: receiver,
      value: {
        lovelace: cardano.toLovelace(1.5),
        "5c322476d9350f058ed66069c0758417e89e395a2bae1f99009eb40c.546573744e4654": 1,
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
  signingKeys: [sender.payment.skey],
});

//subm transaction
const txHash = cardano.transactionSubmit(txSigned);
console.log("TxHash: " + txHash);
