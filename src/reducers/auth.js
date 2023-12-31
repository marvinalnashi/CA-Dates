import {
    CONVERSATIONS,
    GET_LOCATION,
    HIDE_LOADER,
    LOGIN,
    LOGOUT,
    MATCHES,
    MY_SEND_ACTIVITIES_REQUESTS,
    NOTIFICATION_UNREAD_COUNT,
    NOTIFICATIONS,
    PEOPLE_WHO_LIKED,
    PEOPLE_WHO_LIKED_COUNT,
    ACTIVITIES_REQUESTS,
    ACTIVITIES_REQUESTS_COUNT,
    SET_USER_DATA,
    SHOW_LOADER,
    THEME,
} from '../actions/types';
import {THEMES} from '../themes/themes';

const initialAuthState = {loading: true, user: null, theme: THEMES[0],
  showLoader: false, location: {latitude: 0.00, longitude: 0.00},
  mySendActivitiesRequests: [],
  matches: [],
  activitiesRequests: [], activitiesUnreadCount: 0,
  peopleWhoLiked: [], whoLikedUnreadCount: 0,
  notifications: [], notificationCount: 0,
  conversations: [], conversationCount: 0,
};

function auth(state = initialAuthState, action) {
  switch (action.type) {
    case LOGIN:
      return {...state, user: action.payload, loading: false};

    case LOGOUT:
      return {...state, user: null, loading: false, peopleWhoLiked: [], activitiesRequests: [], mySendActivitiesRequests: [],
        matches: [], conversations: []};

    case THEME:
      return {...state, theme: action.payload};

    case SET_USER_DATA:
      return {...state, user: action.payload};

    case SHOW_LOADER:
      return {...state, showLoader: true};

    case HIDE_LOADER:
      return {...state, showLoader: false};

    case GET_LOCATION:
      return {...state, location: action.payload};

    case PEOPLE_WHO_LIKED:
      return {...state, peopleWhoLiked: action.payload.data, whoLikedUnreadCount: action.payload.count};

    case PEOPLE_WHO_LIKED_COUNT:
      return {...state, whoLikedUnreadCount: action.payload};

    case MY_SEND_ACTIVITIES_REQUESTS:
      return {...state, mySendActivitiesRequests: action.payload};

    case ACTIVITIES_REQUESTS:
      return {...state, activitiesRequests: action.payload.data, activitiesUnreadCount: action.payload.count};

    case ACTIVITIES_REQUESTS_COUNT:
      return {...state, activitiesUnreadCount: action.payload};

    case MATCHES:
      return {...state, matches: action.payload};

    case NOTIFICATIONS:
      return {...state, notifications: action.payload.data, notificationCount: action.payload.count};

    case NOTIFICATION_UNREAD_COUNT:
      return {...state, notificationCount: action.payload};

    case CONVERSATIONS:
      return {...state, conversations: action.payload.data, conversationCount: action.payload.count};

    default:
      return state;
  }
}

export default auth;
