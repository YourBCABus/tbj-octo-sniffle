// JSX just loves React
import React from 'react';

// Full text search
import Fuse from 'fuse.js';

// Types + Queries for GraphQL
import { AbsenceState, Period, Teacher } from '../lib/types/types';
import { GET_ALL_TEACHERS_PERIODS } from '../lib/graphql/Queries';

// Notifs
import messaging from '../lib/webcompat/firebase-messaging/index';

// Components
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Header from '../components/Header/Header';
import SearchBar from '../components/SearchBar/SearchBar';
import TeacherEntry from '../components/TeacherEntry/TeacherEntry';
import {
    Platform,
    ActivityIndicator,
    SafeAreaView,
    Text,
    View,
    ScrollView,
    RefreshControl,
    Alert,
} from 'react-native';

// Hooks
import useRerender from '../lib/hooks/useRerender';
import useFixSettings from '../lib/hooks/useValidateSettings';
import useSetting from '../lib/hooks/useSetting';
import {
    useStarredTeachers,
    useStarredTeacherIds,
} from '../lib/hooks/useStarredTeachers';
import useSortedFilteredTeachers from '../lib/hooks/useSortedFilteredTeachers';
import useCurrentPeriod from '../lib/hooks/useCurrentPeriod';
import useRefreshableQuery from '../lib/hooks/useRefreshableQuery';
import useTeachers from '../lib/hooks/useTeachers';
import { useState, useEffect, useMemo } from 'react';
import { signOut } from '../lib/google';

const SUBHEADER = 'text-zinc-aa-compliant font-medium pl-2 text-sm';

// need to do this because of weird stuff on android devices with notches unfortunately
const SUCCESSFUL_SAFE_AREA_VIEW_STYLE =
    Platform.OS === 'android'
        ? 'flex-1 bg-[#0b0b0e] pt-8'
        : 'flex-1 bg-[#0b0b0e]';

function getAbsenceState(
    teacher: Teacher,
    currPeriod: Period | null,
    dayIsOver: boolean,
): AbsenceState {
    if (dayIsOver) {
        return AbsenceState.DAY_OVER;
    }

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

// await signOut

export default function Main({ navigation }: any) {
    useFixSettings();
    const useHapticFeedback =
        useSetting('hapticfeedback', false) && Platform.OS !== 'web';
    const useMinimalistIcons = useSetting('minimalist', false);

    // TODO --> Potentially tell users to keep Background App Refresh mode on for best performance on iOS
    useEffect(() => {
        if (Platform.OS !== 'web') {
            const unsubscribe = messaging().onMessage(async remoteMessage => {
                Alert.alert(
                    'A new FCM message arrived!',
                    JSON.stringify(remoteMessage),
                );
            });

            return unsubscribe;
        }
    }, []);

    const rerender = useRerender();

    const signOutAndDropOntoHomepage = useMemo(
        () => async () => {
            await signOut();
            navigation.reset({
                index: 0,
                routes: [{ name: 'TableJet - Sign In' }],
            });
        },
        [navigation],
    );

    const { data, loading, error, refresh, refreshing } = useRefreshableQuery<
        { teachers: Teacher[]; periods: Period[] },
        {}
    >(
        GET_ALL_TEACHERS_PERIODS,
        {
            pollInterval: 30000,
            onError: e => console.log(e),
            onCompleted: () => setTimeout(() => rerender(), 10),
        },
        signOutAndDropOntoHomepage,
    );

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
    const [starredIds, toggleTeacherStar] = useStarredTeacherIds(data);
    const starredTeachers = useStarredTeachers(sortedTeachers, starredIds);

    const [currPeriod, nextCurrPeriod] = useCurrentPeriod(data);

    // as of right now, if it ever fails fetching the data, this gets rendered until data successfully is returned
    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-zinc-950 justify-center align-middle flex-grow">
                <Header navigation={navigation} />
                <ScrollView
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
                            {currPeriod?.name ?? 'No Current Period'}
                        </Text>
                    </View>

                    {starredTeachers.length > 0 ? (
                        <View className="mt-1 pt-2 border-t border-zinc-aa-compliant">
                            <Text className={SUBHEADER}>Starred Teachers</Text>
                        </View>
                    ) : null}
                    {starredTeachers.map((teacher, idx) => {
                        return (
                            <TeacherEntry
                                key={teacher.id}
                                teacher={teacher}
                                starred={true}
                                toggleStar={toggleTeacherStar}
                                minimalist={useMinimalistIcons}
                                absent={getAbsenceState(
                                    teacher,
                                    currPeriod,
                                    nextCurrPeriod === null,
                                )}
                                hapticfeedback={useHapticFeedback}
                                idx={idx}
                                periods={data?.periods ?? []}
                            />
                        );
                    })}

                    {sortedTeachers.length > 0 ? (
                        <View className="mt-1 pt-2 border-t border-zinc-aa-compliant">
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
                                starred={starredIds.includes(teacher.id)}
                                toggleStar={toggleTeacherStar}
                                minimalist={useMinimalistIcons}
                                absent={getAbsenceState(
                                    teacher,
                                    currPeriod,
                                    nextCurrPeriod === null,
                                )}
                                hapticfeedback={useHapticFeedback}
                                idx={idx}
                                periods={data?.periods ?? []}
                            />
                        );
                    })}
                </ScrollView>
            </BottomSheetModalProvider>
        </SafeAreaView>
    );
}
