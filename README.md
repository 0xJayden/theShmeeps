# The Shmeeps  

Mock-up NFT project with the ability to stake and earn tokens.  

<strong>Website</strong>  

https://theshmeeps.surge.sh/  

<strong>How To Use</strong>  

1. Make sure you have MetaMask installed and connect to the site using the Rinkeby network.  

2. Make sure you have enough ETH in your account on the Rinkeby network for gas to mint the free NFT (you can mint up to 3).  

3. After you recieve your NFT(s), you may stake the NFT(s) to farm tokens. Once staked, you can claim your tokens at anytime or claim tokens & unstake your NFT(s) at the same time. To see the tokens in your wallet, import the token to your MetaMask. Here's the token contract address 0x2a47F52B0fb86e83C723C3235d3fe41e612bF351.  

<i>==================================================================================</i>  

<strong>For Devs</strong>  

<strong>Initial Set-Up:</strong>  

1. Make sure node is installed (Used version 14.17.0, use the same to avoid potential errors.)

2. Install Truffle globally  
`npm i -g truffle`  

3. Install Ganache CLI globally  
`npm i -g ganache-cli`  

4. Download or clone this repository (you may need to install git if cloning using the command line interface - `npm i -g git`)  
`git clone https://github.com/0xJayden/theShmeeps.git`  

5. Enter the correct project directory (depends on where you downloaded/cloned the repository to)  
e.g. `cd desktop/theShmeeps`  

6. Install dependencies  
`npm install`  

<strong>How To Use</strong>  

1. Create an account on https://alchemy.com, then create a new app and fill out the required fields. Make sure that the Chain is Ethereum and the Network is Rinkeby.  

2. View the details of your newly created app, click view key and copy the HTTP or Websockets key.  

3. Run a local blockchain by forking the Ethereum Rinkeby test network using Ganache CLI with the copied key from your app in Alchemy in a separate CLI window or tab  
`ganache-cli -f pasteKeyHere`  

4. Make sure you have MetaMask installed https://metamask.io, import one of the given accounts from the local blockchain by copy pasting that account's private key in your MetaMask and connect to network LocalHost 8545.  

5. Run the DApp in the previous CLI window where you are in the project directory  
`npm start`  
