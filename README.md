# theShmeeps  

Mock-up NFT project with the ability to stake and earn tokens.  

<strong>Website</strong>  

https://the-shmeeps.herokuapp.com/  

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

3. Install Ganache globally  
`npm i -g ganache`  

4. Download or clone this repository (you may need to install git if cloning using the command line interface - `npm i -g git`)  
`git clone https://github.com/0xJayden/theShmeeps.git`  

5. Enter the correct project directory (depends on where you downloaded/cloned the repository to)  
e.g. `cd desktop/theShmeeps`  

6. Install dependencies  
`npm install`  

<strong>How To Use</strong>  

1. Open ganache and click the Quickstart button.  

2. Make sure you have MetaMask installed https://metamask.io and connect to a network that matches the network ganache is using (Shows towards the top of Ganache, usually the RPC URL being HTTP://127.0.0.1:7545 and the NETWORK ID being 5777) and the port matches in truffle-config.js.  

3. Import an account from Ganache to your MetaMask.  

4. Deploy the contracts to the development network, which is called development, in truffle-config.js   
`truffle migrate --network development`  

5. Launch the DApp `npm start` and connect the imported account from MetaMask to the site.  

If you'd like to launch on a test network like Rinkeby, replace development in step 4 with your preffered network (rinkeby and matic are already available in truffle-config.js, if you want to deploy on a different network, then add it in module.exports under networks in truffle-config.js before you migrate)
