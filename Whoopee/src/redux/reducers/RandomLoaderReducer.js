import {RANDOM_LOADER} from '../actionTypes/actionTypes';

export default (state = {randNumber: 0}, action) => {
    switch (action.type) {
        case RANDOM_LOADER:
            const {randNumber} = action;
            return {randNumber};
        default:
            return state;
    }
}