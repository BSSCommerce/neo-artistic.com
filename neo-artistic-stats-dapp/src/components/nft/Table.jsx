import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import NeoIcon from "../common/NeoIcon";
import Avatar from '@mui/material/Avatar';
function createData(name, value, tokens, auctions, average) {
    return { name, value, tokens, auctions, average };
}



export default function BasicTable({collections}) {
    const rows = [];

    for (const [key, value] of Object.entries(collections)) {
        rows.push(
            createData(key, value.value, value.tokens, value.auctions, (value.value / value.tokens).toFixed(2) )
        )
    }

    return (
        <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell>Collection</TableCell>
                        <TableCell align="right">Total Value</TableCell>
                        <TableCell align="right">Total NFTs</TableCell>
                        <TableCell align="right">Auctioned NFTs</TableCell>
                        <TableCell align="right">Average Price</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((row) => (
                        <TableRow
                            key={row.name}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row" style={{display: "flex", alignItems: "center"}}>
                                <Avatar src={`https://picsum.photos/300?random=${row.name}`}/>&nbsp;<a target={"_blank"} href={`https://neo-artistic.com/collections/${row.name}`}>{row.name}</a>
                            </TableCell>
                            <TableCell align="right">{row.value}&nbsp;<NeoIcon fontSize={'small'} /></TableCell>
                            <TableCell align="right">{row.tokens}</TableCell>
                            <TableCell align="right">{row.auctions}</TableCell>
                            <TableCell align="right">{row.average}&nbsp;<NeoIcon fontSize={'small'} /></TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
