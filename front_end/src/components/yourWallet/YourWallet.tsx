import { Token } from "../Main"
import React, { useState } from "react";
import { Box } from "@mui/system";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Tab } from "@mui/material";
import WallerBalance from "./WalletBalance";
import StakeForm from "./StakeForm";


interface YourWalletProps {
    supportedToken: Array<Token>
}

export default function YourWallet({ supportedToken }: YourWalletProps) {

    const [selectedTokenIndex, setSelectedTokenIndex] = useState<number>(0)

    // const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    //     setSelectedTokenIndex(newValue);
    //   };

    const handleChange = (event: React.ChangeEvent<{}>, newValue: string) => {
        setSelectedTokenIndex(parseInt(newValue))
    }

    return(
        <Box>
            <h1>Your Wallet!</h1>
            <Box >
                <TabContext value={selectedTokenIndex.toString()}>
                    <Box >
                    <TabList textColor="secondary" indicatorColor="secondary" onChange={handleChange} aria-label="stake from tabs">
                        {supportedToken.map((token, index) => {
                            return (
                                <Tab label={token.name} value={index.toString()} key={index}/>
                            )
                        })}
                    </TabList>
                    {supportedToken.map((token, index) => {
                        return (
                            <TabPanel value={index.toString()} key={index}>
                                <div>
                                    <WallerBalance token={supportedToken[selectedTokenIndex]}/>
                                    <StakeForm token={supportedToken[selectedTokenIndex]}></StakeForm>
                                </div>
                            </TabPanel>
                        )
                    })}
                    </Box>
                </TabContext>
            </Box>
        </Box>
    )
}