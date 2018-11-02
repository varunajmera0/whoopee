import {WHOOPEE_DATA} from '../actionTypes/actionTypes';

export const WhoopeeDataAction = (data) => {
    return {
        type: WHOOPEE_DATA,
        data
    };
}
