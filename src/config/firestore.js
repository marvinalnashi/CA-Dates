import firestore from '@react-native-firebase/firestore';

export const usersCollection = firestore().collection('Users');
export const swipeCardsCollection = firestore().collection('SwipeCards');
export const matchesCollection = firestore().collection('Matches');
export const conversationsCollection = firestore().collection('Conversations');
export const activitiesRequestCollection = firestore().collection('ActivitiesRequest');
export const notificationsCollection = firestore().collection('Notifications');
