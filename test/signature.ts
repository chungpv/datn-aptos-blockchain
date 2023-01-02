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

export class CompleteOrderProductProof extends Proof {
    seller: string
    orderId: string

    constructor(moduleAddress: string, seller: string, orderId: string) {
        super(moduleAddress, "proofs", "CompleteOrderProductProof")
        this.seller = seller
        this.orderId = orderId
    }

    serialize(serializer: BCS.Serializer): void {
        TxnBuilderTypes.AccountAddress.fromHex(this.moduleAddress).serialize(serializer)
        serializer.serializeStr(this.moduleName)
        serializer.serializeStr(this.structName)
        TxnBuilderTypes.AccountAddress.fromHex(this.seller).serialize(serializer)
        serializer.serializeStr(this.orderId)
    }
}

export class ClaimRewardProof extends Proof {
    buyer: string
    claimHistoryId: string

    constructor(moduleAddress: string, buyer: string, claimHistoryId: string) {
        super(moduleAddress, "proofs", "ClaimRewardProof")
        this.buyer = buyer
        this.claimHistoryId = claimHistoryId
    }

    serialize(serializer: BCS.Serializer): void {
        TxnBuilderTypes.AccountAddress.fromHex(this.moduleAddress).serialize(serializer)
        serializer.serializeStr(this.moduleName)
        serializer.serializeStr(this.structName)
        TxnBuilderTypes.AccountAddress.fromHex(this.buyer).serialize(serializer)
        serializer.serializeStr(this.claimHistoryId)
    }
}

export class ReviewProductProof extends Proof {
    reviewer: string
    reviewId: string

    constructor(moduleAddress: string, reviewer: string, reviewId: string) {
        super(moduleAddress, "proofs", "ReviewProductProof")
        this.reviewer = reviewer
        this.reviewId = reviewId
    }

    serialize(serializer: BCS.Serializer): void {
        TxnBuilderTypes.AccountAddress.fromHex(this.moduleAddress).serialize(serializer)
        serializer.serializeStr(this.moduleName)
        serializer.serializeStr(this.structName)
        TxnBuilderTypes.AccountAddress.fromHex(this.reviewer).serialize(serializer)
        serializer.serializeStr(this.reviewId)
    }
}

export class ClaimReviewProof extends Proof {
    reviewer: string
    reviewId: string

    constructor(moduleAddress: string, reviewer: string, reviewId: string) {
        super(moduleAddress, "proofs", "ClaimReviewProof")
        this.reviewer = reviewer
        this.reviewId = reviewId
    }

    serialize(serializer: BCS.Serializer): void {
        TxnBuilderTypes.AccountAddress.fromHex(this.moduleAddress).serialize(serializer)
        serializer.serializeStr(this.moduleName)
        serializer.serializeStr(this.structName)
        TxnBuilderTypes.AccountAddress.fromHex(this.reviewer).serialize(serializer)
        serializer.serializeStr(this.reviewId)
    }
}

export class ClaimAllReviewProof extends Proof {
    reviewer: string

    constructor(moduleAddress: string, reviewer: string) {
        super(moduleAddress, "proofs", "ClaimAllReviewProof")
        this.reviewer = reviewer
    }

    serialize(serializer: BCS.Serializer): void {
        TxnBuilderTypes.AccountAddress.fromHex(this.moduleAddress).serialize(serializer)
        serializer.serializeStr(this.moduleName)
        serializer.serializeStr(this.structName)
        TxnBuilderTypes.AccountAddress.fromHex(this.reviewer).serialize(serializer)
    }
}
