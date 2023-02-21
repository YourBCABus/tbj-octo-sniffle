import { View, Text, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { AbsenceState, TeacherEntryProps } from '../../lib/types/types';
import { useCallback } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'; 

const STAR_SIZE = 30;

const HAPTIC_OPTIONS = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false
  };

function getAbsentIcon(status: AbsenceState, useMinimalistIcons: boolean): JSX.Element {
    if(useMinimalistIcons) {
        switch (status) {
            case AbsenceState.ABSENT:
                return ( <Icon color="red" size={30} name="ellipse-outline"></Icon> );
            case AbsenceState.ABSENT_ALL_DAY:
                return ( <Icon color="maroon" size={30} name="close-circle-outline"></Icon> );
            case AbsenceState.PRESENT:
                return ( <Icon color="lime" size={30} name="ellipse-outline"></Icon> );
            default:
                return ( <Icon color="gray" size={30} name="ellipse-outline"></Icon> );
        }
    } else {
        switch (status) {
            case AbsenceState.ABSENT:
                return ( <Icon color="red" size={30} name="close-sharp"></Icon> );
            case AbsenceState.ABSENT_ALL_DAY:
                return ( <Icon color="maroon" size={30} name="close"></Icon> );
            case AbsenceState.PRESENT:
                return ( <Icon color="lime" size={30} name="checkmark-outline"></Icon> );
            default:
                return ( <Icon color="gray" size={30} name="ellipse"></Icon> );
        }
    }
}

export default function TeacherEntry(props: TeacherEntryProps) {
    let useMinimalistIcons = props.minimalist
    const starred = props.starred;
    const { id, name } = props.teacher;

    const toggleStar = props.setStar;
    
    // could make haptics a little less powerful if it's too much
    const toggle = useCallback(() => { 
            toggleStar(id); 
            if(props.hapticfeedback) {
                ReactNativeHapticFeedback.trigger("impactHeavy", HAPTIC_OPTIONS);
            }
        }, [id, props.hapticfeedback])

    return (
        <View className="flex flex-row p-2 m-2 pl-0 justify-between" id={id}>
            <View className="flex flex-row space-x-3 my-auto">
                <View className="my-auto">
                    {
                        getAbsentIcon(props.absent, useMinimalistIcons)
                    }
                </View>

                {
                starred ? 
                    (
                        <Text className="text-yellow-400 my-auto text-lg">{name}</Text>
                    ) : 
                    (
                        <Text className="text-white my-auto text-lg">{name}</Text>
                    )
                }
            </View>
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
        </View>
    )

}