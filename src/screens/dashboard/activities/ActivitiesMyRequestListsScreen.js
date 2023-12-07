import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import HeaderComponent from '../../../components/general/HeaderComponent';
import ActivitiesRequestComponent from '../../../components/messages/ActivitiesRequestComponent';
import {getMyActivitiesRequestLists} from '../../../actions/activitiesAction';

class ActivitiesMyRequestListsScreen extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(): void {
        getMyActivitiesRequestLists(this.props.user.uid)
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    render() {
        const {theme, navigation, mySendActivitiesRequests} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent title={'Sent date proposals'}
                                 theme={theme}
                                 onLeftPress={this.onBackPress}/>
                <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                    {
                        mySendActivitiesRequests.length === 0
                            ? <View style={styles.emptyView}>
                                <Text style={[styles.infoText, {color: theme.subPrimaryColor}]}>You haven't asked anyone out yet</Text>
                            </View>
                            : <FlatList
                                showsVerticalScrollIndicator={false}
                                showsHorizontalScrollIndicator={false}
                                data={mySendActivitiesRequests}
                                extraData={mySendActivitiesRequests}
                                renderItem={({item}) => <ActivitiesRequestComponent type={'my'} theme={theme} navigation={navigation} item={item}/> }
                                keyExtractor={(item, index) => index.toString()}
                            />
                    }
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => ({
    theme: state.auth.theme,
    user: state.auth.user,
    mySendActivitiesRequests: state.auth.mySendActivitiesRequests,
});

export default connect(mapStateToProps)(ActivitiesMyRequestListsScreen);

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
        textAlign: 'center',
    }
});
