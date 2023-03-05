import { TokenClient } from "aptos"
import { EcommerceClient, Sandbox, sleep } from "./common"
import {
    ClaimAllReviewProof,
    ClaimRewardProof,
    CompleteOrderProductProof,
    ListingProductProof,
    OrderProductProof,
    ReviewProductProof,
} from "./signature"

const ECOMMERCE = "92d6f99faa051fb7ccc61ca28d551155f55f41f7e5014bdc26527772db817ab3"

describe("Ecommerce", () => {
    let client: EcommerceClient
    let tokenClient: TokenClient
    const { admin, seller, buyer, verifier } = new Sandbox()
    let random = Math.floor(Math.random() * 10000)
    let now = Math.floor(Date.now() / 1000)
    let categories: string[] = [
        "Machinery / Mechanical Parts / Tools",
        "Consumer Electronics / Home Appliances",
        "Auto / Transportation",
        "Apparel / Textiles / Timepieces",
        "Home & Garden / Construction / Lights",
        "Beauty & Personal Care / Health",
    ]
    let colors: string[] = [
        "#fe4a49",
        "#2ab7ca",
        "#fed766",
        "#e6e6ea",
        "#f4f4f8",
        "#eee3e7",
        "#ead5dc",
        "#eec9d2",
        "#f4b6c2",
        "#011f4b",
        "#f6abb6",
        "#03396c",
        "#005b96",
        "#6497b1",
        "#b3cde0",
        "#051e3e",
        "#251e3e",
        "#451e3e",
        "#651e3e",
        "#851e3e",
        "#dec3c3",
        "#e7d3d3",
        "#4a4e4d",
        "#0e9aa7",
        "#3da4ab",
        "#f6cd61",
        "#fe8a71",
        "#2a4d69",
        "#4b86b4",
        "#adcbe3",
        "#e7eff6",
        "#63ace5",
    ]

    let sizes: string[] = ["Small", "Medium", "Large", "XLarge", "2XLarge", "3XLarge"]

    before(async () => {
        client = new EcommerceClient(ECOMMERCE)
        tokenClient = new TokenClient(client)
    })

    it("Init config", async () => {
        const txn = await client.initConfig(
            admin,
            verifier.pubKey().hex(),
            5,
            100,
            4,
            100,
            2,
            0.1 * 10 ** 8,
            5 * 60,
            categories,
            colors,
            sizes,
        )
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
        const txn = await client.setReward(admin, 4, 100, 2)
        await client.waitForTransactionWithResult(txn, { checkSuccess: true })
    })

    it("Set review", async () => {
        const txn = await client.setReview(admin, 0.1 * 10 ** 8, 10)
        await client.waitForTransactionWithResult(txn, { checkSuccess: true })
    })

    it("Insert categories", async () => {
        const categories: string[] = ["Computer hardwares / Softwares"]
        const txn = await client.insertCategories(admin, categories)
        await client.waitForTransactionWithResult(txn, { checkSuccess: true })
    })

    // it("Listing product", async () => {
    //     const name = `Product|${random}`
    //     const description = `Description#${random}`
    //     const uri = `Uri#${random}`
    //     const quantity = 10
    //     const price = 0.005 * 10 ** 8
    //     const data = new ListingProductProof(ECOMMERCE, seller.address().hex(), name, description, uri, quantity, price)
    //     const signature = data.generateSignature(verifier.toPrivateKeyObject().privateKeyHex)
    //     const txn = await client.listingProduct(seller, name, description, uri, quantity, price, signature)
    //     await client.waitForTransactionWithResult(txn, { checkSuccess: true })
    // })

    // it("Order product", async () => {
    //     const orderId = `order ${random}`
    //     const productTittle = `Product|${random}`
    //     const quantity = 2
    //     const data = new OrderProductProof(ECOMMERCE, buyer.address().hex(), [orderId], [productTittle], [quantity])
    //     const signature = data.generateSignature(verifier.toPrivateKeyObject().privateKeyHex)
    //     const txn = await client.orderProduct(buyer, [orderId], [productTittle], [quantity], signature)
    //     await client.waitForTransactionWithResult(txn, { checkSuccess: true })
    // })

    // it("Complete order product", async () => {
    //     const orderId = `order ${random}`
    //     const data = new CompleteOrderProductProof(ECOMMERCE, seller.address().hex(), orderId)
    //     const signature = data.generateSignature(verifier.toPrivateKeyObject().privateKeyHex)
    //     const txn = await client.completeOrderProduct(seller, orderId, signature)
    //     await client.waitForTransactionWithResult(txn, { checkSuccess: true })
    // })

    // it("Claim reward", async () => {
    //     const orderId = `order ${random + 1}`
    //     const productTittle = `Product|${random}`
    //     const quantity = 2
    //     const data1 = new OrderProductProof(ECOMMERCE, buyer.address().hex(), [orderId], [productTittle], [quantity])
    //     const signature1 = data1.generateSignature(verifier.toPrivateKeyObject().privateKeyHex)
    //     const txn1 = await client.orderProduct(buyer, [orderId], [productTittle], [quantity], signature1)
    //     await client.waitForTransactionWithResult(txn1, { checkSuccess: true })

    //     const data2 = new CompleteOrderProductProof(ECOMMERCE, seller.address().hex(), orderId)
    //     const signature2 = data2.generateSignature(verifier.toPrivateKeyObject().privateKeyHex)
    //     const txn2 = await client.completeOrderProduct(seller, orderId, signature2)
    //     await client.waitForTransactionWithResult(txn2, { checkSuccess: true })

    //     const claimHistoryId = `history ${random}`
    //     const data3 = new ClaimRewardProof(ECOMMERCE, buyer.address().hex(), claimHistoryId)
    //     const signature3 = data3.generateSignature(verifier.toPrivateKeyObject().privateKeyHex)
    //     const txn3 = await client.claimReward(buyer, claimHistoryId, signature3)
    //     await client.waitForTransactionWithResult(txn3, { checkSuccess: true })
    //     console.log({ claimReward: txn3 })
    // })

    // it("Review product", async () => {
    //     const reviewId = `review ${random}`
    //     const data = new ReviewProductProof(ECOMMERCE, buyer.address().hex(), reviewId)
    //     const signature = data.generateSignature(verifier.toPrivateKeyObject().privateKeyHex)
    //     const txn = await client.reviewProduct(buyer, reviewId, signature)
    //     await client.waitForTransactionWithResult(txn, { checkSuccess: true })
    //     console.log({ reviewProduct: txn })
    // })

    // it("Claim all reviews product", async () => {
    //     await sleep(15)
    //     const data = new ClaimAllReviewProof(ECOMMERCE, buyer.address().hex())
    //     const signature = data.generateSignature(verifier.toPrivateKeyObject().privateKeyHex)
    //     const txn = await client.claimAllReviewProduct(buyer, signature)
    //     await client.waitForTransactionWithResult(txn, { checkSuccess: true })
    //     console.log({ claimAllReviewsProduct: txn })
    // })
})
