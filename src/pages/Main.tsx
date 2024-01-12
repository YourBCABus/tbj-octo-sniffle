import React, { useMemo } from 'react';

import {
    Platform,
    ActivityIndicator,
    SafeAreaView,
    TextInput,
    Text,
    View,
    Pressable,
    ScrollView,
    RefreshControl,
    Alert,
} from 'react-native';
import TeacherEntry from '../components/TeacherEntry/TeacherEntry';
import { useState, useCallback, useEffect } from 'react';

import { AbsenceState, Period, Teacher } from '../lib/types/types';

import { GET_ALL_TEACHERS_PERIODS } from '../lib/graphql/Queries';

import Fuse from 'fuse.js';
import { useFocusEffect } from '@react-navigation/native';

import messaging from '@react-native-firebase/messaging';

import { requestUserPermission } from '../lib/notifications/Notification';

import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import useRerender from '../lib/hooks/useRerender';
import useValidateSettings from '../lib/hooks/useValidateSettings';
import useSetting from '../lib/hooks/useSetting';
import { useStarredTeachers, useStarredTeacherIds } from '../lib/hooks/useStarredTeachers';
import useSortedFilteredTeachers from '../lib/hooks/useSortedFilteredTeachers';
import useCurrentPeriod from '../lib/hooks/useCurrentPeriod';
import Header from '../components/Header/Header';
import SearchBar from '../components/SearchBar/SearchBar';
import useRefreshableQuery from '../lib/hooks/useRefreshableQuery';
import useTeachers from '../lib/hooks/useTeachers';

const SUBHEADER = 'text-zinc-600 font-medium pl-2 text-sm';

// need to do this because of weird stuff on android devices with notches unfortunately
const SUCCESSFUL_SAFE_AREA_VIEW_STYLE =
    Platform.OS === 'android'
        ? 'flex-1 bg-[#0b0b0e] pt-8'
        : 'flex-1 bg-[#0b0b0e]';

function getAbsenceState(
    teacher: Teacher,
    currPeriod: Period | null,
): AbsenceState {
    if (teacher.fullyAbsent) {
        return AbsenceState.ABSENT_ALL_DAY;
    }
    if (teacher.absence.some(periodId => periodId === currPeriod?.id)) {
        return AbsenceState.ABSENT;
    }
    if (currPeriod === null || currPeriod === undefined) {
        return AbsenceState.NO_PERIOD;
    }

    return AbsenceState.PRESENT;
}

export default function Main({ navigation }: any) {
    useValidateSettings();
    const useHapticFeedback = useSetting('hapticfeedback', false);
    const useMinimalistIcons = useSetting('minimalist', false);

    // TODO: Prompt before asking for permissions
    useFocusEffect(
        useCallback(() => {
            const reqUserPerms = async () => {
                try {
                    await requestUserPermission();
                } catch (e) {
                    console.log(e);
                }
            };

            reqUserPerms();
        }, []),
    );

    // TODO --> Potentially tell users to keep Background App Refresh mode on for best performance on iOS
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
            Alert.alert(
                'A new FCM message arrived!',
                JSON.stringify(remoteMessage),
            );
        });

        return unsubscribe;
    }, []);

    const rerender = useRerender();

    const { data, loading, error, refresh, refreshing } = useRefreshableQuery<
        { teachers: Teacher[]; periods: Period[] },
        {}
    >(GET_ALL_TEACHERS_PERIODS, {
        pollInterval: 30000,
        onError: e => console.log(e),
        onCompleted: () => setTimeout(() => rerender(), 10),
    });

    const teachers = useTeachers(data);

    const [search, updateSearch] = useState('');
    const fuse = useMemo(() => {
        return new Fuse(teachers, {
            keys: ['displayName'],
            threshold: 0.4,
            findAllMatches: true,
        });
    }, [teachers]);

    const sortedTeachers = useSortedFilteredTeachers(teachers, fuse, search);
    const [starredTeacherIds, toggleTeacherStarState] = useStarredTeacherIds(data);
    const starredTeachers = useStarredTeachers(
        sortedTeachers,
        starredTeacherIds,
    );

    const curPeriod = useCurrentPeriod(data);

    // as of right now, if it ever fails fetching the data, this gets rendered until data successfully is returned
    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-zinc-950 justify-center align-middle">
                <ScrollView
                    contentContainerStyle={{
                        flexGrow: 1,
                        justifyContent: 'center',
                    }}
                    refreshControl={
                        <RefreshControl
                            colors={['white']}
                            tintColor={'white'}
                            refreshing={refreshing}
                            onRefresh={refresh}
                        />
                    }>
                    <View>
                        <Text className="text-red-500 text-center text-lg mx-3 font-bold">
                            Failed to load data :&#x28;
                        </Text>
                        <Text className="text-white text-center mx-3">
                            Please check your internet connection.
                        </Text>
                    </View>
                </ScrollView>
            </SafeAreaView>
        );
    }

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-zinc-950 justify-center align-middle">
                <ActivityIndicator size="large" color="white" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className={SUCCESSFUL_SAFE_AREA_VIEW_STYLE}>
            <BottomSheetModalProvider>
                <Header navigation={navigation} />

                {/* TODO - add popup at bottom to indicate failed to load if request failed but there are already things in cache */}
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            colors={['rgb(250 250 250)']}
                            tintColor="rgb(250 250 250)"
                            refreshing={refreshing}
                            onRefresh={refresh}
                        />
                    }>
                    <SearchBar search={search} setSearch={updateSearch} />
                    <View>
                        <Text className="text-zinc-100 text-center text-xl mx-3 my-5 font-bold">
                            {curPeriod?.name ?? 'No Current Period'}
                        </Text>
                    </View>

                    {starredTeachers.length > 0 ? (
                        <View className="mt-1 pt-2 border-t border-zinc-600">
                            <Text className={SUBHEADER}>Starred Teachers</Text>
                        </View>
                    ) : null}
                    {starredTeachers.map((teacher, idx) => {
                        return (
                            <TeacherEntry
                                key={teacher.id}
                                teacher={teacher}
                                starred={true}
                                setStar={toggleTeacherStarState}
                                minimalist={useMinimalistIcons}
                                absent={getAbsenceState(teacher, curPeriod)}
                                hapticfeedback={useHapticFeedback}
                                idx={idx}
                                periods={data.periods ?? []}
                            />
                        );
                    })}

                    {sortedTeachers.length > 0 ? (
                        <View className="mt-1 pt-2 border-t border-zinc-600">
                            <Text className={SUBHEADER}> All Teachers </Text>
                        </View>
                    ) : (
                        <View className="flex-1 justify-center align-middle mt-44">
                            <Text className="text-red-500 text-center text-xl mx-3 mt-6 mb-3 font-bold">
                                No Teachers Found :&#x28;
                            </Text>
                            <Text className="text-white font-semibold text-center text-sm mx-3">
                                Tip: Search by full name
                            </Text>
                        </View>
                    )}

                    {sortedTeachers.map((teacher, idx) => {
                        return (
                            <TeacherEntry
                                key={teacher.id}
                                teacher={teacher}
                                starred={starredTeacherIds.has(teacher.id)}
                                setStar={toggleTeacherStarState}
                                minimalist={useMinimalistIcons}
                                absent={getAbsenceState(teacher, curPeriod)}
                                hapticfeedback={useHapticFeedback}
                                idx={idx}
                                periods={data.periods ?? []}
                            />
                        );
                    })}
                </ScrollView>
            </BottomSheetModalProvider>
        </SafeAreaView>
    );
}
