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
        <View className="flex flex-row  mx-2 border-w border-b border-zinc-aa-compliant">
            <View className="text-center my-auto ml-3">
                <Icon name="search" size={25} color="rgb(121 120 129)" />
            </View>
            <TextInput
                className="ml-2 mr-5 my-2 p-2 pr-8 text-[#e4e4e7]"
                onChangeText={text => setSearch(text)}
                value={search}
                placeholderTextColor="rgb(121 120 129)"
                placeholder="Search for a teacher"
                autoComplete="off"
                keyboardType="default"
            />
        </View>
    );
}
