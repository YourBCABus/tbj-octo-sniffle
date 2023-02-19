import { Button, ActivityIndicator, SafeAreaView, TextInput, Text, View, Pressable, ScrollView, RefreshControl } from "react-native";
import TeacherEntry from "../components/TeacherEntry/TeacherEntry";
import { useState, useCallback, useEffect, useMemo } from "react";
import Icon from 'react-native-vector-icons/Ionicons';

import { AbsenceState, Teacher } from '../lib/types'
import { initialIdLoad, updateTeacherStarStorage, validateIDs } from "../lib/storage/StarredTeacherStorage";

import { useQuery } from '@apollo/client';
import { GET_ALL_TEACHERS_PERIODS } from '../lib/graphql/Queries';
import { getCurrentPeriod } from "../lib/time";

import Fuse from 'fuse.js'
import { getSettingState, initialSettingsLoad } from "../lib/storage/SettingStorage";

const SUBHEADER = 'text-purple-300 font-medium pl-2 text-lg'

export default function Main({navigation}: any) {
    const [refreshing, setRefreshing] = useState(false);
    const [ useMinimalistIcons, setUseMinimalistIcons ] = useState(false);

    useEffect(() => {
        getSettingState('minimalist').then((value) => {
            console.log("got value");
            console.log(value);
            setUseMinimalistIcons(value)
        });
    }, [initialSettingsLoad()])

    const { data, loading, error, refetch } = useQuery( GET_ALL_TEACHERS_PERIODS, {
        pollInterval: 30000,
        onError: (error) => {
            console.log(error);
        }    
    } );

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
    
    const [search, updateSearch] = useState('');

    const [starredTeachers, setStarredTeachers] = useState(new Set<string>());
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

    // as of right now, if it ever fails fetching the data, this gets rendered until data successfully is returned
    if(error) {
        return (
            <SafeAreaView className="flex-1 bg-ebony justify-center align-middle">
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
            <SafeAreaView className="flex-1 bg-ebony justify-center align-middle">
                <ActivityIndicator size="large" color="white" />
            </SafeAreaView>
        )
    }
    
    const teachers : Teacher[] = data.teachers.map( (teacher : Teacher) => {
        return {
            id: teacher.id,
            name: teacher.name,
            absenceState: teacher.absenceState,
        }
    })

    const fuse = new Fuse(teachers, {
        keys: ['name'],
        threshold: 0.4,
        findAllMatches: true,
    });

    let resultedTeachers = search !== '' ? fuse.search(search).map((result) => {
        return {
            id: result.item.id,
            name: result.item.name,
            AbsenceState: result.item.absenceState,
        }
    }) : teachers;
    
    const sortedTeachers = resultedTeachers.sort((a, b) => a.name.localeCompare(b.name));
    const starredInSearch = (sortedTeachers as Teacher[]).filter((teacher) => starredTeachers.has(teacher.id));

    return (
        <SafeAreaView className="flex-1 bg-ebony">
            <View className="flex flex-row justify-between pb-4 px-3 mt-2">
                <Text className="text-white font-bold text-2xl">
                    TableJet
                </Text>
                <View>
                    <Pressable onPressIn={ () => navigation.navigate('Settings') } hitSlop={3}>
                        <Icon name="cog" size={30} color="white" />
                    </Pressable>
                </View>
            </View>

            {/* TODO - add popup at bottom to indicate failed to load if request failed but there are already things in cache */}
            <ScrollView refreshControl={ <RefreshControl colors={["white"]} tintColor={"white"} refreshing={ refreshing } onRefresh={ refreshFn } /> }>
                <View className="flex flex-row  mx-2 border-w border-b border-gray-300">
                    <View className="text-center my-auto ml-3">
                        <Icon name="search" size={25} color="gray" />
                    </View>
                    <TextInput 
                        className="ml-2 mr-5 my-2 p-2 pr-8 "
                        onChangeText={text => updateSearch(text)}
                        value={search}
                        placeholderTextColor={"white"}
                        style={{ color: 'white'}}
                        placeholder="Search for a teacher..."
                        autoComplete="off"
                        keyboardType="default" />
                </View>
                <View>
                    <Text className="text-white text-center text-xl mx-3 my-5 font-bold">
                        { 
                            (curPeriod === undefined || curPeriod === null) ? "No Current Period" : curPeriod.name
                        }
                    </Text>
                </View>
                {
                    (starredInSearch.length > 0)? (
                        <View className="pt-2 border-t border-purple-500/30">
                            <Text className={SUBHEADER}> Starred Teachers </Text>
                            {
                                (sortedTeachers as Teacher[])
                                    .filter((teacher) => starredTeachers.has(teacher.id))
                                    .map((teacher: Teacher, idx: Number) => {
                                        let isAbsentThisPeriod : AbsenceState;
                                        let absentIds = curPeriod?.teachersAbsent.map((teacher) => teacher.id )
                                    
                                        if(curPeriod === null || curPeriod === undefined) {
                                            isAbsentThisPeriod = AbsenceState.NO_PERIOD;
                                        } else if ( absentIds?.includes( teacher.id ) ) {
                                            isAbsentThisPeriod = AbsenceState.ABSENT;
                                        } else {
                                            isAbsentThisPeriod = AbsenceState.PRESENT;
                                        }
                                        
                                        return (
                                            <TeacherEntry
                                                key={teacher.id}
                                                teacher={ teacher }
                                                starred={ true }
                                                setStar={toggleTeacherStarState}
                                                minimalist={ useMinimalistIcons } 
                                                absent={ isAbsentThisPeriod }
                                                idx={idx} />
                                        )
                                    })
                            }
                        </View>
                    ) : null
                }
                {
                sortedTeachers.length > 0 ? 
                    (
                    <View className="mb-6 pt-2 border-t border-purple-500/30">
                        <Text className={SUBHEADER}> All Teachers </Text>
                        {
                            sortedTeachers
                                .map((teacher, idx) => {
                                    let isAbsentThisPeriod : AbsenceState;
                                    let absentIds = curPeriod?.teachersAbsent.map((teacher) => teacher.id )
                                
                                    if(curPeriod === null || curPeriod === undefined) {
                                        isAbsentThisPeriod = AbsenceState.NO_PERIOD;
                                    } else if ( absentIds?.includes( teacher.id ) ) {
                                        isAbsentThisPeriod = AbsenceState.ABSENT;
                                    } else {
                                        isAbsentThisPeriod = AbsenceState.PRESENT;
                                    }

                                    return (
                                        <TeacherEntry
                                            key={ teacher.id }
                                            teacher={ teacher as Teacher }
                                            starred={ starredTeachers.has(teacher.id) }
                                            setStar={ toggleTeacherStarState} 
                                            minimalist={ useMinimalistIcons }
                                            absent={ isAbsentThisPeriod }
                                            idx={idx} />
                                    )
                                })
                        }
                    </View>
                ) : (
                    <View className="flex-1 justify-center align-middle">
                        <Text className="text-white text-center text-xl mx-3 my-3 font-bold">
                            No teachers found :&#x28;
                        </Text>
                    </View>
                )
                }
            </ScrollView>
        </SafeAreaView>
    )
}