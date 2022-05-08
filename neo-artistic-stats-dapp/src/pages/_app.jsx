import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from 'src/theme';
import createEmotionCache from 'src/createEmotionCache';
import favicon from "src/public/static/favicon.ico";

const clientSideEmotionCache = createEmotionCache();

import ResponsiveAppBar from 'src/components/layout/ResponsiveAppBar';
import 'src/public/static/css/style.css';
import Footer from "../components/layout/Footer";

export default function MyApp(props) {


    const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
    return (

        <CacheProvider value={emotionCache}>
            <Head>
                <meta name="viewport" content="initial-scale=1, width=device-width" />
                <link rel="shortcut icon" href={favicon.src} />
                <meta name={"title"} title={"NFT Marketplace"} />
                <title>NFT Marketplace</title>
            </Head>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <main>

                    <ResponsiveAppBar />
                    <Component {...pageProps} />
                    <Footer />
                </main>
            </ThemeProvider>
        </CacheProvider>
    );
}

MyApp.propTypes = {
    Component: PropTypes.elementType.isRequired,
    emotionCache: PropTypes.object,
    pageProps: PropTypes.object.isRequired,
};
