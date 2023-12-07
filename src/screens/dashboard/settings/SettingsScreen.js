import React, {Component} from 'react';
import {Alert, ScrollView, StyleSheet, Switch, Text, View} from 'react-native';
import {connect} from 'react-redux';
import HeaderComponent from '../../../components/general/HeaderComponent';
import {Icon} from 'react-native-elements';
import {White} from '../../../themes/constants';
import BackgroundAnimation from "./BackgroundAnimation";
import {regex, TouchableFeedback} from '../../../utils/regex';
import {deleteUser, updateUserAction} from '../../../actions/userAction';
import * as messages from '../../../utils/messages';
import {GlowingSun} from "./GlowingSun";

class SettingsScreen extends Component {

    constructor(props) {
        super(props);
        let user = props.user;
        this.state = {
            // notificationOn: user.notificationOn,
            // matchOn: user.matchOn,
            // soundOn: user.soundOn,
        }
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    updateData = (parameter) => {
        updateUserAction(this.props.user.uid, parameter, 'settings');
    };

    // notificationSwitch = (notificationOn) => {
    //     this.setState({notificationOn});
    //     this.updateData({notificationOn});
    // };

    // matchSwitch = (matchOn) => {
    //     this.setState({matchOn});
    //     this.updateData({matchOn});
    // };

    // soundSwitch = (soundOn) => {
    //     this.setState({soundOn});
    //     this.updateData({soundOn});
    // };

    okClick = () => {
        regex.showLoader();
        deleteUser(this.props.user.uid).then(() => {
           regex.hideLoader();
           regex.clearData();
        });
    };

    onDeletePress = () => {
        Alert.alert('Account Delete', messages.deleteMsg,
            [{text: 'Cancel', onPress: () => {}, style: 'cancel'},
                     {text: 'Confirm', onPress: this.okClick}],
            {cancelable: false},
        );
    };

    render() {
        const {theme, navigation} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent title={'Settings'} theme={theme} onLeftPress={this.onBackPress}/>
                <View style={[styles.container, {backgroundColor: theme.primaryBackgroundColor}]}>
                    <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                        <TouchableFeedback onPress={() => navigation.navigate('AccountSetting')}>
                            <View style={[styles.view, {backgroundColor: theme.backgroundColor}]}>
                                <Text style={[styles.text, {color: theme.subPrimaryColor}]}>Account Settings</Text>
                                <Icon type={'feather'} name={'chevron-right'} color={theme.subSecondaryColor} style={{color: theme.subSecondaryColor}} />
                            </View>
                        </TouchableFeedback>
                        <TouchableFeedback onPress={this.onDeletePress}>
                            <View style={[styles.view, {backgroundColor: theme.backgroundColor}]}>
                                <Text style={[styles.text, {color: theme.blueColor}]}>Delete Account</Text>
                                <Icon type={'feather'} name={'chevron-right'} color={theme.backgroundColor} style={{color: theme.backgroundColor}} />
                            </View>
                        </TouchableFeedback>
                    </ScrollView>
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
    user: state.auth.user,
});

export default connect(mapStateToProps)(SettingsScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    view: {
        marginVertical: 3,
        flexDirection: 'row',
        paddingHorizontal: 20,
        alignItems: 'center',
        paddingVertical: 10,
    },
    text: {
        flex: 1,
        fontSize: 16,
        fontWeight: '400'
    }
});
