module ecommerce::exchange_entry {
    use std::error;
    use std::vector;
    use std::signer;
    use std::string::String;
    use std::option::{Self, Option};
    use aptos_std::math64;
    use aptos_std::type_info::{Self, TypeInfo};
    use aptos_std::ed25519::{Self, ValidatedPublicKey};
    use aptos_token::token::{Self, TokenId};
    use aptos_framework::coin::{Self, Coin};
    use aptos_framework::timestamp;
    use aptos_framework::resource_account;
    use aptos_framework::event::{Self, EventHandle};
    use aptos_framework::aptos_coin::AptosCoin;
    use aptos_framework::account::{Self, SignerCapability};

    struct Config has key {
        signer_cap: SignerCapability,
        verifier_pk: Option<ValidatedPublicKey>,
    }

    fun init_module(resource_account: &signer) {

    }

    fun initialize_ecommerce(account: &signer) {
        let resource_signer_cap = resource_account::retrieve_resource_account_cap(account, @admin_addr);
        move_to(account, Config {
            signer_cap: resource_signer_cap,
            verifier_pk: option::none()
        });
    }
}