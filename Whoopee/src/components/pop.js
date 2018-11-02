import React, { Component } from 'react';
import {View, StyleSheet, ScrollView, Animated, TouchableOpacity, PixelRatio, Image, Dimensions, Modal, Alert,TouchableHighlight} from 'react-native';
import {
    Container,
    Header,
    Content,
    Button,
    Text,
    Card,
    CardItem,
    Thumbnail,
    Left,
    Body,
    Icon,
    Right,
    Segment,
    Footer,
    FooterTab
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
            videoSource: null,
            name: "image-773eb9a9-b606-4c68-ad10-b6039e225eb2.jpg",
            type: "image/jpeg",
            url: "file:///storage/emulated/0/Android/data/com.whoopee/files/Pictures/image-773eb9a9-b606-4c68-ad10-b6039e225eb2.jpg",
            id: null,
            // d: [{
            //     "building":{
            //         "cat_hashtag": [
            //             {
            //                 "text_hashtag": [
            //                     "varun",
            //                     "ajmeri",
            //                     "lol",
            //                     "bye",
            //                     "design",
            //                     "baroque",
            //                     "travelblogger",
            //                     "instatravel",
            //                     "travelgram",
            //                     "explore"
            //                 ] }
            //         ],
            //         "cat_quote": [{"text_quote": "The conspicuously wealthy turn up urging the character building values of the privation of the poor."},
            //             {"text_quote": "You have to see a building to comprehend it. Photographs cannot convey the experience, nor film."},
            //             {"text_quote": "I believe that voting is the first act of building a community as well as building a country."}
            //         ]
            //     },
            //     "ceiling":{
            //         "cat_hashtag": [ {
            //             "text_hashtag": [
            //                 "ceiling",
            //                 "art",
            //                 "architecture",
            //                 "travel",
            //                 "design",
            //                 "baroque",
            //                 "travelblogger",
            //                 "instatravel",
            //                 "travelgram",
            //                 "explore"
            //             ] }
            //         ] ,
            //         "cat_quote": [
            //             {"text_quote": "In my life, the sky is literally the ceiling."},
            //             {"text_quote": "Tithing is a bad ceiling but an excellent floor."},
            //             {"text_quote": "When I visited Moscow for the first time in 1998, …ter, to set 'A Gentleman in Moscow' in the hotel."},
            //             {"text_quote": "Obama has been perhaps the most partisan President… reached the debt ceiling before anyone expected."},
            //             {"text_quote": "I would vote against raising the national debt cei…out representation. I don't think we can do that."},
            //             {"text_quote": "Blame the Tea Party? Geez, no wonder Kerry did so … ceiling thumbs up; we would have been rated BBB."},
            //             {"text_quote": "When you go to the Sistine Chapel with Sophia Lore…me time before your thoughts turn to the ceiling."},
            //             {"text_quote": "You can have money piled to the ceiling but the si… funeral is still going to depend on the weather."},
            //             {"text_quote": "The message I like to convey to women and girls across the globe is that there is no glass ceiling."},
            //             {"text_quote": "I wanted to inspire people not to work under a bam… your business. There's not one face to anything."},
            //             {"text_quote": "I wouldn't be where I am, if not for Jamaica. My f…ted to become. There was no ceiling on top of me."}


            //         ]
            //     },
            //     "building1":{},
            //     "building2":{},
            //     "building3":{}
            // }],
            d: null,
            buttonStatus: 'quote',
            lottieAnimation: false,
            clickSnap: false,
            modalOpen: false,
        };
        // this.props.Whoopee_Data(this.state.d);
        this.props.Whoopee_Modal(false); //dispatch Redux
        console.log('Math.floor((Math.random() * 3))',Math.floor((Math.random() * 2)))
        this.props.Whoopee_Loader(Math.floor((Math.random() * 2))); //dispatch Redux
    }

    selectPhotoTapped = () => {
        const options = {
            quality: 1.0,
            maxWidth: 500,
            maxHeight: 500,
            storageOptions: {
                skipBackup: true
            }
        };

        ImagePicker.showImagePicker(options, (response) => {
            console.log('Response = ', response);

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
    }

    selectComponent = (text,activePage) => () => {
        this.props.LottieAnimation(true); //dispatch Redux
        setTimeout(() => {
            this.props.LottieAnimation(false) //dispatch Redux
        }, 600);
        this.setState({buttonStatus: text, activePage, lottieAnimation: true})
    }

    onUpload = () => () => {
        const data = new FormData();
        // data.append('photo', {
        //   uri: this.state.url,
        //   type: this.state.type, // or photo.type
        //   name: this.state.name
        // });
        data.append('photo', this.state.url)
        data.append('photo_name', this.state.name);
        data.append('photo_type', this.state.type);

        //set timout is there cant set state clicksnap
        this.setState({modalOpen: true});
        this.props.Whoopee_Modal(true); //dispatch Redux

        fetch("http://10.0.2.2:8003/v/getfuck/", {
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
            this.setState({modalOpen: false})
            return res.text().then(text => {throw (res.status + ': '+ JSON.parse(text).error)});
        }).then(r => {
            fetch(`http://10.0.2.2:8003/v/getp/78/`)
                .then(res => {
                    if (res.ok){
                        return res.json()
                    }
                    return res.text().then(text => {throw (res.status + ': '+ JSON.parse(text).error)});
                })
                .then(r => {
                    this.setState({clickSnap: true, modalOpen: false});
                    this.props.Whoopee_Data([r]);
                }).catch(err => alert(err));
        }).catch(err => alert(err));
    }

    poo(){
        console.log('gi shaadui bi l=kr legi')
        // this.props.Whoopee_Data(this.state.d);
        this.props.Whoopee_Modal(true)
        fetch(`http://10.0.2.2:8003/v/getp/78`)
            .then(res => res.json())
            .then(p => {
                console.log(p)
                this.setState({d: [p], clickSnap: true})
                this.props.Whoopee_Data([p])
            })
            .catch(err => console.log(err));
    }
    po = () => {
        return (
            <LottieView

                style={{ height:150, display: 'flex'}}
                source={require('../lottiesFiles/animation.json')}
                progress={this.state.progress}
                autoPlay
                loop
            />
        );
    }

    segement = () => {
        return (
            <Segment style={{backgroundColor: '#35a79c', shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.5,

                // its for android
                elevation: 10,}}>
                <Button first active={this.state.activePage === 1} style={{borderColor: 'white', backgroundColor: (this.state.activePage === 1) ? 'white' : null }}
                        onPress={this.selectComponent('quote', 1)}><Text style={{color: 'black', fontFamily: 'Comfortaa-Bold'}}>Quote</Text></Button>
                <Button last active={this.state.activePage === 2} style={{borderColor: 'white', backgroundColor: (this.state.activePage === 2) ? 'white' : null}}
                        onPress= {this.selectComponent('hashtag', 2)}><Text style={{color: 'black', fontFamily: 'Comfortaa-Bold'}}>Hashtag</Text></Button>
            </Segment>
        );
    }

    camerRender = () => {
        return (
            <View style={{backgroundColor: '#35a79c', height: Dimensions.get('window').height/3.1, width: Dimensions.get('window').width, marginTop: 7, marginBottom: (this.state.clickSnap) ? 5 : 0}}>
                {/* <Card style={{height: Dimensions.get('window').height/3, width: Dimensions.get('window').width, }}> */}

                {/* <CardItem style={{backgroundColor: '#82E0AA'}}> */}

                <TouchableOpacity onPress={() => this.selectPhotoTapped()} style={{width: null, justifyContent: 'center', alignItems: 'center',}}>
                    <View style={[ {}]}>
                        { this.state.avatarSource == null ? (<LottieView
                                ref={animation => {
                                    this.animation = animation;
                                }}
                                style={{ height:250, justifyContent: 'center', alignItems: 'center'
                                }}
                                source={require('../lottiesFiles/camera.json')}
                                progress={this.state.progress}
                                autoPlay
                                loop
                            />) :
                            <Image style={styles.avatar} source={this.state.avatarSource} />
                        }
                    </View>
                </TouchableOpacity>

                {/* </CardItem> */}
                {/* <CardItem footer style={{backgroundColor: '#82E0AA'}}>
<Text>GeekyAnts</Text>
</CardItem>
</Card> */}
            </View>
        );
    }

    componentDidMount() {

        console.log('this.props.QuoteHashtagData != null',this.props.QuoteHashtagData)
        if (this.props.QuoteHashtagData != null){
            this.props.Whoopee_Modal(true)
            this.setState({clickSnap: true})
            this.setState({
                avatarSource: {uri: `http://10.0.2.2:8003${this.props.QuoteHashtagData[0].ana.image}`},
            })
            console.log('image uri', this.props.QuoteHashtagData[0].ana.image)
        }else{
            this.setState({clickSnap: false, avatarSource: null})
        }

        this.props.navigation.setParams({ handleCamera: () => this.selectPhotoTapped() })
    }
    static navigationOptions = ({ navigation }) => {
        const { state } = navigation
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
    }
    ModalShow = () => {
        return (
            <Modal
                animationType="fade"
                transparent={true}
                visible={this.props.WhoopeeModal}
                onRequestClose={() => {
                    Alert.alert('Modal has been closed.');
                }}>
                <View style={{backgroundColor: '#FCFCFC', width: '100%', height: '100%'}}>
                    <View style={{justifyContent: 'center', alignContent: 'center', flexDirection: 'row', marginTop: Dimensions.get('window').height/5 }}>
                        <LottieView
                            ref={animation => {
                                this.animation = animation;
                            }}
                            style={{ width: '100%',
                                height: '100%', justifyContent: 'center', alignContent: 'center'
                            }}
                            source={require('../lottiesFiles/splashy_loader.json')}
                            // source={require('../lottiesFiles/girl_jump.json')}
                            progress={this.state.progress}
                            autoPlay
                            loop
                        />
                    </View>
                </View>
            </Modal>
            //   </View>
        );
    }

    withoutImage = () => {
        //set timout is here cant set state clicksnap
        if(!this.state.clickSnap){
            console.log('withoutImage')
            setTimeout(() => {
                console.log('withoutImage', this.props)
                this.props.Whoopee_Modal(false)
            }, 1200);
        }

        return (
            <View style={{flexDirection: "row", justifyContent: "center", height: Dimensions.get('window').height/2.20, width: Dimensions.get('window').width, backgroundColor: '#35a79c', paddingBottom: 200}}>
                <TouchableOpacity onPress={this.onUpload()} style={{marginTop: 100, borderRadius: 30, borderWidth: 3, borderColor: 'white', width: 170, height: 50, flexDirection: "row", justifyContent: "center",}}>
                    <Text style={{fontSize: 24, fontFamily: 'Comfortaa-Bold', color: 'black'}}>Send</Text>
                    <Icon type='FontAwesome' name='send-o' style={{justifyContent: "center", alignItems: 'center', paddingTop: 6, paddingLeft: 5}}/>
                </TouchableOpacity>
            </View>
        );
    }

    render() {

        const btnStyle = { margin: 10, borderRadius: 5 }
        console.log('this.props.WhoopeeModal',this.props.WhoopeeModal)


        console.log('this.state.clickSnap', this.state.clickSnap)
        return (
            <View style={{height: Dimensions.get('window').height, backgroundColor: 'transparent'}}>
                {console.log('Dimensions.get.height',Dimensions.get('window').height)}
                {console.log('Dimensions.get.height',(Dimensions.get('window').height/0.8)) }
                <View style={{height: Dimensions.get('window').height*0.80}}>
                    {this.state.clickSnap ? this.segement() : null}
                    {this.camerRender()}
                    {this.ModalShow()}

                    {!this.state.modalOpen ? (this.state.clickSnap ?
                        <WhoopeeSlider ButtonStatus={this.state.buttonStatus} />
                        :
                        this.withoutImage())
                        : <View style={{flexDirection: "row", justifyContent: "center", height: Dimensions.get('window').height/2.20, width: Dimensions.get('window').width, backgroundColor: '#35a79c', paddingBottom: 200}}></View>
                    }
                </View>


                <View style={{ backgroundColor: '#35a79c', height: Dimensions.get('window').height*0.20}}>

                    <AdMobBanner
                        adSize="smartBannerPortrait"
                        adUnitID="ca-app-pub-4132894286898630/3108734750"
                        didFailToReceiveAdWithError={this.bannerError} />

                </View>



            </View> );
    }
}

const mapStateToProps = (state, props) => ({
    AuthInfo: state.AuthReducer,
    RandomLoading: state.RandomLoaderReducer,
    QuoteHashtagData: state.WhoopeeDataReducer.data,
    WhoopeeModal: state.ModalReducer.modalStatus,
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
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
    avatarContainer: {
        borderColor: '#9B9B9B',
        // borderWidth: 1 / PixelRatio.get(),
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {
        width: Dimensions.get('window').width,
        flex: 1

    }
});
