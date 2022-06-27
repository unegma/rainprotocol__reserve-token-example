import * as rainSDK from "rain-sdk"; // rain SDK imported using importmap in index.html (or in package.json)
import { ethers } from "ethers"; // ethers library imported using importmap in index.html (or in package.json)
import { connect } from "./connect.js"; // a very basic web3 connection implementation
import { logToWindow } from "@unegma/utils"; // rain SDK imported using importmap in index.html (or in package.json)
logToWindow('console'); // override console.log to output to browser with very simple styling

/**
 * Reserve Token Example
 * Tutorials (see Getting Started): https://docs.rainprotocol.xyz
 * @returns {Promise<void>}
 */
export async function reserveTokenExample() {

  try {
    console.log(`Reserve Token Deploy Example (check your console and make sure you have a browser wallet installed)`, 'black', 'bold');

    const { address, signer } = await connect(); // get the signer and account address using a very basic connection implementation

    console.log("Info: It is important to let your users know how many transactions to expect and what they are. " +
      "This example consists of X Transactions:\n\n", 'orange'
    );

    console.log('------------------------------'); // separator

    // constants (can put these into .env)
    const RUSDC_ERC20_DECIMALS = 18; // See here for more info: https://docs.openzeppelin.com/contracts/3.x/erc20#a-note-on-decimals
    const RUSDC_ERC20_INITIAL_SUPPLY = 1000;

    const emissionsERC20Config = {
      allowDelegatedClaims: false, // can mint on behalf of someone else
      erc20Config: {
        name: 'Rain USDC',
        symbol: 'rUSDC',
        distributor: address, // initialSupply is given to the distributor during the deployment of the emissions contract
        initialSupply: ethers.utils.parseUnits(RUSDC_ERC20_INITIAL_SUPPLY.toString(), RUSDC_ERC20_DECIMALS), // TODO CHECK UNDERSTANDING HOW TO LIMIT CORRECTLY, AND TO WHERE THIS GOES ON DEPLOYING THE CONTRACT (distributor?)
      },
      vmStateConfig: {
        constants: [RUSDC_ERC20_INITIAL_SUPPLY], // mint a set amount at a time (infinitely), if set to 10, will mint 10 at a time, no more no less (infinitely)
        sources: [
          ethers.utils.concat([
            rainSDK.utils.op(rainSDK.Sale.Opcodes.VAL, 0),
          ]),
        ],
        stackLength: 1,
        argumentsLength: 0,
      },
    };

    console.log(`### Section 1 (Admin function): Mint erc20 Token for Deploying erc20 for reserve token`, 'black', 'bold');
    console.log(`Info: Minting new ERC20 with the following state:`);
    console.log(emissionsERC20Config);
    const emissionsErc20 = await rainSDK.EmissionsERC20.deploy(signer, emissionsERC20Config);
    // // todo claim function will mint another token (in addition to initial supply)??
    const EMISSIONS_ERC20_TOKEN_ADDRESS = emissionsErc20.address;
    console.log(`Result: emissionsErc20, with address ${EMISSIONS_ERC20_TOKEN_ADDRESS}:`); // todo check what exists in addition to what is on an erc20, are erc20s through the evm 'factory'?
    console.log(emissionsErc20);

    console.log('------------------------------'); // separator

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

    console.log("Info: Done");
  } catch (err) {
    console.log('------------------------------'); // separator
    console.log(`Error:`, 'red', 'bold');
    console.log(err, 'red');
  }
}

reserveTokenExample();
