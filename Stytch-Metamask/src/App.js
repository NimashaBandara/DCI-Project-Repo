import "./App.css";
import { useEffect, useState } from "react";
import { ethers } from "ethers";
import MetaMaskOnboarding from "@metamask/onboarding";
import { Button, Container } from "@mui/material";
function App() {
  const [logged, setLogged] = useState(false);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState("");
  //-const [provider, setProvider] = useState("");
  const [mess, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [address, setAddress] = useState("");
  const [user, setUser] = useState("");
  const forwarderOrigin = "http://localhost:3000";
  const onboarding = new MetaMaskOnboarding({ forwarderOrigin });
  const { utils } = require("ethers");

  const loginFlowFunction = async () => {
    if (window.ethereum && window.ethereum.isMetaMask) {
      console.log("MetaMask Here!");

      window.ethereum
        .request({ method: "eth_requestAccounts" })
        .then((result) => {
          console.log(result);

          const acc = utils.getAddress(result[0]);
          //-const pro = new ethers.providers.Web3Provider(window.ethereum);
          setAccount(acc);
          //-setProvider(pro);

          //=================First API call==================================
          const requestOptions = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization:
                "Basic " +
                btoa(
                  "<Project-id>:<project-secret>"
                ),
            },

            body: JSON.stringify({
              crypto_wallet_type: "ethereum",
              crypto_wallet_address: acc,
            }),
          };
          fetch(
            "https://test.stytch.com/v1/crypto_wallets/authenticate/start",
            requestOptions
          )
            .then((response) => response.json())
            .then(async (data) => {
              console.log("data" + data);
              const chall = data.challenge;
              setMessage(data.challenge);

              //----------------------------

              const sig = await window.ethereum.request({
                method: "personal_sign",
                params: [chall, acc],
              });
              setSignature(sig);
              //++++++++++++++++++++++++++++++++++++++++++++++++++++
              const nextRequestOptions = {
                method: "POST",
                headers: {
                  //Accept: "application/json, text/plain, */*",

                  // "Access-Control-Allow-Origin": "*",
                  "Content-Type": "application/json",
                  Authorization:
                    "Basic " +
                    btoa(
                      "<Project-id>:<project-secret>"
                    ),
                },
                body: JSON.stringify({
                  crypto_wallet_type: "ethereum",
                  crypto_wallet_address: acc,
                  signature: sig,
                  session_duration_minutes: 10,
                }),
              };
              console.log("acc" + account);
              fetch(
                "https://test.stytch.com/v1/crypto_wallets/authenticate",
                nextRequestOptions
              )
                .then((response) => response.json())
                .then((data) => {
                  console.log(data);
                  setUser(data.user_id);
                  if (data.status_code == 200) {
                    setLogged(true);
                  } else {
                    setLogged(false);
                  }
                })
                .catch((error) => console.log("error is " + error));
            })
            .catch((error) => console.log("error is " + error));
        })
        .catch((error) => {
          console.log("Could not detect Account metamask");
        });
    } else {
      console.log("Need to install MetaMask");
      onboarding.startOnboarding();
    }
  };

  const handleBalance = () => {
    window.ethereum
      .request({ method: "eth_getBalance", params: [account, "latest"] })
      .then((balance) => {
        setBalance(ethers.utils.formatEther(balance));
      })
      .catch((error) => {
        console.log("Could not detect the Balance");
      });
  };

  const hnadleLogout = () => {
    console.log("address using " + account);
    setLogged(false);
    setAccount(null);
  };
  return (
    <div>
      {!logged ? (
        <div className="App">
          <Button
            onClick={loginFlowFunction}
            variant="contained"
            className="button"
          >
            Crypto Wallet Connect
          </Button>
        </div>
      ) : (
        <div className="appnxt">
          <h1>Welcome to the page!!</h1>
          <div
            style={{
              backgroundColor: "#faf6d4",
              marginBottom: "60px",
              marginTop: "60px",
            }}
          >
            <h2>
              <u>
                <font color="brown">Details of your login are below</font>
              </u>
            </h2>
            <p>
              <font size="5" color="green">
                Wallet Address is : <br></br>
                {account}
              </font>
            </p>
            <p>
              <font size="5" color="red">
                Message is : <br></br>
                {mess}
              </font>
            </p>
            <p>
              <font size="5" color="purple">
                Signature is : <br></br>
                {signature}
              </font>
            </p>

            <p>
              <font size="5">
                Stytch User is : <br></br>
                {user}
              </font>
            </p>
            <Button onClick={handleBalance} variant="contained" color="primary">
              Check Balance
            </Button>
            <p>
              <font size="5">
                Balance is : <br></br>
                {balance}
              </font>
            </p>
          </div>
          <Button onClick={hnadleLogout} variant="contained" color="success">
            Log Out
          </Button>
        </div>
      )}
    </div>
  );
}
export default App;
