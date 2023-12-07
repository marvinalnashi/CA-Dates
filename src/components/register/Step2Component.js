import React, {Component} from 'react';
import {Modal, ScrollView, StyleSheet, Text, View} from 'react-native';
import CommonButton from '../general/CommonButton';
import {ASPECT_RATIO, regex, W_WIDTH} from '../../utils/regex';
import HeightModal from './HeightModal';
import {DatePickerDialog} from 'react-native-datepicker-dialog';
import moment from 'moment';
import {partyData, genderData} from '../../json/generalCatogeryData';
import * as messages from '../../utils/messages';

class Step2Component extends Component {

    constructor(props) {
        super(props);
        this.state = {
            DoB: props.data.DoB,
            dobDate: null,
            height: props.data.height,
            modalVisible: false,
            party: props.data.party,
            gender: props.data.gender,
            partyData: partyData,
            genderData: genderData
        }
    }

    nextPress = () => {
        const {DoB, height, party, gender} = this.state;
        const {onPress} = this.props;

        if (DoB === 'MM / DD / YYYY')
            alert(messages.enterDOB);
        else if (height === `0' / 00'`)
            alert(messages.enterHeight);
        else if (regex.isEmpty(party))
            alert(messages.enterParty);
        else if (regex.isEmpty(gender))
            alert(messages.enterGender);
        else {
            onPress(2, {DoB, height, party, gender});
        }
    };

    openHeightPress = () => {
        this.setState({modalVisible: true});
    };

    /**
     * DOB textbox click listener
     */
    onDOBPress = () => {
        let dobDate = this.state.dobDate;

        if(!dobDate || dobDate === null){
            dobDate = new Date();
            this.setState({dobDate: dobDate});
        }

        //To open the dialog
        this.dobDialogRef.open({
            date: dobDate,
            maxDate: new Date()
        });
    };

    /**
     * Call back for dob date picked event
     *
     */
    onDOBDatePicked = (date) => {
        this.setState({
            dobDate: date,
            DoB: moment(date).format('MM / DD / YYYY')
        });
    };

    onPartyPress = (item) => {
        this.setState({party: item.title});
    };

    renderPartyItem = ({ item }) => {
        const {party} = this.state;
        const {theme} = this.props;
        let selected = false;
        if (party === item.title)
            selected = true;

        return (
            <CommonButton
                theme={theme}
                container={{marginVertical: 8}}
                backgroundColor={theme.backgroundColor}
                borderRadius={10}
                borderColor={selected ? theme.blueColor : theme.borderColor}
                textColor={selected ? theme.blueColor : theme.secondaryColor}
                title={item.title}
                onPress={() => this.onPartyPress(item)}
            />
        )
    };

    onGenderPress = (item) => {
        this.setState({gender: item.title});
    };

    renderGenderItem = ({ item }) => {
        const {gender} = this.state;
        const {theme} = this.props;
        let selected = false;
        if (gender === item.title)
            selected = true;

        return (
            <CommonButton
                theme={theme}
                container={{marginVertical: 8}}
                backgroundColor={theme.backgroundColor}
                borderRadius={10}
                borderColor={selected ? theme.blueColor : theme.borderColor}
                textColor={selected ? theme.blueColor : theme.secondaryColor}
                title={item.title}
                onPress={() => this.onGenderPress(item)}
            />
        )
    };

    onPress = (item, section) => {
        if (section === '0') {
           this.onPartyPress(item)
        } else if (section === '1') {
           this.onGenderPress(item) 
        } 
    };

    renderItem = (item, section) => {
        const {party, gender} = this.state;
        const {theme} = this.props;
        let selected = false;
        if (party === item.title || gender === item.title)
            selected = true;

        return (
            <CommonButton
                theme={theme}
                container={{marginVertical: 8}}
                backgroundColor={theme.backgroundColor}
                borderRadius={10}
                borderColor={selected ? theme.blueColor : theme.borderColor}
                textColor={selected ? theme.blueColor : theme.secondaryColor}
                title={item.title}
                onPress={() => this.onPress(item, section)}
            />
        )
    };

    render() {
        const {DoB, height, partyData, genderData, modalVisible} = this.state;
        const {theme} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <ScrollView showsVerticalScrollIndicator={false}
                            showsHorizontalScrollIndicator={false}>
                    <Text style={[styles.titleText, {color: theme.primaryColor}]}>{'Date of Birth'}</Text>
                    <View>
                        <CommonButton
                            theme={theme}
                            container={{marginTop: 5}}
                            backgroundColor={theme.textInputBackgroundColor}
                            borderRadius={10}
                            borderColor={theme.textInputBackgroundColor}
                            textColor={theme.subPrimaryColor}
                            title={DoB}
                            onPress={this.onDOBPress}
                        />
                        <Text style={[styles.titleText, {color: theme.primaryColor}]}>{'Height'}</Text>
                        <CommonButton
                            theme={theme}
                            container={{marginTop: 5}}
                            backgroundColor={theme.textInputBackgroundColor}
                            borderRadius={10}
                            borderColor={theme.textInputBackgroundColor}
                            textColor={theme.subPrimaryColor}
                            title={height}
                            onPress={this.openHeightPress}
                            dropDownArrow={true}
                            arrowColor={theme.subPrimaryColor}
                        />
                        <Text style={[styles.titleText, {color: theme.primaryColor}]}>{'Gender'}</Text>
                        {
                            genderData.map((item) => {
                                return this.renderItem(item, '1')
                            })
                        }
                        <Text style={[styles.titleText, {color: theme.primaryColor}]}>{'Do you party?'}</Text>
                        {
                            partyData.map((item) => {
                                return this.renderItem(item, '0')
                            })
                        }
                        <CommonButton
                            theme={theme}
                            container={{marginVertical: ASPECT_RATIO(30)}}
                            backgroundColor={theme.blueColor}
                            borderRadius={10}
                            borderColor={theme.blueColor}
                            textColor={theme.backgroundColor}
                            title={'Continue'}
                            onPress={this.nextPress}
                        />
                    </View>
                </ScrollView>
                <Modal animationType={'fade'} transparent={true} visible={modalVisible} onRequestClose={() => {}}>
                    <HeightModal theme={theme} selectedHeightStatus={height}
                                 onClose={(height) => {
                                     let setStateData = {modalVisible: false};
                                     if (height)
                                         setStateData.height = height;

                                     this.setState(setStateData);
                                 }}/>
                </Modal>
                <DatePickerDialog ref={ref => this.dobDialogRef = ref} onDatePicked={this.onDOBDatePicked.bind(this)} />
            </View>
        );
    }
}

export default Step2Component;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: W_WIDTH
    },
    titleText: {
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 10,
        fontSize: 18,
        fontWeight: '500',
    },
    titleTextInput: {
        marginHorizontal: 20,
        marginVertical: 5,
        fontSize: 14,
        fontWeight: '500'
    }
});
