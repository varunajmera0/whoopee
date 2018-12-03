import {NETWORK} from '../actionTypes/actionTypes';

export default (state = {networkStatus: true}, action) => {
    switch (action.type) {
        case NETWORK:
            const {networkStatus} = action;
            return {networkStatus};
        default:
            return state;
    }
}