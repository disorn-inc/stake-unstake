from scripts.helpful_scripts import get_account, get_contract
from brownie import MockToken, TokenFarm, network, config
from web3 import Web3
import yaml
import json
import os
import shutil


KEPT_BALANCE = Web3.toWei(100, "ether")


def deploy_token_farm_and_mock_token(update_front_end=False):
    account = get_account()
    mock_token = MockToken.deploy({"from": account})
    token_farm = TokenFarm.deploy(
        mock_token.address, 
        {"from": account},
        publish_source=config["networks"][network.show_active()]["verify"]
    )
    tx = mock_token.transfer(
        token_farm.address, mock_token.totalSupply() - KEPT_BALANCE,
        {"from": account}
    )
    tx.wait(1)
    # mock_token, weth_token, fau_token/dai
    # weth_token = config[""]
    weth_token = get_contract("weth_token")
    fau_token = get_contract("fau_token")
    dict_of_allowed_tokens = {
        mock_token: get_contract("dai_usd_price_feed"),
        fau_token: get_contract("dai_usd_price_feed"),
        weth_token: get_contract("eth_usd_price_feed") 
    }
    add_allowed_tokens(token_farm, dict_of_allowed_tokens, account)
    if update_front_end:
        update_front_end()
    return token_farm, mock_token
    
    
def add_allowed_tokens(token_farm, dict_of_allowed_tokens, account):
    for token in dict_of_allowed_tokens:
        add_tx = token_farm.AddAllowedTokens(token.address, {"from": account})
        add_tx.wait(1)
        set_tx = token_farm.setPriceFeedContract(token.address,
                                                 dict_of_allowed_tokens[token],
                                                 {"from": account}
        )
        set_tx.wait(1)
    return token_farm

def update_front_end():
    copy_folders_to_front_end(src="./build", dest="./front_end/src/chain-info")
    with open("brownie-config.yaml", "r") as brownie_config:
        config_dict = yaml.load(brownie_config, Loader=yaml.FullLoader)
        with open("./brownie-config.json", "w") as brownie_config_json:
            json.dump(config_dict, brownie_config_json)
    print("front end update")
    
    
def copy_folders_to_front_end(src, dest):
    if os.path.exists(dest):
        shutil.rmtree(dest)
    shutil.copytree(src, dest)


def main():
    deploy_token_farm_and_mock_token(update_front_end=True)