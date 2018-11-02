import {LOGIN, USER_CREATED} from '../actionTypes/actionTypes';
import {LoginManager, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk';
import {ModalAction} from "./ModalAction";
import {ToastAndroid} from "react-native";

export const AuthInfoAction = (first_name, last_name, email, accessToken) => {
    return {
        type: LOGIN,
        first_name,
        last_name,
        email,
        accessToken
    };
}

export const UserCreatedAction = (userId) => {
    return {
        type: USER_CREATED,
        userId
    }
};

userCreate = (first_name, last_name, email, access_token, dispatch) => {
    console.log('called')
    fetch("http://10.0.2.2:8003/api/v1/userCreate/", {
        method: 'POST',
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            first_name,
            last_name,
            email,
            access_token
        })
    }).then(res => {
        if (res.ok) {
            return res.json();
        }
        return res.text().then(text => {throw (res.status + ': '+ JSON.parse(text).error)});
    }).then(r => {
        console.log('r', r)
        dispatch(UserCreatedAction(r.userId))
    }).catch(err => {
        alert(err)
    });
};

export const FacebookManagerAction = () => {
    return dispatch => {
        return LoginManager.logInWithReadPermissions(['public_profile'])
            .then(function (result) {
                if (result.isCancelled) {
                    ToastAndroid.showWithGravityAndOffset(
                        'Login cancelled!',
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        50,
                        50,
                    );
                    // alert('Login cancelled');
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
                                    // alert('Error fetching data: ' + error.toString());
                                    dispatch(ModalAction(false));
                                } else {
                                    // dispatch(ModalAction(true));
                                    this.userCreate(result.first_name, result.last_name, result.email, accessToken.toString(), dispatch);
                                    dispatch(AuthInfoAction(result.first_name, result.last_name, result.email, accessToken.toString()));
                                }
                            };
                            const infoRequest = new GraphRequest('/me', {
                                accessToken: accessToken,
                                parameters: {
                                    fields: {
                                        string: 'email,name,first_name,middle_name,last_name'
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
                // alert('Login fail with error: ' + error);
                dispatch(ModalAction(false));
            });
    }
}