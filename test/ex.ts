// import { EcommerceClient } from "./common"

// const ECOMMERCE = "3f4429b11a88ee40270e3898185d51c4ef357ca44f3d0ac974a6c370b1327ac6"
// const seller = "0x165bc4a869039919f464ac9275ea0c376fae6ac9636f20171bc7ed12f23c366b"
// const buyer = "0x6b1d772be2e2ae8a4c83f57af451561d547ea4d98cd291938382907d42602e9e"

// type ProductResource = {
//     type: string
//     data: {
//         records: { handle: string }
//     }
// }

// type ExchangeResource = {
//     type: string
//     data: {
//         buyer_by_order: {
//             handle: string
//         }
//         // all_lists: { handle: string }
//         // all_offers: { handle: string }
//         // all_token_ids: {
//         //     token_data_id: { creator: { account: string }; collection: string; name: string }
//         //     property_version: number
//         // }[]
//     }
// }

// let client: EcommerceClient = new EcommerceClient(ECOMMERCE)

// const test = async () => {
//     const resource = (await client.getAccountResource(
//         seller,
//         `0x${ECOMMERCE}::product::ProductRecords`,
//     )) as ProductResource
//     const itemRequest = {
//         key_type: "0x3::token::TokenId",
//         value_type: `0x${ECOMMERCE}::product::Product`,
//         key: {
//             token_data_id: {
//                 creator: `0x${ECOMMERCE}`,
//                 collection: "Ecommerce",
//                 name: "Product#6930",
//             },
//             property_version: "0",
//         },
//     }
//     const product = await client.getTableItem(resource.data.records.handle, itemRequest)
//     console.log(product)
// }

// test()
