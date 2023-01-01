import { TokenClient } from "aptos"
import { EcommerceClient, Sandbox } from "./common"
import { ListingProductProof, OrderProductProof } from "./signature"

const ECOMMERCE = "6a2f7b4e3955a06796814f191b31c8d1ea6f13691bcc7792d4a0e9ac04f35fa4"

describe("Ecommerce", () => {
    let client: EcommerceClient
    let tokenClient: TokenClient
    const { admin, seller, buyer, verifier } = new Sandbox()
    let random = Math.floor(Math.random() * 10000)
    let now = Math.floor(Date.now() / 1000)

    before(async () => {
        client = new EcommerceClient(ECOMMERCE)
        tokenClient = new TokenClient(client)
    })

    it("Init config", async () => {
        const txn = await client.initConfig(admin, verifier.pubKey().hex(), 5, 100, 4, 100, 2, 0.1 * 10 ** 8, 5 * 60)
        await client.waitForTransactionWithResult(txn, { checkSuccess: true })
    })

    it("Set verifier public key", async () => {
        const txn = await client.setVerifierPk(admin, verifier.pubKey().hex())
        await client.waitForTransactionWithResult(txn, { checkSuccess: true })
    })

    it("Create collection", async () => {
        const txn = await client.createCollection(
            admin,
            "Ecommerce",
            "This is the only collection of e-commerce platform using Blockchain technology. Creator: chung.pv172983@sis.hust.edu.vn",
            "New uri",
        )
        await client.waitForTransactionWithResult(txn, { checkSuccess: true })
    })

    it("Set fee", async () => {
        const txn = await client.setFee(admin, 5, 100)
        await client.waitForTransactionWithResult(txn, { checkSuccess: true })
    })

    it("Set reward", async () => {
        const txn = await client.setReward(admin, 4, 100)
        await client.waitForTransactionWithResult(txn, { checkSuccess: true })
    })

    it("Set review", async () => {
        const txn = await client.setReview(admin, 2, 0.1 * 10 ** 8, 5 * 60)
        await client.waitForTransactionWithResult(txn, { checkSuccess: true })
    })

    it("Listing product", async () => {
        const name = `Product#${random}`
        const description = `Description#${random}`
        const uri = `Uri#${random}`
        const quantity = 10
        const price = 0.005 * 10 ** 8
        const data = new ListingProductProof(ECOMMERCE, seller.address().hex(), name, description, uri, quantity, price)
        const signature = data.generateSignature(verifier.toPrivateKeyObject().privateKeyHex)
        let txn = await client.listingProduct(seller, name, description, uri, quantity, price, signature)
        await client.waitForTransactionWithResult(txn, { checkSuccess: true })
    })

    it("Order product", async () => {
        const orderId = "order 1"
        const productTittle = `Product#${random}`
        const quantity = 2
        const data = new OrderProductProof(ECOMMERCE, buyer.address().hex(), orderId, productTittle, quantity)
        const signature = data.generateSignature(verifier.toPrivateKeyObject().privateKeyHex)
        let txn = await client.orderProduct(buyer, orderId, productTittle, quantity, signature)
        await client.waitForTransactionWithResult(txn, { checkSuccess: true })
    })
})
