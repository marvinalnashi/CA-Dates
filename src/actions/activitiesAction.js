import {activitiesRequestCollection} from '../config/firestore';
import {getStore} from '../../App';
import {MY_SEND_ACTIVITIES_REQUESTS, ACTIVITIES_REQUESTS} from './types';
import {getUserDetail} from './userAction';
import moment from 'moment';
import {createNewNotification} from './notificationsAction';

export function sendActivitiesRequest(parameter) {
    return new Promise((resolve, reject) => {
        activitiesRequestCollection
            .add({
                ...parameter,
                createdAt: moment().utc().unix(),
            }).then(response => {
            if (Boolean(response._documentPath)) {
                if (Boolean(response._documentPath._parts)) {
                    let parts = response._documentPath._parts;
                    if (parts.length > 1) {
                        let activities_id = parts[1];
                        createNewNotification({
                            relationship_id: activities_id,
                            notification_type: 'activities',
                            to_user: parameter.request_to,
                            from_user: parameter.request_by,
                            activitiesDate: parameter.date,
                            address: parameter.address,
                            activitiesKey: parameter.activitiesKey,
                            request_status: parameter.request_status,
                        });
                    }
                }
            }
            resolve(true);
        });
    });
}

export function getActivitiesRequestLists(id) {
    return new Promise((resolve, reject) => {
        activitiesRequestCollection
            .where('request_to', '==', id)
            .where('request_status', 'in', ['', 'accepted'])
            .onSnapshot(snapshot => {
                const getUserInfo = snapshot.docs.map(doc => {
                    const firebaseData = {
                        activities_id: doc.id,
                        ...doc.data(),
                    };
                    return getUserDetail(firebaseData.request_by, firebaseData);
                });

                Promise.all(getUserInfo).then(responseData => {
                    let response = [];
                    for (let v in responseData) {
                        let user = responseData[v].response._data;
                        let data = responseData[v].data;
                        response.push({
                            user,
                            ...data,
                        });
                    }

                    let activitiesReadCount = getStore.getState().auth.user.activitiesReadCount;
                    if (activitiesReadCount !== undefined) {
                        activitiesReadCount = response.length - activitiesReadCount;
                    } else {
                        activitiesReadCount = response.length;
                    }

                    getStore.dispatch({
                        type: ACTIVITIES_REQUESTS,
                        payload: {data: response, count: activitiesReadCount},
                    });
                    resolve(response);
                });
            });
    });
}

export function getMyActivitiesRequestLists(id) {
    return new Promise((resolve, reject) => {
        activitiesRequestCollection
            .where('request_by', '==', id)
            .onSnapshot(snapshot => {
                const getUserInfo = snapshot.docs.map(doc => {
                    const firebaseData = {
                        activities_id: doc.id,
                        ...doc.data(),
                    };
                    return getUserDetail(firebaseData.request_to, firebaseData);
                });

                Promise.all(getUserInfo).then(responseData => {
                    let response = [];
                    for (let v in responseData) {
                        let user = responseData[v].response._data;
                        let data = responseData[v].data;
                        response.push({
                            user,
                            ...data,
                        });
                    }
                    getStore.dispatch({
                        type: MY_SEND_ACTIVITIES_REQUESTS,
                        payload: response,
                    });
                    resolve(response);
                });
            });
    });
}

export function updateActivitiesRequestStatus(id, request_status) {
    return new Promise((resolve, reject) => {
        activitiesRequestCollection
            .doc(id)
            .set({request_status: request_status}, {merge: true})
            .then(() => {
                resolve(true);
            });
    });
}

export function deleteActivitiesRequest(id) {
    return new Promise((resolve, reject) => {
        activitiesRequestCollection
            .doc(id)
            .delete()
            .then(() => {
                resolve(true);
            });
    });
}

export function updateLatestMessageInActivities(id, parameter) {
    return new Promise((resolve, reject) => {
        activitiesRequestCollection
            .doc(id)
            .set({
                    latestMessage: {
                        ...parameter,
                        createdAt: moment().utc().unix(),
                    },
                },
                {merge: true}).then(response => {

        });
    });
}

export function addMessageInActivities(id, parameter) {
    return new Promise((resolve, reject) => {
        activitiesRequestCollection
            .doc(id)
            .collection('Messages')
            .add({
                ...parameter,
                createdAt: moment().utc().unix(),
            }).then(response => {
            resolve(true)
        })
    });
}
