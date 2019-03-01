import {LOGIN, USER_CREATED} from '../actionTypes/actionTypes';
import {LoginManager, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk';
import {ModalAction} from "./ModalAction";
import {ToastAndroid} from "react-native";

const Whoopee_URL = 'http://1precent.com';

export const AuthInfoAction = (first_name, last_name, email, accessToken, id) => {
    return {
        type: LOGIN,
        first_name,
        last_name,
        email,
        accessToken,
        id
    };
};

export const UserCreatedAction = (userId) => {
    return {
        type: USER_CREATED,
        userId
    }
};

userCreate = (first_name, last_name, email, access_token, id, dispatch) => {
    fetch(`${Whoopee_URL}/api/v1/userCreate/`, {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            first_name,
            last_name,
            email,
            access_token,
            id
        })
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
        return res.text().then(text => {
            try {
                // here we check json is not an object
                throw typeof text === 'object' ? (res.status + ': '+ JSON.parse(text).error) : (res.status + ': '+ text);
              } catch(error) {
                 // this drives you the Promise catch
                throw error;
              }  
            // throw (res.status + ': '+ JSON.parse(text).error)
        });
    }).then(r => {
        dispatch(UserCreatedAction(r.userId))
    }).catch(err => {
        alert(err)
    });
};

export const FacebookManagerAction = () => {
    return dispatch => {
        return LoginManager.logInWithReadPermissions(['public_profile', 'email'])
            .then(function (result) {
                if (result.isCancelled) {
                    ToastAndroid.showWithGravityAndOffset(
                        'Login cancelled!',
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        50,
                        50,
                    );
                    dispatch(ModalAction(false));
                } else {
                    AccessToken
                        .getCurrentAccessToken()
                        .then((data) => {
                            let accessToken = data.accessToken
                            const responseInfoCallback = (error, result) => {
                                if (error) {
                                    ToastAndroid.showWithGravityAndOffset(
                                        'Error fetching data: ' + error.toString(),
                                        ToastAndroid.LONG,
                                        ToastAndroid.BOTTOM,
                                        50,
                                        50,
                                    );
                                    dispatch(ModalAction(false));
                                } else {
                                    this.userCreate(result.first_name, result.last_name, result.email, accessToken.toString(), result.id, dispatch);
                                    dispatch(AuthInfoAction(result.first_name, result.last_name, result.email, accessToken.toString(), result.id));
                                }
                            };
                            const infoRequest = new GraphRequest('/me', {
                                accessToken: accessToken,
                                parameters: {
                                    fields: {
                                        string: 'name,first_name,middle_name,last_name,email,id'
                                    }
                                }
                            }, responseInfoCallback);

                            // Start the graph request.
                            new GraphRequestManager()
                                .addRequest(infoRequest)
                                .start()

                        })
                }
            }, function (error) {
                ToastAndroid.showWithGravityAndOffset(
                    'Login fail with error: ' + error,
                    ToastAndroid.LONG,
                    ToastAndroid.BOTTOM,
                    50,
                    50,
                );
                dispatch(ModalAction(false));
            });
    }
};