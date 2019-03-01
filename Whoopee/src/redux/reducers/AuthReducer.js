import {LOGIN, ERROR} from '../actionTypes/actionTypes';

let fb = {'first_name': null, 'last_name': null, 'email': null, 'accessToken': null, 'error': null};

export default (state = fb, action) => {
    switch (action.type) {
        case LOGIN:
            const {first_name, last_name, email, accessToken, id} = action;
            const auth = {
                first_name,
                last_name,
                email,
                accessToken,
                id
            };
            return auth;
        case ERROR:
            const {message} = action.error;
        default:
            return state;

    }
}