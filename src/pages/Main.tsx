import { Button, ActivityIndicator, SafeAreaView, TextInput, Text, View, Pressable, ScrollView, RefreshControl } from "react-native";
import TeacherEntry from "../components/TeacherEntry/TeacherEntry";
import { useState, useCallback, useEffect } from "react";
import Icon from 'react-native-vector-icons/Ionicons';

import { Teacher } from '../lib/types'
import { initialLoad, update, validateIDs } from "../lib/storage";

import { useQuery } from '@apollo/client';
import { GET_ALL_TEACHERS } from '../lib/graphql/Queries';

const SUBHEADER = 'text-purple-300 italic pl-2 text-lg'

export default function Main({navigation}: any) {
    const [refreshing, setRefreshing] = useState(false);


    const { data, loading, error, refetch } = useQuery( GET_ALL_TEACHERS, {
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
        () => { initialLoad()
            .then((value) => setStarredTeachers(value)) },
        [setStarredTeachers]
    );

    const toggleTeacherStarState = useCallback(
        (id: string) => update(setStarredTeachers, id),
        [setStarredTeachers],
    );

    if(error) {
        return (
            <SafeAreaView className="flex-1 bg-ebony justify-center align-middle">
                <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}refreshControl={ <RefreshControl refreshing={ refreshing } onRefresh={ refreshFn } /> } >
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
        }
    })

    return (
        <SafeAreaView className="flex-1 bg-ebony">
            <View className="flex flex-row justify-between pb-4 px-3 mt-3">
                <Text className="text-white font-bold text-2xl">
                    TableJet
                </Text>
                <View>
                    <Pressable onPressIn={ () => navigation.navigate('Settings') } hitSlop={3}>
                        <Icon name="cog" size={30} color="white" />
                    </Pressable>
                </View>
            </View>

            <View className="flex flex-row border border-gray-300 mx-2">
                <View className="text-center my-auto ml-3">
                    <Icon name="search" size={25} color="gray" />
                </View>
                <TextInput 
                    className="text-white ml-2 mr-5 my-2 p-2 pr-8 "
                    onChangeText={text => updateSearch(text)}
                    value={search}
                    placeholder="Search for a teacher..."
                    autoComplete="off"
                    keyboardType="default" />
            </View>
            {/* TODO - add popup at bottom to indicate failed to load if request failed but there are already things in cache */}
            <ScrollView refreshControl={ <RefreshControl refreshing={ refreshing } onRefresh={ refreshFn } /> }>
                {
                    starredTeachers.size > 0 ? (
                        <View className="pt-2 border-t border-purple-500/30">
                            <Text className={SUBHEADER}> Starred Teachers </Text>
                            {
                                teachers
                                    .filter((teacher) => starredTeachers.has(teacher.id))
                                    .map((teacher, idx) => {
                                        return (
                                            <TeacherEntry
                                                key={teacher.id}
                                                teacher={ teacher }
                                                starred={ true }
                                                setStar={toggleTeacherStarState} idx={idx} />
                                        )
                                    })
                            }
                        </View>
                    ) : null
                }
                <View className="mb-6 pt-2 border-t border-purple-500/30">
                    <Text className={SUBHEADER}> All Teachers </Text>
                    {
                        teachers
                            .map((teacher, idx) => {
                                return (
                                    <TeacherEntry
                                        key={ teacher.id }
                                        teacher={ teacher }
                                        starred={ starredTeachers.has(teacher.id) }
                                        setStar={toggleTeacherStarState} idx={idx} />
                                )
                            })
                    }
                </View>
                <View className="mb-5">
                    <Button
                        title="Go Back"
                        onPress={() =>
                            navigation.reset({
                                index: 0,
                                routes: [{ name: 'Landing' }],
                            })
                        }
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}