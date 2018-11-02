/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View,  PixelRatio,
  TouchableOpacity,
  Image, Animated, Easing} from 'react-native';
import LottieView from 'lottie-react-native';
import ImagePicker from 'react-native-image-picker';
import Whoopee from './src/components/whoopee';
import { Container, Header, Content, Button, Icon } from 'native-base';
import { LoginManager, LoginButton, AccessToken, GraphRequest, GraphRequestManager } from 'react-native-fbsdk';
import { FbManager } from './src/redux/actions/facebook-action';
import { connect } from 'react-redux';
import reducers from './src/redux/reducers';
import { Scene, Router, Actions, Reducer, ActionConst, Overlay, Tabs, Modal, Drawer, Stack, Lightbox } from 'react-native-router-flux';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

// type Props = {};
class App extends Component {
  componentDidMount() {
    // this.animation.play();
    // // Or set a specific startFrame and endFrame with:
    // this.animation.play(30, 120);
  }

  state = {
    progress: new Animated.Value(0),
    avatarSource: {uri: "file:///storage/emulated/0/Android/data/com.whoopee/files/Pictures/image-773eb9a9-b606-4c68-ad10-b6039e225eb2.jpg"},
    videoSource: null,
    name: "image-773eb9a9-b606-4c68-ad10-b6039e225eb2.jpg",
    type: "image/jpeg",
    url: "file:///storage/emulated/0/Android/data/com.whoopee/files/Pictures/image-773eb9a9-b606-4c68-ad10-b6039e225eb2.jpg",
    id: null,
    d: [{
      "building":{
        "cat_hashtag": [],
        "cat_quote": [{"text_quote": "The conspicuously wealthy turn up urging the character building values of the privation of the poor."},
        {"text_quote": "You have to see a building to comprehend it. Photographs cannot convey the experience, nor film."},
        {"text_quote": "I believe that voting is the first act of building a community as well as building a country."}
         ]
        },
        "ceiling":{
        "cat_hashtag": [ {
         "text_hashtag": [
         "ceiling",
         "art",
        "architecture",
         "travel",
         "design",
         "baroque",
       "travelblogger",
         "instatravel",
         "travelgram",
         "explore"
        ] }
        ] ,
        "cat_quote": [
        {"text_quote": "In my life, the sky is literally the ceiling."},
      {"text_quote": "Tithing is a bad ceiling but an excellent floor."},
      {"text_quote": "When I visited Moscow for the first time in 1998, …ter, to set 'A Gentleman in Moscow' in the hotel."},
      {"text_quote": "Obama has been perhaps the most partisan President… reached the debt ceiling before anyone expected."},
      {"text_quote": "I would vote against raising the national debt cei…out representation. I don't think we can do that."},
      {"text_quote": "Blame the Tea Party? Geez, no wonder Kerry did so … ceiling thumbs up; we would have been rated BBB."},
      {"text_quote": "When you go to the Sistine Chapel with Sophia Lore…me time before your thoughts turn to the ceiling."},
      {"text_quote": "You can have money piled to the ceiling but the si… funeral is still going to depend on the weather."},
      {"text_quote": "The message I like to convey to women and girls across the globe is that there is no glass ceiling."},
      {"text_quote": "I wanted to inspire people not to work under a bam… your business. There's not one face to anything."},
        {"text_quote": "I wouldn't be where I am, if not for Jamaica. My f…ted to become. There was no ceiling on top of me."}
       
        
        ]
    },
    "building1":{},
    "building2":{}
  }],
    buttonStatus: 'quote'
  };

  selectPhotoTapped() {
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
        let source = { uri: response.uri };

        // You can also display the image using data:
        // let source = { uri: 'data:image/jpeg;base64,' + response.data };

        this.setState({
          avatarSource: source,
          name: response.fileName,
          type: response.type,
          url : response.data,
          
        });
      }
    });
  }

  selectVideoTapped() {
    const options = {
      title: 'Video Picker',
      takePhotoButtonTitle: 'Take Video...',
      mediaType: 'video',
      videoQuality: 'medium'
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled video picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        this.setState({
          videoSource: response.uri
        });
      }
    });
  }

  componentDidMount() {
    Animated.timing(this.state.progress, {
      toValue: 1,
      duration: 5000,
      easing: Easing.linear,
    }).start();
  }

  onPressLearnMore(){
    const data = new FormData();
data.append('name', 'testName'); // you can append anyone.
// data.append('photo1', {
//   uri: this.state.url,
//   type: this.state.type, // or photo.type
//   name: this.state.name
// });
data.append('photo', this.state.url)
data.append('photo_name', this.state.name);
data.append('photo_type', this.state.type);
console.log(this.state)
    fetch("http://10.0.2.2:8003/v/getfuck/", {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "multipart/form-data"
      },
      body: data
    }).then(res => res.json())
    .then(r => {
      console.log('sad')
      this.setState({id: r.id})
      console.log(this.state.id)
      console.log('hey bye', this.state.id)
    fetch(`http://10.0.2.2:8003/v/getp/${this.state.id}`)
    .then(res => res.json())
    .then(p => this.setState({d: p})).catch(err => console.log(err));

    });
    
  }

  onC(po){
    // alert(1)
    console.log(po)
  this.setState({buttonStatus: po})
  }  
  
  fblogin(){
    console.log(1)
    this.props.Login()
    // LoginManager.logOut();
    // Attempt a login using the Facebook login dialog asking for default permissions.
    // LoginManager
    // .logInWithReadPermissions(['public_profile'])
    // .then(function (result) {
    //   if (result.isCancelled) {
    //     alert('Login cancelled');
    //   } else {
    //     AccessToken
    //       .getCurrentAccessToken()
    //       .then((data) => {
    //         let accessToken = data.accessToken
    //         alert(accessToken.toString())
  
    //         const responseInfoCallback = (error, result) => {
    //           if (error) {
    //             console.log(error)
    //             alert('Error fetching data: ' + error.toString());
    //           } else {
    //             console.log(result)
    //             alert('Success fetching data: ' + result.toString());
    //           }
    //         }
  
    //         const infoRequest = new GraphRequest('/me', {
    //           accessToken: accessToken,
    //           parameters: {
    //             fields: {
    //               string: 'email,name,first_name,middle_name,last_name'
    //             }
    //           }
    //         }, responseInfoCallback);
  
    //         // Start the graph request.
    //         new GraphRequestManager()
    //           .addRequest(infoRequest)
    //           .start()
  
    //       })
    //   }
    // }, function (error) {
    //   alert('Login fail with error: ' + error);
    //  });
    
  }


  render() {
  
    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}}>
            <TouchableOpacity onPress={() => this.onC('quote')}>
              <Text>sa</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.onC('hashtag')}>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}}>
                      <Text>2  </Text>
                      <Button
                          name='chevrons-right'
                          type='feather'
                          color='#517fa4'
                          />
                  </View>
            </TouchableOpacity>
          </View>
          <Text style={styles.welcome}>Welcome to React Native!</Text>
          <Text style={styles.instructions}>To get started, edit App.js</Text>
          <Text style={styles.instructions}>{instructions}</Text>
          
          
        
          <LottieView
          ref={animation => {
            this.animation = animation;
          }}
          style={{ height:100
          }}
          source={require('./lottie.json')}
          autoPlay
          loop
        />
            <View style={{alignItems: "center", justifyContent: "center" }}>
            <Button onPress={() => this.fblogin()} rounded style={{backgroundColor: "#3B5998", width: 240}}>
              <Icon type="Zocial" name="facebook" style={{padding: 0}}/>
              <Text style={{color: "white", fontWeight: "bold", fontSize: 15}}>Continue with FACEBOOK</Text>
            </Button>
            </View>
            <Button title="Hoem GO" onPress={() => Actions.home()} >
            <Text>Go home</Text>
            </Button>

        <TouchableOpacity onPress={this.selectPhotoTapped.bind(this)}>
            <View style={[styles.avatar, styles.avatarContainer, {marginBottom: 20}]}>
            { this.state.avatarSource === null ? <Text>Select a Photo</Text> :
              <Image style={styles.avatar} source={this.state.avatarSource} />
            }
            </View>
          </TouchableOpacity>

        {/* <TouchableOpacity onPress={this.selectVideoTapped.bind(this)}>
          <View style={[styles.avatar, styles.avatarContainer]}>
            <Text>Select a Video</Text>
          </View>
        </TouchableOpacity> */}

          { this.state.videoSource &&
            <Text style={{margin: 8, textAlign: 'center'}}>{this.state.videoSource}</Text>
          }
          <Image source={this.state.avatarSource} style={styles.uploadAvatar} />
          <TouchableOpacity
            onPress={this.onPressLearnMore.bind(this)}
            
            color="#841584"
            
          >
            <View>
              <Text>Hi ba</Text>
            </View>
          </TouchableOpacity>
        {console.log('state-wa varun',this.props.err)}
        {console.log('hibye')}
        {console.log(this.state.buttonStatus)}
        <Whoopee p={this.state.d} bStatus={this.state.buttonStatus}/>
      </View>
    );
  }
}

const mapStateToProps = (state, props) => ({
  err: state.fbReducer
})

const mapDispatchToProps = (dispatch, props) => ({
  Login: () => dispatch(FbManager())
})

export default connect(mapStateToProps, mapDispatchToProps)(App);

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
    borderWidth: 1 / PixelRatio.get(),
    justifyContent: 'center',
    alignItems: 'center'
  },
  avatar: {
    borderRadius: 75,
    width: 150,
    height: 150
  }
});
