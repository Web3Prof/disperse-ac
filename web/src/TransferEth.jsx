import React from 'react'
import { useState } from "react";
import { ethers } from "ethers";
import { Web3Button, useAddress } from "@thirdweb-dev/react";

function TransferEthInput() {
    const [data, setData] = useState();

    const handleInputChange = (event) => {
        const lines = event.target.value.split('\n');
        const parsedData = lines.map(line => {
            const [address, amount] = line.split(',').map(val => val.trim()); // remove white spaces
            return { address, amount };
        });

        // remove empty lines
        const filteredData = parsedData.filter(item => item.address !== '' && item.amount !== '');
        // console.log(filteredData);

        setData(filteredData);
    };

    const address = useAddress();

    return (
        <div style={{ display: "flex", flexDirection: "column" }}>
            <h2 style={{ marginBottom: "20px" }}>Batch Transfer Eth</h2>
            {!address && <p style={{ marginTop: "20px" }}>Click on the Connect Wallet button above</p>}




            {address && <>
                <p style={{ marginBottom: "20px" }}>Type address and amount separated by a comma and enter to insert more recipient.</p>
                <textarea onChange={handleInputChange} placeholder="0x71C7656EC7ab88b098defB751B7401B5f6d8976F, 0.025&#10;0xcd3B766CCDd6AE721141F452C550Ca635964ce71, 0.05" rows={5} style={{ resize: "none" }} />
                <div>
                    <div style={{ display: 'flex', marginTop: '20px' }}>
                        <div style={{ flex: 1, fontWeight: 'bold' }}>Address</div>
                        <div style={{ flex: 1, fontWeight: 'bold' }}>Amount</div>
                    </div>
                    {data && data.map((item, index) => (
                        <div key={index} style={{ display: 'flex' }}>
                            <div style={{ flex: 1 }}>{item.address}</div>
                            <div style={{ flex: 1 }}>{item.amount}</div>
                        </div>
                    ))}
                </div>
                <Web3Button
                    style={{ marginTop: "20px" }}
                    contractAddress={"0xFDd705d5374cb577b5Eb8f74B52fD2804CA06483"}
                    action={async (contract) => {

                        // Map each item in the data array to a new array, 'recipients', containing only the addresses
                        const recipients = data.map(item => item.address);

                        // Use ethers.js to handle conversion from ether to Wei for each amount
                        // This approach ensures precision and avoids the direct use of BigInt for arithmetic operations
                        const amounts = data.map(item => ethers.utils.parseEther(item.amount.toString()));

                        console.log(amounts);

                        // Calculate the total amount by summing up all amounts
                        // Using ethers.BigNumber for accurate and safe arithmetic operations
                        let totalAmount = ethers.BigNumber.from(0);
                        amounts.forEach(amount => {
                            totalAmount = totalAmount.add(amount);
                        });

                        // Call the 'disperseEther' function of the contract with the recipients and their respective amounts
                        // The 'value' property is set to the total amount of Ether to be dispersed, in Wei
                        contract.call("disperseEther", [
                            recipients,
                            amounts,
                        ], {
                            value: totalAmount
                        })
                    }}
                >
                    Send ETH
                </Web3Button>


                <button
                    style={{ marginTop: "20px" }}
                    onClick={() => {
                        console.log(data)

                        // map data[i].amount to amounts, parse it to int and * 10^18
                        const amounts = data.map(item => parseInt(item.amount * 10 ** 18));

                        // map data[i].address to recipients
                        const recipients = data.map(item => item.address);

                        console.log({
                            amounts,
                            recipients
                        })

                    }}
                >
                    View Data
                </button>
            </>
            }

        </div>
    )
}

export default TransferEthInput;