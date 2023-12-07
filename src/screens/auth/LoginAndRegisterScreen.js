import React, {Component} from 'react';
import {Button, Keyboard, ScrollView, StyleSheet, Text, TextInput, View} from 'react-native';
import {connect} from 'react-redux';
import HeaderComponent from '../../components/general/HeaderComponent';
import {BORDER} from '../../themes/constants';
import {Icon} from 'react-native-elements';
import CountryPicker from 'react-native-country-picker-modal';
import {ASPECT_RATIO, regex} from '../../utils/regex';
import CommonButton from '../../components/general/CommonButton';
import * as messages from '../../utils/messages';
import {signInPhone} from '../../actions/socialLogin';

class LoginAndRegisterScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            countryCode: 'US',
            callingCode: ["1"],
            phone_number: '',
        };
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    nextPress = () => {
        const {phone_number, callingCode} = this.state;
        const {navigation, route} = this.props;
        let params = route.params;
        let type = params.type;

        if (regex.isEmpty(phone_number))
            alert(messages.enterPhoneNumber);
        else {
            let phone = `+${callingCode}${phone_number}`;

            // Request to send OTP
            if (regex.validatePhoneNumber(phone)) {
                regex.showLoader();
                signInPhone(phone).then(confirmResult => {
                        regex.hideLoader();
                        navigation.navigate('Verification', {type, callingCode, phone_number, confirmResult});
                    }).catch(error => {
                        regex.hideLoader();
                        alert(error.message);
                    })
            } else
                alert('Invalid Phone Number');
        }
    };

    joinNowPress = () => {
        const {navigation, route} = this.props;
        let params = route.params;
        let type = params.type;

        Keyboard.dismiss();
        this.setState({
            countryCode: 'US',
            callingCode: ["1"],
            phone_number: '',
        });
        if (type === 1)
            navigation.navigate('LoginAndRegister', {type: 2});
        else
            navigation.navigate('LoginAndRegister', {type: 1});
    };

    render() {
        const {phone_number, countryCode} = this.state;
        const {theme, route} = this.props;
        let params = route.params;
        let type = params.type;

        let title = 'Log in to existing account';
        let subTitle = 'Sign in by using your phone number';
        let infoText = `Don't have an account yet? `;
        let actionText = `Sign Up`;
        if (type === 1) {
            title = 'Create new account';
            subTitle = 'Sign up by using your phone number';
            infoText = `Already have an account? `;
            actionText = 'Log In'
        }

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent theme onLeftPress={this.onBackPress}/>
                <ScrollView contentContainerStyle={styles.container}
                            showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}>
                    <View style={styles.container}>
                        <View style={{flex: 1}}>
                            <Text style={[styles.titleText, {color: theme.primaryColor}]}>{title}</Text>
                            <Text style={[styles.subTitleText, {color: theme.subPrimaryColor}]}>{subTitle}</Text>
                            <View style={styles.textView}>
                                <View style={{flexDirection: 'row', alignItems: 'center', marginHorizontal: 15}}>
                                    <CountryPicker
                                        onSelect={(value) => {
                                            this.setState({
                                                countryCode: value.cca2,
                                                callingCode: value.callingCode,
                                            });
                                        }}
                                        styles={{itemCountryName: {borderBottomWidth: 0}}}
                                        countryCode={countryCode}
                                        withCallingCodeButton={true}
                                        withFlag={false}
                                        withEmoji={true}
                                        withFilter={true}
                                        withCallingCode={true}
                                        withFlagButton={true}
                                        withAlphaFilter={false}
                                        translation="eng">
                                        <Text>{`+${countryCode}`}</Text>
                                    </CountryPicker>
                                    <Icon type={'feather'} name={'chevron-down'} size={20} color={theme.primaryColor} />
                                </View>
                                <View style={[styles.textInput, {backgroundColor: theme.backgroundColor}]}>
                                    <TextInput
                                        style={{flex: 1, color: theme.primaryColor}}
                                        value={phone_number}
                                        placeholder="Phone Number"
                                        placeholderTextColor={theme.primaryColor}
                                        keyboardType={'phone-pad'}
                                        maxLength={15}
                                        onChangeText={(phone_number) => this.setState({phone_number})}
                                    />
                                </View>
                            </View>
                            <CommonButton
                                theme={theme}
                                container={{marginTop: 30}}
                                backgroundColor={theme.blueColor}
                                borderRadius={10}
                                borderColor={theme.blueColor}
                                textColor={theme.backgroundColor}
                                title={'Next'}
                                onPress={this.nextPress}
                            />
                            <View style={{marginHorizontal: 20, marginTop: ASPECT_RATIO(45), flexDirection: 'row', justifyContent: 'center'}}>
                                <Text style={[styles.againText, {color: theme.subPrimaryColor}]}>{infoText}</Text>
                                <Text style={[styles.againText, {color: theme.blueColor, fontWeight: '600'}]} onPress={this.joinNowPress}>{actionText}</Text>
                            </View>
                            <View style={{flex: 1, marginHorizontal: 20, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 25}}>
                                <Text style={[styles.infoText, {color: theme.subPrimaryColor}]}>© CodeArise 2023</Text>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
});

export default connect(mapStateToProps)(LoginAndRegisterScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    titleText: {
        marginHorizontal: 20,
        marginTop: 15,
        fontSize: 26,
        fontWeight: '800'
    },
    subTitleText: {
        marginHorizontal: 20,
        marginVertical: 15,
        fontSize: 16,
        fontWeight: '400'
    },
    textView: {
      marginHorizontal: 20,
      marginTop: ASPECT_RATIO(50),
      flexDirection: 'row',
      borderWidth: 1.5,
      borderColor: BORDER,
      backgroundColor: BORDER,
      height: 55,
      borderRadius: 10,
      overflow: 'hidden',
      alignItems: 'center'
    },
    textInput: {
        flex: 1,
        paddingRight: 10,
        paddingLeft: 10,
    },
    againText: {
        fontSize: 16,
        fontWeight: '400'
    },
    infoText: {
        fontSize: 14,
        fontWeight: '500'
    }
});
