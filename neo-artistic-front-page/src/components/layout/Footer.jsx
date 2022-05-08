import {
    Box,
    Typography,
    Link
} from "@mui/material"


function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://neo-artistic.com">
                neo-artistic.com
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}
export default function Footer() {
    return (
        <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer" className={"picasarts-footer"}>
            <Typography variant="h6" align="center" gutterBottom>
                NEO-ARTISTIC
            </Typography>
            <Typography
                variant="subtitle1"
                align="center"
                color="text.secondary"
                component="p"
            >
                Discover, collect, and sell extraodinary NFTs
            </Typography>
            <Copyright />
        </Box>
    )
}