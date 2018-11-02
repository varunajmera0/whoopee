import {MODAL} from '../actionTypes/actionTypes';

export const ModalAction = (modalStatus) => {
    return {
        type: MODAL,
        modalStatus
    };
}
