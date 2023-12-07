import React, {Component} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import {ASPECT_RATIO, regex, shadow, TouchableFeedback} from '../../../utils/regex';
import {Icon} from "react-native-elements";
import {BLUE} from "../../../themes/constants";

class MenuScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            data: [
                {
                    id: 1,
                    title: 'Notifications',
                    count: 0,
                    icon: 'bell'
                },
                {
                    id: 2,
                    title: 'Matches',
                    count: 0,
                    icon: 'users'
                },
                {
                    id: 3,
                    title: 'Dates',
                    count: 0,
                    icon: 'calendar'
                },
                {
                    id: 4,
                    title: 'Messages',
                    count: 0,
                    icon: 'message-circle'
                },
                {
                    id: 5,
                    title: 'Settings',
                    count: 0,
                    icon: 'settings'
                },
                {
                    id: 6,
                    title: 'Logout',
                    count: 0,
                    icon: 'log-out'
                }
            ]
        }
    }

    onItemPress = (item) => {
        const {navigation} = this.props;
        if (item.id !== 10)
            navigation.closeDrawer();

        if (item.id === 1) {
            navigation.navigate('Notifications');
        } else if (item.id === 2) {
            navigation.navigate('Matches');
        } else if (item.id === 3) {
            navigation.navigate('Activities');
        } else if (item.id === 4) {
            navigation.navigate('Messages');
        } else if (item.id === 5) {
            navigation.navigate('Settings');
        } else if (item.id === 6) {
            regex.logout(navigation);
        }
    };

    renderItem = ({ item }) => {
        return <TouchableFeedback onPress={()=>this.onItemPress(item)}>
            <View style={{flexDirection: 'row', paddingVertical: 15, alignItems: 'center'}}>
                <Icon color={BLUE} type={'feather'} name={item.icon} />
            </View>
        </TouchableFeedback>
    };

    render() {
        const {data} = this.state;
        const {theme} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <View style={[styles.innerView]}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={data}
                        extraData={data}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id.toString()}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
    user: state.auth.user,
    notificationCount: state.auth.notificationCount,
    conversationCount: state.auth.conversationCount,
});

export default connect(mapStateToProps)(MenuScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    innerView: {
        flex: 1,
        marginHorizontal: 20,
        marginVertical: 30
    },
    imageView: {
        width: 70,
        height: 70,
        borderRadius: 40
    },
    nameText: {
        fontSize: 15,
        fontWeight: '400',
    }
});
