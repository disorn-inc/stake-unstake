import { useEthers } from "@usedapp/core";
import React from "react";
import helperConfig from "../helper-config.json";
import networkMapping from "../chain-info/deployments/map.json";
import { constants } from "ethers";
import brownieConfig from "../brownie-config.json"
import mock from "../mock.png"
import eth from "../eth.png"
import dai from "../dai.png"
import YourWallet from "./yourWallet/YourWallet";

export type Token = {
    image: string;
    address: string;
    name: string;
}

export default function Main() {
    // show token value from wallet

    // Get the address of different tokens
    // Get the balance of the users wallet

    // const getKeyValue = <U extends keyof T, T extends object>(key: U) => (obj: T) =>obj[key];
    const { chainId, error } = useEthers();
    const networkName = chainId ? helperConfig[chainId] : "dev";

    const mockTokenAddress = chainId ? networkMapping[String(chainId)]["MockToken"][0] : constants.AddressZero;
    const wethTokenAddress = chainId ? brownieConfig["networks"][networkName]["weth_token"] : constants.AddressZero;
    const fauTokenAddress = chainId ? brownieConfig["networks"][networkName]["fau_token"] : constants.AddressZero;

    const supportedToken: Array<Token> = [
        {
            image: mock,
            address: mockTokenAddress,
            name: "MT"
        },
        {
            image: eth,
            address: wethTokenAddress,
            name: "WETH"
        },
        {
            image: dai,
            address: fauTokenAddress,
            name: "DAI"
        },
    ];
    console.log(chainId);
    console.log(networkName);
    return (<YourWallet supportedToken={supportedToken} />)
}