#![cfg(test)]

use soroban_sdk::{testutils::Address as _, Address, Env};
use stellar_scavngr_contract::{omni-stellar-omni-stellar-scavengerContract, omni-stellar-omni-stellar-scavengerContractClient};

fn setup(env: &Env) -> (omni-stellar-omni-stellar-scavengerContractClient<'_>, Address) {
    let client = omni-stellar-omni-stellar-scavengerContractClient::new(env, &env.register_contract(None, omni-stellar-omni-stellar-scavengerContract));
    let admin = Address::generate(env);
    client.initialize_admin(&admin);
    (client, admin)
}

#[test]
#[should_panic(expected = "Unauthorized: caller is not admin")]
fn test_transfer_admin_non_admin_cannot_transfer() {
    let env = Env::default();
    let (client, _admin) = setup(&env);
    env.mock_all_auths();
    let non_admin = Address::generate(&env);
    let new_admin = Address::generate(&env);
    client.transfer_admin(&non_admin, &new_admin);
}

#[test]
fn test_transfer_admin_new_admin_can_call_admin_functions() {
    let env = Env::default();
    let (client, admin) = setup(&env);
    env.mock_all_auths();
    let new_admin = Address::generate(&env);
    client.transfer_admin(&admin, &new_admin);
    assert_eq!(client.get_admin(), new_admin);
}

#[test]
#[should_panic(expected = "Unauthorized: caller is not admin")]
fn test_transfer_admin_old_admin_loses_privileges() {
    let env = Env::default();
    let (client, admin) = setup(&env);
    env.mock_all_auths();
    let new_admin = Address::generate(&env);
    client.transfer_admin(&admin, &new_admin);
    // old admin should no longer have privileges
    client.transfer_admin(&admin, &Address::generate(&env));
}
