import React, { Component } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
// import { Button, Text, Divider } from 'react-native-elements';
import { Container, Header, Content, Button, Text } from 'native-base';
import Carousel from './Carousel';

class Whoopee extends Component {
    constructor(props) {
        super(props);
        this.state = {
            btnValue: null,
            segmentedControlBtn: null,
            quote: Object.values(this.props.p[0])[0].cat_quote,
        }
    }
    componentDidMount(){

        //  if(this.props.bStatus == 'quote'){
        //     this.setState({quote: Object.values(this.props.p[0])[0].cat_quote})
        // }else if (this.props.bStatus == 'hashtag'){
        //     this.setState({quote: Object.values(this.props.p[0])[1].cat_hashtag})
        // }
    }

    // componentDidUpdate(prevProps) {
    //
    //     // Typical usage (don't forget to compare props):
    //     // if (this.props.bStatus !== prevProps.bStatus) {
    //     //     this.props.bStatus === 'quote' ? this.setState({quote: Object.values(this.props.p[0])[0].cat_quote}) :  this.setState({quote: Object.values(this.props.p[0])[1].cat_hashtag});
    //     // }
    //   }


    Keywa = (obj, key) => {
        if(this.props.bStatus == 'quote'){
            if (obj.hasOwnProperty(key)){
                console.log({key: key, value: obj[key].cat_quote})
                this.setState({quote: obj[key].cat_quote});
                // return { key: key, value: obj[key] };
                // throw new Error("Invalid map key.");
            }
        }else if(this.props.bStatus == 'hashtag'){
            if (obj.hasOwnProperty(key)){
                console.log({key: key, value: obj[key].cat_hashtag})
                this.setState({quote: obj[key].cat_hashtag});
                // return { key: key, value: obj[key] };
                // throw new Error("Invalid map key.");
            }
        }


    }
    re(){
        if(this.props.bStatus == 'quote'){
            return ( <Carousel sneak={0} containerStyle={{height: 100}}>
                {this.state.quote.map((t, m) => {
                    return <Text key={m}>{t.text_quote}</Text>
                })
                }
            </Carousel>)
        }else if(this.props.bStatus == 'hashtag'){
            console.log('lola', this.state.quote.length)
            console.log('lo', new String(this.state.quote[0].text_hashtag).split(',')[0])
            // console.log('lo', this.state.quote[0].text_hashtag)
            return new String(this.state.quote[0].text_hashtag).split(',').map(t => <Text>#{t},</Text>)
        }
//    return ( this.props.bStatus == 'quote' ? 
//                     <Carousel sneak={0} containerStyle={{height: 100}}>
//                     {this.state.quote.map((t, m) => {
//                             return <Text key={m}>{t.text_quote}</Text>
//                         }) 
//                         }
//                         </Carousel>


//                         : <Text>{this.state.quote[0].text_hashtag},</Text>

//    )
    }
    render() {
        const btnStyle = { margin: 10, borderRadius: 5 }
        return (
            <View>



                <View style={styles.contentContainer}>
                    <ScrollView  horizontal={true}>
                        {this.props.p.map((k, v) => {
                            return Object.keys(k).map(keys => {
                                return <View style={styles.buttonContainer} key={keys}>
                                    <Button

                                        title={keys} onPress={() => this.Keywa(this.props.p[0], keys)} />

                                </View>
                            });

                        })}
                    </ScrollView>
                </View>




                {/* {Object.values(this.props.p[0])[0].cat_quote.map((t, m) => {
                            return <Text key={m}>{t.text_quote}</Text>
                        }) 
                        } */}
                {console.log('hi ba')}
                {console.log(this.state.quote)}
                {/* {this.props.bStatus == 'quote' ?
                    <Carousel sneak={0} containerStyle={{height: 100}}>
                    {this.state.quote.map((t, m) => {
                            return <Text key={m}>{t.text_quote}</Text>
                        }) 
                        }
                        </Carousel>

                          
                        : <Text>{this.state.quote[0].text_hashtag},</Text>
                        // console.log('ko', this.state.quote[0].text_hashtag)
                        // this.state.quote.map((t, m) => {
                        //     var tp = t.text_hashtag
                           
                        //     return <Text>{tp}</Text>
                            
                        // })
                        } */}

                {this.re()}







                <Text>
                    {this.state.btnValue || 'no selection'}
                </Text>

            </View>
        )
    }
}

export default Whoopee;

const styles = StyleSheet.create({
    contentContainer: {

        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonContainer: {

    }
});