import React, {Component} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {connect} from 'react-redux';
import {activitiesData} from '../../../json/activitiesData';
import HeaderComponent from '../../../components/general/HeaderComponent';
import ActivitiesItemComponent from '../../../components/activities/ActivitiesItemComponent';
import {Icon} from 'react-native-elements';
import {TouchableFeedback} from '../../../utils/regex';

class ActivitiesListsScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            activitiesData
        }
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    onSendActivities = () => {
        const {navigation} = this.props;
        navigation.navigate('SendMyActivitiesRequest');
    };

    render() {
        const {activitiesData} = this.state;
        const {theme, navigation} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent title={'Activities'}
                                 theme={theme}
                                 rightView={<TouchableFeedback onPress={this.onSendActivities}>
                                     <View style={styles.buttonView}>
                                         <Icon type={'feather'} name={'send'} size={28} color={theme.primaryColor} style={{fontSize: 28, color: theme.primaryColor}} />
                                     </View>
                                 </TouchableFeedback>}
                                 onLeftPress={this.onBackPress}/>
                <View style={[styles.container, {backgroundColor: theme.container.backgroundColor, paddingHorizontal: 10}]}>
                    <FlatList
                        showsVerticalScrollIndicator={false}
                        showsHorizontalScrollIndicator={false}
                        data={activitiesData}
                        extraData={activitiesData}
                        renderItem={({item}) => <ActivitiesItemComponent theme={theme} navigation={navigation} item={item}/> }
                        numColumns={3}
                        keyExtractor={(item, index) => index.toString()}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
});

export default connect(mapStateToProps)(ActivitiesListsScreen);

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
});
