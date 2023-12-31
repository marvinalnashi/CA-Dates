import React, {Component} from 'react';
import {FlatList, StyleSheet, Text, View} from 'react-native';
import {connect} from 'react-redux';
import HeaderComponent from '../../../components/general/HeaderComponent';
import MatchComponent from '../../../components/matches/MatchComponent';
import {getAllMatchesLists} from '../../../actions/matchesAction';
import {regex} from '../../../utils/regex';

class MatchesScreen extends Component {

    constructor(props) {
        super(props);
    }

    componentDidMount(): void {
        getAllMatchesLists(this.props.user.uid, true)
    }

    onBackPress = () => {
        const {navigation} = this.props;
        navigation.goBack();
    };

    onRightPress = () => {

    };

    renderData = () => {
        const {theme, matches} = this.props;

        if (matches.length === 0) {
            return <View style={styles.emptyView}>
                <Text style={[styles.infoText, {color: theme.subPrimaryColor}]}>You haven't matched with anyone yet</Text>
            </View>
        } else {
            return <FlatList
                showsVerticalScrollIndicator={false}
                showsHorizontalScrollIndicator={false}
                data={matches}
                extraData={matches}
                renderItem={({item}) => <MatchComponent theme={theme} item={item}/> }
                numColumns={2}
                keyExtractor={(item, index) => index.toString()}
            />
        }
    };

    render() {
        const {theme} = this.props;

        return (
            <View style={[styles.container, {backgroundColor: theme.container.backgroundColor}]}>
                <HeaderComponent title={'Matches'} theme={theme} onLeftPress={this.onBackPress}/>
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
    matches: state.auth.matches,
});

export default connect(mapStateToProps)(MatchesScreen);

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
