const express = require("express");
const app = express();
const cors = require("cors");
const port = 3042;
const { keccak256 } = require("ethereum-cryptography/keccak");
const { utf8ToBytes } = require("ethereum-cryptography/utils");
const secp = require("ethereum-cryptography/secp256k1");
const { toHex } = require("ethereum-cryptography/utils");

app.use(cors());
app.use(express.json());

const balances = {
  "046212a9918b5d1ab7de88837421626eac9e5ed84a0f9f91b68e2ffcfe54f47a6ad898ede5226eee8f071a90d8022de3ada0e4ccd1b65116eb8471d3ac9a5b743a": 100,
  "0405bd280528aeadfc6e1e17b4d882824dcae85660b56437fa463428fe6f3dbf7292cd9f365dad892c502e5f153da06fbdae475814e38762a3daba9f5f698d7f82": 50,
  "041625719e8838d44a1174ce7cfecaefb2db01bd07888f006ef2826f5702d60f159167c4a5dabfc74703d941612703266b5fc357f67bbfa6b0bbf94e3ae3eb02a9": 75,
};

const privateKey = {
  "046212a9918b5d1ab7de88837421626eac9e5ed84a0f9f91b68e2ffcfe54f47a6ad898ede5226eee8f071a90d8022de3ada0e4ccd1b65116eb8471d3ac9a5b743a":
    "aa2b568c559e0b413991ea45ebf12f66c79136495352b35e5a33fcd7a14c54af",
  "0405bd280528aeadfc6e1e17b4d882824dcae85660b56437fa463428fe6f3dbf7292cd9f365dad892c502e5f153da06fbdae475814e38762a3daba9f5f698d7f82":
    "108f91672851934c69826b7c7512962dfe3f428813681047347ba19d58ae4300",
  "041625719e8838d44a1174ce7cfecaefb2db01bd07888f006ef2826f5702d60f159167c4a5dabfc74703d941612703266b5fc357f67bbfa6b0bbf94e3ae3eb02a9":
    "f609754d6024883107567da4262ab0986db6d30b141e11b63cb8f8c1d67379a8",
};

app.get("/balance/:address", (req, res) => {
  const { address } = req.params;
  const balance = balances[address] || 0;
  res.send({ balance });
});

const hashMessage = (msg) => {
  const bytes = utf8ToBytes(msg);
  const hash = keccak256(bytes);
  return hash;
};

app.post("/send", async (req, res) => {
  const { publicKey, signature, recipient, amount } = req.body;

  const message = `pay ${recipient} amount ${amount}`;
  const hash = hashMessage(message);

  if (!secp.verify(signature, toHex(hash), publicKey)) {
    res.status(400).send({ message: "invalid transaction" });
    return;
  }

  if (balances[publicKey] < amount) {
    res.status(400).send({ message: "Not enough funds!" });
  } else {
    balances[publicKey] -= amount;
    balances[recipient] += amount;
    res.send({ balance: balances[publicKey] });
  }
});

app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
});

function setInitialBalance(address) {
  if (!balances[address]) {
    balances[address] = 0;
  }
}
