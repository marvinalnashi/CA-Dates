import React, {Component} from 'react';
import Swiper from 'react-native-deck-swiper';
import {Modal, StyleSheet, Text, ToastAndroid, View} from 'react-native';
import {connect} from 'react-redux';
import {Icon} from 'react-native-elements';
import HeaderComponent from '../../../components/general/HeaderComponent';
import {HEIGHT_RATIO, regex, shadow, TouchableFeedback} from '../../../utils/regex';
import {BLUE, RED, LOVE, White, BORDER} from '../../../themes/constants';
import FastImage from 'react-native-fast-image';
import BackgroundAnimation from "../settings/BackgroundAnimation";
import FilterModal from './FilterModal';
import {distance, getCurrentLocation} from '../../../utils/location';
import CongraMatchModal from './CongraMatchModal';
import {discoverUsers, updateUserAction} from '../../../actions/userAction';
import {swipeCardUser} from '../../../actions/swipeCardAction';
import {getNotificationLists} from '../../../actions/notificationsAction';
import LottieView from "lottie-react-native";
import RNAndroidLocationEnabler from 'react-native-android-location-enabler';

class HomeScreen extends Component {

    constructor (props) {
        super(props);
        this.state = {
            cards: [],
            swipedAllCards: false,
            modalVisible: false,
            loading: true,
            congoModalVisible: false,
            matchUser: null
        };
        this.location = null;
        this.filterData = {
            selectedDistance: 800,
            selectedAge: 60,
        };
    }

    componentDidMount(): void {
        this.checkLocationEnabled();
        this.getNotificationData();
        getCurrentLocation().then(location => {
            this.location = location.coords;
            this.getNearByUserData();
        }).catch(error => {
            this.setState({loading: false});
        })
    }

    getNotificationData = () => {
        getNotificationLists(this.props.user.uid);
    };

    checkLocationEnabled = () => {
        RNAndroidLocationEnabler.promptForEnableLocationIfNeeded({
            interval: 10000,
            fastInterval: 5000,
        }).then(data => {
            if (data === "enabled") {
                ToastAndroid.show('CA Dates will now work as intended, now that you have enabled your location', ToastAndroid.SHORT)
            }
        })
            .catch((err) => {
                err = { "code" : "ERR00"}
                if (err) {
                    ToastAndroid.show('CA Dates will not work if you refuse to turn on your location.', ToastAndroid.SHORT)
                }
            });
    }

    getNearByUserData = () => {
        this.setLoader(true, () => {
            discoverUsers(this.props.user.uid, this.location, this.filterData.selectedDistance).then(response => {
                let data = [];
                for (let a in response)
                    data.push(response[a]._data);

                if (data.length > 0)
                    this.filterToData(data);
            });
        });
    };

    filterToData = (data) => {
        const {selectedAge, interested, showMe} = this.filterData;

        let uid = this.props.user.uid;
        let result = data.filter(function(v, i) {
            let query = false;
            if (Boolean(interested) && Boolean(showMe))
                query = v['uid'] !== uid && v['age'] <= selectedAge && interested.includes(v['lookingFor']) && showMe.includes(v['sexuality']);
            else if (Boolean(interested))
                query = v['uid'] !== uid && v['age'] <= selectedAge && interested.includes(v['lookingFor']);
            else if (Boolean(showMe))
                query = v['uid'] !== uid && v['age'] <= selectedAge && showMe.includes(v['sexuality']);
            else
                query = v['uid'] !== uid && v['age'] <= selectedAge;

            return query;
        });
        this.setState({cards: [], loading: false}, () => {
            this.setState({cards: result});
        });
    };

    setLoader = (shown, callback) => {
        this.setState({loading: shown}, callback);
    };

    onMenuPress = () => {
        const {navigation} = this.props;
        navigation.openDrawer();
    };

    onFilterPress = () => {
        this.setState({modalVisible: true});
    };

    onSwiped = (type, index) => {
        let uid = this.props.user.uid;
        let other = this.state.cards[index];

            swipeCardUser(uid, other.uid, type).then(response => {
                if (response && !this.state.congoModalVisible)
                    this.setState({matchUser: other, congoModalVisible: true});
            })
    };

    onSwipedAllCards = () => {
        this.setState({swipedAllCards: true})
    };

    swipeLeft = (index) => {
        const {navigation} = this.props;
        navigation.navigate('OtherProfile', {profileData: this.state.cards[index]})
    };

    onButtonPress = (type) => {
        const {swipedAllCards} = this.state;

        if (swipedAllCards)
            return;

        if (type === 'dislike')
            this.swiper.swipeLeft();
        else if (type === 'like')
            this.swiper.swipeRight();
        else if (type === 'love')
            this.swiper.swipeTop();
    };

    renderCardItem = (item, index) => {
        const {theme} = this.props;
        return (
            <View style={[styles.cardView, {backgroundColor: theme.backgroundColor, borderColor: theme.subSecondaryColor}]}>
                <FastImage source={{uri: regex.getProfilePic(item.photos)}} style={{flex: 1, borderRadius: 20, overflow: 'hidden'}}/>
                <FastImage source={require('./../../../assets/blur_effect.png')} style={{position: 'absolute', bottom: 0, left: 0, right: 0, top: 0, borderRadius: 20, overflow: 'hidden'}}/>
                <View style={{position: 'absolute', top: 0, right: 0, left: 0, bottom: 0}}>
                    <View style={{position: 'absolute', right: 0, left: 0, bottom: 20, paddingHorizontal: 20}}>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}}>
                            <Text style={[styles.nameText, {color: theme.backgroundColor}]}>{item.name}{regex.getAge(item.DoB)}</Text>
                        </View>
                        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginVertical: 5}}>
                            <Icon type={'feather'} name={'map-pin'} size={16} color={theme.backgroundColor} style={{fontSize: 16, color: theme.backgroundColor}}/>
                            <Text style={[styles.locationText, {color: theme.backgroundColor, marginLeft: 5}]}>{`${distance(item.location, this.location, 'K')}`} km away</Text>
                        </View>
                    </View>
                </View>
            </View>
        )
    };

    renderCard = () => {
        const {cards} = this.state;
        const {theme} = this.props;

        if (cards.length === 0) {
           return <View style={[styles.innerView, {alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primaryBackgroundColor}]}>
               <LottieView
                   source={require("./../../../assets/filter.json")}
                   style={{
                       bottom: "40%",
                       marginTop: "15%"
                   }}
                   autoPlay
               />
               <View>
                   <Text style={{fontSize: 18, padding: 30, textAlign: 'center'}}>
                       {'Enable your location and apply a filter to show users.'}
                   </Text>
               </View>
           </View>
        }

        return <View style={[styles.innerView, {backgroundColor: White}]}>
            <Swiper
                ref={swiper => {this.swiper = swiper}}
                onSwipedLeft={(index) => this.onSwiped('dislike', index)}
                onSwipedRight={(index) => this.onSwiped('like', index)}
                onSwipedTop={(index) => this.onSwiped('love', index)}
                onTapCard={this.swipeLeft}
                disableBottomSwipe={true}
                cards={cards}
                renderCard={this.renderCardItem}
                onSwipedAll={this.onSwipedAllCards}
                backgroundColor={White}
                containerStyle={{bottom: HEIGHT_RATIO(0.15)}}
                stackSize={cards.length > 2 ? 3 : cards.length}
                stackSeparation={-30}
                overlayLabels={overlayLabel}
                animateOverlayLabelsOpacity
                animateCardOpacity
                swipeBackCard
            />
            <View style={[styles.bottomView]}>
                <TouchableFeedback onPress={() => this.onButtonPress('dislike')}>
                    <View style={[styles.commonLike, {backgroundColor: White}]}>
                        <Icon type={'feather'} name={'thumbs-down'} size={30} color={BLUE} />
                    </View>
                </TouchableFeedback>
                <TouchableFeedback onPress={() => this.onButtonPress('love')}>
                    <View style={[styles.commonLike, {backgroundColor: White}]}>
                        <Icon type={'feather'} name={'heart'} size={30} color={BLUE} />
                    </View>
                </TouchableFeedback>
                <TouchableFeedback onPress={() => this.onButtonPress('like')}>
                    <View style={[styles.commonLike, {backgroundColor: White}]}>
                        <Icon type={'feather'} name={'thumbs-up'} size={30} color={BLUE} />
                    </View>
                </TouchableFeedback>
            </View>
        </View>
    };

    render () {
        const {modalVisible, loading, congoModalVisible, matchUser} = this.state;
        const {theme, user, navigation} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent
                                 theme={theme}
                                 leftView={<TouchableFeedback onPress={this.onMenuPress}>
                                     <View style={styles.buttonView}>
                                         <Icon type={'feather'} name={'menu'} size={28} color={theme.primaryColor} />
                                     </View>
                                 </TouchableFeedback>}

                                 middleView={<TouchableFeedback onPress={() => navigation.navigate('MyProfile')}>
                                     <View>
                                         {/*<Icon type={'feather'} name={'camera'} size={28} color={theme.primaryColor} style={{fontSize: 28, color: theme.primaryColor}} />*/}
                                         <FastImage source={{uri: regex.getProfilePic(user.photos)}} style={[styles.imageView]}/>
                                     </View>
                                 </TouchableFeedback>}

                                 rightView={<View style={{flexDirection: 'row'}}>
                                     <TouchableFeedback onPress={this.onFilterPress}>
                                         <View style={styles.buttonView}>
                                             <Icon type={'feather'} name={'filter'} size={25} color={theme.primaryColor} />
                                         </View>
                                     </TouchableFeedback>
                                 </View>}/>
                {
                    loading
                        ?
                        <View style={[styles.innerView, {alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primaryBackgroundColor}]}>
                                <LottieView
                                    source={require("./../../../assets/friends_jump.json")}
                                    style={{
                                        bottom: "40%",
                                        marginTop: "15%"
                                    }}
                                    autoPlay
                                />
                                    <View>
                                        <Text style={{fontSize: 18, padding: 30, textAlign: 'center'}}>
                                            {'Looking for new people to show you...'}
                                        </Text>
                                    </View>
                        </View>
                        :  this.renderCard()
                }
                <Modal animationType={'slide'} transparent={true} visible={modalVisible} onRequestClose={() => {}}>
                    <FilterModal theme={theme} filterData={this.filterData}
                                 onClose={(data) => {
                                     let setStateData = {modalVisible: false};
                                     this.setState(setStateData);

                                     if (data) {
                                         this.filterData = data;
                                         this.getNearByUserData();
                                     }
                                 }}/>
                </Modal>
                <Modal animationType={'slide'} transparent={true} visible={congoModalVisible} onRequestClose={() => {}}>
                    <CongraMatchModal navigation={navigation} theme={theme} uid={user.uid} data={matchUser} location={this.location} onClose={(data) => {
                        let setStateData = {congoModalVisible: false};
                        this.setState(setStateData);
                    }}/>
                </Modal>
            </View>
        )
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
    user: state.auth.user,
});

export default connect(mapStateToProps)(HomeScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    buttonView: {
        width: 45,
        height: 45,
        alignItems: 'center',
        justifyContent: 'center'
    },
    innerView: {
        flex: 1
    },
    bottomView: {
        height: HEIGHT_RATIO(.15),
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        right: 0,
        left: 0,
        alignItems: 'center',
        justifyContent: 'center',
    },
    commonLike: {
        padding: 20,
        marginHorizontal: 8,
        marginBottom: HEIGHT_RATIO(.01),
        borderRadius: 40,
        borderColor: BORDER,
        borderStyle: "solid",
        borderWidth: 1,
        ...shadow(),
    },
    cardView: {
        height: HEIGHT_RATIO(0.63),
        borderRadius: 20,
        justifyContent: 'center',
        borderWidth: 1,
        ...shadow(),
    },
    nameText: {
        fontSize: 24,
        fontWeight: '800'
    },
    locationText: {
        fontSize: 16,
        fontWeight: '800'
    },
    animation: {
        width: 100,
        height: 100,
    },
    imageView: {
        width: 30,
        height: 30,
        borderRadius: 40
    },
});

const overlayLabel = {
    left: {
        title: 'REJECT',
        style: {
            label: {
                backgroundColor: RED,
                borderColor: RED,
                color: White,
                borderWidth: 1
            },
            wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-end',
                justifyContent: 'flex-start',
                marginTop: 30,
                marginLeft: -30,
                elevation: 5
            }
        }
    },
    right: {
        title: 'LIKE',
        style: {
            label: {
                backgroundColor: BLUE,
                borderColor: BLUE,
                color: White,
                borderWidth: 1
            },
            wrapper: {
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'flex-start',
                marginTop: 30,
                marginLeft: 30,
                elevation: 5
            }
        }
    },
    top: {
        title: 'LOVE',
        style: {
            label: {
                backgroundColor: LOVE,
                borderColor: LOVE,
                color: White,
                borderWidth: 1
            },
            wrapper: {
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                elevation: 5
            }
        }
    }
};
