import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import Head from 'next/head';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { CacheProvider } from '@emotion/react';
import theme from 'src/theme';
import createEmotionCache from 'src/createEmotionCache';
import favicon from "src/public/static/favicon.ico";
// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();
import { WalletModalProvider } from '@rentfuse-labs/neo-wallet-adapter-react-ui';
// import { pageview } from 'src/lib/gtag';
import { WalletConnectionProvider } from 'src/utils/wallet-connection-provider';
import ResponsiveAppBar from 'src/components/layout/ResponsiveAppBar';
import 'src/public/static/css/style.css';
import '@rentfuse-labs/neo-wallet-adapter-react-ui/styles.css';
import { AppProvider } from '../state/app';
import Footer from "../components/layout/Footer";

export default function MyApp(props) {

    // useEffect(() => {
    //     const handleRouteChange = url => {
    //         pageview(url, document.title);
    //     };
    //     props.router.events.on('routeChangeComplete', handleRouteChange);
    //     return () => {
    //         props.router.events.off('routeChangeComplete', handleRouteChange);
    //     };
    // }, []);

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
                    <WalletConnectionProvider>
                        <WalletModalProvider>
                            <AppProvider>
                                <ResponsiveAppBar />
                                <Component {...pageProps} />
                                <Footer />
                            </AppProvider>
                        </WalletModalProvider>
                    </WalletConnectionProvider>
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
