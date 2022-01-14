import { makeStyles } from '@mui/styles';
import { Theme } from '@mui/system';

const useStyles = makeStyles((theme) => ({
    container: {
        display: "inline-grid",
        gridTemplateColumns: "auto auto auto",
        gap: "8px",
        alignContent: "center"
    },
    tokenImg: {
        width: "24px"
    },
    amount: {
        fontWeight: 700
    }
}))

interface BalanceMsgProps {
    label: string;
    amount: number;
    tokenImgSrc: string;
}

export default function BalanceMsg({label, amount, tokenImgSrc}: BalanceMsgProps) {
    const classes = useStyles();

    return (
        <div className = {classes.container}>
            <div>{label}</div>
            <div className={classes.amount}>{amount}</div>
            <img className={classes.tokenImg} src={tokenImgSrc} alt="token logo" />
        </div>
    )
}