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
    verifier: AptosAccount

    constructor(aptosConfigPath: string = "/Users/chung/datn-aptos-blockchain/.aptos/config.yaml") {
        const phrases = load(readFileSync(aptosConfigPath, "utf-8")) as ConfigYaml
        this.admin = new AptosAccount(HexString.ensure(phrases.profiles.default.private_key).toUint8Array())
        this.seller = new AptosAccount(HexString.ensure(phrases.profiles.seller.private_key).toUint8Array())
        this.buyer = new AptosAccount(HexString.ensure(phrases.profiles.buyer.private_key).toUint8Array())
        this.verifier = new AptosAccount(HexString.ensure(phrases.profiles.verifier.private_key).toUint8Array())
    }
}

export class EcommerceClient extends CommonClient {
    ecommerce: HexString

    constructor(ecommerce: string) {
        super()
        this.ecommerce = new HexString(ecommerce)
    }

    async initConfig(
        account: AptosAccount,
        verifierPk: string,
        feeNumerator: number | bigint,
        feeDenominator: number | bigint,
        rewardNumerator: number | bigint,
        rewardDenominator: number | bigint,
        minTimeOrdersReward: number | bigint,
        reviewingFee: number | bigint,
        reviewingLockTime: number | bigint,
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(account.address(), {
            function: `${this.ecommerce.hex()}::exchange_entry::init_config`,
            type_arguments: [],
            arguments: [
                new HexString(verifierPk).toUint8Array(),
                feeNumerator,
                feeDenominator,
                rewardNumerator,
                rewardDenominator,
                minTimeOrdersReward,
                reviewingFee,
                reviewingLockTime,
            ],
        })
        const bcsTxn = await this.signTransaction(account, rawTxn)
        const pendingTxn = await this.submitTransaction(bcsTxn)
        return pendingTxn.hash
    }

    async createCollection(account: AptosAccount, name: string, description: string, uri: string): Promise<string> {
        const rawTxn = await this.generateTransaction(account.address(), {
            function: `${this.ecommerce.hex()}::exchange_entry::create_collection`,
            type_arguments: [],
            arguments: [name, description, uri],
        })
        const bcsTxn = await this.signTransaction(account, rawTxn)
        const pendingTxn = await this.submitTransaction(bcsTxn)
        return pendingTxn.hash
    }

    async addOperator(account: AptosAccount, operator: string): Promise<string> {
        const rawTxn = await this.generateTransaction(account.address(), {
            function: `${this.ecommerce.hex()}::exchange_entry::add_operator`,
            type_arguments: [],
            arguments: [operator],
        })
        const bcsTxn = await this.signTransaction(account, rawTxn)
        const pendingTxn = await this.submitTransaction(bcsTxn)
        return pendingTxn.hash
    }

    async removeOperator(account: AptosAccount, operator: string): Promise<string> {
        const rawTxn = await this.generateTransaction(account.address(), {
            function: `${this.ecommerce.hex()}::exchange_entry::remove_operator`,
            type_arguments: [],
            arguments: [operator],
        })
        const bcsTxn = await this.signTransaction(account, rawTxn)
        const pendingTxn = await this.submitTransaction(bcsTxn)
        return pendingTxn.hash
    }

    async setFee(
        account: AptosAccount,
        feeNumerator: number | bigint,
        feeDenominator: number | bigint,
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(account.address(), {
            function: `${this.ecommerce.hex()}::exchange_entry::set_fee`,
            type_arguments: [],
            arguments: [feeNumerator, feeDenominator],
        })
        const bcsTxn = await this.signTransaction(account, rawTxn)
        const pendingTxn = await this.submitTransaction(bcsTxn)
        return pendingTxn.hash
    }

    async setReward(
        account: AptosAccount,
        rewardNumerator: number | bigint,
        rewardDenominator: number | bigint,
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(account.address(), {
            function: `${this.ecommerce.hex()}::exchange_entry::set_reward`,
            type_arguments: [],
            arguments: [rewardNumerator, rewardDenominator],
        })
        const bcsTxn = await this.signTransaction(account, rawTxn)
        const pendingTxn = await this.submitTransaction(bcsTxn)
        return pendingTxn.hash
    }

    async setReview(
        account: AptosAccount,
        minTimeOrdersReward: number | bigint,
        reviewingFee: number | bigint,
        reviewingLockTime: number | bigint,
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(account.address(), {
            function: `${this.ecommerce.hex()}::exchange_entry::set_review`,
            type_arguments: [],
            arguments: [minTimeOrdersReward, reviewingFee, reviewingLockTime],
        })
        const bcsTxn = await this.signTransaction(account, rawTxn)
        const pendingTxn = await this.submitTransaction(bcsTxn)
        return pendingTxn.hash
    }

    async setVerifierPk(account: AptosAccount, verifierPublicKey: string): Promise<string> {
        const rawTxn = await this.generateTransaction(account.address(), {
            function: `${this.ecommerce.hex()}::exchange_entry::set_verifier_pk`,
            type_arguments: [],
            arguments: [new HexString(verifierPublicKey).toUint8Array()],
        })
        const bcsTxn = await this.signTransaction(account, rawTxn)
        const pendingTxn = await this.submitTransaction(bcsTxn)
        return pendingTxn.hash
    }

    async listingProduct(
        account: AptosAccount,
        name: string,
        description: string,
        uri: string,
        quantity: number | bigint,
        price: number | bigint,
        signature: string,
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(account.address(), {
            function: `${this.ecommerce.hex()}::exchange_entry::listing_product`,
            type_arguments: [],
            arguments: [name, description, uri, quantity, price, Array.from(new HexString(signature).toUint8Array())],
        })
        const bcsTxn = await this.signTransaction(account, rawTxn)
        const pendingTxn = await this.submitTransaction(bcsTxn)
        return pendingTxn.hash
    }

    async orderProduct(
        account: AptosAccount,
        orderId: string,
        productTittle: string,
        quantity: number | bigint,
        signature: string,
    ): Promise<string> {
        const rawTxn = await this.generateTransaction(account.address(), {
            function: `${this.ecommerce.hex()}::exchange_entry::order_product`,
            type_arguments: [APTOS_COIN_TYPE],
            arguments: [orderId, productTittle, quantity, Array.from(new HexString(signature).toUint8Array())],
        })
        const bcsTxn = await this.signTransaction(account, rawTxn)
        const pendingTxn = await this.submitTransaction(bcsTxn)
        return pendingTxn.hash
    }
}
