import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {Icon} from 'react-native-elements';
import HeaderComponent from '../../../components/general/HeaderComponent';
import MessagesComponent from '../../../components/messages/MessagesComponent';
import {BLUE} from '../../../themes/constants';
import {TouchableFeedback} from '../../../utils/regex';
import {getAllConversationLists} from '../../../actions/conversationsAction';
import {getActivitiesRequestLists} from '../../../actions/activitiesAction';
import {getWhoLikedMeLists} from '../../../actions/swipeCardAction';

class MessagesScreen extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(): void {
        getAllConversationLists(this.props.user.uid);
        getActivitiesRequestLists(this.props.user.uid);
        getWhoLikedMeLists(this.props.user.uid)
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    renderHeader = () => {
        const {theme, navigation, activitiesUnreadCount, whoLikedUnreadCount} = this.props;
        return <View>
            <View style={{flexDirection:'row', marginTop: 20}}>
            <TouchableFeedback onPress={() => navigation.navigate('ActivitiesRequest')}>
                <View style={[styles.btnBorder, {flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}>
                    <Text style={[styles.headText, {color: theme.primaryColor, textAlign: 'center'}]}>Date proposals</Text>
                    <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
                        {
                            activitiesUnreadCount > 0 && <View style={styles.countView}>
                                <Text style={[styles.countText, {color: theme.backgroundColor}]}>{activitiesUnreadCount}</Text>
                            </View>
                        }
                    </View>
                </View>
            </TouchableFeedback>
            <TouchableFeedback onPress={() => navigation.navigate('WhoLikeMe')}>
                <View style={[styles.btnBorder, {flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center'}]}>
                    <Text style={[styles.headText, {color: theme.primaryColor, textAlign: 'center'}]}>Likes</Text>
                    <View style={[{flexDirection: 'row', alignItems: 'center'}]}>
                        {
                            whoLikedUnreadCount > 0 && <View style={styles.countView}>
                                <Text style={[styles.countText, {color: theme.backgroundColor}]}>{whoLikedUnreadCount}</Text>
                            </View>
                        }
                    </View>
                </View>
            </TouchableFeedback>
            </View>
            {/*<Text style={[styles.titleText, {color: theme.primaryColor}]}>Messages</Text>*/}
        </View>
    };

    render() {
        const {theme, navigation, conversations, user} = this.props;

        if (conversations.length === 0) {
            return <View style={styles.emptyView}>
                <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                    <HeaderComponent title={'Messages'} theme={theme} onLeftPress={this.onBackPress}/>
                    <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                        <FlatList
                            ListHeaderComponent={this.renderHeader}
                        />
                        <View style={[{flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: '70%'}]}>
                            <Text style={[styles.infoText, {color: theme.subPrimaryColor, textAlign: 'center'}]}>You have no messages yet</Text>
                        </View>
                    </View>
                </View>
            </View>
        } else {
            return (
                <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                    <HeaderComponent title={'Messages'} theme={theme} onLeftPress={this.onBackPress}/>
                    <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                        <FlatList
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                            data={conversations}
                            extraData={conversations}
                            ListHeaderComponent={this.renderHeader}
                            renderItem={({item}) => <MessagesComponent uid={user.uid} theme={theme} item={item}
                                                                       navigation={navigation}/>}
                            keyExtractor={(item, index) => index.toString()}
                        />
                    </View>
                </View>
            );
        }
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
    user: state.auth.user,
    conversations: state.auth.conversations,
    activitiesUnreadCount: state.auth.activitiesUnreadCount,
    whoLikedUnreadCount: state.auth.whoLikedUnreadCount,
});

export default connect(mapStateToProps)(MessagesScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    rowView: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: 1,
        marginHorizontal: 20,
        marginVertical: 5,
        paddingVertical: 10
    },
    headText: {
        flex: 1,
        fontSize: 15,
        fontWeight: '400',
    },
    countView: {
        paddingHorizontal: 15,
        paddingVertical: 4,
        backgroundColor: BLUE,
        borderRadius: 15
    },
    countText: {
        fontSize: 14,
        fontWeight: '800'
    },
    titleText: {
        marginHorizontal: 20,
        marginVertical: 10,
        fontSize: 32,
        fontWeight: '800',
    },
    btnBorder: {
        height: 40,
        width: '40%',
        marginLeft: '7.5%',
        marginRight: '7.5%',
        borderColor: '#1565c0',
        borderWidth: 1,
        borderRadius: 10
    },
    emptyView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#ffffff',
        paddingHorizontal: 20,
    },
    infoText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: '400',
        textAlign: 'center'
    }
});
