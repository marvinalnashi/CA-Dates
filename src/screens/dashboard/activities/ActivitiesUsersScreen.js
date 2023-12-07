import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import HeaderComponent from '../../../components/general/HeaderComponent';
import ActivitiesUserComponent from '../../../components/activities/ActivitiesUserComponent';
import {discoverUsers} from '../../../actions/userAction';
import {regex} from '../../../utils/regex';
import LottieView from "lottie-react-native";

class ActivitiesUsersScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            nearByUsers: []
        };
    }

    componentDidMount(): void {
        this.getNearByUserData();
    }

    getNearByUserData = () => {
        discoverUsers(this.props.user.uid, this.props.location, 30).then(response => {
            let data = [];
            for (let a in response)
                data.push(response[a]._data);

            if (data.length > 0)
                this.filterToData(data);
        });
    };

    filterToData = (data) => {
        let uid = this.props.user.uid;
        let result = data.filter(function(v, i) {
            return v['uid'] !== uid;
        });
        this.setState({nearByUsers: result});
    };

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    onRightPress = () => {

    };

    renderData = () => {
        const {nearByUsers} = this.state;
        // const {theme, user} = this.props;
        const {theme} = this.props;

        if (nearByUsers.length === 0) {
            return <View style={[styles.emptyView, {alignItems: 'center', justifyContent: 'center', backgroundColor: theme.primaryBackgroundColor}]}>
                <LottieView
                    source={require("./../../../assets/users.json")}
                    style={{
                        bottom: "40%",
                        marginTop: "15%"
                    }}
                    autoPlay
                />
                <View>
                    <Text style={{fontSize: 18, padding: 30, textAlign: 'center'}}>
                        {"There aren't any users nearby you."}
                    </Text>
                </View>
            </View>
        } else {
            return <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={nearByUsers}
                extraData={nearByUsers}
                renderItem={({item}) => <ActivitiesUserComponent {...this.props} item={item}/> }
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
            />
        }
    };

    render() {
        const {theme, route} = this.props;
        let params = route.params;
        const {title} = params.activities;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent title={title} theme={theme} onLeftPress={this.onBackPress}/>
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
    location: state.auth.location,
});

export default connect(mapStateToProps)(ActivitiesUsersScreen);

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
        fontSize: 24,
        fontWeight: '400',
        textAlign: 'center'
    }
});
