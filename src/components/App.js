import { useState, useEffect } from 'react'
import axios from 'axios'
import { Row, Col } from 'react-bootstrap'
import Countdown from 'react-countdown'
import Web3 from 'web3'

// Import Images + CSS
//import logo from '../images/logo.png'
import shmeep1 from '../images/4.png'
import shmeep2 from '../images/134.png'
import shmeep3 from '../images/9.png'
import './App.css'

// Import ABI + Config
import OpenEmoji from '../abis/OpenEmoji.json'
import StakeShmeeps from '../abis/StakeShmeeps.json'
import ShmeepsToken from '../abis/ShmeepsToken.json'
import CONFIG from '../config.json'

function App() {
	const [web3, setWeb3] = useState(null)
	const [openEmoji, setOpenEmoji] = useState(null)
	const [stake, setStake] = useState(null)
	const [tokenIds, setTokenIds] = useState([])
	const [selectedTokens, setSelectedTokens] = useState([])
	const [selectedStakedTokens, setSelectedStakedTokens] = useState([])
	const [stakedShmeeps, setStakedShmeeps] = useState([])
	const [tokenIdsStaked, setTokenIdsStaked] = useState([])
	const [availableImageUrls, setAvailableImageUrls] = useState([])
	const [stakedImageUrls, setStakedImageUrls] = useState([])
	const [urlTl, setUrlTl] = useState(``)
	const [amount, setAmount] = useState(0)
	const [totalAmountStaked, setTotalAmountStaked] = useState(0)

	const [supplyAvailable, setSupplyAvailable] = useState(0)
	const [balanceOf, setBalanceOf] = useState(0)

	const [account, setAccount] = useState(null)
	const [currentNetwork, setCurrentNetwork] = useState(null)

	const [blockchainExplorerURL, setBlockchainExplorerURL] = useState('https://etherscan.io/')
	const [openseaURL, setOpenseaURL] = useState('https://opensea.io/')

	const [isMinting, setIsMinting] = useState(false)
	const [isError, setIsError] = useState(false)
	const [message, setMessage] = useState(null)

	const [currentTime, setCurrentTime] = useState(new Date().getTime())
	const [revealTime, setRevealTime] = useState(0)

	const loadBlockchainData = async () => {
		// Fetch Contract, Data, etc.
		if (web3) {
			const networkId = await web3.eth.net.getId()
			setCurrentNetwork(networkId)

			try {

				// Nft contract
				const openEmoji = new web3.eth.Contract(OpenEmoji.abi, OpenEmoji.networks[networkId].address)
				setOpenEmoji(openEmoji)

				// Staking contract
				const stake = new web3.eth.Contract(StakeShmeeps.abi, StakeShmeeps.networks[networkId].address)
				if(!stake) {
					window.alert("Staking contract not connected to current network!")
					return
				}
				setStake(stake)

				// Token contract
				const shmeepsToken = new web3.eth.Contract(ShmeepsToken.abi, ShmeepsToken.networks[networkId].address)
				if(!shmeepsToken) {
					window.alert("Staking contract not connected to current network!")
					return
				}

				// Load available supply
				const maxSupply = await openEmoji.methods.maxSupply().call()
				const totalSupply = await openEmoji.methods.totalSupply().call()
				setSupplyAvailable(maxSupply - totalSupply)

				// Balance of Nfts in account
				const balanceOf = await openEmoji.methods.balanceOf(account).call()
				setBalanceOf(balanceOf)

				// Load staked nfts on stakimg contract
				const tokenIdsStaked = await openEmoji.methods.walletOfOwner(StakeShmeeps.networks[networkId].address).call()
				setTokenIdsStaked(tokenIdsStaked)

				// Set reveal time
				const allowMintingAfter = await openEmoji.methods.allowMintingAfter().call()
				const timeDeployed = await openEmoji.methods.timeDeployed().call()
				setRevealTime((Number(timeDeployed) + Number(allowMintingAfter)).toString() + '000')

				// Fetch nfts available to stake
				const tokenIds = await openEmoji.methods.walletOfOwner(account).call()
				setTokenIds(tokenIds)

				// Fetch staked nfts
				const stakedShmeepsStream = await stake.getPastEvents('ShmeepStaked', { fromBlock: 10071770, toBlock: 'latest' })
				const allStakedShmeeps = (stakedShmeepsStream.map(event => event.returnValues))

				for(let i = 0; i < allStakedShmeeps.length; i++) {
					if(allStakedShmeeps[i].account === account && tokenIdsStaked.includes(allStakedShmeeps[i].tokenId)) {
						let stakedShmeepId = allStakedShmeeps[i].tokenId
						stakedShmeeps.push(stakedShmeepId)
					}
				}
				setStakedShmeeps(stakedShmeeps)

				// Available nfts and staked nfts in one array, iterate over array to create the template literal for the api url
				const images = [...tokenIds, ...stakedShmeeps]
				if (images.length === 1) {
					let urlTl = `token_ids=${images[0]}&`
					setUrlTl(urlTl)
				} else if (images.length > 1) {
					let urlTl = `token_ids=${images[0]}&`
					for (let i = 1; images.length > i; i++) {
						urlTl = urlTl + `token_ids=${images[i]}&`
					}
					setUrlTl(urlTl)
				} else {
					return
				}

				// Fetch api for nfts in owners wallet and in staking contract
				const result = await axios.get(
		        `https://testnets-api.opensea.io/api/v1/assets?${urlTl}asset_contract_address=0x8CE171d997d8a818D6c1437a39F344A74b068ADc&order_direction=desc&offset=0&limit=20`)
		        const assets = result.data.assets

		        // Put nft image urls in wallet in own array and staked nfts in another.
		        for (let i = 0; assets.length > i; i++) {
		        	if (tokenIds.includes(assets[i].token_id)) {
		        		availableImageUrls.push(assets[i].image_url)
		        	} else if (stakedShmeeps.includes(assets[i].token_id)) {
		        		stakedImageUrls.push(assets[i].image_url)
		        	}
		        }
		        setAvailableImageUrls(availableImageUrls)
		        setStakedImageUrls(stakedImageUrls)
		        const amountStaked = stakedImageUrls.length
		        setTotalAmountStaked(amountStaked)

				if (networkId !== 5777) {
					setBlockchainExplorerURL(CONFIG.NETWORKS[networkId].blockchainExplorerURL)
					setOpenseaURL(CONFIG.NETWORKS[networkId].openseaURL)
				}

			} catch (error) {
				setIsError(true)
				setMessage("Contract not deployed to current network, please change network in MetaMask")
			}

		}
	}

	const loadWeb3 = async () => {
		if (typeof window.ethereum !== 'undefined' && !account) {
			const web3 = new Web3(window.ethereum)
			setWeb3(web3)

			const accounts = await web3.eth.getAccounts()

			if (accounts.length > 0) {
				setAccount(accounts[0])
			} else {
				setMessage('Please connect with MetaMask')
			}

			window.ethereum.on('accountsChanged', function (accounts) {
				setAccount(accounts[0])
				setMessage(null)
			});

			window.ethereum.on('chainChanged', (chainId) => {
				// Handle the new chain.
				// Correctly handling chain changes can be complicated.
				// We recommend reloading the page unless you have good reason not to.
				window.location.reload();
			});
		}
	}

	// MetaMask Login/Connect
	const web3Handler = async () => {
		if (web3) {
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			setAccount(accounts[0])
		}
	}

	const mintNFTHandler = async () => {
		if (revealTime > new Date().getTime()) {
			window.alert('Minting is not live yet!')
			return
		}

		if (balanceOf + totalAmountStaked > 2) {
			window.alert('You\'ve already minted!')
			return
		}

		if (amount === 0) {
			window.alert('Please select an amount.')
			return
		}

		// Mint NFT
		if (openEmoji) {
			setIsMinting(true)
			setIsError(false)

			await openEmoji.methods.mint(amount).send({ from: account, value: 0 })
				.on('confirmation', async () => {
					const maxSupply = await openEmoji.methods.maxSupply().call()
					const totalSupply = await openEmoji.methods.totalSupply().call()
					setSupplyAvailable(maxSupply - totalSupply)

					const balanceOf = await openEmoji.methods.balanceOf(account).call()
					setBalanceOf(balanceOf)
				})
				.on('error', (error) => {
					window.alert(error)
					setIsError(true)
				})
		}

		setIsMinting(false)
	};

	// Render available nfts to stake.
	const renderTokenId = (i) => {
		return(
			<div className="col text-center" key={i}>
				<button className="button2" onClick={(e) => {
					if(!selectedTokens.includes(i)) {
						selectedTokens.push(i)
						setSelectedTokens(selectedTokens)
						e.target.className = "button3"
					} else if (selectedTokens.includes(i)) {
						let index = selectedTokens.indexOf(i)
						selectedTokens.splice(index, 1)
						setSelectedTokens(selectedTokens)
						e.target.className = "button2"
					}
				}}>
					<img className="nft" alt="available nft to stake" src={i}/>
				</button>
			</div>
		)
	}

	// Render staked nfts
	const renderStakedTokenId = (i) => {
		return(
			<div className="col text-center" key={i}>
				<button className="button2" onClick={(e) => {
					if(!selectedStakedTokens.includes(i)) {
						selectedStakedTokens.push(i)
						setSelectedStakedTokens(selectedStakedTokens)
						e.target.className = "button3"
					} else if (selectedStakedTokens.includes(i)) {
						let index = selectedStakedTokens.indexOf(i)
						selectedStakedTokens.splice(index, 1)
						setSelectedStakedTokens(selectedStakedTokens)
						e.target.className = "button2"
					}
				}}>
					<img className="nft" alt="staked nft" src={i}/>
				</button>
			</div>
		)
	}

	// Map nfts available to stake to render
	const showTokenIds = () => {
		if(balanceOf > 0) {
			return(
				<Row className="available-row my-2">
					{availableImageUrls.map(renderTokenId)}
				</Row>
			)
		} else {
			return(
				<Row className="my-2 text-center">
					<p>You don't own any Shmeeps ):</p>
				</Row>
			)
		}
	}

	// Map staked nfts to render
	const displayStakedTokens = () => {
		if(stakedShmeeps.length > 0) {
			return(
				<Row className="my-2">
					{stakedImageUrls.map(renderStakedTokenId)}
				</Row>
			)
		} else {
			return(
				<Row className="my-2 justify-content-center">
					No Shmeeps Staked.
				</Row>
			)
		}
	}

	// Stake selected nfts
	const stakeHandler = async () => {
		if(selectedTokens.length > 0) {
			await stake.methods.stakeShmeep(selectedTokens).send({ from: account, gas: 1000000 })
			const amountStaked = selectedTokens.length
			totalAmountStaked += amountStaked
			setTotalAmountStaked(amountStaked)
		} else {
			return
		}
	}

	// Claim tokens and unstake nfts
	const claimTokensAndUnstake = async () => {
		if(stakedShmeeps.length > 0) {
			await stake.methods.claimTokens(selectedStakedTokens, true).send({ from: account, gas: 1000000 })
		} else {
			return
		}
	}

	// Claim tokens without unstaking
	const claimTokens = async () => {
		if(stakedShmeeps.length > 0) {
			await stake.methods.claimTokens(selectedStakedTokens, false).send({ from: account, gas: 1000000 })
		} else {
			return
		}
	}

	const handleAmount = (e) => {
		const amount = e.target.value
		setAmount(amount)
	}

	useEffect( () => {
		loadWeb3()
		loadBlockchainData()
	}, [account]);

	return (
		<div>
			<nav className="navbar fixed-top">
				<a
					className="navbar-brand col-sm-3 col-md-2 mr-0 mx-4"
					href="/#"
					target="_blank"
					rel="noopener noreferrer"
				>
					<img src={shmeep1} className="App-logo" alt="logo" />
					The Shmeeps
				</a>

				{account ? (
					<a
						href={`https://etherscan.io/address/${account}`}
						target="_blank"
						rel="noopener noreferrer"
						className="button nav-button btn-sm mx-4">
						{account.slice(0, 5) + '...' + account.slice(38, 42)}
					</a>
				) : (
					<button onClick={web3Handler} className="button nav-button btn-sm mx-4">Connect Wallet</button>
				)}
			</nav>
			<main>
				<Row className="start my-3">
					<Col className="text-center">
						<h1 className="text-uppercase">The Shmeeps</h1>
						<p className="countdown">
							{revealTime !== 0 && <Countdown date={currentTime + (revealTime - currentTime)} />}
						</p>
						<p>Mint your free Shmeep (not including gas fees)</p>
					</Col>
				</Row>
				<Row className="showcase my-4">
					<Col className="panel grid" sm={12} md={6}>
						<button onClick={mintNFTHandler} className="button mint-button"><span>Mint</span></button>
						<input type='text' placeholder='Amount' onChange={handleAmount} className='input' />
					</Col>
					<Col className="panel grid image-showcase mx-4">
						<img
							src={isError ? (
								shmeep3
							) : !isError && isMinting ? (
								shmeep2
							) : (
								shmeep1
							)}
							alt="shmeep-emotions"
							className="image-showcase-example-1"
						/>
					</Col>
				</Row>
				<Row className="my-3">
					<Col className="flex">
						<a href={openseaURL + account} target="_blank" rel="noreferrer" className="button">View My Opensea</a>
						<a href={`${blockchainExplorerURL}address/${account}`} target="_blank" rel="noreferrer" className="button">My Etherscan</a>
					</Col>
				</Row>
				<Row className="my-2 text-center mb-5">
					{message ? (
						<p>{message}</p>
					) : (
						<div>
							{openEmoji &&
								<a href={`${blockchainExplorerURL}address/${openEmoji._address}`}
									target="_blank"
									rel="noreferrer"
									className="contract-link d-block my-3">
									{openEmoji._address}
								</a>
							}

							{CONFIG.NETWORKS[currentNetwork] && (
								<p>Current Network: {CONFIG.NETWORKS[currentNetwork].name}</p>
							)}

							<p>{`NFT's Left: ${supplyAvailable}, You've minted: ${balanceOf}`}</p>
						</div>
					)}
				</Row>
				<div className="staking">
					<Row className="staking-row justify-content-center mt-3">
						STAKING
					</Row>
					<Row className="justify-content-center mt-2 mb-4">
						Select Shmeeps to Stake
					</Row>
					{showTokenIds()}
					<Row className="justify-content-center mb-5">
						<button className="button w-50" onClick={stakeHandler}>Stake</button>
					</Row>
					<Row className="justify-content-center mb-4">
						Select Staked Shmeeps
					</Row>
					{displayStakedTokens()}
					<Row className="mb-3">
						<Col className="p-0 flex">
							<button className="button" onClick={claimTokens}>Claim Tokens</button>
						</Col>
						<Col className="p-0 flex">
							<button className="button" onClick={claimTokensAndUnstake}>Claim & Unstake</button>
						</Col>
					</Row>
				</div>
			</main>
		</div>
	)
}

export default App;
