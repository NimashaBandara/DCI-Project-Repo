import React from "react";
import "./App.css";
import {
  ClerkProvider,
  SignedIn,
  SignedOut,
  UserButton,
  useUser,
  SignInWithMetamaskButton,
  UserProfile,
  RedirectToSignIn,
} from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

const frontendApi = process.env.REACT_APP_CLERK_FRONTEND_API;

function App() {
  const navigate = useNavigate();

  return (
    <ClerkProvider frontendApi={frontendApi} navigate={(to) => navigate(to)}>
      <SignedIn>
        <Home />
      </SignedIn>
      <SignedOut>
        {/* <SignInWithMetamaskButton /> */}
        <RedirectToSignIn />
      </SignedOut>
    </ClerkProvider>
  );
}

function Home() {
  const { user } = useUser();

  return (
    <div className="App-header">
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "1rem",
        }}
      >
        <span>{user ? <h1>Hello, {user.firstName}!</h1> : null}</span>

        <div
          style={{
            paddingLeft: "700px",
            fontSize: "100px",
          }}
        >
          <UserButton />
        </div>
      </header>
      <span>
        {user ? (
          <p>
            your account is : '
            <font color="red">{user.web3Wallets[0].web3Wallet}</font>'
          </p>
        ) : null}
      </span>

      <UserProfile />
    </div>
  );
}

export default App;
