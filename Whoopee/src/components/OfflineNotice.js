import React, { PureComponent } from 'react';
import {View, Text, NetInfo, Dimensions, StyleSheet, ToastAndroid} from 'react-native';
import {connect} from 'react-redux';

import {NetworkConnectionAction} from "../redux/actions/NetworkConnectionAction";

const { width } = Dimensions.get('window');

function MiniOfflineSign() {
    return (
        <View style={styles.offlineContainer}>
            <Text style={styles.offlineText}>No Internet Connection</Text>
        </View>
    );
}

// https://medium.com/dailyjs/offline-notice-in-react-native-28a8d01e8cd0
class OfflineNotice extends PureComponent {
    state = {
        isConnected: true
    };

    componentDidMount() {
        NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
    }

    componentWillUnmount() {
        NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
    }

    handleConnectivityChange = isConnected => {
        this.props.NetworkInfo(isConnected)
        if (isConnected) {
            this.setState({ isConnected });
        } else {
            this.setState({ isConnected });
        }
    };

    render() {
        if (!this.state.isConnected) {
             return <MiniOfflineSign />;
        }
        return null;
    }
}

const styles = StyleSheet.create({
    offlineContainer: {
        backgroundColor: '#b52424',
        height: 30,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width,
        position: 'absolute',
    },
    offlineText: { color: '#fff' }
});

const mapDispatchToProps = (dispatch, props) => ({
    NetworkInfo: networkStatus => dispatch(NetworkConnectionAction(networkStatus))
});

export default connect(null, mapDispatchToProps)(OfflineNotice);
