import { AptosAccount, AptosClient, BCS, HexString } from "aptos"
import { readFileSync } from "fs"
import { load } from "js-yaml"

export const NODE_URL = "https://fullnode.testnet.aptoslabs.com"

export const APTOS_COIN_TYPE = "0x1::aptos_coin::AptosCoin"

type ConfigYaml = {
    profiles: {
        default: {
            private_key: string
        }
        seller: {
            private_key: string
        }
        buyer: {
            private_key: string
        }
        payee: {
            private_key: string
        }
        verifier: {
            private_key: string
        }
    }
}

export const sleep = (second: number) => {
    return new Promise((resolve) => setTimeout(resolve, second * 1000))
}

export class CommonClient extends AptosClient {
    constructor() {
        super(NODE_URL)
    }

    async registerCoin(account: AptosAccount, coinType: string = APTOS_COIN_TYPE): Promise<void> {
        const rawTxn = await this.generateTransaction(account.address(), {
            function: "0x1::managed_coin::register",
            type_arguments: [coinType],
            arguments: [],
        })
        const bcsTxn = await this.signTransaction(account, rawTxn)
        const pendingTxn = await this.submitTransaction(bcsTxn)
        await this.waitForTransaction(pendingTxn.hash, { checkSuccess: true })
    }

    async optInDirectTransfer(account: AptosAccount, optIn: boolean): Promise<void> {
        const rawTxn = await this.generateTransaction(account.address(), {
            function: "0x3::token::opt_in_direct_transfer",
            type_arguments: [],
            arguments: [optIn],
        })
        const bcsTxn = await this.signTransaction(account, rawTxn)
        const pendingTxn = await this.submitTransaction(bcsTxn)
        await this.waitForTransaction(pendingTxn.hash, { checkSuccess: true })
    }

    async getBalance(accountAddress: HexString, coinType: string = APTOS_COIN_TYPE): Promise<string | number> {
        try {
            const resource = await this.getAccountResource(accountAddress, `0x1::coin::CoinStore<${coinType}>`)

            return parseInt((resource.data as any)["coin"]["value"])
        } catch (_) {
            return 0
        }
    }
}

export class Sandbox {
    admin: AptosAccount
    seller: AptosAccount
    buyer: AptosAccount
    payee: string
    verifier: AptosAccount

    constructor(aptosConfigPath: string = "/Users/chung/datn-aptos-blockchain/.aptos/config.yaml") {
        const phrases = load(readFileSync(aptosConfigPath, "utf-8")) as ConfigYaml
        this.admin = new AptosAccount(HexString.ensure(phrases.profiles.default.private_key).toUint8Array())
        this.seller = new AptosAccount(HexString.ensure(phrases.profiles.seller.private_key).toUint8Array())
        this.buyer = new AptosAccount(HexString.ensure(phrases.profiles.buyer.private_key).toUint8Array())
        this.payee = new AptosAccount(HexString.ensure(phrases.profiles.payee.private_key).toUint8Array())
            .address()
            .hex()
        this.verifier = new AptosAccount(HexString.ensure(phrases.profiles.verifier.private_key).toUint8Array())
    }
}
