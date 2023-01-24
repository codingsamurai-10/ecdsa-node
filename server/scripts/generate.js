const { toHex } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");

const privateKey = secp.utils.randomBytes();
const publicKey = secp.getPublicKey(privateKey);

console.log(toHex(privateKey));
console.log(toHex(publicKey));
