import { State } from './state';


const initialState = {
    app: {
        mounted: false,
        neoToUsd: 17
    }
};

export const { appStore, AppProvider } = State(initialState, 'app');

export const onAppMount = () => async ({ update }) => {
    try {
        let neoToUsdReq = await fetch(`${process.env.apiurl}neo-price`);
        let neoToUsdRes = await neoToUsdReq.json();
        update('app', { mounted: true, neoToUsd: parseFloat(neoToUsdRes[0]) });
    } catch (e) {
        console.log(e.message);
        update('app', { mounted: true });
    }
};
