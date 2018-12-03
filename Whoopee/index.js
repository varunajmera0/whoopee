import {AppRegistry} from 'react-native';
import React, {Component} from 'react';
import {name as appName} from './app.json';

import {Provider, connect} from 'react-redux';
import {store, persistor} from './src/redux/store';
import {PersistGate} from 'redux-persist/integration/react'

import {
    createStackNavigator,
    createSwitchNavigator
} from 'react-navigation';

import App from './App';
import Home from './src/components/Home';
import History from "./src/components/History";

// https://shift.infinite.red/react-navigation-drawer-tutorial-a802fc3ee6dc
const AppStack = createStackNavigator({Home: Home, History: History});
const AuthStack = createStackNavigator({SignIn: App});

const WhoopeeRoutes = createSwitchNavigator(
    {
        App: AppStack,
        Auth: AuthStack,
    },
    {
        initialRouteName: 'Auth',
    }
);

class Whoopee extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={persistor}>
                    <WhoopeeRoutes />
                </PersistGate>
            </Provider>
        );
    }
}

AppRegistry.registerComponent(appName, () => Whoopee);