import { AptosAccount, BCS, HexString, TxnBuilderTypes } from "aptos"

class Proof {
    moduleAddress: string
    moduleName: string
    structName: string

    constructor(moduleAddress: string, moduleName: string, structName: string) {
        this.moduleAddress = moduleAddress
        this.moduleName = moduleName
        this.structName = structName
    }

    generateSignature(signer_private_key: string) {
        const message = BCS.bcsToBytes(this)
        const signer = new AptosAccount(HexString.ensure(signer_private_key).toUint8Array())
        const signature = signer.signBuffer(message)
        return signature.noPrefix()
    }

    serialize(serializer: BCS.Serializer) {}
}

export class ListingProductProof extends Proof {
    creator: string
    name: string
    description: string
    uri: string
    quantity: number | bigint
    price: number | bigint

    constructor(
        moduleAddress: string,
        creator: string,
        name: string,
        description: string,
        uri: string,
        quantity: number | bigint,
        price: number | bigint,
    ) {
        super(moduleAddress, "proofs", "ListingProductProof")
        this.creator = creator
        this.name = name
        this.description = description
        this.uri = uri
        this.quantity = quantity
        this.price = price
    }

    serialize(serializer: BCS.Serializer): void {
        TxnBuilderTypes.AccountAddress.fromHex(this.moduleAddress).serialize(serializer)
        serializer.serializeStr(this.moduleName)
        serializer.serializeStr(this.structName)
        TxnBuilderTypes.AccountAddress.fromHex(this.creator).serialize(serializer)
        serializer.serializeStr(this.name)
        serializer.serializeStr(this.description)
        serializer.serializeStr(this.uri)
        serializer.serializeU64(this.quantity)
        serializer.serializeU64(this.price)
    }
}

export class OrderProductProof extends Proof {
    buyer: string
    orderId: string
    productTittle: string
    quantity: number | bigint

    constructor(
        moduleAddress: string,
        buyer: string,
        orderId: string,
        productTittle: string,
        quantity: number | bigint,
    ) {
        super(moduleAddress, "proofs", "OrderProductProof")
        this.buyer = buyer
        this.orderId = orderId
        this.productTittle = productTittle
        this.quantity = quantity
    }

    serialize(serializer: BCS.Serializer): void {
        TxnBuilderTypes.AccountAddress.fromHex(this.moduleAddress).serialize(serializer)
        serializer.serializeStr(this.moduleName)
        serializer.serializeStr(this.structName)
        TxnBuilderTypes.AccountAddress.fromHex(this.buyer).serialize(serializer)
        serializer.serializeStr(this.orderId)
        serializer.serializeStr(this.productTittle)
        serializer.serializeU64(this.quantity)
    }
}
