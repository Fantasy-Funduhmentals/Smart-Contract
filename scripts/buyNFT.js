const cardano = require("./cardano");

const buyerAddress = "addr_test1qzjq58nukgyr7ck927w2nllgyy9jp0xmx552jr3udaz2t6yqejhltyhdn3z00cwrv0gvza9etkg20rzars058qgzqhcqzk0aq6";
const buyerKeypath = "./priv/wallet/Bilal/Bilal.payment.skey";
const sellerAddress = 'addr_test1qpap6vsnd5eksmqxffsqnvpqfp0wjyd4rf3vs6m59wlfj8wce4822gg09zrp2h0932v0gylm4mcxu4ea45yhrxyfzhsq05v6xj';
async function buyNFT(_buyerAddress, _price, _sellerAddress, _buyerKeyPath)
{
    const buyerUtxo = cardano.queryUtxo(_buyerAddress);
    const sellerUtxo = cardano.queryUtxo(_sellerAddress);
    console.log(buyerUtxo[0]);
    const txInfo = {
        txIn: buyerUtxo,
        txOut:
        [
            {
                address:buyerAddress.toString(),
                value: 
                {...buyerUtxo[0].value, lovelace: buyerUtxo[0].value.lovelace - cardano.toLovelace(_price)}
            },
            {
                address:sellerAddress.toString(),
                value:{lovelace: cardano.toLovelace(_price)}
            }
        ]
    }

const raw = cardano.transactionBuildRaw(txInfo);

const fee = cardano.transactionCalculateMinFee({
  ...txInfo,
  txBody: raw,
  witnessCount: 1,
});

//pay the fee by subtracting it from the sender utxo
txInfo.txOut[0].value.lovelace -= fee;

const tx = cardano.transactionBuildRaw({ ...txInfo, fee });
const txSigned = cardano.transactionSign({
  txBody: tx,
  signingKeys: [_buyerKeyPath],
});
const txHash = cardano.transactionSubmit(txSigned);
console.log("TxHash: " + txHash);
return txHash;
}

async function verifyPurchase(_sellerAddress, _txHash, _price)
{
    let verified = false;
    const utxo = await cardano.queryUtxo(_sellerAddress);
    console.log(utxo);
    for(x = 0; x < utxo.length; x++)
    {
        if(utxo[x].txHash == _txHash && utxo[x].value.lovelace == cardano.toLovelace(_price))
        {
            verified = true;
            break;
        }
    }
    console.log("transaction verification: ", verified);
    return verified;
}

// buyNFT(buyerAddress, 5, sellerAddress, buyerKeypath);

verifyPurchase("addr_test1qpap6vsnd5eksmqxffsqnvpqfp0wjyd4rf3vs6m59wlfj8wce4822gg09zrp2h0932v0gylm4mcxu4ea45yhrxyfzhsq05v6xj", 'a5917b0042d5728566a42e6e6af530388e402a822f19b9c4ec8c592e599b6700', 15);
