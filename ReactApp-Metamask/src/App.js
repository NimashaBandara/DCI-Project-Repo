import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";
import MetaMaskOnboarding from "@metamask/onboarding";
function App() {
  const [logged, setLogged] = useState(false);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState();
  //const forwarderOrigin = "http://localhost:3000";
  const onboarding = new MetaMaskOnboarding({});
  const { utils } = require("ethers");
  const [provider, setProvider] = useState("");
  const [mess, setMessage] = useState();
  const [signature, setSignature] = useState();
  //const [address, setAddress] = useState("");
  const [hasSignature, setHasSignature] = useState(false);
  const [verifyAddress, setVerifyAddress] = useState("");
  const [verificationStatus, setVerificationStatus] = useState("");
  const handleLogin = () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask Here!");
      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          console.log(result);
          setLogged(true);
          setAccount(utils.getAddress(result[0]));
          setProvider(new ethers.providers.Web3Provider(window.ethereum));
        })
        .catch((error) => {
          console.log("Could not detect Account");
        });
    } else {
      console.log("Need to install MetaMask");
      onboarding.startOnboarding();
    }
  };
  const hnadleLogout = () => {
    setLogged(false);
    setAccount(null);
  };
  const handleBalance = () => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [account, "latest"] })
      .then((balance) => {
        setBalance(ethers.utils.formatEther(balance));
        console.log("provider is " + provider.Web3Provider);
      })
      .catch((error) => {
        console.log("Could not detect the Balance");
      });
  };
  const handleChange = (e) => {
    setMessage(e.target.value);
  };
  const handleSign = async () => {
    const message = mess;
    const signer = await provider.getSigner();
    const signature = await signer.signMessage(message);
    const address = await signer.getAddress();

    // const sig = await window.ethereum.request({
    //   method: "personal_sign",
    //   params: [message, account],
    // });

    setSignature(signature);
    //setAddress(address);
    setHasSignature(true);
    console.log("sig : " + signature);
  };
  const verify = () => {
    if (hasSignature) {
      const actualAddress = utils.verifyMessage(mess, signature);
      console.log(actualAddress);
      setVerifyAddress(actualAddress);
      if (actualAddress !== account) {
        console.log("invalid");
        setVerificationStatus("False");
      } else {
        console.log("valid");
        setVerificationStatus("True");
      }
    } else {
      setVerificationStatus("Require Signature");
    }
  };
  return (
    <div>
      {!logged ? (
        <div className="App">
          <h1>Log in with Metamask wallet</h1>
          <button onClick={handleLogin}>Connect</button>
        </div>
      ) : (
        <div className="App">
          <h1>Connected from {account}</h1>
          <button onClick={hnadleLogout}>Disconnect</button>
          <br></br>
          <br></br>
          <button onClick={handleBalance}>check Balance</button>
          <h2>Balance is {balance}</h2>
          <input
            type="text"
            placeholder="message"
            onChange={(e) => handleChange(e)}
          />
          <button onClick={() => handleSign()}>Sign</button>
          <div style={{ backgroundColor: "#faf6d4" }}>
            <p>
              <font size="5" color="red">
                Message is : <br></br>
                {mess}
              </font>
            </p>
            <p>
              <font size="5">
                signature is : <br></br>
                {signature}
              </font>
            </p>
            <p>
              <font size="5" color="green">
                address is : <br></br>
                {account}
              </font>
            </p>
          </div>
          <div style={{ backgroundColor: "#edffa6" }}>
            <br></br>
            <button onClick={verify}>Verify</button>
            <p>
              <font size="5" color="purple">
                verification : <br></br>
                {verificationStatus}
              </font>
            </p>
            <p>
              <font size="5" color="blue">
                verification address is : <br></br>
                {verifyAddress}
              </font>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
