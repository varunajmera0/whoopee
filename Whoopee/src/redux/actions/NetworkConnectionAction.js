import {NETWORK} from '../actionTypes/actionTypes';

export const NetworkConnectionAction = (networkStatus) => {
    return {
        type: NETWORK,
        networkStatus
    };
};
