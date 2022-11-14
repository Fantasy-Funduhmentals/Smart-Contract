const cardano = require("./cardano");

const sender = cardano.wallet("Bilal");
console.log(sender.balance());
