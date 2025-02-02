import notifee, { AuthorizationStatus } from '@notifee/react-native';
import { Platform } from 'react-native';
import { GET_ALL_TEACHERS_PERIODS } from '../graphql/Queries';
import { Period } from '../types/types';
import messaging from '../webcompat/firebase-messaging/index';
import { getAuthenticatedApolloClient } from '../hooks/useAuthenticatedApolloClient';

export async function requestUserPermission() {
    const authStatus = await notifee.requestPermission();

    if (Platform.OS === 'android') {
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        console.log('Android detected... creating channel: ', channelId);
    }

    if (authStatus.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
        console.log('Authorized');
        console.log(`Token: ${await messaging().getToken()}`);
    } else {
        console.log('Not Authorized; status: ', authStatus.authorizationStatus);
    }
}

const defaultStatus = {
    authorizationStatus: AuthorizationStatus.DENIED,
    ios: {},
    android: {},
    web: {},
};
export async function hasNotifPermission(): Promise<boolean> {
    const notifSettings =
        Platform.OS === 'web'
            ? defaultStatus
            : await notifee.getNotificationSettings();
    const authStatus = notifSettings.authorizationStatus;
    return authStatus === AuthorizationStatus.AUTHORIZED;
}

async function coalescePeriods(
    periods: Period[] | undefined | null,
): Promise<Period[]> {
    if (periods == null || typeof periods === 'undefined') {
        const client = await getAuthenticatedApolloClient();
        const { data } = await client.query({
            query: GET_ALL_TEACHERS_PERIODS,
        });
        return data.periods;
    } else {
        return periods;
    }
}

// Subscribes to a topic with the format of `period-id.teacher-id`
// If no period is provided, it will subscribe to all periods.
export async function subscribeToNotification(
    teacherId: string,
    periods?: Period[],
) {
    periods = await coalescePeriods(periods);
    const fbMessaging = messaging();

    const topics = [
        ...periods.map(p => `${p.id}.${teacherId}`),
        `00000000-0000-0000-0000-000000000000.${teacherId}`,
    ];

    console.log(`Subscribing to topics: ${topics.join(', ')}`);

    return Promise.all(topics.map(t => fbMessaging.subscribeToTopic(t)));
}

// Unsubscribes to a topic with the format of `period-id.teacher-id`
// If no period is provided, it will unsubscribe from all periods.
export async function unsubscribeToNotification(
    teacherId: string,
    periods?: Period[],
) {
    periods = await coalescePeriods(periods);
    const fbMessaging = messaging();

    const topics = [
        ...periods.map(p => `${p.id}.${teacherId}`),
        `00000000-0000-0000-0000-000000000000.${teacherId}`,
    ];

    console.log(`Unsubscribing from topics: ${topics.join(', ')}`);

    return Promise.all(topics.map(t => fbMessaging.unsubscribeFromTopic(t)));
}
