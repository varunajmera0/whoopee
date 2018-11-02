import {RANDOM_LOADER} from '../actionTypes/actionTypes';

export function RandomLoaderAction(randNumber) {
    return {
        type: RANDOM_LOADER,
        randNumber
    };
}