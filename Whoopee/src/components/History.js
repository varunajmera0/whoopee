import React, {Component} from 'react';
import {View, Text, Dimensions, Modal} from 'react-native';
import LottieView from 'lottie-react-native';
import {Container, Content, List, ListItem, Left, Body, Right, Thumbnail, Icon} from 'native-base';
import {connect} from 'react-redux';

// const Whoopee_URL = 'http://10.0.2.2:8003';
const Whoopee_URL = 'http://1precent.com';

class History extends Component{
    constructor(props) {
        super(props);
        this.state = {
            getUserData1: null,
            modalShow: false
        }
    }

    static navigationOptions = ({ navigation }) => {
        const { state } = navigation;
        return {
            headerTitle: 'History',
            headerStyle: {
                backgroundColor: '#35a79c',
            },
            headerTintColor: 'black',
            headerTitleStyle: {
                fontFamily: 'Comfortaa-Bold',
                marginLeft: -10
            }
        }
    };

    ModalShow = () => {
        return (
            <Modal animationType="fade"
                   transparent={true}
                   visible={this.state.modalShow}
                   onRequestClose={() => {
                       alert('Modal has been closed.');
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

    componentDidMount(){
        this.setState({modalShow: true});
        fetch(`${Whoopee_URL}/api/v1/getUserData/${this.props.UserCreated}/`)
            .then(res => {
                if (res.ok) {
                    return res.json()
                }
                return res.text().then(text => {
                    try {
                        // here we check json is not an object
                        throw typeof text === 'object' ? (res.status + ': '+ JSON.parse(text).error) : (res.status + ': '+ text);
                      } catch(error) {
                         // this drives you the Promise catch
                        throw error;
                      }  
                    // throw (res.status + ': ' + JSON.parse(text).error)
                });
            })
            .then(r => {
                this.setState({ getUserData1: r.user_analytics, modalShow: false });
            })
            .catch(err => { 
                this.setState({modalShow: false});
                alert(err)
            });
    };
    
    render(){
        return(
            <Container>
                <Content style={{backgroundColor: '#35a79c'}}>
                    {this.ModalShow()}
                    <List>
                        {this.state.getUserData1 ? (this.state.getUserData1.length > 0 ? (this.state.getUserData1.map((value, k) => {
                            //inside ListItem onPress={() => (value.data !== null) ? this.props.navigation.navigate('Home', {'id': value.id}) : null}
                            return <ListItem thumbnail key={k}>
                                    <Left>
                                        <Thumbnail square source={{ uri: `${Whoopee_URL}/media/${value.image}` }} />
                                    </Left>
                                    <Body>
                                    <Text numberOfLines={1}>{value.data !== null ? JSON.parse(value.data).captions : (value.data !== null ? JSON.parse(value.data).tags.map((x, key) => {
                                            if (key===(JSON.parse(value.data).tags.length-1)){
                                                return x
                                            }
                                            return x + ', '
                                        }) : 'Nothing')
                                    }</Text>
                                    <View style={{flexDirection: 'row'}}>
                                        <Text style={{textAlign: 'left'}}>{value.created_at} </Text>
                                        <Text style={{paddingLeft: '50%'}}>{value.data !== null ? 'Success' : 'Failed'}</Text>
                                    </View>
                                    </Body>
                                    <Right>
                                        {value.data !== null ?
                                        <Icon name="ios-arrow-forward" type="Ionicons" onPress={() => this.props.navigation.navigate('Home', {'id': value.id})} /> : null}
                                    </Right>
                                </ListItem>
                            }) 
                            ): 
                            <LottieView
                                    style={{ height: null, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}
                                    source={require('../lottiesFiles/crying.json')}
                                    autoPlay
                                    loop
                            />)
                                : <LottieView
                                style={{ height: null, justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}
                                source={require('../lottiesFiles/crying.json')}
                                autoPlay
                                loop
                            />
                        }
                    </List>
                </Content>
            </Container>
        )
    }
}

const mapStateToProps = (state, props) => ({
    UserCreated: state.UserCreatedReducer.userId,
});

export default connect(mapStateToProps, null)(History);