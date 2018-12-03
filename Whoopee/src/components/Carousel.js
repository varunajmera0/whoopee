import React, {Component} from "react";
// import PropTypes from 'prop-types';
import {
    Dimensions,
    I18nManager,
    ScrollView,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    View,
    Clipboard,
    ToastAndroid
} from "react-native";
import {Icon, Left, Right} from 'native-base';

import styles from "./styles";

const {width} = Dimensions.get("window");

export default class Carousel extends Component {

    displayName = "Carousel";

    static defaultProps = {
        initialPage: 0,
        pageStyle: null,
        containerStyle: null,
        pageWidth: width,
        sneak: 20,
        noItemsText: "Sorry, there are currently \n no items available",
        transitionDelay: 0,
        currentPage: 0,
        swipeThreshold: 0.5
    };

    constructor(props) {
        super(props);

        this.state = {
            gap: undefined,
            currentPage: props.currentPage,
        };

        this._scrollTimeout = null;

        this._resetScrollPosition = this._resetScrollPosition.bind(this);
        this._handleScrollEnd = this._handleScrollEnd.bind(this);
    }

    componentWillMount() {
        this._calculateGap(this.props);
    }

    componentDidMount() {
        this._resetScrollPosition(false);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            currentPage: nextProps.currentPage
        });
        this._calculateGap(nextProps);
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.currentPage !== this.props.currentPage) {
            this._resetScrollPosition();
            this._onPageChange(this.props.currentPage);
        } else if (prevState.currentPage !== this.state.currentPage) {
            this._resetScrollPosition();
            this._onPageChange(this.state.currentPage);
        }
    }

    componentWillUnmount() {
        if (this._scrollTimeout) {
            clearTimeout(this._scrollTimeout);
        }
    }

    _getPageOffset() {
        const {
            pageWidth,
        } = this.props;

        const {
            gap,
        } = this.state;

        return pageWidth + gap;
    }

    _getPageScrollX(pageIndex) {
        return pageIndex * this._getPageOffset();
    }

    _getPagesCount() {
        return React.Children.count(this.props.children);
    }

    _resetScrollPosition(animated = true) {
        // in android, you can't scroll directly in componentDidMount
        // (http://stackoverflow.com/questions/33208477/react-native-android-scrollview-scrollto-not-working)
        // however this doesn't work in android for some reason:
        // InteractionManager.runAfterInteractions(() => {
        //     this.scrollView.scrollTo({ y: 0, x: pagePosition}, true);
        //     console.log('scrollView.scrollTo x:', pagePosition);
        // });
        // So I was left with an arbitrary timeout.
        if (this._scrollTimeout) {
            clearTimeout(this._scrollTimeout);
        }
        this._scrollTimeout = setTimeout(() => {
            this.scrollView.scrollTo({
                x: this._getPageScrollX(this.state.currentPage),
                y: 0,
                animated,
            });
            this._scrollTimeout = null;
        }, this.props.transitionDelay);
    }

    _calculateGap(props) {
        const {sneak, pageWidth} = props;
        if (pageWidth > width) {
            throw new Error("invalid pageWidth");
        }
        /*
         ------------
        |            |
        |-   ----   -|
        | | |    | | |
        | | |    | | |
        | | |    | | |
        |-   ----   -|
        |^-- sneak   |
        |         ^--- gap
         ------------

        */
        const gap = (width - (2 * sneak) - pageWidth) / 2;
        this.setState({gap: gap});
    }

    _handleScrollEnd(e) {
        const {swipeThreshold} = this.props;
        const {currentPage} = this.state;

        const currentPageScrollX = this._getPageScrollX(currentPage);
        const currentScrollX = e.nativeEvent.contentOffset.x;

        const swiped = (currentScrollX - currentPageScrollX) / this._getPageOffset();

        const pagesSwiped = Math.floor(Math.abs(swiped) + (1 - swipeThreshold)) * Math.sign(swiped);
        const newPage = Math.max(Math.min(currentPage + pagesSwiped, this._getPagesCount() - 1), 0)

        if (newPage !== currentPage) {
            this.setState({currentPage: newPage});
        } else {
            if (newPage !== 0) {
                this.setState({currentPage: 0});
            }
            this._resetScrollPosition();
        }

    };

    _onPageChange(position) {
        if (this.props.onPageChange) {
            const currentElement = this.props.children[position];
            this.props.onPageChange(position, currentElement);
        }
    }

    _nextPage(pageIndex) {
        if ((this._getPagesCount() - 1) === pageIndex) {
            this.setState({currentPage: 0})
        } else {
            this.setState({currentPage: pageIndex + 1})
        }
    }

    _prevPage(pageIndex) {
        if (pageIndex === 0) {
            this.setState({currentPage: (this._getPagesCount() - 1)})
        } else {
            this.setState({currentPage: pageIndex - 1})
        }
    }

    render() {
        const {sneak, pageWidth} = this.props;
        const {gap} = this.state;
        const computedStyles = StyleSheet.create({
            scrollView: {
                paddingLeft: sneak + gap / 2,
                paddingRight: sneak + gap / 2
            },
            page: {
                width: Dimensions.get('window').width,
                height: 50,
                justifyContent: "center",
            }
        });

        // if no children render a no items dummy page without callbacks
        let body = null;
        if (!this.props.children) {
            body = (
                <TouchableWithoutFeedback>
                    <View style={[styles.page, computedStyles.page, this.props.pageStyle]}>
                        <Text style={styles.noItemsText}>
                            {this.props.noItemsText}
                        </Text>
                    </View>
                </TouchableWithoutFeedback>
            );
        }
        else {
            const children = Array.isArray(this.props.children) ? this.props.children : [this.props.children]
            body = children.map((c, index) => {
                return (
                    <View key={index} style={{width: Dimensions.get('window').width,}}>
                        <View style={{flexDirection: 'row',}}>
                            <Left>
                            
                            </Left>

                            <Right>
                                <Icon type='MaterialIcons' name='content-copy' onPress={async () => {
                                    await Clipboard.setString(c.props.children + "\n" +'- '+c.props.author);
                                    ToastAndroid.showWithGravityAndOffset(
                                        'Quote copied successfully!',
                                        ToastAndroid.LONG,
                                        ToastAndroid.BOTTOM,
                                        50,
                                        100,
                                    );
                                    }} style={{paddingTop: 8, paddingRight: 5}}/>
                            </Right>
                        </View>
                        <TouchableWithoutFeedback key={index} onPress={() => this.setState({currentPage: index})}>
                            <View style={{
                                width: Dimensions.get('window').width,
                                flex: 0.9,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <View style={{width: '10%', alignItems: 'center', justifyContent: 'center'}}>
                                    <TouchableWithoutFeedback onPress={() => this._prevPage(this.state.currentPage)}>
                                        <View>
                                            <Icon type="FontAwesome" name='angle-double-left' />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                                
                                <ScrollView style={{width: '80%',}} 
                                bounces
                                decelerationRate={0.9}
                            
                                contentContainerStyle={{ flexGrow: 1 }}
                                ref={c => this.scrollView = c}
                            >
                                    <Text adjustsFontSizeToFit={true} style={{ fontSize: 18, fontFamily: 'Comfortaa-Bold', textAlign: 'left'}}>{c.props.children}</Text>
                                    <Text style={{textAlign: 'right', fontSize: 18, fontFamily: 'Comfortaa-Bold',}}>{c.props.author ? '- '+c.props.author : ''}</Text>
                                </ScrollView>
                               
                                <View style={{width: '10%', alignItems: 'center', justifyContent: 'center'}}>
                                    <TouchableWithoutFeedback onPress={() => this._nextPage(this.state.currentPage)}>
                                        <View>
                                            <Icon type="FontAwesome" name='angle-double-right' />
                                        </View>
                                    </TouchableWithoutFeedback>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                );
            });
        }

        return (
            <View style={[styles.container, this.props.containerStyle]}>
                <ScrollView
                    automaticallyAdjustContentInsets={false}
                    bounces
                    style={{flexDirection: (I18nManager && I18nManager.isRTL) ? 'row-reverse' : 'row'}}
                    decelerationRate={0.9}
                    horizontal
                    onScrollEndDrag={this._handleScrollEnd}
                    ref={c => this.scrollView = c}
                    showsHorizontalScrollIndicator={false}
                >
                    {body}
                </ScrollView>
            </View>
        );
    }
}