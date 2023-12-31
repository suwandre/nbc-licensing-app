import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";
import LicenseABI from "../../../abis/License.json";
import { Data } from "@/utils/apiData";

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    if (req.method === "POST") {
        try {
            const { licenseeAddress, applicationHash } = req.body;

            const ADMIN_PVT_KEY = process.env.ADMIN_WALLET_PVT_KEY ?? "";
            const provider = new ethers.providers.JsonRpcProvider(
                "https://data-seed-prebsc-1-s1.binance.org:8545"
            );
            const wallet = new ethers.Wallet(ADMIN_PVT_KEY, provider);

            const contractABI = LicenseABI;
            const contractAddress = process.env.LICENSE_CONTRACT_ADDRESS ?? "";
            const contract = new ethers.Contract(
                contractAddress,
                contractABI,
                wallet
            );

            const nonce = await provider.getTransactionCount(wallet.address, 'latest');

            const rawTx = await contract.populateTransaction.approveApplication(licenseeAddress, applicationHash);

            const estimatedGasLimit = await contract.estimateGas.approveAccounts([licenseeAddress]);
            const gasLimit = estimatedGasLimit.add(ethers.utils.parseUnits('100000', 'wei'));

            const gasPrice = await provider.getGasPrice();

            rawTx.gasLimit = gasLimit;
            rawTx.gasPrice = gasPrice;
            rawTx.nonce = nonce;

            const signedTx = await wallet.signTransaction(rawTx);

            console.log('raw tx: ', rawTx);
            console.log('signed tx: ', signedTx);

            const receipt = await provider.sendTransaction(signedTx);

            await receipt.wait(2);

            console.log('receipt: ', receipt);

            res.status(200).json({ success: true, data: receipt });
        } catch (e: any) {
            console.log("error approving application: ", e.message);
            res.status(500).json({ success: false, error: e.message });
        }
    } else {
        res.setHeader("Allow", ["POST"]);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}
