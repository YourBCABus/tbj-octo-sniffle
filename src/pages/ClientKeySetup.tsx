// JSX just loves React
import React from 'react';

// Full text search
// import Fuse from 'fuse.js';

// Types + Queries for GraphQL
import { AbsenceState, Period, Teacher } from '../lib/types/types';
// import { GET_ALL_TEACHERS_PERIODS } from '../lib/graphql/Queries';

// Notifs
// import messaging from '../lib/webcompat/firebase-messaging/index';

// Components
// import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
// import Header from '../components/Header/Header';
// import SearchBar from '../components/SearchBar/SearchBar';
// import TeacherEntry from '../components/TeacherEntry/TeacherEntry';
import {
    Platform,
    // ActivityIndicator,
    SafeAreaView,
    Text,
    // View,
    // ScrollView,
    // RefreshControl,
    // Alert,
} from 'react-native';

// Hooks
// import useRerender from '../lib/hooks/useRerender';
// import useFixSettings from '../lib/hooks/useValidateSettings';
// import useSetting from '../lib/hooks/useSetting';
// import {
//     useStarredTeachers,
//     useStarredTeacherIds,
// } from '../lib/hooks/useStarredTeachers';
// import useSortedFilteredTeachers from '../lib/hooks/useSortedFilteredTeachers';
// import useCurrentPeriod from '../lib/hooks/useCurrentPeriod';
// import useRefreshableQuery from '../lib/hooks/useRefreshableQuery';
// import useTeachers from '../lib/hooks/useTeachers';
// import { useState, useMemo } from 'react';
import { useEffect } from 'react';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Pages } from '../lib/linking';
import { setClientKey } from '../lib/storage/auth';

const HEADER = 'text-zinc-aa-compliant font-medium pl-2 text-lg';

// need to do this because of weird stuff on android devices with notches unfortunately
const SUCCESSFUL_SAFE_AREA_VIEW_STYLE =
    Platform.OS === 'android'
        ? 'flex-1 bg-[#0b0b0e] pt-8'
        : 'flex-1 bg-[#0b0b0e]';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function getAbsenceState(
    teacher: Teacher,
    currPeriod: Period | null,
    dayIsOver: boolean,
): AbsenceState {
    if (dayIsOver) return AbsenceState.DAY_OVER;

    const partAbsent = teacher.absence.length > 0;
    const fullAbsent = teacher.fullyAbsent;
    if (fullAbsent) {
        return AbsenceState.ABSENT_ALL_DAY;
    } else if (!fullAbsent && !partAbsent) {
        return AbsenceState.PRESENT;
    } else {
        if (currPeriod === null || currPeriod === undefined) {
            return AbsenceState.ABSENT_PART_UNSURE;
        }

        const isAbsentRightNow = teacher.absence.some(
            periodId => periodId === currPeriod?.id,
        );
        if (isAbsentRightNow) {
            return AbsenceState.ABSENT_PART_ABSENT;
        } else {
            return AbsenceState.ABSENT_PART_PRESENT;
        }
    }
}

interface ClientKeySetupProps {
    navigation: NativeStackNavigationProp<any>;
    route: {
        params: {
            id: string;
            secret: string;
        };
    };
}

export default function ClientKeySetup({
    route,
    navigation,
}: ClientKeySetupProps) {
    useEffect(
        () => {
            (async () => {
                const { id, secret } = route.params;
                await setClientKey(id, secret);
                navigation.navigate(Pages.MAIN);
            })();
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [],
    );

    return (
        <SafeAreaView className={SUCCESSFUL_SAFE_AREA_VIEW_STYLE}>
            <Text className={HEADER}>Please Wait...</Text>
        </SafeAreaView>
    );
}
