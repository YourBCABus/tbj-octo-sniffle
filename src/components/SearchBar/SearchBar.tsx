import React from 'react';
import { TextInput, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface SearchBarProps {
    search: string;
    setSearch: (newValue: string) => void;
}

export default function SearchBar({
    search,
    setSearch,
}: SearchBarProps): JSX.Element {
    return (
        <View className="flex flex-row  mx-2 border-w border-b border-zinc-600">
            <View className="text-center my-auto ml-3">
                <Icon name="search" size={25} color="rgb(82 82 91)" />
            </View>
            <TextInput
                className="ml-2 mr-5 my-2 p-2 pr-8"
                onChangeText={text => setSearch(text)}
                value={search}
                placeholderTextColor="rgb(82 82 91)"
                style={{ color: 'rgb(228 228 231)' }}
                placeholder="Search for a teacher"
                autoComplete="off"
                keyboardType="default"
            />
        </View>
    );
}
