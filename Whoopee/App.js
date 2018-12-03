import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Dimensions,
    Modal,
    TouchableWithoutFeedback
} from 'react-native';

import LottieView from 'lottie-react-native';

import {FacebookManagerAction} from './src/redux/actions/AuthAction';
import {connect} from 'react-redux';
import {ModalAction} from "./src/redux/actions/ModalAction";


class App extends Component {
    constructor(props) {
        super(props);
        this._bootstrapAuthentication();
        this.props.Modalstatus(false);
    }

    _bootstrapAuthentication = () => {
        if (this.props.AuthInfo.accessToken != null) {
            this.props.navigation.navigate('App');
        } else {
            this.props.navigation.navigate('Auth');
        }
    };

    Authentication() {
        this.props.Modalstatus(true);
        this.props.Login()
    }

    ModalShow = () => {
        return (
            <Modal animationType="fade"
                   transparent={true}
                   visible={this.props.WhoopeeModal}
                   onRequestClose={() => {
                       alert('Modal has been closed.');
                   }}>
                <View style={{backgroundColor: '#FCFCFC', width: '100%', height: '100%'}}>
                    <View style={{justifyContent: 'center', alignContent: 'center', flexDirection: 'row', marginTop: Dimensions.get('window').height/5 }}>
                        <LottieView ref={animation => { this.animation = animation; }}
                                    style={{width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center'}}
                                    source={require('./src/lottiesFiles/loader.json')}
                                    autoPlay
                                    loop
                        />
                    </View>
                </View>
            </Modal>
        );
    };

    componentDidUpdate(prevProps) {
        if (this.props.AuthInfo.accessToken != null) {
            this.props.Modalstatus(false);  //componentDidUpdate runs every time when component update
            this.props.navigation.navigate('App');
        } else {
            this.props.navigation.navigate('Auth');
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            headerTitle: 'Whoopee',
            headerStyle: {
                backgroundColor: '#35a79c',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
                fontFamily: 'Comfortaa-Bold',
            }
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <View style={{flexDirection: 'row', alignItems: "center", justifyContent: "center",}}>
                    <LottieView
                        style={{height: 200}}
                        source={require('./src/lottiesFiles/whoopee.json')}
                        autoPlay
                        loop
                    />

                </View>
                {this.ModalShow()}
                <TouchableWithoutFeedback onPress={() => this.Authentication()} style={{width: 350, alignItems: "center", justifyContent: "center", backgroundColor: 'red'}}>
                    <View style={{flexDirection: 'row', backgroundColor: 'white', width: 320, borderRadius: 30}}>
                        <LottieView
                            style={{height: 45, marginLeft: 6}}
                            source={require('./src/lottiesFiles/facebook_.json')}
                            autoPlay
                            loop
                        />
                        <Text style={{color: "black", fontFamily: 'Comfortaa-Bold', fontSize: 19, paddingTop: 5, marginLeft:10, textAlign: 'center', alignItems: "center", justifyContent: "center",}}>Continue with Facebook</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const mapStateToProps = (state, props) => ({
    AuthInfo: state.AuthReducer,
    WhoopeeModal: state.ModalReducer.modalStatus,
});

const mapDispatchToProps = (dispatch, props) => ({
    Login: () => dispatch(FacebookManagerAction()),
    Modalstatus: modalStatus => dispatch(ModalAction(modalStatus))
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#35a79c'
    }
});
