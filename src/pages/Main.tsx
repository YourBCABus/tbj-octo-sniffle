import { Button, FlatList, SafeAreaView, TextInput, Text, View, Pressable, ScrollView } from "react-native";
import TeacherEntry from "../components/TeacherEntry/TeacherEntry";
import { useState, useCallback, useEffect } from "react";
import Icon from 'react-native-vector-icons/Ionicons';

import { Teacher } from '../lib/Types'
import { initialLoad, update } from "../lib/storage";

// should probably be a dictionary of some sorts
const TEACHERS : Teacher[] = [
    {
        id: 'a',
        name: 'Papaya Lemon',
    },
    {
        id: 'b',
        name: 'Skyler Calaman',
    },
    {
        id: 'c',
        name: 'Yusuf Sallam',
    },
    {
        id: 'd',
        name: 'Alice Zhang',
    },
    {
        id: 'asdf',
        name: 'Anthony Li',
    },
    {
        id: 'zxcv',
        name: 'Edward Feng',
    },
    {
        id: 'ae',
        name: 'Shahmeer Ali',
    },
    {
        id: 'w',
        name: 'Shahmeer Ali',
    },
    {
        id: 'e',
        name: 'Shahmeer Ali',
    },
    {
        id: 'are',
        name: 'Shahmeer Ali',
    },
    {
        id: 'grg',
        name: 'Shahmeer Ali',
    }
];

const SUBHEADER = 'text-purple-300 italic pl-2 text-lg'

export default function Main({navigation}: any) {
    const [search, updateSearch] = useState('');
    const [starredTeachers, setStarredTeachers] = useState(new Set<string>());
    const teachers = TEACHERS;
    useEffect(
        () => { initialLoad()
            .then((value) => setStarredTeachers(value)) },
        [setStarredTeachers]
    );

    // console.log({ starredTeachers });

    
    const toggleTeacherStarState = useCallback(
        (id: string) => update(setStarredTeachers, id),
        [setStarredTeachers],
    );


    return (
        <SafeAreaView className="flex-1 bg-ebony">
            <View className="flex flex-row justify-between pb-4 px-3 mt-3">
                <Text className="text-white font-bold text-2xl">
                    TableJet
                </Text>
                <View>
                    <Pressable onPressIn={ () => navigation.navigate('Settings') }>
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
            <ScrollView>
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