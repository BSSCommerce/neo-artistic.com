import React from 'react';
import GasLogo from 'src/public/static/icons/gas.svg';
import Icon from '@mui/material/Icon';

export default function GasIcon(props) {
    return (
        <Icon {...props} sx={{ textAlign: 'center' }}>
            <img src={GasLogo.src} style={{ display: 'flex', width: 'inherit', height: 'inherit' }}/>
        </Icon>
    );
};