const CardanocliJs = require("cardanocli-js");
const cardano = new CardanocliJs({
  network: "testnet-magic 1",
  shelleyGenesisPath:
    "/home/quantumalgopot/Desktop/Fantasy/config/shelley-genesis.json",
});
module.exports = cardano;

const createWallet = (account) => {
  const payment = cardanocliJs.addressKeyGen(account);
  const stake = cardanocliJs.stakeAddressKeyGen(account);
  cardanocliJs.stakeAddressBuild(account);
  cardanocliJs.addressBuild(account, {
    paymentVkey: payment.vkey,
    stakeVkey: stake.vkey,
  });
  return cardanocliJs.wallet(account);
};

async function getBalance() {
  const sender = await cardanocliJs.wallet("Fasih");
  console.log(sender.balance());
}

getBalance();
