import NavigationService from '../actions/NavigationService';
import { NavigationActions } from 'react-navigation';
export const loginCheck = state => {
    return next => {
        return action => {
            let result = next(action);
                // console.log('state', state)
            if (state.getState().AuthReducer.accessToken != null) {
                    // console.log('state.getState().AuthReducer.accessToken', state.getState().AuthReducer.accessToken)
                NavigationActions.navigate({ routeName: "App" })
                    // return NavigationService.navigate('App')
                // return this.props.navigation.navigate('App');
            } else {
                    // console.log('Not state.getState().AuthReducer.accessToken')
                NavigationActions.navigate({ routeName: "Auth" })
                // return NavigationService.navigate('Auth')
                // return this.props.navigation.navigate('Auth');
            }
            return result;
        };
    };
};