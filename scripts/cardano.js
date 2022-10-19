const CardanocliJs = require("cardanocli-js");
const cardano = new CardanocliJs({
  network: "testnet-magic 1",
  shelleyGenesisPath:
    "/home/kryptomind/Documents/cardano/cardano-minter-final/shelley-genesis.json",
});
module.exports = cardano;
