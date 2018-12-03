export const loginCheck = state => {
    return next => {
        return action => {
            let result = next(action);
            if (state.getState().AuthReducer.accessToken != null) {
            } else {
            }
            return result;
        };
    };
};