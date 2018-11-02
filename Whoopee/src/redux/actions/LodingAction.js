import {LOADING} from '../actionTypes/actionTypes';

export function LoadingLottieAction(status) {
    return {
        type: LOADING,
        status
    };
}