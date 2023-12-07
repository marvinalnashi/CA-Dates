import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import HeaderComponent from '../../../components/general/HeaderComponent';
import ActivitiesRequestComponent from '../../../components/messages/ActivitiesRequestComponent';
import FastImage from 'react-native-fast-image';
import {regex} from '../../../utils/regex';
import {updateUserAction} from '../../../actions/userAction';
import {getStore} from '../../../../App';
import {ACTIVITIES_REQUESTS_COUNT} from '../../../actions/types';

class ActivitiesRequestListsScreen extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(): void {
        this.updateActivitiesRequestCount({activitiesReadCount: this.props.activitiesRequests.length})
    }

    updateActivitiesRequestCount = (parameter) => {
        updateUserAction(this.props.user.uid, parameter, 'activitiesRequest');
        getStore.dispatch({
            type: ACTIVITIES_REQUESTS_COUNT,
            payload: 0
        })
    };

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    renderData = () => {
        const {theme, navigation, activitiesRequests} = this.props;

        if (activitiesRequests.length === 0) {
            return <View style={styles.emptyView}>
                <Text style={[styles.infoText, {color: theme.subPrimaryColor}]}>You haven't received any date proposals yet</Text>
            </View>
        } else {
            return <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={activitiesRequests}
                extraData={activitiesRequests}
                renderItem={({item}) => <ActivitiesRequestComponent type={'others'} theme={theme} navigation={navigation} item={item}/> }
                keyExtractor={(item, index) => index.toString()}
            />
        }
    };

    render() {
        const {theme} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent title={'Received date proposals'} theme={theme} onLeftPress={this.onBackPress}/>
                <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                    {this.renderData()}
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
    user: state.auth.user,
    activitiesRequests: state.auth.activitiesRequests,
});

export default connect(mapStateToProps)(ActivitiesRequestListsScreen);

const styles = StyleSheet.create({
    container: {
        flex: 1,
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
