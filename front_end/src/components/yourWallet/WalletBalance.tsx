import { formatUnits } from "@ethersproject/units";
import { useEthers, useTokenBalance } from "@usedapp/core";
import React from "react";
import { Token } from "../Main";
import BalanceMsg from "../BalanceMsg";

export interface WallerBalanceProps {
    token: Token;

}

export default function WallerBalance({token}: WallerBalanceProps) {
    const { image, address, name } = token;
    const { account } = useEthers();
    const tokenBalance = useTokenBalance(address, account);
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    // console.log(tokenBalance?.toString());

    return (
            <BalanceMsg
                label={`Your un-stake ${name} balance`} amount={formattedTokenBalance} tokenImgSrc={image}/>
    )
}