import notifee, { AuthorizationStatus, RepeatFrequency, TimestampTrigger, TriggerType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { GET_ALL_TEACHERS_PERIODS } from '../graphql/Queries';
import { client } from '../../../App';
import { initialIdLoad } from '../storage/StarredTeacherStorage';
import { Period, Teacher } from '../types/types';
import { getCurrentPeriod } from '../time';

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

async function coalescePeriods(periods: Period[] | undefined | null): Promise<Period[]> {
  console.log(123);
  if(periods == null || typeof(periods) === 'undefined') {
    const { data } = await client.query({query: GET_ALL_TEACHERS_PERIODS});
    console.log("data returned: ", data);
    return data.periods;
  } else {
    console.log(345);
    return periods
  }
}

// Subscribes to a topic with the format of `period-id.teacher-id`
// If no period is provided, it will subscribe to all periods.
export async function subscribeToNotification(teacherId: string, periods?: Period[]) {
  periods = await coalescePeriods(periods);

  const topics: string[] = [];
  console.log(periods);
  periods.forEach((period: Period) => {
    const topic = period.id + "." + teacherId;
    console.log("Subscribing to topic: " + topic);
    topics.push(topic);
    messaging().subscribeToTopic(topic);
  })
}

// Unsubscribes to a topic with the format of `period-id.teacher-id`
// If no period is provided, it will unsubscribe to all periods.
export async function unsubscribeToNotification(teacherId: string, periods?: Period[]) {
  periods = await coalescePeriods(periods);
  console.log(periods);
  periods.forEach((period: Period) => {
    const topic = period.id + "." + teacherId;
    console.log("Unsubscribing from topic: " + topic);
    messaging().unsubscribeFromTopic(topic);
  })
}

// export async function onCreateTriggerNotification(){
//     const date = new Date(Date.now());
//     date.setHours(date.getHours());
//     date.setMinutes(date.getMinutes());
//     date.setSeconds(date.getSeconds() + 15);
  
//     console.log("if this triggers: " + date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds());
//     const trigger: TimestampTrigger = {
//       type: TriggerType.TIMESTAMP,
//       timestamp: date.getTime(),
//       repeatFrequency: RepeatFrequency.NONE,
//     };

//     // const trigger: IntervalTrigger = {
//     //   type: TriggerType.INTERVAL,
//     //   interval: 5
//     // }

//     // const teachers = await getStarredTeachers();
//     const teachers = await getStarredAbsentTeachers();

//     const teacherNames = teachers.map((teacher: Teacher) => { return teacher.name });

//     await notifee.createTriggerNotification(
//       {
//         id: "1235456",
//         title: 'Test notification with teachers',
//         body: "Starred Absent: " + teacherNames.join(", "),
//         android: {
//           channelId: 'default',
//         },
//       },
//       trigger,
//     );
//     // return teachers;
//   }



// Maybe this should return a set instead?
async function getStarredTeachers(): Promise<Teacher[]> {
    const { data } = await client.query({query: GET_ALL_TEACHERS_PERIODS});

    // TODO: Verify that this refetches/always returns an updated list of starred teachers
    const StarredTeacherIDS = await initialIdLoad();

    const starredTeachers = data.teachers.filter((teacher: Teacher) => {
        if(StarredTeacherIDS.has(teacher.id)) {
          return true;
        }
        return false;
    })

    return starredTeachers;
}

// If a teacher is fully absent, possibly only announce first period // have students optionally input what period they have the teacher
async function getStarredAbsentTeachers(): Promise<Teacher[]> {
    const { data } = await client.query({query: GET_ALL_TEACHERS_PERIODS});
    const currentPeriod = getCurrentPeriod(data.periods);
    
    if(currentPeriod === null) return [];
    return (await getStarredTeachers()).filter((teacher: Teacher) => {
        if (teacher.absenceState.isFullyAbsent) return true;
        return currentPeriod.teachersAbsent.some((absentTeacher: {id: string}) => teacher.id === absentTeacher.id);
    });  
  }