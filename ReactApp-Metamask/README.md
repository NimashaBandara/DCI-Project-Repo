## handleLogin()

- if (window.ethereum && window.ethereum.isMetaMask) - if window.ethereum object esist and if metamask is installed to browser
  type console.log(window.ethereum) to see the object and under target, can see the isMetamask attribute

- window.ethereum.request({ method: "eth_requestAccounts" }) - MetaMask uses the ethereum.request(args) method to wrap an RPC API.
  eth-requestAccounts is restricted method. If a method is restricted, the caller must have the corresponding permission in order to call it.
  this returns An array of a single, hexadecimal Ethereum address string.
  The request causes a MetaMask popup to appear

- setAccount(utils.getAddress(result[0])); - gets the address of wallets.
  uses ethers library here to format the returned address
  otherwise there might be simple, capital case issue

- setProvider(new ethers.providers.Web3Provider(window.ethereum)) - it will detect the provider. provider is a abstractiob for a connection to etehereum network. metamask is a provider.
  uses from ethers library.

- onboarding.startOnboarding() -sending users offsite to install MetaMask presents challenges. Most notably, you must inform the user to return to your site and refresh their browser after the installation

## handleBalance()

- window.ethereum.request({ method: "eth_getBalance", params: [account, "latest"] }) - get the account balance
  calls Post https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161 endpoint top get the balance
  integer block number, or the string "latest", "earliest" or "pending"

## handleSign()

- const signer = await provider.getSigner() - get the signer. the class which hasdirect/ indirect access to private key and transaction of wallet. here metamask at as signre.
  const signature = await signer.signMessage(message) - get the message signed and catch returned signature.

## verify()

- const actualAddress = utils.verifyMessage(mess, signature) - the function from ethers library to get the relevant public address from mesage and signature that signed by private key.
