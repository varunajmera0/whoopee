import {MODAL} from '../actionTypes/actionTypes';

export default (state = {modalStatus: false}, action) => {
    switch (action.type) {
        case MODAL:
            const {modalStatus} = action;
            return {modalStatus};
        default:
            return state;
    }
}