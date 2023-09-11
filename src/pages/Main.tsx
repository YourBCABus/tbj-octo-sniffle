import { Platform, ActivityIndicator, SafeAreaView, TextInput, Text, View, Pressable, ScrollView, RefreshControl, Alert } from "react-native";
import TeacherEntry from "../components/TeacherEntry/TeacherEntry";
import { useState, useCallback, useEffect, useMemo } from "react";
import Icon from 'react-native-vector-icons/Ionicons';

import { AbsenceState, Period, Teacher } from '../lib/types/types'
import { initialIdLoad, updateTeacherStarStorage, validateIDs } from "../lib/storage/StarredTeacherStorage";

import { useQuery } from '@apollo/client';
import { GET_ALL_TEACHERS_PERIODS } from '../lib/graphql/Queries';
import { getCurrentPeriod } from "../lib/time";

import Fuse from 'fuse.js'
import { getSettingState, validateSettings } from "../lib/storage/SettingStorage";
import { useFocusEffect } from "@react-navigation/native";

import messaging from '@react-native-firebase/messaging';

import { requestUserPermission } from "../lib/notifications/Notification";

import {
    BottomSheetModalProvider,
  } from '@gorhom/bottom-sheet';

const SUBHEADER = 'text-zinc-600 font-medium pl-2 text-sm'

// need to do this because of weird stuff on android devices with notches unfortunately
const SUCCESSFUL_SAFE_AREA_VIEW_STYLE = Platform.OS === 'android' ? "flex-1 bg-[#0b0b0e] pt-8" : "flex-1 bg-[#0b0b0e]"

function getAbsenceState(teacher: Teacher, curPeriod: Period | null): AbsenceState {
    // console.log("Teacher: ", teacher);
    // console.log("Period: ", curPeriod);
    if(teacher.fullyAbsent) return AbsenceState.ABSENT_ALL_DAY;
    if(teacher.absence.some((periodId) => periodId === curPeriod?.id)) return AbsenceState.ABSENT;
    if(curPeriod === null || curPeriod === undefined) return AbsenceState.NO_PERIOD;
    
    return AbsenceState.PRESENT;
}

export default function Main({navigation}: any) {
    const [ refreshing, setRefreshing ] = useState(false);
    const [ useMinimalistIcons, setUseMinimalistIcons ] = useState(false);
    const [ useHapticFeedback, setUseHapticFeedback ] = useState(true);

    useFocusEffect(
        useCallback(() => {
            let isActive = true;
            const validate = async () => {
                try {
                    if(isActive) {
                        validateSettings();
                    }
                } catch (e) {
                    console.log(e);
                }
            }

            validate();

            return () => {
                isActive = false;
            }
        }, []));

    useFocusEffect(
        useCallback(() => {
            let isActive = true;

            const getTeacherSettings = async () => {
            try {
                const state = await getSettingState('minimalist');
                const hapticState = await getSettingState('hapticfeedback');

                if (isActive) {
                    setUseMinimalistIcons(state);
                    setUseHapticFeedback(hapticState);
                }
                } catch (e) {
                    console.log(e);
                }
            };
        
            getTeacherSettings();
        
            return () => {
                isActive = false;
            };
        }, [useMinimalistIcons, useHapticFeedback])
      );
    
    useFocusEffect(
        useCallback(() => {
            const reqUserPerms = async () => {
                try {
                    await requestUserPermission();
                } catch (e) {
                    console.log(e);
                }
            }

            reqUserPerms();
        }, [])
    )

    // TODO --> Potentially tell users to keep Background App Refresh mode on for best performance on iOS
    useEffect(() => {
        const unsubscribe = messaging().onMessage(async remoteMessage => {
          Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
        });
    
        return unsubscribe;
      }, []);
    
    const { data, loading, error, refetch } = useQuery( GET_ALL_TEACHERS_PERIODS, {
        pollInterval: 30000,
        onError: (error) => {
            console.log(error);
        }    
    } );

    const [search, updateSearch] = useState('');

    const refreshFn = useCallback(() => {
        setRefreshing(true);
        refetch()
            .then(() => setRefreshing(false))
            .catch((e) => {
                console.log(e);
                setRefreshing(false);
            });
    }, [setRefreshing, refetch]);


    useEffect(() => {
        if(data !== undefined) {
            validateIDs(setStarredTeachers, data.teachers);
        }
    }, [data]);

    const [starredTeachers, setStarredTeachers] = useState(new Set<string>());
    const [teachers, setTeachers] = useState<Teacher[]>([]);
    const [sortedTeachers, setSortedTeachers] = useState(teachers);
    
    useEffect(
        () => { initialIdLoad()
            .then((value) => setStarredTeachers(value)) },
        [setStarredTeachers]
    );

    const toggleTeacherStarState = useCallback(
        (id: string) => updateTeacherStarStorage(setStarredTeachers, id),
        [setStarredTeachers],
    );
    
    const [curPeriod, setCurPeriod] = useState(getCurrentPeriod(data?.periods));
    useEffect(() => {
        setCurPeriod(getCurrentPeriod(data?.periods));
        const interval = setInterval(() => {
            setCurPeriod(getCurrentPeriod(data?.periods));
        }, 10000);
        return () => clearInterval(interval);
    }, [data?.periods]);


    useEffect(() => {
        let teachers : Teacher[] = [];
        if(data) {
            teachers = data.teachers.map( (teacher: Teacher) => {
                return {
                    id: teacher.id,
                    displayName: teacher.name.normal,
                    name: {
                        honorific: teacher.name.honorific,
                        first: teacher.name.first,
                        middles: teacher.name.middles,
                        last: teacher.name.last,
                        full: teacher.name.full,
                        firstLast: teacher.name.firstLast,
                        normal: teacher.name.normal
                    },
                    pronouns: {
                        sub: teacher.pronouns.sub,
                        subject: teacher.pronouns.subject,
                        obj: teacher.pronouns.obj,
                        object: teacher.pronouns.object,
                        posAdj: teacher.pronouns.posAdj,
                        possAdjective: teacher.pronouns.possAdjective,
                        posPro: teacher.pronouns.posPro,
                        possPronoun: teacher.pronouns.possPronoun,
                        refx: teacher.pronouns.refx,
                        reflexive: teacher.pronouns.reflexive,
                        grammPlu: teacher.pronouns.grammPlu,
                        grammaticallyPlural: teacher.pronouns.grammaticallyPlural,
                        setStr: teacher.pronouns.setStr,
                    },
                    absence: teacher.absence.map((absenceResult: any) => absenceResult.id) ?? [],
                    fullyAbsent: teacher.fullyAbsent,
                }
            })
        }
        setTeachers(teachers);
    }, [data])

    const fuse = new Fuse(teachers, {
        keys: ['displayName'],
        threshold: 0.4,
        findAllMatches: true,
    });

    useEffect(() => {
        if(data) {
            let resultedTeachers = search !== '' ? fuse.search(search).map((result) => result.item) : teachers;
            
            // names are sorted only by last name
            const newSorted = resultedTeachers.sort((a, b) => {
                return a.name.last.localeCompare(b.name.last)
            });
            setSortedTeachers(newSorted);
        }
    }, [data, search, starredTeachers])

    // as of right now, if it ever fails fetching the data, this gets rendered until data successfully is returned
    if(error) {
        return (
            <SafeAreaView className="flex-1 bg-zinc-950 justify-center align-middle">
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} refreshControl={ <RefreshControl colors={["white"]} tintColor={"white"} refreshing={ refreshing } onRefresh={ refreshFn } /> } >
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
        )
    }
    
    if(loading) {
        return (
            <SafeAreaView className="flex-1 bg-zinc-950 justify-center align-middle">
                <ActivityIndicator size="large" color="white" />
            </SafeAreaView>
        )
    }
   
    return (
        <SafeAreaView className={SUCCESSFUL_SAFE_AREA_VIEW_STYLE}>
                <BottomSheetModalProvider>
                <View className="flex flex-row justify-between pb-4 px-3 mt-2">
                    <Text className="text-[#9898f5] font-bold text-3xl">
                        TableJet
                    </Text>
                    <View>
                        <Pressable onPressIn={ () => navigation.navigate('Settings') } hitSlop={3}>
                            <Icon name="cog" size={35} color="rgb(250 250 250)" />
                        </Pressable>
                    </View>
                </View>

                {/* TODO - add popup at bottom to indicate failed to load if request failed but there are already things in cache */}
                <ScrollView refreshControl={ <RefreshControl colors={["rgb(250 250 250)"]} tintColor={"rgb(250 250 250)"} refreshing={ refreshing } onRefresh={ refreshFn } /> }>
                    <View className="flex flex-row  mx-2 border-w border-b border-zinc-600">
                        <View className="text-center my-auto ml-3">
                            <Icon name="search" size={25} color="rgb(82 82 91)" />
                        </View>
                        <TextInput 
                            className="ml-2 mr-5 my-2 p-2 pr-8"
                            onChangeText={text => updateSearch(text)}
                            value={search}
                            placeholderTextColor={"rgb(82 82 91)"}
                            style={{ color: 'rgb(228 228 231)'}}
                            placeholder="Search for a teacher"
                            autoComplete="off"
                            keyboardType="default" />
                    </View>
                    <View>
                        <Text className="text-zinc-100 text-center text-xl mx-3 my-5 font-bold">
                            { 
                                (curPeriod === undefined || curPeriod === null) ? "No Current Period" : curPeriod.name
                            }
                        </Text>
                    </View>
                    
                    {
                        sortedTeachers.filter((teacher) => starredTeachers.has(teacher.id)).length > 0 ? (
                            <View className="mt-1 pt-2 border-t border-zinc-600">
                                <Text className={SUBHEADER}> Starred Teachers </Text>
                            </View>
                        ) : null
                    }
                    {
                        sortedTeachers.filter((teacher) => starredTeachers.has(teacher.id))
                            .map((teacher, idx) => {
                                return (
                                    <TeacherEntry
                                        key={ teacher.id }
                                        teacher={ teacher }
                                        starred={ true }
                                        setStar={ toggleTeacherStarState }
                                        minimalist={ useMinimalistIcons } 
                                        absent={ getAbsenceState(teacher, curPeriod) }
                                        hapticfeedback={ useHapticFeedback }
                                        idx={ idx } />
                                )
                            })
                    }

                    {
                        sortedTeachers.length > 0 ? (
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
                        )
                    }

                    {
                        sortedTeachers
                            .map((teacher, idx) => {
                                return (
                                    <TeacherEntry
                                        key={ teacher.id }
                                        teacher={ teacher }
                                        starred={ starredTeachers.has(teacher.id) }
                                        setStar={ toggleTeacherStarState} 
                                        minimalist={ useMinimalistIcons }
                                        absent={ getAbsenceState(teacher, curPeriod) }
                                        hapticfeedback={ useHapticFeedback }
                                        idx={ idx } />
                                )
                            })
                    }
                </ScrollView>
            </BottomSheetModalProvider>
        </SafeAreaView>
    )
}