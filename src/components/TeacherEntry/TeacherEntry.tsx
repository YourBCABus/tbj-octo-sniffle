import { View, Text, Pressable, ColorValue } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { AbsenceState, TeacherEntryProps } from '../../lib/types';
import { useCallback } from 'react';

const STAR_SIZE = 25;

function getCorrectColor(status: AbsenceState): ColorValue {
    switch (status) {
        case AbsenceState.ABSENT:
            return "red"
        case AbsenceState.PRESENT:
            return "green";
        default:
            return "gray";
    }
}

export default function TeacherEntry(props: TeacherEntryProps) {
    const starred = props.starred;
    const { id, name } = props.teacher;
    const toggleStar = props.setStar;
    
    const toggle = useCallback(() => toggleStar(id), [id]);

    return (
        <View className="flex flex-row p-2 m-2 justify-between" id={id}>
            <Pressable onPress={ toggle } hitSlop={2}>
                {
                starred ? 
                (
                    <Icon name="star" size={STAR_SIZE} color="yellow" />
                ) :
                (
                    <Icon name="star-outline" size={STAR_SIZE} color="gray" />
                )
                }
            </Pressable>
            <View className="flex flex-row space-x-3 my-auto">
                {
                starred ? 
                    (
                        <Text className="text-yellow-400 my-auto">* {name}</Text>
                    ) : 
                    (
                        <Text className="text-white my-auto">{name}</Text>
                    )
                }

                <View className="my-auto">
                    {
                        <Icon color={getCorrectColor(props.absent)} name="ellipse"></Icon>
                    }
                </View>
            </View>
        </View>
    )

}