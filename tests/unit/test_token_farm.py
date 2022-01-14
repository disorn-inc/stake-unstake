from brownie import network, config, exceptions
from scripts.deploy import deploy_token_farm_and_mock_token
from scripts.helpful_scripts import LOCAL_BLOCKCHAIN_ENVIRONMENTS, get_account, get_contract, INITIAL_PRICE_FEED_VALUE
import pytest


def test_set_price_feed_contract():
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    non_owner = get_account(index=1)
    token_farm, mock_token = deploy_token_farm_and_mock_token()
    price_feed_address = get_contract("eth_usd_price_feed")
    token_farm.setPriceFeedContract(
        mock_token.address,
        price_feed_address,
        {"from": account}
    )
    assert token_farm.tokenPriceFeedMapping(mock_token.address) == price_feed_address
    with pytest.raises(exceptions.VirtualMachineError):
        token_farm.setPriceFeedContract(
            mock_token.address,
            price_feed_address,
            {"from": non_owner}
        )
        
        
def test_stake_tokens(amount_staked):
    # Arrange
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    token_farm, mock_token = deploy_token_farm_and_mock_token()
    # Act
    mock_token.approve(token_farm.address, amount_staked, {"from": account})
    token_farm.stakeTokens(amount_staked, mock_token.address, {"from": account})
    assert (
        token_farm.stakingBalance(mock_token.address, account.address) == amount_staked
    )
    assert token_farm.uniqueTokensStaked(account.address) == 1
    assert token_farm.stakers(0) == account.address
    return token_farm, mock_token
        

def test_issue_tokens(amount_staked):
    if network.show_active() not in LOCAL_BLOCKCHAIN_ENVIRONMENTS:
        pytest.skip("Only for local testing!")
    account = get_account()
    token_farm, mock_token = test_stake_tokens(amount_staked)
    starting_balance = mock_token.balanceOf(account.address)
    print(starting_balance)
    token_farm.issueTokens({"from": account})
    print(mock_token.balanceOf(account.address))
    assert (
        mock_token.balanceOf(account.address) == starting_balance + INITIAL_PRICE_FEED_VALUE
    )