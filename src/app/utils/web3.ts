import { Chain, createPublicClient, http } from "viem"
import { arbitrum, mainnet, optimism } from "viem/chains"
import { CONFIG, NETWORKS } from "./config"

export function CreatePublicClient(network: NETWORKS = "mainnet") {
    let chain: Chain = mainnet
    let url = `https://mainnet.infura.io/v3/${CONFIG.INFURA_API_KEY}`

    if (network === "arbitrum") {
        chain = arbitrum
        url = `https://arb-mainnet.g.alchemy.com/v2/${CONFIG.ALCHEMY_API_KEY}`
    }

    if (network === "base") {
        chain = arbitrum
        url = `https://mainnet.base.org`
    }

    if (network === "optimism") {
        chain = optimism
        url = `https://optimism.publicnode.com`
    }

    return createPublicClient({
        chain: chain,
        batch: {
        multicall: true,
        },
        transport: http(url),
    })
}
