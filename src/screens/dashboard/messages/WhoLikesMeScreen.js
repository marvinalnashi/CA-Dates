import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import HeaderComponent from '../../../components/general/HeaderComponent';
import WhoLikeComponent from '../../../components/messages/WhoLikeComponent';
import {regex} from '../../../utils/regex';
import {updateUserAction} from '../../../actions/userAction';
import {getStore} from '../../../../App';
import {PEOPLE_WHO_LIKED_COUNT} from '../../../actions/types';

class MessagesScreen extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(): void {
       this.updateWhoLikedCount({likedReadCount: this.props.peopleWhoLiked.length});
    }

    updateWhoLikedCount = (parameter) => {
        updateUserAction(this.props.user.uid, parameter, 'whoLiked');
        getStore.dispatch({
            type: PEOPLE_WHO_LIKED_COUNT,
            payload: 0
        })
    };

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    renderData = () => {
        const {theme, peopleWhoLiked} = this.props;

        if (peopleWhoLiked.length === 0) {
            return <View style={styles.emptyView}>
                <Text style={[styles.infoText, {color: theme.subPrimaryColor}]}>You have no likes yet</Text>
            </View>
        } else {
            return <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={peopleWhoLiked}
                extraData={peopleWhoLiked}
                renderItem={({item}) => <WhoLikeComponent theme={theme} item={item}/> }
                keyExtractor={(item, index) => index.toString()}
            />
        }
    };

    render() {
        const {theme} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent title={'People who liked you'} theme={theme} onLeftPress={this.onBackPress}/>
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
    peopleWhoLiked: state.auth.peopleWhoLiked,
});

export default connect(mapStateToProps)(MessagesScreen);

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
