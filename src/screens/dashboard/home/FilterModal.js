import React, {Component} from 'react';
import {FlatList, ScrollView, StyleSheet, Text, View} from 'react-native';
import {ASPECT_RATIO, TouchableFeedback, W_WIDTH} from './../../../utils/regex';
import {Icon} from 'react-native-elements';
import BackgroundAnimation from "../settings/BackgroundAnimation";
import Slider from 'react-native-slider';
import CommonButton from '../../../components/general/CommonButton';
import {lookingData, sexualityData} from '../../../json/generalCatogeryData';

class FilterModal extends Component {

    constructor(props) {
        super(props);
        let filterData = props.filterData;
        const {selectedDistance, selectedAge} = filterData;

        let lookData = JSON.parse(JSON.stringify(lookingData));
        let lookingResults = lookData.map((item) => {
            let interested = filterData.interested;
            if (Boolean(interested))
                item.selected = interested.includes(item.title);

            return item;
        });

        let showData = JSON.parse(JSON.stringify(sexualityData));
        let showResults = showData.map((item) => {
            let showMe = filterData.showMe;
            if (Boolean(showMe))
                item.selected = showMe.includes(item.title);

            return item;
        });
        this.state = {
            ...this.initialData(),
            selectedDistance,
            selectedAge,
            lookingData: lookingResults,
            showMeData: showResults
        }
    }

    initialData = () => {
       return {
           selectedLocation: 'Amsterdam',
           selectedDistance: 30,
           isLookingData: false,
           lookingData: JSON.parse(JSON.stringify(lookingData)),
           isShowMeData: false,
           showMeData: JSON.parse(JSON.stringify(sexualityData)),
           selectedAge: 25
       }
    };

    onLookingPress = (item) => {
      item.selected = !item.selected;
      this.setState({lookingData: this.state.lookingData});
    };

    closePress = () => {
        const {onClose} = this.props;
        onClose();
    };

    resetPress = () => {
        const {onClose} = this.props;
        this.setState({
            ...this.initialData()
        });
        onClose({
            selectedDistance: 30,
            selectedAge: 25,
        })
    };

    donePress = () => {
        const {lookingData, selectedDistance, selectedAge, showMeData} = this.state;
        const {onClose} = this.props;

        let filterData = {
            selectedDistance,
            selectedAge
        };
        let getLooking = lookingData.filter(function(o){ return o.selected === true});
        if (getLooking.length > 0)
           filterData.interested = getLooking.map(function (o) {return o.title;});

        let getShowMe = showMeData.filter(function(o){ return o.selected === true});
        if (getShowMe.length > 0)
            filterData.showMe = getShowMe.map(function (o) {return o.title;});

        onClose(filterData);
    };

    renderLookingItem = ({ item }) => {
        const {theme} = this.props;
        let selected = item.selected;

        let iconName = selected ? 'check-circle' : 'circle';
        return (
            <TouchableFeedback onPress={()=>this.onLookingPress(item)}>
                <View style={[styles.renderItemView]}>
                    <Icon type={'feather'} name={iconName} size={20} color={theme.blueColor} style={{fontSize: 20, color: theme.blueColor}}/>
                    <Text style={styles.renderItemText}>{item.title}</Text>
                </View>
            </TouchableFeedback>
        )
    };

    render() {
        const {selectedDistance, lookingData, showMeData, selectedAge} = this.state;
        const {theme} = this.props;

        return (
            <View style={[styles.container]}>
                <View style={[styles.innerContainer, {backgroundColor: theme.container.backgroundColor}]}>
                    <BackgroundAnimation/>
                    <View style={[styles.commonView, styles.itemView, {marginHorizontal: 0, paddingHorizontal: 20, borderColor: theme.borderColor}]}>
                        <Icon type={'feather'} name={'x'} size={25} color={theme.primaryColor} style={{fontSize: 25, color: theme.primaryColor}} onPress={this.closePress}/>
                        <Text style={[styles.titleText, {color: theme.primaryColor}]}>{'Filter'}</Text>
                        <Text style={[styles.titleText, {color: theme.subPrimaryColor}]} onPress={this.resetPress}>{'Reset'}</Text>
                    </View>
                    <ScrollView showsVerticalScrollIndicator={false} showsHorizontalScrollIndicator={false}>
                        <View style={{paddingBottom: 20}}>
                            <View style={[styles.commonView, {borderColor: theme.borderColor}]}>
                                <View style={[styles.itemView]}>
                                    <Text style={[styles.commonTitleText, {color: theme.primaryColor}]}>{'Distance'}</Text>
                                    <View style={[styles.rightRowView]}>
                                        <Text style={[styles.commonTitleText, {color: theme.subPrimaryColor}]}>{`${selectedDistance}mi`}</Text>
                                    </View>
                                </View>
                                <Slider
                                    minimumValue={1}
                                    maximumValue={800}
                                    value={selectedDistance}
                                    minimumTrackTintColor={theme.blueColor}
                                    thumbImage={require('./../../../assets/sliderthumb.png')}
                                    thumbStyle={[styles.sliderTrack, {shadowColor: theme.blueColor}]}
                                    thumbTintColor={theme.blueColor}
                                    thumbTouchSize={{width: 32, height: 20}}
                                    onValueChange={(selectedDistance) => this.setState({selectedDistance: Math.round(selectedDistance)})}
                                />
                            </View>
                            <View style={[styles.commonView, {borderColor: theme.borderColor}]}>
                                <View style={[styles.itemView]}>
                                    <Text style={[styles.commonTitleText, {color: theme.primaryColor}]}>{'Age'}</Text>
                                    <View style={[styles.rightRowView]}>
                                        <Text style={[styles.commonTitleText, {color: theme.subPrimaryColor}]}>{`18 - ${selectedAge}`}</Text>
                                    </View>
                                </View>
                                <Slider
                                    minimumValue={18}
                                    maximumValue={80}
                                    value={selectedAge}
                                    minimumTrackTintColor={theme.blueColor}
                                    thumbImage={require('./../../../assets/sliderthumb.png')}
                                    thumbStyle={[styles.sliderTrack, {shadowColor: theme.blueColor}]}
                                    thumbTintColor={theme.blueColor}
                                    thumbTouchSize={{width: 32, height: 20}}
                                    onValueChange={(selectedAge) => this.setState({selectedAge: Math.round(selectedAge)})}
                                />
                            </View>
                            <View style={[styles.commonView, {borderColor: theme.borderColor}]}>
                                <Text style={[{fontSize: 14, fontWeight: '400', marginBottom: '12%'}]}>Only matches corresponding to your selected options will be shown. If no options are selected, all possible matches will be shown, as if all options are selected.</Text>
                                <Text style={[{color: theme.primaryColor}]}>{'Interested in'}</Text>
                                {
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={false}
                                            data={lookingData}
                                            extraData={lookingData}
                                            renderItem={this.renderLookingItem}
                                            keyExtractor={item => item.id.toString()}
                                        />
                                }
                            </View>
                            <View style={[styles.commonView, {borderColor: theme.borderColor}]}>
                                <Text style={[{color: theme.primaryColor}]}>{'Sexual orientation'}</Text>
                                {
                                        <FlatList
                                            showsVerticalScrollIndicator={false}
                                            showsHorizontalScrollIndicator={false}
                                            data={showMeData}
                                            extraData={showMeData}
                                            renderItem={this.renderLookingItem}
                                            keyExtractor={item => item.id.toString()}
                                        />
                                }
                            </View>
                        </View>
                    </ScrollView>
                    <CommonButton
                        theme={theme}
                        container={{marginVertical: 20}}
                        backgroundColor={theme.blueColor}
                        borderRadius={10}
                        borderColor={theme.blueColor}
                        textColor={theme.backgroundColor}
                        title={'Done'}
                        onPress={this.donePress}
                    />
                </View>
            </View>
        );
    }
}

export default FilterModal;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: W_WIDTH
    },
    innerContainer: {
        flex: 1,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
    },
    titleText: {
        fontSize: 18,
        fontWeight: '500',
        textAlign: 'center'
    },
    commonView: {
        marginHorizontal: 20,
        paddingVertical: 18,
    },
    itemView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    commonTitleText: {
        fontSize: 16,
        fontWeight: '400',
        textAlign: 'center'
    },
    rightRowView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    sliderTrack: {
        width: 32,
        height: 17,
        shadowOffset: {width: 0, height: 1},
        shadowOpacity: 0.5,
        shadowRadius: 1,
    },
    renderItemView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    renderItemText: {
        marginLeft: 10,
        fontSize: 14,
    }
});
