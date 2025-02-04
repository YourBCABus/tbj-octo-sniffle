// JSX just loves React
import React from 'react';

// Full text search
import Fuse from 'fuse.js';

// Types + Queries for GraphQL
import { Period, Teacher } from '../lib/types/types';
import { GET_ALL_TEACHERS_PERIODS } from '../lib/graphql/Queries';

// Components
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import Header from '../components/Header/Header';
import SearchBar from '../components/SearchBar/SearchBar';
import {
    Platform,
    ActivityIndicator,
    SafeAreaView,
    Text,
    View,
    RefreshControl,
} from 'react-native';
import TeacherList from '../components/TeacherEntry/TeacherList';

// @ts-expect-error
import _ScrollViewContainer from '../components/reordering/ScrollViewContainer';
const ScrollViewContainer: typeof import('../components/reordering/ScrollViewContainer.d')['default'] =
    _ScrollViewContainer;

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
import { useState, useMemo } from 'react';
import useKickToSignIn from '../lib/hooks/useKickToSignIn';
import useAuthGate from '../lib/hooks/useAuthGate';

// need to do this because of weird stuff on android devices with notches unfortunately
const SUCCESSFUL_SAFE_AREA_VIEW_STYLE =
    Platform.OS === 'android'
        ? 'flex-1 bg-[#0b0b0e] pt-8'
        : 'flex-1 bg-[#0b0b0e]';

export default function Main({ navigation }: any) {
    useFixSettings();
    const useHapticFeedback =
        useSetting('hapticfeedback', false) && Platform.OS !== 'web';
    const useMinimalistIcons = useSetting('minimalist', false);

    useAuthGate(navigation);

    const rerender = useRerender();
    const kickToSignIn = useKickToSignIn(navigation);

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
        kickToSignIn,
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
    const [starredIds, toggleTeacherStar, reorderStarredTeachers] =
        useStarredTeacherIds(data);
    const starredTeachers = useStarredTeachers(sortedTeachers, starredIds);

    const [currPeriod, nextCurrPeriod] = useCurrentPeriod(data);

    // as of right now, if it ever fails fetching the data, this gets rendered until data successfully is returned
    if (error) {
        return (
            <SafeAreaView className="flex-1 bg-zinc-950 justify-center align-middle flex-grow">
                <Header navigation={navigation} />
                <ScrollViewContainer
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
                </ScrollViewContainer>
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
                <ScrollViewContainer
                    refreshControl={
                        <RefreshControl
                            colors={['rgb(250 250 250)']}
                            tintColor="rgb(250 250 250)"
                            refreshing={refreshing}
                            onRefresh={refresh}
                        />
                    }
                    className="flex">
                    <SearchBar search={search} setSearch={updateSearch} />
                    <View>
                        <Text className="text-zinc-100 text-center text-xl mx-3 my-5 font-bold">
                            {currPeriod?.name ?? 'No Current Period'}
                        </Text>
                    </View>

                    <TeacherList
                        listTitle="Starred Teachers"
                        teachers={starredTeachers}
                        // teachers={sortedTeachers}
                        periods={data?.periods ?? []}
                        currPeriod={currPeriod}
                        dayIsOver={nextCurrPeriod === null}
                        starred={starredIds}
                        toggleStar={toggleTeacherStar}
                        minimalist={useMinimalistIcons}
                        hapticFeedback={useHapticFeedback}
                        reorderable
                        reorder={reorderStarredTeachers}
                    />

                    <TeacherList
                        listTitle="All Teachers"
                        teachers={sortedTeachers}
                        periods={data?.periods ?? []}
                        currPeriod={currPeriod}
                        dayIsOver={nextCurrPeriod === null}
                        starred={starredIds}
                        toggleStar={toggleTeacherStar}
                        minimalist={useMinimalistIcons}
                        hapticFeedback={useHapticFeedback}
                    />

                    {sortedTeachers.length === 0 && (
                        <View className="flex-1 justify-center align-middle mt-44">
                            <Text className="text-red-500 text-center text-xl mx-3 mt-6 mb-3 font-bold">
                                No Teachers Found :&#x28;
                            </Text>
                            <Text className="text-white font-semibold text-center text-sm mx-3">
                                Tip: Search by full name
                            </Text>
                        </View>
                    )}
                </ScrollViewContainer>
            </BottomSheetModalProvider>
        </SafeAreaView>
    );
}
