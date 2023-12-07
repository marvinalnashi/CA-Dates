import React, {Component} from 'react';
import {ScrollView, StyleSheet, Text, View} from 'react-native';
import CommonTextInput from '../../../components/general/CommonTextInput';
import CommonButton from '../../../components/general/CommonButton';
import {regex, W_WIDTH} from '../../../utils/regex';
import {connect} from 'react-redux';
import HeaderComponent from '../../../components/general/HeaderComponent';
import {updateUserAction} from '../../../actions/userAction';
import * as messages from '../../../utils/messages';
import {Black, BLUE} from "../../../themes/constants";
import {firebase} from "@react-native-firebase/auth";

class AccountSettingScreen extends Component {

    constructor(props) {
        super(props);
        let user = props.user;
        this.state = {
            socialType: user.socialType,
            name: user.name,
            username: user.username,
            email: user.email,
            emailVerified: firebase.auth().currentUser.emailVerified,
            phone_number: firebase.auth().currentUser.phoneNumber,
        };
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    nextPress = () => {
        const {name, username, email} = this.state;

        if (regex.isEmpty(name)) {
            alert(messages.enterFullName);
        } else if (regex.isEmpty(username)) {
            alert(messages.enterUserName);
        } else if (!regex.validateUsername(username)) {
            alert(messages.enterValidUserName);
        } else if (regex.isEmpty(email)) {
            alert(messages.enterEmail);
        } else if (!regex.validateEmail(email)) {
            alert(messages.enterValidEmail);
        } else {
            regex.showLoader();
            updateUserAction(this.props.user.uid, this.state, 'account_setting').then(() => {
                regex.hideLoader();
                this.onBackPress();
            });
        }
    };

    render() {
        const {name, username, email, phone_number, emailVerified, socialType} = this.state;
        const {theme} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent title={'Account Settings'} theme={theme} onLeftPress={this.onBackPress}/>
                <ScrollView showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}
                >
                    <View>
                        <CommonTextInput
                            style={styles.inputBorder}
                            autoCompleteType={'name'}
                            placeholder={'Full Name'}
                            keyboardType={'default'}
                            value={name}
                            onChangeText={(name) => this.setState({name})}
                        />
                        <CommonTextInput
                            style={styles.inputBorder}
                            autoCompleteType={'username'}
                            placeholder={'Username'}
                            keyboardType={'default'}
                            value={username}
                            onChangeText={(username) => this.setState({username})}
                        />

                        <View>
                            {
                                (socialType === 'phone')
                                    ?
                                    <CommonTextInput
                                        style={styles.inputBorder}
                                        autoCompleteType={'email'}
                                        placeholder={'Email'}
                                        keyboardType={'email-address'}
                                        editable={socialType === 'phone'}
                                        value={email}
                                        onChangeText={(email) => this.setState({email})}
                                    />
                                    :
                                    <View>
                                        <Text style={{marginLeft: 30}}>Email</Text>
                                        <View style={[styles.textBorder]}>
                                            <Text style={[{color: Black}]}>
                                                {
                                                    `Your email address: ` + email + ` can't be edited, cause you're logged in with your Google account`
                                                }
                                            </Text>
                                        </View>
                                    </View>
                            }
                        </View>

                        <View style={[{marginTop: 40}]}>
                            {
                                (firebase.auth().currentUser.emailVerified === false)
                                    ?
                                    <View>
                                        <Text style={{marginLeft: 30}}>Email Verification</Text>
                                        <View style={[styles.textBorder]}>
                                            <Text style={[{color: Black}]}>
                                                {
                                                    `You haven't verified your email address yet. Keep your account safe and consider doing this soon.`

                                                }
                                            </Text>
                                        </View>
                                    </View>
                                    :
                                    <View>
                                        <Text style={{marginLeft: 30}}>Email Verification</Text>
                                        <View style={[styles.textBorder]}>
                                            <Text style={[{color: Black}]}>
                                                {
                                                    `You have successfully verified your email address. This helps keeping your account secure.`

                                                }
                                            </Text>
                                        </View>
                                    </View>
                            }
                        </View>

                        <View style={[{marginTop: 40}]}>
                            {
                                (socialType === 'phone')
                                    ?
                                    <View>
                                        <Text style={{marginLeft: 30}}>Phone</Text>
                                        <View style={[styles.textBorder]}>
                                            <Text style={[{color: Black}]}>
                                                {
                                                    `Your phone number is ` + phone_number + ` and can never be edited.`

                                                }
                                            </Text>
                                        </View>
                                    </View>
                                    :
                                    <View>
                                        <Text style={{marginLeft: 30}}>Phone</Text>
                                        <View style={[styles.textBorder]}>
                                            <Text style={[{color: Black}]}>
                                                {
                                                    `There is no phone number linked to your account, cause you're logged in with your Google account`

                                                }
                                            </Text>
                                        </View>
                                    </View>
                            }
                        </View>
                        <CommonButton
                            theme={theme}
                            container={{marginTop: 45}}
                            backgroundColor={theme.blueColor}
                            borderRadius={10}
                            borderColor={theme.blueColor}
                            textColor={theme.backgroundColor}
                            title={'Done'}
                            onPress={this.nextPress}
                        />
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
    user: state.auth.user,
});

export default connect(mapStateToProps)(AccountSettingScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: W_WIDTH,
    },
    titleText: {
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 10,
        fontSize: 26,
        fontWeight: '800'
    },
    textBorder: {
        height: 60,
        marginLeft: '7.5%',
        marginRight: '7.5%',
        borderColor: '#1565c0',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10
    },
    inputBorder: {
        height: 60,
        width: '90%',
        borderColor: '#1565c0',
        borderWidth: 1,
        borderRadius: 10,
        paddingLeft: 10
    }
});
