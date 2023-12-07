import React, {Component} from 'react';
import {StyleSheet, Text, View, SectionList} from 'react-native';
import CommonButton from '../general/CommonButton';
import {W_WIDTH} from '../../utils/regex';
import {drinkingData, eatingData, kidsData, smokingData} from '../../json/generalCatogeryData';

class Step8Component extends Component {

    constructor(props) {
        super(props);
        this.state = {
            kidsStatus: props.data.kidsStatus,
            drinkingStatus: props.data.drinkingStatus,
            smokingStatus: props.data.smokingStatus,
            eatingStatus: props.data.eatingStatus,
            sections: [
                {
                    id: '0',
                    title: 'Kids',
                    data: kidsData,
                },
                {
                    id: '1',
                    title: 'Drinking',
                    data: drinkingData,
                },
                {
                    id: '2',
                    title: 'Smoking',
                    data: smokingData,
                },
                {
                    id: '3',
                    title: 'Eating',
                    data: eatingData,
                },
            ]
        }
    }

    onKidsPress = (item) => {
        if (item.title === this.state.kidsStatus)
            this.setState({kidsStatus: ''});
        else
            this.setState({kidsStatus: item.title});
    };

    onDrinkingPress = (item) => {
        if (item.title === this.state.drinkingStatus)
            this.setState({drinkingStatus: ''});
        else
            this.setState({drinkingStatus: item.title});
    };

    onSmokingPress = (item) => {
        if (item.title === this.state.smokingStatus)
            this.setState({smokingStatus: ''});
        else
            this.setState({smokingStatus: item.title});
    };

    onEatingPress = (item) => {
        const {eatingStatus} = this.state;
        const {onPress} = this.props;
        if (item.title === eatingStatus)
            this.setState({eatingStatus: ''});
        else
            this.setState({eatingStatus: item.title}, () => {
                const {kidsStatus, drinkingStatus, smokingStatus, eatingStatus} = this.state;
                if (kidsStatus !== '' && drinkingStatus !== '' && smokingStatus !== '' && eatingStatus !== '')
                    onPress(8, {kidsStatus, drinkingStatus, smokingStatus, eatingStatus});
            });
    };

    onPress = (item, section) => {
        if (section.id === '0') {
            this.onKidsPress(item)
        } else if (section.id === '1') {
            this.onDrinkingPress(item)
        } else if (section.id === '2') {
            this.onSmokingPress(item)
        } else if (section.id === '3') {
            this.onEatingPress(item)
        }
    };

    renderItem = ({ item, section }) => {
        const {kidsStatus, drinkingStatus, smokingStatus, eatingStatus} = this.state;
        const {theme} = this.props;
        let selected = false;
        if (kidsStatus === item.title || drinkingStatus === item.title || smokingStatus === item.title || eatingStatus === item.title)
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
        const {sections} = this.state;
        const {theme} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <SectionList
                    style={styles.container}
                    sections={sections}
                    renderItem={this.renderItem}
                    renderSectionHeader={({ section }) => (
                        <View style={{backgroundColor: theme.container.backgroundColor}}>
                            <Text style={[styles.titleText, {color: theme.primaryColor}]}>{section.title}</Text>
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                    extraData={this.state}
                />
            </View>
        );
    }
}

export default Step8Component;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: W_WIDTH
    },
    titleText: {
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 10,
        fontSize: 24,
        fontWeight: '500',
        textAlign: 'center'
    },
});
