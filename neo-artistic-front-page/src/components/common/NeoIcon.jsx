import React from 'react';
import NeoLogo from 'src/public/static/icons/neo.svg';
import Icon from '@mui/material/Icon';

export default function NeoIcon(props) {
    return (
        <Icon {...props} sx={{ textAlign: 'center' }}>
            <img src={NeoLogo.src} style={{display: 'flex', width: 'inherit', height: 'inherit'}} />
        </Icon>
    );
};