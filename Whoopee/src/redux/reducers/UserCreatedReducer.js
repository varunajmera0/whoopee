import {USER_CREATED} from '../actionTypes/actionTypes';

export default (state = {'userId': null, }, action) => {
    switch (action.type) {
        case USER_CREATED:
            const {userId} = action;
            return {userId};
        default:
            return state;
    }
}