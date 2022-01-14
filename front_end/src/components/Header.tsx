import React from "react";
import { useEthers } from "@usedapp/core";
import { Button, createTheme } from "@mui/material";
import { createStyles, makeStyles } from '@mui/styles';
import { Box, Theme } from "@mui/system";
// import { ThemeProvider } from "@mui/material";


const useStyles = makeStyles((theme: Theme) => ({
    container: {
        padding: "16px",
        display: "flex",
        justifyContent: "flex-end",
        gap: "8px"
    }
}));

// const theme = createTheme();

export default function Header() {
    const classes = useStyles();
    const { activateBrowserWallet, account, deactivate } = useEthers();
    // console.log("id",chainId)

    const isConnected = (account !== undefined);

    return (
            <div className={classes.container}>
            <div>
                {isConnected ? (
                    <Box display="flex" justifyContent="space-between">
                        <Button color="primary" variant="contained">
                            {`${account?.slice(0, 4)}...${account?.slice(-3)}`}
                        </Button>
                        <Button variant='contained' onClick={deactivate}>
                            Disconnect
                        </Button>
                    </Box>
                    ) : (
                    <Button color="primary" variant='contained' onClick={() => activateBrowserWallet()}> 
                        Connect
                    </Button>
                    )
                }
            </div>
            </div>
    )
}

