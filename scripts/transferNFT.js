const cardano = require("./cardano");

async function transfer(_senderPubKey, _signerPath, _receiverPubKey, _nftId, _amount)
{
  // complete id of NFT  policyId+hexName

const _balanceSender = await cardano.queryUtxo(_senderPubKey);
const _balanceReceiver = await cardano.queryUtxo(_receiverPubKey);
const txInfo = {
  txIn: _balanceSender,
  txOut: [
    {
      address: _senderPubKey,
      value: {
        lovelace:_balanceSender[0].value.lovelace - cardano.toLovelace(1.5),
      },
    },
    {
      address: _receiverPubKey,
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
txInfo.txOut[0].value.lovelace -= fee;
const tx = cardano.transactionBuildRaw({ ...txInfo, fee });
const txSigned = cardano.transactionSign({
  txBody: tx,
  signingKeys: [_senderPrivateKey],
});
const txHash = cardano.transactionSubmit(txSigned);
console.log("TxHash: " + txHash);
}

transfer('addr_test1qpap6vsnd5eksmqxffsqnvpqfp0wjyd4rf3vs6m59wlfj8wce4822gg09zrp2h0932v0gylm4mcxu4ea45yhrxyfzhsq05v6xj', './priv/wallet/Fasih/Fasih.payment.address', "addr_test1qr94r8rg0hmyrwe37up3lldkcv7hln99kwkd6gnwv2wzqq3gxj6v24vdrm9c7kt36wxe0yl8aft9vkj5kqzkjnycugjsxr3sa8", '5c322476d9350f058ed66069c0758417e89e395a2bae1f99009eb40c.546573744e4654', 4);