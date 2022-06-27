import { ethers } from 'ethers';
import { logToWindow } from '@unegma/utils';
logToWindow('console'); // override console.log to output to browser with very simple styling (be aware, this prevents pushing multiple messages in one .log())

/**
 * Very basic connection to Web3 wallet
 * @returns {Promise<{address: *, signer: *}>}
 */
export const connect = async (chainData) => {
  try {
    const {ethereum} = window;
    const provider = new ethers.providers.Web3Provider(ethereum, chainData);

    // Prompt user for account connections
    await provider.send("eth_requestAccounts", []);
    const signer = provider.getSigner();
    const address = await signer.getAddress();

    console.log(`Info: Connected to your account with address: ${address}`, 'green');
    console.log('------------------------------'); // separator
    return { signer, address };
  } catch (err) {
    console.log('Error: You may not have a Web3 Wallet installed', 'red', 'bold');
    console.log(err, 'red');
    throw new Error('Web3WalletConnectError');
  }
}
