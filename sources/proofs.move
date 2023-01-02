module ecommerce::proofs {
    use std::string::String;
    use std::option::Option;
    use aptos_token::token::{
        TokenId
    };

    struct ListingProductProof has drop {
        creator: address,
        name: String,
        description: String,
        uri: String,
        quantity: u64,
        price: u64
    }

    public fun create_listing_product_proof(
        creator: address,
        name: String,
        description: String,
        uri: String,
        quantity: u64,
        price: u64
    ): ListingProductProof {
        ListingProductProof {
            creator,
            name,
            description,
            uri,
            quantity,
            price
        }
    }

    struct OrderProductProof has drop {
        buyer: address,
        order_id: String,
        product_title: String,
        quantity: u64
    }

    public fun create_order_product_proof(
        buyer: address,
        order_id: String,
        product_title: String,
        quantity: u64
    ): OrderProductProof {
        OrderProductProof {
            buyer,
            order_id,
            product_title,
            quantity
        }
    }

    struct CompleteOrderProductProof has drop {
        seller: address,
        order_id: String
    }

    public fun create_complete_order_product_proof(
        seller: address,
        order_id: String
    ): CompleteOrderProductProof {
        CompleteOrderProductProof {
            seller,
            order_id
        }
    }

    struct ClaimRewardProof has drop {
        buyer: address,
        claim_history_id: String
    }

    public fun create_claim_reward_proof(
        buyer: address,
        claim_history_id: String
    ): ClaimRewardProof {
        ClaimRewardProof {
            buyer,
            claim_history_id
        }
    }

    struct ReviewProductProof has drop {
        reviewer: address,
        review_id: String
    }

    public fun create_review_product_proof(reviewer: address, review_id: String): ReviewProductProof {
        ReviewProductProof {
            reviewer,
            review_id
        }
    }

    struct ClaimReviewProof has drop {
        reviewer: address,
        review_id: String,
    }

    public fun create_claim_review_proof(reviewer: address, review_id: String): ClaimReviewProof {
        ClaimReviewProof {
            reviewer,
            review_id
        }
    }

    struct ClaimAllReviewProof has drop {
        reviewer: address
    }

    public fun create_claim_all_review_proof(reviewer: address): ClaimAllReviewProof {
        ClaimAllReviewProof {
            reviewer
        }
    }
}
