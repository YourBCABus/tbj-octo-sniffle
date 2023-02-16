import { Button, FlatList, SafeAreaView, TextInput, Text, View, Pressable } from "react-native";
import TeacherEntry from "../components/TeacherEntry/TeacherEntry";
import { useState } from "react";

import Icon from 'react-native-vector-icons/Ionicons';

const STARRED_TEACHERS = [
    {
        id: 'fghj',
        name: 'Papaya Lemon',
    }
]

const TEACHERS = [
    {
      id: 'fghj',
      name: 'Skyler Calaman',
    },
    {
      id: 'rtyu',
      name: 'Yusuf Sallam',
    },
    {
      id: 'qwer',
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
    return (
        <SafeAreaView className="flex-1 bg-ebony pt-3">
            <View className="flex flex-row justify-between pb-4 px-3">
                <Text className="text-white font-bold text-2xl">
                    YourBCATeacher
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
            <View className="h-2/3">
                {
                    STARRED_TEACHERS.length > 0 ? (
                        <View className="pt-2 border-t border-purple-500/30">
                            <Text className={SUBHEADER}> Starred Teachers </Text>
                            <FlatList
                                data={STARRED_TEACHERS}
                                keyExtractor={teacher => teacher.id}
                                renderItem={({item}) => <TeacherEntry name={item.name} id={item.id} starred={true} />}
                            />
                        </View>
                    ) : null
                }
                <View className="mb-6 pt-2 border-t border-purple-500/30">
                    <Text className={SUBHEADER}> All Teachers </Text>
                    <FlatList
                        data={TEACHERS}
                        keyExtractor={teacher => teacher.id}
                        renderItem={({item}) => <TeacherEntry name={item.name} id={item.id} starred={false}/>}
                    />

                </View>
            </View>
            <View className="text-center absolute bottom-10 w-full">
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
            <View className="absolute bottom-5 w-full">
                <Text className="text-gray-300 text-center">© Yenowa</Text>
            </View>
        </SafeAreaView>
    )
}