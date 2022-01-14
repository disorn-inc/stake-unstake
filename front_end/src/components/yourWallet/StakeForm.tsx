import { formatUnits } from "@ethersproject/units";
import { Button, CircularProgress, Input } from "@mui/material";
import { useEthers, useNotifications, useTokenBalance } from "@usedapp/core";
import { utils } from "ethers";
import  React,{ useEffect, useState } from "react";
import { useStakeTokens } from "../../hooks/useStakeTokens";
import { useUnstakeTokens } from "../../hooks/useUnstakeToken";
import { Token } from "../Main";

export interface StakeFormProps {
    token: Token;
}

export default function StakeForm({ token }: StakeFormProps) {
    const {address: tokenAddres, name} = token;
    const {account} = useEthers();
    const tokenBalance = useTokenBalance(tokenAddres, account)
    const formattedTokenBalance: number = tokenBalance ? parseFloat(formatUnits(tokenBalance, 18)) : 0
    const {notifications} = useNotifications();

    const [amount, setAmount] = useState<number | string | Array<number | string>>(0)
    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const newAmount = event.target.value === "" ? "" : Number(event.target.value);
        setAmount(newAmount);
        console.log(newAmount);
    }

    const { approveAndStake, state: approveAndStakeErc20State } = useStakeTokens(tokenAddres);

    const {unstakeToken, unstakeState} = useUnstakeTokens(tokenAddres)

    const handleStakeSubmit = () => {
        const amountAsWei = utils.parseEther(amount.toString());
        setAmount("");
        return approveAndStake(amountAsWei.toString());
    }

    const handleUnstakeSubmit = () => {
        setAmount("");
        return unstakeToken();
    }

    const isMining = approveAndStakeErc20State.status === "Mining";

    useEffect(() => {
        if(notifications.filter((notification) => 
            notification.type === "transactionSucceed" && notification.transactionName === "Approve ERC20 transfer").length > 0) {
                console.log("Approved!")
            }
        if(notifications.filter((notification) => 
            notification.type === "transactionSucceed" && notification.transactionName === "Stake Tokens").length > 0) {
                console.log("Tokens Stake!")
            }
        if(notifications.filter((notification) => 
            notification.type === "transactionSucceed" && notification.transactionName === "Stake Tokens").length > 0) {
                console.log("Tokens Stake!")
            }
    }, [notifications])

    return (
        <>
            <Input value={amount} onChange={handleInputChange} />
            <Button onClick={handleStakeSubmit} color="warning" size="large" disabled={isMining}>
                {isMining ? <CircularProgress size={26} /> : "Stake!!"}
            </Button>
            <Button color="error" onClick={handleUnstakeSubmit}>
                Unstake token
            </Button>
        </>
    )
}