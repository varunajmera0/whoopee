import React, { Component } from 'react';
import {View, StyleSheet, ScrollView, Dimensions, Clipboard, ToastAndroid} from 'react-native';
import {Button, Text, Icon, Right} from 'native-base';
import LottieView from 'lottie-react-native';
import {connect} from 'react-redux';

import Carousel from './Carousel';
import {LoadingLottieAction} from "../redux/actions/LodingAction";
import {RandomLoaderAction} from "../redux/actions/RandomLoaderAction";
import {ModalAction} from "../redux/actions/ModalAction";

class WhoopeeSlider extends Component {
    constructor(props) {
        super(props);
        this.state = {
            quote: (this.props.QuoteHashtagData != null) ? Object.values(this.props.QuoteHashtagData[0])[0].cat_quote : null,
            existCategory: false,
            index: 0
        }
    }

    shuffledQuotes = (arr) => {
        return arr.map((a) => ({sort: Math.random(), value: a}))
            .sort((a, b) => a.sort - b.sort)
            .map((a) => a.value)
    };

    componentDidUpdate(prevProps) {
        if(this.props.ButtonStatus !== prevProps.ButtonStatus) {
            if(this.props.QuoteHashtagData != null){
                if(this.props.ButtonStatus === 'quote'){
                    if(Object.values(this.props.QuoteHashtagData[0])[0].hasOwnProperty('cat_quote')){
                        this.setState({
                            quote: this.shuffledQuotes(Object.values(this.props.QuoteHashtagData[0])[this.state.index].cat_quote),
                            existCategory: false
                        });
                    }else{
                        this.setState({existCategory: true});
                    }
                }else{
                    if(Object.values(this.props.QuoteHashtagData[0])[0].hasOwnProperty('cat_hashtag')){
                        this.setState({
                            quote: Object.values(this.props.QuoteHashtagData[0])[this.state.index].cat_hashtag,
                            existCategory: false
                        });
                    }else{
                        this.setState({existCategory: true});
                    }
                }
            }
        }else if(this.props.QuoteHashtagData !== prevProps.QuoteHashtagData){ //request changed
            if (this.props.QuoteHashtagData != null){
                if(this.props.ButtonStatus === 'quote'){
                    if(Object.values(this.props.QuoteHashtagData[0])[0].hasOwnProperty('cat_quote')){
                        this.setState({
                            quote: Object.values(this.props.QuoteHashtagData[0])[0].cat_quote,
                            existCategory: false
                        });
                    }else{
                        this.setState({existCategory: true});
                    }
                    this.props.Whoopee_Modal(false); //Modal close if request is there //dispatch Redux
                }else{
                    if(Object.values(this.props.QuoteHashtagData[0])[0].hasOwnProperty('cat_hashtag')){
                        this.setState({
                            quote: Object.values(this.props.QuoteHashtagData[0])[0].cat_hashtag,
                            existCategory: false
                        });
                    }else{
                        this.setState({existCategory: true});
                    }
                }
            }
        }
    }

    keySelected = (obj, key, index) => {
        if (this.state.index !== index){
            this.props.LottieAnimation(true); //dispatch Redux
            setTimeout(() => {
                this.props.LottieAnimation(false)  //dispatch Redux
            }, 1000);

            this.props.Whoopee_Loader(Math.floor((Math.random() * 5))); //dispatch Redux

            if(this.props.ButtonStatus === 'quote'){
                if (obj.hasOwnProperty(key)){
                    if(obj[key].hasOwnProperty('cat_quote')){
                        this.setState({
                            quote: this.shuffledQuotes(obj[key].cat_quote),
                            existCategory: false,
                            index
                        });
                    }
                    else{
                        this.setState({existCategory: true, index});
                    }
                }
            }else if(this.props.ButtonStatus === 'hashtag'){
                if (obj.hasOwnProperty(key)){
                    if(obj[key].hasOwnProperty('cat_hashtag')){ //"cat_hashtag" in obj[key]
                        this.setState({
                            quote: obj[key].cat_hashtag,
                            existCategory: false,
                            index
                        });
                    }else{
                        this.setState({existCategory: true, index});
                    }
                }
            }
        }
    };

    // https://stackoverflow.com/questions/35471326/react-native-flexbox-align
    // https://facebook.github.io/react-native/docs/flexbox
    dataRender = () => {
        return (
            (this.props.ButtonStatus === 'quote') ?
                (!this.state.existCategory ?
                    ((this.state.quote != null) ?
                        <Carousel sneak={0} containerStyle={{height: Dimensions.get('window').height/3.3, backgroundColor: '#35a79c'}}>
                            { this.state.quote.map((t, m) => {
                                return <Text author={t.author ? t.author.name : ''} key={m}>{t.text_quote}</Text>
                            })
                            }
                        </Carousel>
                        :
                        null
                    )
                    :
                    <View style={{justifyContent: 'center', alignItems: 'center', backgroundColor: '#35a79c', height: Dimensions.get('window').height/3.3}}>
                        <LottieView
                        style={{  height: Dimensions.get('window').height/3.3, width: Dimensions.get('window').width, justifyContent: 'center', alignItems: 'center', }}
                        source={require('../lottiesFiles/crying.json')}
                        autoPlay
                        loop
                        />
                    </View>
                )
                :
                (!this.state.existCategory ?
                    <View style={{backgroundColor: '#35a79c', height: Dimensions.get('window').height/3.3}}>
                        <ScrollView >
                            <View style={{flexDirection: 'row',}}>
                                <Right>
                                    <Icon type='MaterialIcons' name='content-copy'
                                          onPress={async () => {await Clipboard.setString('#' + this.state.quote[0].text_hashtag.map(x => x + ' ').join('#') + '#whoopee');
                                              ToastAndroid.showWithGravityAndOffset(
                                                  'Hashtag copied successfully!',
                                                  ToastAndroid.LONG,
                                                  ToastAndroid.BOTTOM,
                                                  50,
                                                  100,
                                              );
                                          }}
                                          style={{paddingTop: 8, paddingRight: 5}}/>
                                </Right>
                            </View>
                            <View style={{flex:1, flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center',}}>
                                {
                                    this.state.quote[0].text_hashtag.map((val,keys) =>{
                                        if(val !== ""){
                                            return  <View key={keys} style={{flexDirection: 'row', borderRadius: 20, borderWidth: 2, margin: 5, paddingRight: 5, paddingLeft: 5}}>
                                                        <Text style={{color: 'black', fontSize: 21, fontFamily: 'Comfortaa-Bold',}}>#{val}</Text>
                                                    </View>
                                        }
                                    })
                                }
                            </View>
                        </ScrollView>
                    </View>
                    :
                    <View style={{justifyContent: 'center', alignItems: 'center', height: Dimensions.get('window').height/3.3, backgroundColor: '#35a79c'}}>
                        <LottieView style={{height: Dimensions.get('window').height/3.3,
                                            width: Dimensions.get('window').width,
                                            justifyContent: 'center',
                                            alignItems: 'center'}}
                        source={require('../lottiesFiles/crying.json')}
                        autoPlay
                        loop
                        />
                    </View>
                )
        );
    };

    animationRender = () => {
        const random_loader_arr = [require("../lottiesFiles/duck_blue_style.json"),
                                require("../lottiesFiles/animation.json"),
                                require("../lottiesFiles/splashy_loader.json"),
                                require("../lottiesFiles/girl_jump.json"),
                                require("../lottiesFiles/halloween.json"),]
        return (
            <View style={{backgroundColor: '#35a79c', width: null, justifyContent: 'center', alignItems: 'center'}}>
                <LottieView style={{ height: Dimensions.get('window').height/3.3, justifyContent: 'center', alignItems: 'center'}}
                    source={random_loader_arr[this.props.RandomLoading.randNumber]}
                    progress={this.state.progress}
                    autoPlay
                    loop
                />
            </View>
        );
    };

    render() {
        return (
            <View style={{marginTop: 2, height: Dimensions.get('window').height/2.5,}}>
                <View style={styles.contentContainer}>
                    <ScrollView horizontal={true} style={{width: Dimensions.get('window').width, fontFamily: 'Comfortaa-Bold',}}  showsHorizontalScrollIndicator={false}>
                        {this.props.QuoteHashtagData != null ? this.props.QuoteHashtagData.map((k, val) => {
                            return Object.keys(k).map((keys, index) => {
                                return (
                                    <View style={[styles.buttonContainer, {}]} key={keys}>
                                        <Button transparent style={{
                                            borderRadius: (this.state.index === index) ? 30 : null,
                                            borderWidth: (this.state.index === index) ? 1 : null,
                                            borderColor: (this.state.index === index) ? 'black' : '',
                                        }} onPress={() => this.keySelected(this.props.QuoteHashtagData[0], keys, index)}>
                                            <Text style={{
                                                color: 'black',
                                                fontSize: 16,
                                                fontFamily: 'Comfortaa-Bold',
                                                textTransform: 'capitalize'
                                            }}>{(keys!=='analysis') ? keys : ''}</Text>
                                        </Button>
                                    </View>
                                );
                            });
                        }) : null }
                    </ScrollView>
                </View>
                {this.props.AnimationLoading.status ? this.animationRender() : this.dataRender() }
            </View>
        )
    }
}

const mapStateToProps = (state, props) => ({
    AnimationLoading: state.LoadingReducer,
    QuoteHashtagData: state.WhoopeeDataReducer.data,
    RandomLoading: state.RandomLoaderReducer
});

const mapDispatchToProps = (dispatch, props) => ({
    LottieAnimation: (vals) => dispatch(LoadingLottieAction(vals)),
    Whoopee_Loader: randomNum => dispatch(RandomLoaderAction(randomNum)),
    Whoopee_Modal: modalStatus => dispatch(ModalAction(modalStatus))
});

export default connect(mapStateToProps, mapDispatchToProps)(WhoopeeSlider);

const styles = StyleSheet.create({
    contentContainer: {
        width: Dimensions.get('window').width,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#35a79c',
        marginBottom: 8
    },
    buttonContainer: {
        marginRight: -8,
        height: Dimensions.get('window').height/15,
    }
});