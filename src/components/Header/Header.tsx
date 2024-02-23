import React from 'react';
import { Pressable, Text, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface HeaderProps {
    navigation: any;
}

export default function Header({ navigation }: HeaderProps): JSX.Element {
    return (
        <View className="flex flex-row justify-between pb-4 px-3 mt-2">
            <Text className="text-[#9898f5] font-bold text-3xl">TableJet</Text>
            <View>
                <Pressable
                    onPressIn={() => navigation.navigate('TableJet - Settings')}
                    hitSlop={10}>
                    <Icon name="cog" size={40} color="rgb(250 250 250)" />
                </Pressable>
            </View>
        </View>
    );
}
