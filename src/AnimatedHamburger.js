/*
The ScrollOffset's code is taken from this link and rest is my stupid code because I still can't sleep and it's 5AM,
Ahhh I am back to my bad routine. -_- . Anyway, had fun ^_^
https://stackoverflow.com/questions/29503252/get-current-scroll-position-of-scrollview-in-react-native
*/

import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    Animated,
    Dimensions,
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native';
import { Constants, Svg } from 'expo';
import { Ionicons } from '@expo/vector-icons';

import { Circle } from "./react-native-progress";

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const WIDTH = Dimensions.get("window").width
const HEIGHT = Dimensions.get("window").height

const BAR_HEIGHT = 50

export default class AnimatedHamburger extends React.Component {

    constructor(props){
        super(props);
        this.state={
            scrollY: new Animated.Value(0),
            animateLongBar: new Animated.Value(20),
            animateAroundBurger: new Animated.Value(0),
            animateSmallBar: new Animated.Value(WIDTH-20),
        }

    }

    componentDidMount() {
        this.state.animateLongBar.addListener(({value}) => {
            d=`M${value} ${BAR_HEIGHT} L${WIDTH-50} ${BAR_HEIGHT}`
            this._longBarComponent.setNativeProps({d})
        })
        
        this.state.animateSmallBar.addListener(({value}) => {
            d=`M${WIDTH-50} ${BAR_HEIGHT} L${value} ${BAR_HEIGHT}`
            this._smallBarComponent.setNativeProps({d})
        })
    }

    componentWillUnmount() {
        this.state.animateLongBar.removeAllListeners()
        this.state.animateSmallBar.removeAllListeners()
    }

    _handleScroll = () => {
        this.handleAnimateBurger()
    }

    handleAnimateBurger = () => {
        
        this._open = false

        if ((this.yOffset < HEIGHT/2 && this.dragVelocity < 0) || this.dragVelocity < -0.7 ){
            this._open = true
        }

        const toValueLongBar = this._open ? 20 : WIDTH-50;
        const toValueAroundBurger = this._open ? 0: 1;
        const toValueSmallBar = this._open ? WIDTH-20 : WIDTH-50;

        Animated.parallel([
            Animated.timing(this.state.animateLongBar, {
                toValue: toValueLongBar,
                duration: 500
            }),
            Animated.timing(this.state.animateAroundBurger, {
                toValue: toValueAroundBurger,
                duration: 500
            }),
            Animated.sequence([
                Animated.delay(this._open ? 500: 0),
                Animated.timing(this.state.animateSmallBar, {
                    toValue: toValueSmallBar,
                    duration: 300
                })
            ])
        ]).start()
        
    }

    render() {

      return (
      <View style={styles.container}>
        <View style={[styles.topBarStyle]}>
            <Ionicons name="md-menu" size={32} color="white" style={[styles.menuStyle]}/>
            <View
                style={{
                    transform: [
                        {
                            rotate: '180deg'
                        }
                    ],
                    position: 'absolute',
                    right: 25,
                }}
            >
            <AnimatedCircle
                progress={this.state.animateAroundBurger}
                size={52}
                thickness={2}
                color={"white"}
                borderColor={"#152d44"}
                direction={"counter-clockwise"}
            />
            </View>
            <Svg height={75} width={WIDTH}>
                <Svg.Path
                    ref={component => (this._longBarComponent = component)}
                    {...this.props}
                    d={`M20 ${BAR_HEIGHT} L${WIDTH-50} ${BAR_HEIGHT}`}
                    fill={"transparent"}
                    stroke={"white"}
                    strokeWidth={2}
                />
                <Svg.Path
                    ref={component => (this._smallBarComponent = component)}
                    {...this.props}
                    d={`M${WIDTH-50} ${BAR_HEIGHT} L${WIDTH-20} ${BAR_HEIGHT}`}
                    fill={"transparent"}
                    stroke={"white"}
                    strokeWidth={2}
                />
            </Svg>

        </View>
        <ScrollView
          style={[styles.scrollStyle]}
          scrollEventThrottle={16}
          onLayout={event => {
            this.frameHeight = event.nativeEvent.layout.height;
            const maxOffset = this.contentHeight - this.frameHeight;
            if (maxOffset < this.yOffset) {
              this.yOffset = maxOffset;
            }
          }}
          onContentSizeChange={(contentWidth, contentHeight) => {
            this.contentHeight = contentHeight;
            const maxOffset = this.contentHeight - this.frameHeight;
            if (maxOffset < this.yOffset) {
              this.yOffset = maxOffset;
            }
          }}
          onScroll={event => { 
            this.yOffset = event.nativeEvent.contentOffset.y;
          }}
          onScrollEndDrag={event => { 
            console.log(event.nativeEvent);
            this.dragVelocity = event.nativeEvent.velocity.y
            this.yOffset = event.nativeEvent.contentOffset.y;
          }}
          onMomentumScrollBegin={
            Animated.event(
              [
                {
                  nativeEvent: { contentOffset: { y: this.state.scrollY } }
                }
              ],
              { listener: this._handleScroll },
              {
                nativeDrive: true
              }
            )
          }
        >
            <Text style={{fontSize: 28, textAlign: 'center', paddingTop: 20}}>Scroll me Up!</Text>
            <Text style={{fontSize: 28, textAlign: 'center', marginTop: 430, marginBottom: 430}}>Scroll me Down!</Text>
        </ScrollView>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 24,
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#152d44',
  },
  menuStyle: {
    position: 'absolute',
    right: 38.5,
    top: 10,
  },
  topBarStyle: {
    height: 100,
    top: 10,
  },
  scrollStyle: {
    backgroundColor: "#1989AC",
    flex: 1,
    width: "100%",
    height: 2000,
  },
});