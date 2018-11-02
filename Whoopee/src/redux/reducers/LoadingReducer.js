import {LOADING} from '../actionTypes/actionTypes';

export default (state = {status: false}, action) => {
    switch (action.type) {
        case LOADING:
            const {status} = action;
            const loading = {
                status
            };
            return loading;
        default:
            return state;
    }
}