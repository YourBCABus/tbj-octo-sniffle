// import messaging from '@react-native-firebase/messaging';

// // Does this work on Android?
// // If not: https://rnfirebase.io/messaging/usage
// export async function requestUserPermission() {
//   const authStatus = await messaging().requestPermission();
//   const enabled =
//     authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
//     authStatus === messaging.AuthorizationStatus.PROVISIONAL;

//   if (enabled) {
//     console.log('Authorization status:', authStatus);
//   }

//   console.log("FCM Token: " + (await messaging().getToken()));
// }

import { gql, useQuery } from '@apollo/client';
import notifee, { AuthorizationStatus, RepeatFrequency, TimestampTrigger, TriggerType } from '@notifee/react-native';
import { Platform } from 'react-native';
import { GET_ALL_TEACHERS_PERIODS } from '../graphql/Queries';
import { randomInt } from 'crypto';
import { client } from '../../../App';
import { initialIdLoad } from '../storage/StarredTeacherStorage';
import { Teacher } from '../types/types';

export async function requestUserPermission() {
    const authStatus = await notifee.requestPermission();
    
    if(Platform.OS === 'android') {
        // Create a channel (required for Android)
        const channelId = await notifee.createChannel({
            id: 'default',
            name: 'Default Channel',
        });

        console.log("Android detected... creating channel: ", channelId);
    }

    if(authStatus.authorizationStatus === AuthorizationStatus.AUTHORIZED) {
        console.log("Authorized");        
    } else {
        console.log("Not Authorized; status: ", authStatus.authorizationStatus)
    }
}

export async function onCreateTriggerNotification(){
    const date = new Date(Date.now());
    date.setHours(date.getHours());
    date.setMinutes(date.getMinutes());
    date.setSeconds(date.getSeconds() + 15);
  
    console.log("if this triggers: " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
      repeatFrequency: RepeatFrequency.NONE,
    };

    const teachers = await getStarredTeachers();

    // const teachers = ["Mr. Smith", "Mr. Jones", "Mr. Johnson"];

    await notifee.createTriggerNotification(
      {
        id: "1235456",
        title: 'Test notification with teachers',
        body: "Teachers: " + teachers.join(", "),
        // body: "Teachers???",
        android: {
          channelId: 'default',
        },
      },
      trigger,
    );
    // return teachers;
  }


async function getStarredTeachers(): Promise<string[]> {
    // const { data } = useQuery(GET_ALL_TEACHERS_PERIODS);
    // const teacherNames: string[] = [];

    const { data } = await client.query({query: GET_ALL_TEACHERS_PERIODS});
    // console.log("DATA RETURNED: ", data);

    const StarredTeacherIDS = await initialIdLoad();
    console.log("Starred Teacher IDS: ", StarredTeacherIDS);

    // const teacherNames = ["Mr. Smith", "Mr. Jones", "Mr. Johnson"];
    // for (const teacher of data.teachers) {
    //     teacherNames.push(teacher.name);
    // }

    const starredTeachers = data.teachers.filter((teacher: Teacher) => {
        if(StarredTeacherIDS.has(teacher.id)) {
          return true;
        }
        return false;
    })

    const teacherNames = starredTeachers.map((teacher: Teacher) => teacher.name);

    console.log("teacher names: " + data.teachers.map((teacher: Teacher) => teacher.name).join(", "));
    console.log("starred teacher names: " + teacherNames.join(", "));

    // data.teachers.forEach((teacher: any) => {
        
    // });

    return teacherNames;
}