import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {Dimensions} from 'react-native';
import {connect} from 'react-redux';
import SplashScreen from '../screens/SplashScreen';
import enableFontPatch from './enableFontPatch';
import GetStartedScreen from '../screens/auth/GetStartedScreen';
import HomeScreen from '../screens/dashboard/home/HomeScreen';
import LoginAndRegisterScreen from '../screens/auth/LoginAndRegisterScreen';
import VerificationScreen from '../screens/auth/VerificationScreen';
import RegistrationStepScreen from '../screens/auth/RegistrationStepScreen';
import AddPhotoScreen from '../screens/auth/AddPhotoScreen';
import CongratulationsScreen from '../screens/auth/CongratulationsScreen';
import MenuScreen from '../screens/dashboard/menu/MenuScreen';
import MatchesScreen from '../screens/dashboard/matches/MatchesScreen';
import MessagesScreen from '../screens/dashboard/messages/MessagesScreen';
import WhoLikesMeScreen from '../screens/dashboard/messages/WhoLikesMeScreen';
import ActivitiesRequestScreen from '../screens/dashboard/activities/ActivitiesRequestListsScreen';
import NotificationsScreen from '../screens/dashboard/notifications/NotificationsScreen';
import ActivitiesDetailScreen from '../screens/dashboard/activities/ActivitiesDetailScreen';
import ActivitiesListsScreen from '../screens/dashboard/activities/ActivitiesListsScreen';
import ActivitiesUsersScreen from '../screens/dashboard/activities/ActivitiesUsersScreen';
import ActivitiesSendRequestScreen from '../screens/dashboard/activities/ActivitiesFormScreen';
import SettingsScreen from '../screens/dashboard/settings/SettingsScreen';
import AccountSettingScreen from '../screens/dashboard/settings/AccountSettingScreen';
import MyProfileScreen from '../screens/dashboard/profile/MyProfileScreen';
import OtherProfileScreen from '../screens/dashboard/profile/OtherProfileScreen';
import AllPhotoScreen from '../screens/dashboard/profile/AllPhotoScreen';
import ChatScreen from '../screens/dashboard/messages/ChatScreen';
import VerifiedCodeScreen from '../screens/auth/VerifiedCodeScreen';
import {firebase} from '@react-native-firebase/analytics';
import {GoogleSignin} from '@react-native-community/google-signin';
import {WEB_CLIENT_ID} from '../config/config';
import SelectInformationScreen from '../screens/dashboard/profile/SelectInformationScreen';
import LoaderComponent from '../components/LoaderComponent';
import SendMyActivitiesRequestScreen from '../screens/dashboard/activities/ActivitiesMyRequestListsScreen';

let Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

enableFontPatch();

const navigationOption = () => {
  return {
    headerShown: false,
    headerBackTitleVisible: false,
    gestureEnabled: false,
  };
};

const forFade = ({ current }) => ({
    cardStyle: {
        opacity: current.progress,
    },
});

let appNav = null;

function CommonView() {
    return (
        <>
            <Stack.Screen name="OtherProfile" component={OtherProfileScreen} options={{cardStyleInterpolator: forFade}} />
            <Stack.Screen name="AllPhotos" component={AllPhotoScreen} options={{cardStyleInterpolator: forFade}} />
            <Stack.Screen name="ChatScreen" component={ChatScreen} options={{cardStyleInterpolator: forFade}} />
            <Stack.Screen name="ActivitiesDetail" component={ActivitiesDetailScreen} options={{cardStyleInterpolator: forFade}} />
            <Stack.Screen name="SelectionInformation" component={SelectInformationScreen} options={{cardStyleInterpolator: forFade}} />
            <Stack.Screen name="WhoLikeMe" component={WhoLikesMeScreen} options={{cardStyleInterpolator: forFade}} />
            <Stack.Screen name="ActivitiesRequest" component={ActivitiesRequestScreen} options={{cardStyleInterpolator: forFade}} />
        </>
    )
}

function HomeStackScreen() {
    return (
        <Stack.Navigator screenOptions={navigationOption()}>
            <Stack.Screen name="Home" component={HomeScreen} options={{headerStyleInterpolator: forFade}} />
            {CommonView()}
        </Stack.Navigator>
    );
}

function MyProfileStackScreen() {
    return (
        <Stack.Navigator screenOptions={navigationOption()}>
            <Stack.Screen name="MyProfile" component={MyProfileScreen} options={{cardStyleInterpolator: forFade}} />
            {CommonView()}
        </Stack.Navigator>
    );
}

function MatchesStackScreen() {
    return (
        <Stack.Navigator screenOptions={navigationOption()}>
            <Stack.Screen name="Matches" component={MatchesScreen} options={{cardStyleInterpolator: forFade}} />
            {CommonView()}
        </Stack.Navigator>
    );
}

function MessagesStackScreen() {
    return (
        <Stack.Navigator screenOptions={navigationOption()}>
            <Stack.Screen name="Messages" component={MessagesScreen} options={{cardStyleInterpolator: forFade}} />
            {CommonView()}
        </Stack.Navigator>
    );
}

function NotificationStackScreen() {
    return (
        <Stack.Navigator screenOptions={navigationOption()}>
            <Stack.Screen name="Notification" component={NotificationsScreen} options={{cardStyleInterpolator: forFade}} />
            {CommonView()}
        </Stack.Navigator>
    );
}

function ActivitiesStackScreen() {
    return (
        <Stack.Navigator screenOptions={navigationOption()}>
            <Stack.Screen name="ActivitiesList" component={ActivitiesListsScreen} options={{cardStyleInterpolator: forFade}} />
            <Stack.Screen name="ActivitiesUser" component={ActivitiesUsersScreen} options={{cardStyleInterpolator: forFade}} />
            <Stack.Screen name="ActivitiesSendRequest" component={ActivitiesSendRequestScreen} options={{cardStyleInterpolator: forFade}} />
            <Stack.Screen name="SendMyActivitiesRequest" component={SendMyActivitiesRequestScreen} options={{cardStyleInterpolator: forFade}} />
            {CommonView()}
        </Stack.Navigator>
    );
}

function SettingStackScreen() {
    return (
        <Stack.Navigator screenOptions={navigationOption()}>
            <Stack.Screen name="Setting" component={SettingsScreen} options={{cardStyleInterpolator: forFade}} />
            <Stack.Screen name="AccountSetting" component={AccountSettingScreen} options={{cardStyleInterpolator: forFade}} />
        </Stack.Navigator>
    );
}

class AppNavigator extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    appNav = this;
    await firebase.analytics().setAnalyticsCollectionEnabled(true);
    GoogleSignin.configure({
        webClientId: WEB_CLIENT_ID,
    });
  }

  render() {
    const {user, loading} = this.props;
      const navigationOptionDrawer = () => {
          return {
              headerShown: false,
              headerBackTitleVisible: false,
              gestureEnabled: false,
              drawerPosition:'left',
              drawerStyle: {
                  width: Dimensions.get('window').width / 5,
                  // height: Dimensions.get('window').height / 2.0,
                  marginVertical: Dimensions.get('window').height / 3.5,
              },
          };
      };
    if (loading)
      return <SplashScreen />;

    return (
      <NavigationContainer>
          {
            user === null
              ? <Stack.Navigator screenOptions={navigationOption()}>
                  <Stack.Screen name="GetStarted" component={GetStartedScreen} options={{cardStyleInterpolator: forFade}} />
                  <Stack.Screen name="LoginAndRegister" component={LoginAndRegisterScreen} options={{cardStyleInterpolator: forFade}} />
                  <Stack.Screen name="Verification" component={VerificationScreen} options={{cardStyleInterpolator: forFade}} />
                  <Stack.Screen name="RegistrationStep" component={RegistrationStepScreen} options={{cardStyleInterpolator: forFade}} />
                  <Stack.Screen name="AddPhoto" component={AddPhotoScreen} options={{cardStyleInterpolator: forFade}} />
                  <Stack.Screen name="Congratulations" component={CongratulationsScreen} options={{cardStyleInterpolator: forFade}} />
                  <Stack.Screen name="VerifiedCode" component={VerifiedCodeScreen} options={{cardStyleInterpolator: forFade}} />
                </Stack.Navigator>
              : <Drawer.Navigator initialRouteName="Home"
                                  drawerContent={props => <MenuScreen {...props} />}
                                  edgeWidth={0}
                                  screenOptions={navigationOptionDrawer()}>
                  <Drawer.Screen name="Home" component={HomeStackScreen} options={{cardStyleInterpolator: forFade}} />
                  <Drawer.Screen name="MyProfile" component={MyProfileStackScreen} options={{cardStyleInterpolator: forFade}} />
                  <Drawer.Screen name="Matches" component={MatchesStackScreen} options={{cardStyleInterpolator: forFade}} />
                  <Drawer.Screen name="Messages" component={MessagesStackScreen} options={{cardStyleInterpolator: forFade}} />
                  <Drawer.Screen name="Notifications" component={NotificationStackScreen} options={{cardStyleInterpolator: forFade}} />
                  <Drawer.Screen name="Activities" component={ActivitiesStackScreen} options={{cardStyleInterpolator: forFade}} />
                  <Drawer.Screen name="Settings" component={SettingStackScreen} options={{cardStyleInterpolator: forFade}} />
                </Drawer.Navigator>
          }
          <LoaderComponent loading={this.props.showLoader}/>
      </NavigationContainer>
    );
  }
}

const mapStateToProps = (state) => ({
  loading: state.auth.loading,
  user: state.auth.user,
  theme: state.auth.theme,
  showLoader: state.auth.showLoader,
});

export default connect(mapStateToProps)(AppNavigator);
