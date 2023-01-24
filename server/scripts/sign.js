const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

const amount = 20;
const recipient =
  "0405bd280528aeadfc6e1e17b4d882824dcae85660b56437fa463428fe6f3dbf7292cd9f365dad892c502e5f153da06fbdae475814e38762a3daba9f5f698d7f82";
const privateKey =
  "aa2b568c559e0b413991ea45ebf12f66c79136495352b35e5a33fcd7a14c54af";

const hashMessage = (msg) => {
  const bytes = utf8ToBytes(msg);
  const hash = keccak256(bytes);
  return hash;
};

const message = `pay ${recipient} amount ${amount}`;
const hash = hashMessage(message);

secp.sign(hash, privateKey).then((signature) => console.log(toHex(signature)));
