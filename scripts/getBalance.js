const cardano = require("./cardano");

const sender = cardano.wallet("Fasih");
console.log(sender.balance());
