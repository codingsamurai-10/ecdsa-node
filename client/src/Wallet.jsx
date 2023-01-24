import server from "./server";

function Wallet({
  address,
  setAddress,
  signature,
  setSignature,
  balance,
  setBalance,
}) {
  async function onAddressChange(evt) {
    const address = evt.target.value;
    setAddress(address);
    if (address) {
      const {
        data: { balance },
      } = await server.get(`balance/${address}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  function onSignChange(evt) {
    const sign = evt.target.value;
    setSignature(sign);
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Wallet Address
        <input
          placeholder="Type an address, for example: 0x1"
          value={address}
          onChange={onAddressChange}
        ></input>
      </label>

      <label>
        Signature
        <input
          placeholder="Paste your signature in hex"
          value={signature}
          onChange={onSignChange}
        ></input>
      </label>

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
