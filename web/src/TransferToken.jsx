import React from 'react'
import { useState } from "react";
import { Web3Button, useAddress } from "@thirdweb-dev/react";
import { ethers } from "ethers";
import abi from './IERC20.json';
import { parseEther, BigNumber } from 'ethers/lib/utils';

function TransferTokenInput() {
    const [data, setData] = useState([]); // initialize empty array
    const [token, setToken] = useState("");
    const [symbol, setSymbol] = useState("");

    const handleInputChange = (event) => {
        const lines = event.target.value.split('\n');
        const parsedData = lines.map(line => {
            const [address, amount] = line.split(',').map(val => val.trim()); // remove white spaces
            return { address, amount };
        });
        setData(parsedData);
    };

    const provider = new ethers.providers.Web3Provider(window.ethereum); // set provider for ethers

    const address = useAddress();

    // validate token address
    const checkToken = async () => {
        if (token === "")
            alert("Insert token address");
        else {
            try {
                // console.log(Array.isArray(abi), abi); // make sure it's a valid ABI
                const tokenContract = new ethers.Contract(token, abi, provider); // set contract
                // console.log(tokenContract);


                // console.log((await tokenContract.balanceOf(address)).toString());

                await tokenContract.balanceOf(address); // check validity by inquiring token balance
                setSymbol(await tokenContract.symbol());
            }
            catch (err) {
                setSymbol("");
                alert("Invalid token contract address");
            }
        }
    }


    return (

        <div style={{ display: "flex", flexDirection: "column" }}>
            <h2 style={{ marginBottom: "20px" }}>Batch Transfer ERC-20 Token</h2>

            {!address && <p style={{ marginTop: "20px" }}>Click on the Connect Wallet button above</p>}

            {
                address &&
                <>
                    <p>Token Contract Address</p>

                    <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                        <textarea onChange={(event) => { setToken(event.target.value); }} placeholder="0x95ad61b0a150d79219dcf64e1e6cc01f0b64c4ce" rows={1} style={{ resize: "none", flexGrow: 1, margin: '10px' }}></textarea>
                        <button onClick={checkToken}>Load Token</button>

                    </div>
                    {symbol && <p style={{ marginTop: "20px" }}>Token: ${symbol}</p>}


                    <p>Type address and amount separated by a comma and enter to insert more recipient.</p>
                    <textarea onChange={handleInputChange} placeholder="0x71C7656EC7ab88b098defB751B7401B5f6d8976F, 0.025&#10;0xcd3B766CCDd6AE721141F452C550Ca635964ce71, 0.05" rows={5} style={{ resize: "none" }} />
                    <div>
                        <div style={{ display: 'flex', marginTop: '20px' }}>
                            <div style={{ flex: 1, fontWeight: 'bold' }}>Address</div>
                            <div style={{ flex: 1, fontWeight: 'bold' }}>Amount</div>
                        </div>
                        {data.map((item, index) => (
                            <div key={index} style={{ display: 'flex' }}>
                                <div style={{ flex: 1 }}>{item.address}</div>
                                <div style={{ flex: 1 }}>{item.amount}</div>
                            </div>
                        ))}
                    </div>

                    {symbol &&
                        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                            <Web3Button
                                style={{ marginTop: "20px", flexGrow: 1 }}
                                contractAddress={token}
                                contractAbi={abi} // set the abi so if contract is not verified, functions are still detetcted
                                action={async (contract) => {

                                    // Map each item in the data array to a new array, 'amounts', converting the 'amount' to a BigInt
                                    const decimal = await contract.call("decimals"); // get the decimals
                                    const amounts = data.map(item => {
                                        return BigInt(parseInt(item.amount * 10 ** decimal).toString());
                                    });

                                    const totalAmount = BigInt(parseInt(amounts.reduce((a, b) => a + b, 0n)).toString());
                                    console.log(totalAmount);

                                    contract.call("approve", [
                                        "0xFDd705d5374cb577b5Eb8f74B52fD2804CA06483",
                                        totalAmount
                                    ])

                                }}
                            >
                                Approve
                            </Web3Button>


                            <Web3Button
                                style={{ marginTop: "20px", flexGrow: 1 }}
                                contractAddress={"0xFDd705d5374cb577b5Eb8f74B52fD2804CA06483"}
                                action={async (contract) => {

                                    const tokenContract = new ethers.Contract(token, abi, provider); // set contract
                                    // Map each item in the data array to a new array, 'recipients', containing only the addresses
                                    const recipients = data.map(item => item.address);

                                    // Map each item in the data array to a new array, 'amounts', converting the 'amount' to a BigInt
                                    const decimal = await tokenContract.decimals();

                                    const amounts = data.map(item => {

                                        // Parse the amount string to a floating point number
                                        const amountNumber = parseFloat(item.amount); // parse float solve precission issue (i assume)
                                        // probaby because di transfer token ada calculation, tapi di eth gaada jadi aman
                                        const amountBigInt = BigInt(Math.floor(amountNumber * (10 ** decimal))).toString();
                                        return amountBigInt; // Ensure to return the calculated BigInt value


                                        //return BigInt(parseInt(item.amount * 10 ** decimal).toString());
                                    });
                                    // ref precission issue: https://links.ethers.org/v5-errors-NUMERIC_FAULT-overflow

                                    // check amounts
                                    console.log(amounts);

                                    // check balance of sender
                                    console.log("Balance:" + await tokenContract.balanceOf(address));


                                    // Call the 'disperseToken' function of the contract with the recipients and their respective amounts
                                    contract.call("disperseToken", [
                                        token,
                                        recipients,
                                        amounts,
                                    ])

                                }}
                            >
                                Send Token
                            </Web3Button>
                        </div>
                    }

                    <button style={{ marginTop: "20px" }} onClick={async () => {
                        console.log(data);
                        const tokenContract = new ethers.Contract(token, abi, provider); // set contract
                        // map data[i].amount to amounts, parse it to int and times decimals
                        // console.log(await tokenContract.decimals());
                        const decimal = await tokenContract.decimals();
                        const amounts = data.map(item => parseInt(item.amount * 10 ** decimal));

                        // map data[i].address to recipients
                        const recipients = data.map(item => item.address);

                        console.log({
                            amounts,
                            recipients
                        });

                    }}>
                        View Data
                    </button>
                </>
            }
        </div >
    )
}

export default TransferTokenInput;