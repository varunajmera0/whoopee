import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    ScrollView,
    Animated,
    Image,
    Dimensions,
    Modal,
    Alert,
    TouchableWithoutFeedback,
    ImageBackground
} from 'react-native';
import {
    Button,
    Text,
    Icon,
    Segment,
} from 'native-base';

import {connect} from 'react-redux';
import {AdMobBanner} from "react-native-admob";
import LottieView from 'lottie-react-native';
import ImagePicker from "react-native-image-picker";

import WhoopeeSlider from './WhoopeeSlider';

import {FacebookManagerAction} from "../redux/actions/AuthAction";
import {LoadingLottieAction} from "../redux/actions/LodingAction";
import {WhoopeeDataAction} from "../redux/actions/WhoopeeDataAction";
import {RandomLoaderAction} from "../redux/actions/RandomLoaderAction";
import {ModalAction} from "../redux/actions/ModalAction";

// https://digitalsynopsis.com/design/beautiful-color-palettes-combinations-schemes/
class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            activePage: 1,
            progress: new Animated.Value(0),
            avatarSource: null,
            name: null,
            type: null,
            url: null,
            buttonStatus: 'quote',
            lottieAnimation: false,
            clickSnap: false,
            modalOpen: false,
    };
    this.props.Whoopee_Modal(false); //dispatch Redux
    this.props.Whoopee_Loader(Math.floor((Math.random() * 5))); //dispatch Redux
    }

    selectPhotoTapped = () => {
        const options = {
            title: 'Photo', // specify null or empty string to remove the title
            cancelButtonTitle: 'Cancel',
            takePhotoButtonTitle: 'Take Photo', // specify null or empty string to remove this button
            chooseFromLibraryButtonTitle: 'Choose photo from Gallery', // specify null or empty string to remove this button
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            // console.log('Response = ', response);
            if (response.didCancel) {
                console.log('User cancelled photo picker');
            }
            else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            }
            else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            }
            else {
                // You can also display the image using data:
                // let source = { uri: 'data:image/jpeg;base64,' + response.data };
                let source = { uri: response.uri };
                this.setState({
                    avatarSource: source,
                    name: response.fileName,
                    type: response.type,
                    url : response.data,
                    clickSnap: false
                });
        }
        });
    };

    selectComponent = (text,activePage) => () => {
        this.props.LottieAnimation(true); //dispatch Redux
        setTimeout(() => {
            this.props.LottieAnimation(false) //dispatch Redux
        }, 600);
        this.setState({buttonStatus: text, activePage, lottieAnimation: true})
    };

    onUpload = () => () => {
        console.log(this.props.UserCreated)
        const data = new FormData();
        // data.append('photo', {
        //   uri: this.state.url,
        //   type: this.state.type, // or photo.type
        //   name: this.state.name
        // });
        data.append('photo', this.state.url)
        data.append('photo_name', this.state.name);
        data.append('photo_type', this.state.type);
        data.append('user_id', this.props.UserCreated);

        //set timout is there cant set state clicksnap
        this.setState({modalOpen: true});
        this.props.Whoopee_Modal(true); //dispatch Redux

        fetch("http://10.0.2.2:8003/api/v1/analyzeImage/", {
          method: 'POST',
          headers: {
            "Accept": "application/json",
            "Content-Type": "multipart/form-data"
          },
          body: data
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
            this.props.Whoopee_Modal(false); //dispatch Redux
            //set timout is there cant set state clicksnap
            this.setState({modalOpen: false});
            return res.text().then(text => {throw (res.status + ': '+ JSON.parse(text).error)});
        }).then(r => {
                fetch(`http://10.0.2.2:8003/api/v1/getWhoopeeData/78/`)
                .then(res => {
                    if (res.ok){
                        return res.json()
                    }
                    return res.text().then(text => {throw (res.status + ': '+ JSON.parse(text).error)});
                })
                .then(r => {
                    this.setState({clickSnap: true, modalOpen: false});
                    this.props.Whoopee_Data([r]);
                })
                .catch(err => Alert.alert(err));
        }).catch(err => {
            this.props.Whoopee_Modal(false);  // typeError : Network request failed || other type of errors
            Alert.alert(err);
        });
    };

    segement = () => {
        return (
            <Segment style={{backgroundColor: '#35a79c', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.5, elevation: 10,}}>
                 <Button first active={this.state.activePage === 1} style={{borderColor: 'white', backgroundColor: (this.state.activePage === 1) ? 'white' : null}}
                         onPress={this.selectComponent('quote', 1)}>
                     <Text style={{color: 'black', fontFamily: 'Comfortaa-Bold'}}>Quote</Text>
                 </Button>
                 <Button last active={this.state.activePage === 2} style={{borderColor: 'white', backgroundColor: (this.state.activePage === 2) ? 'white' : null}}
                         onPress= {this.selectComponent('hashtag', 2)}>
                     <Text style={{color: 'black', fontFamily: 'Comfortaa-Bold'}}>Hashtag</Text>
                 </Button>
            </Segment>
        );
    };

    camerRender = () => {
        return (
            <View style={{backgroundColor: '#35a79c', height: Dimensions.get('window').height/3.1, width: Dimensions.get('window').width, marginTop: 7, marginBottom: (this.state.clickSnap) ? 5 : 0}}>
                <TouchableWithoutFeedback onPress={() => this.selectPhotoTapped()} style={{width: null, justifyContent: 'center', alignItems: 'center',}}>
                        <View style={{justifyContent: 'center', alignItems: 'center',}}>
                        { (this.state.avatarSource == null) ?
                            <LottieView ref={animation => { this.animation = animation; }}
                                style={{ height: 250, justifyContent: 'center', alignItems: 'center'}}
                                source={require('../lottiesFiles/Seccamera.json')}
                                autoPlay
                                loop
                            />
                            :
                            <Image style={styles.avatar} source={this.state.avatarSource} />
                        }
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    };
    
    componentDidMount() {
        if (this.props.QuoteHashtagData != null){
            this.props.Whoopee_Modal(true); //dispatch Redux
            this.setState({clickSnap: true, avatarSource: {uri: `http://10.0.2.2:8003${this.props.QuoteHashtagData[0].analysis.image}`}});
        }else{
            this.setState({clickSnap: false, avatarSource: null})
        }
        // button for camera on header
        this.props.navigation.setParams({ handleCamera: () => this.selectPhotoTapped() })
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
            },
            headerRight:
                <Icon name='camera' type='Feather' onPress={() => state.params.handleCamera()} style={{paddingRight: 10, fontSize: 30}} />
        }
    };

    ModalShow = () => {
        return (
            <Modal animationType="fade"
            transparent={true}
            visible={this.props.WhoopeeModal}
            onRequestClose={() => {
              Alert.alert('Modal has been closed.');
            }}>
                <View style={{backgroundColor: '#FCFCFC', width: '100%', height: '100%'}}>
                    <View style={{justifyContent: 'center', alignContent: 'center', flexDirection: 'row', marginTop: Dimensions.get('window').height/5 }}>
                        <LottieView ref={animation => { this.animation = animation; }}
                                style={{width: '100%', height: '100%', justifyContent: 'center', alignContent: 'center'}}
                                source={require('../lottiesFiles/splashy_loader.json')}
                                autoPlay
                                loop
                        />
                    </View>
                </View>
            </Modal>
        );
    };

    back = () => () => {
        this.setState({clickSnap: true,});
    }

    withoutImage = () => {
        //set timout is here cant set state clicksnap
        setTimeout(() => {
            this.props.Whoopee_Modal(false); //dispatch Redux
        }, 1200);

        return (
            <View style={{flexDirection: "row", justifyContent: "center", height: Dimensions.get('window').height/2.20, width: Dimensions.get('window').width, backgroundColor: '#35a79c', paddingBottom: 200}}>
                {
                    (this.state.url !== null) ?
                        <TouchableWithoutFeedback onPress={this.onUpload()}>
                            <View style={{marginTop: 70, marginRight: 10, borderRadius: 30, borderWidth: 3, borderColor: 'white', width: 120, height: 45, flexDirection: "row", justifyContent: "center", backgroundColor: 'white'}}>
                                <Text style={{fontSize: 22, fontFamily: 'Comfortaa-Bold', color: 'black', textAlign: 'center'}}>Send</Text>
                                <Icon type='FontAwesome' name='send-o' style={{justifyContent: "center", alignItems: 'center', paddingTop: 8, fontSize: 22, paddingLeft: 5}}/>
                            </View>
                        </TouchableWithoutFeedback>
                        :
                        <Image source={require('../lottiesFiles/image.png')} style={{flexDirection: "column", justifyContent: "center", alignItems: 'center', height: Dimensions.get('window').height/2.2, width: Dimensions.get('window').width, backgroundColor: '#35a79c', paddingBottom: 200}}/>
                }
                {
                    (this.props.QuoteHashtagData !== null) ?
                        <TouchableWithoutFeedback onPress={this.back()}>
                            <View style={{marginTop: 70, borderRadius: 30, borderWidth: 3, borderColor: 'white', width: 120, height: 45, flexDirection: "row", justifyContent: "center", backgroundColor: 'white'}}>
                                <Icon type='Ionicons' name='md-arrow-back' style={{justifyContent: "center", alignItems: 'center', paddingTop: 8, fontSize: 22, paddingRight: 7}}/>
                                <Text style={{fontSize: 22, fontFamily: 'Comfortaa-Bold', color: 'black', textAlign: 'center'}}>Back</Text>
                            </View>
                        </TouchableWithoutFeedback>
                        :
                        null
                }
            </View> 
        );
    };

    render() {
        return (
            <View style={{height: Dimensions.get('window').height, backgroundColor: 'transparent'}}>
                <View style={{height: Dimensions.get('window').height*0.80}}>
                    {this.state.clickSnap ? this.segement() : null}
                    {this.camerRender()}
                    {this.ModalShow()}
                    {!this.state.modalOpen ?
                        (this.state.clickSnap ?
                                <WhoopeeSlider ButtonStatus={this.state.buttonStatus}/>
                                :
                                this.withoutImage()
                        )
                        :
                        <View style={{
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: 'center',
                            height: Dimensions.get('window').height / 2.2,
                            width: Dimensions.get('window').width,
                            backgroundColor: '#35a79c',
                            paddingBottom: 200
                        }}/>
                    }
                </View>
                <View style={{ backgroundColor: '#35a79c', height: Dimensions.get('window').height*0.20}}>
                    <AdMobBanner adSize="smartBannerPortrait" adUnitID="ca-app-pub-4132894286898630/3108734750" didFailToReceiveAdWithError={this.bannerError} />
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state, props) => ({
    AuthInfo: state.AuthReducer,
    RandomLoading: state.RandomLoaderReducer,
    QuoteHashtagData: state.WhoopeeDataReducer.data,
    WhoopeeModal: state.ModalReducer.modalStatus,
    UserCreated: state.UserCreatedReducer.userId,
  });
  
const mapDispatchToProps = (dispatch, props) => ({
    Login: () => dispatch(FacebookManagerAction()),
    LottieAnimation: vals => dispatch(LoadingLottieAction(vals)),
    Whoopee_Data: data => dispatch(WhoopeeDataAction(data)),
    Whoopee_Loader: randomNum => dispatch(RandomLoaderAction(randomNum)),
    Whoopee_Modal: modalStatus => dispatch(ModalAction(modalStatus))
});
  
export default connect(mapStateToProps, mapDispatchToProps)(Home);

const styles = StyleSheet.create({
    avatarContainer: {
        borderColor: '#9B9B9B',
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height/3.1
    }
});