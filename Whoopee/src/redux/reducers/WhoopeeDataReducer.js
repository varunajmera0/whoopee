import {ERROR, WHOOPEE_DATA} from '../actionTypes/actionTypes';

export default (state = {data: null}, action) => {
    switch (action.type) {
        case WHOOPEE_DATA:
            const {data} = action;
            const whoopeeData = {
                data
            };
            return whoopeeData;
        default:
            return state;
    }
}