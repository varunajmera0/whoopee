import React, { Component } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
// import { Button, Text, Divider } from 'react-native-elements';
import { Container, Header, Content, Button, Text } from 'native-base';
import Carousel from './Carousel';
import LottieView from 'lottie-react-native';
import { connect } from 'react-redux';
import {Animati} from "../redux/actions/LodingAction";
class Q extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidUpdate(prevProps) {
        console.log('componentDidUpdate----Q', prevProps)
        if (this.props.anilot.ani != prevProps.anilot.ani){
            this.props.lotie(false)
        }

    }
    componentDidMount(){
        console.log('componentDidMount----Q')
    }
    render(){
        console.log('render bye')
        return (
            <View>
                <Carousel sneak={0} containerStyle={{height: Dimensions.get('window').height/4}}>
                {
                        this.props.tet.map((t, m) => {
                            return <Text key={m}>{t.text_quote}</Text>
                        })
                    }
                </Carousel>
                {console.log('hi bye')}

            </View>
        );
    }
}

const mapStateToProps = (state, props) => ({
    lotieInfo: state.AuthReducer,
    anilot: state.lotReducer
})
const mapDispatchToProps = (dispatch, props) => ({
    lotie: (vals) => dispatch(Animati(vals))
})

export default connect(mapStateToProps, mapDispatchToProps)(Q)



// <Button bordered>
// {this.state.quote[0].text_hashtag.toString().split(',').map((t,v) => {
//         return <Text numberOfLines={5} key={v} style={{ borderRadius: 30, marginRight: 5, width: 100}}>#{t}</Text>
//
//
//     }
//
// )
// }
// </Button>