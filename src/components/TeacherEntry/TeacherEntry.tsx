import { View, Text } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';

interface TeacherEntryProps {
    name: string
    id: string
    starred: boolean
}

const STAR_SIZE = 25;

export default function TeacherEntry(props: TeacherEntryProps) {
    return (
        <View className="flex flex-row p-2 m-2 justify-between">
            <View className="">
                {
                props.starred ? 
                (
                    <Icon name="star" size={STAR_SIZE} color="yellow" />
                ) :
                (
                    <Icon name="star-outline" size={STAR_SIZE} color="gray" />
                )
                }
            </View>
            <View className="flex flex-row space-x-3 ">
                {
                    // TODO --> add star for starred teachers, make unstarred look nicer
                    props.starred ? 
                    (
                        <Text className="text-yellow-400 my-auto">* {props.name}</Text>
                    ) : 
                    (
                        <Text className="text-white my-auto">{props.name}</Text>
                    )
                }
                <Text className="text-white my-auto">{props.id}</Text>
            </View>
        </View>
    )

}