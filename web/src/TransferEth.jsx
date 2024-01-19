import React from 'react'
import { useState } from 'react'
import { Web3Button, useAddress } from "@thirdweb-dev/react"


function TransferEth() {
    const [data, setData] = useState([]);

    const handleInputChange = (event) => {
        const lines = event.target.value.split('\n');
        const parsedData = lines.map(line => {
            const [address, amount] = line.split(',').map(val => val.trim());
            return { address, amount };
        });

        setData(parsedData);
        console.log(parsedData);
    }

    const address = useAddress();

    return (
        <>
            <h2>Transfer Eth</h2>
            <p>Type recipient address and amount</p>
            <textarea onChange={handleInputChange} placeholder='0x71C7656EC7ab88b098defB751B7401B5f6d8976F, 0.025' rows={5} style={{ resize: "none", width: "500px" }}></textarea>

            <div>
                <div style={{ display: "flex", alignContent: "center", width: "700px" }}>
                    <div style={{ flex: 1, fontWeight: 'bold' }}>Address</div>
                    <div style={{ flex: 1, fontWeight: 'bold' }}>Amount</div>
                </div>

                {data && data.map((data, index) => (
                    <div key={index} style={{ display: "flex", alignContent: "center", width: "700px" }}>
                        <div style={{ flex: 1 }}>{data.address}</div>
                        <div style={{ flex: 1 }}>{data.amount}</div>
                    </div>
                ))}
            </div >

            {!address && <p>Please connect wallet</p>}
            {address && <Web3Button contractAddress={"0xFDd705d5374cb577b5Eb8f74B52fD2804CA06483"}
                action={async (contract) => {
                    const recipients = data.map(item => item.address);

                    const amounts = data.map(item => {
                        return BigInt(parseInt(item.amount * 10 ** 18));
                    });

                    const totalAmount = amounts.reduce((a, b) => a + b, 0n);

                    contract.call("disperseEther", [
                        recipients, amounts
                    ], {
                        value: BigInt(totalAmount)
                    })

                }}>
                Send ETH
            </Web3Button >}


        </>
    )
}

export default TransferEth;