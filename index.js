import * as rainSDK from 'rain-sdk'; // rain SDK imported using importmap in index.html (or in package.json)
import { ethers } from 'ethers'; // ethers library imported using importmap in index.html (or in package.json)
import { connect } from './connect.js'; // a very basic web3 connection implementation
import { logToWindow } from '@unegma/utils';
logToWindow('console'); // override console.log to output to browser with very simple styling (be aware, this prevents pushing multiple messages in one .log())

const CHAIN_DATA = {
  name: 'Mumbai',
  chainId: 80001 // Mumbai testnet chain id
}

/**
 * Reserve Token Example
 * Tutorials (see Getting Started): https://docs.rainprotocol.xyz
 * @returns {Promise<void>}
 */
export async function reserveTokenExample() {

  try {
    console.log('# Reserve Token Deploy Example', 'black', 'bold');
    console.log('Info: (check your console for more data and make sure you have a browser wallet installed and connected to Polygon Mumbai testnet)', 'orange');
    const { address, signer } = await connect(CHAIN_DATA); // get the signer and account address using a very basic connection implementation

    console.log('## Transactions', 'orange', 'bold');
    console.log('Info: It is important to let your users know how many transactions to expect and what they are.', 'orange');
    console.log('This example consists of 1 Transaction:', 'orange');
    console.log('1. Deploy and Mint ERC20 Token to be used in place of USDC (fee+gas cost at circa 2022-06-27T20:10:00Z: 0.0007387 MATIC)', 'orange');
    // todo maybe warn users they will need to have X matic in their wallet in order to complete ALL the transactions

    console.log('------------------------------'); // separator

    // constants (can put these into .env)
    const TOKEN_NAME = 'Rain USDC';
    const TOKEN_SYMBOL = 'rUSDC';
    const ERC20_INITIAL_SUPPLY = 10000; // to be sent to you as the User
    const ERC20_DECIMALS = 18; // See here for more info: https://docs.openzeppelin.com/contracts/3.x/erc20#a-note-on-decimals

    const emissionsERC20Config = {
      allowDelegatedClaims: false, // can mint on behalf of someone else
      erc20Config: {
        name: TOKEN_NAME,
        symbol: TOKEN_SYMBOL,
        distributor: address, // initialSupply is given to the distributor during the deployment of the emissions contract
        initialSupply: ethers.utils.parseUnits(ERC20_INITIAL_SUPPLY.toString(), ERC20_DECIMALS), // TODO CHECK UNDERSTANDING HOW TO LIMIT CORRECTLY, AND TO WHERE THIS GOES ON DEPLOYING THE CONTRACT (distributor?)
      },
      vmStateConfig: {
        constants: [ERC20_INITIAL_SUPPLY], // mint a set amount at a time (infinitely), if set to 10, will mint 10 at a time, no more no less (infinitely)
        sources: [
          ethers.utils.concat([
            rainSDK.utils.op(rainSDK.Sale.Opcodes.VAL, 0),
          ]),
        ],
        stackLength: 1,
        argumentsLength: 0,
      },
    };

    console.log(`## Section 1: Deploy and Mint ERC20 Token`, 'black', 'bold');
    console.log(`Info: These tokens (${TOKEN_SYMBOL}) will be used as a RESERVE_TOKEN for following tutorials in place of USDC, so make sure to note down the erc20 token address which will be displayed after the transaction completes)`, 'red');
    console.log(`Info: Deploying and Minting new ERC20 with the following state:`);
    console.log(emissionsERC20Config, 'blue');
    const emissionsErc20 = await rainSDK.EmissionsERC20.deploy(signer, emissionsERC20Config);
    // // todo claim function will mint another token (in addition to initial supply)??
    const EMISSIONS_ERC20_TOKEN_ADDRESS = emissionsErc20.address;
    console.log(`Result: deployed emissionsErc20, with address: ${EMISSIONS_ERC20_TOKEN_ADDRESS} and sent you ${ERC20_INITIAL_SUPPLY} tokens`, 'green'); // todo check what exists in addition to what is on an erc20, are erc20s through the evm 'factory'?
    console.info(emissionsErc20);
    console.log('Info: to see the tokens in your Wallet, add a new token with the address above. ALSO, REMEMBER TO NOTE DOWN THIS ADDRESS, AS IT WILL BE USED AS RESERVE_TOKEN IN FUTURE TUTORIALS.', 'red', 'bold');

    // // todo section on how to spend
    // console.log(`Info: Connecting to ${emissionsERC20Config.erc20Config.name} ERC20 token (${EMISSIONS_ERC20_TOKEN_ADDRESS}) for approval of spend of ${EXAMPLE_ERC20_AMOUNT_TO_DEPOSIT} ${emissionsERC20Config.erc20Config.symbol}:`, );
    // const approveTransaction = await emissionsErc20.approve(
    //   redeemableERC20ClaimEscrow.address,
    //   ethers.utils.parseUnits(EXAMPLE_ERC20_AMOUNT_TO_DEPOSIT.toString(), EXAMPLE_ERC20_DECIMALS)
    // );
    // const approveReceipt = await approveTransaction.wait();
    // console.log(`Info: Approve Receipt:`, approveReceipt);

    // console.log('------------------------------'); // separator

    // todo show how to claim more (if possible)

    // console.log(`Info: receipt for withdrawal (please check your wallet to make sure you have the token, you may need to add the address for the token ${EMISSIONS_ERC20_TOKEN_ADDRESS}):`, withdrawReceipt);

    console.log('------------------------------'); // separator

    console.log('Info: Completed Successfully');
  } catch (err) {
    console.log('------------------------------'); // separator
    console.log(`Error:`, 'red', 'bold');
    console.log(err.message, 'red');
    console.warn(err);
  }
}

reserveTokenExample();
