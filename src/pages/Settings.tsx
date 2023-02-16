import { useState } from "react";
import { Switch, Text, View } from "react-native";

const switchDescriptions = [
    {
        description: 'Show Absences',
        id: 0,
    },
    {
        description: 'Show Tardies',
        id: 1,
    },
    {
        description: 'Show Subs',
        id: 2,
    },
    {
        description: 'Show Notes',
        id: 3,
    },
    {
        description: 'Show Teacher Notes',
        id: 4,
    }
]


export default function Settings() {
    const [switches, setToggleSwitch] = useState(Array(switchDescriptions.length).fill(false));

    function toggleSwitch(idx : Number) {
        return switches.map((curswitch, i) => { return i === idx ? !curswitch : curswitch })
    }
    
    const isEnabled = (idx: number) => { return switches[idx] };
    
    return (
        <View className="flex-1 items-center justify-center bg-ebony space-y-5">
            {
                switchDescriptions.map((description, idx) => {
                    return (
                        <View className="flex flex-row justify-around w-screen px-4">
                            <Switch
                                trackColor={{false: 'gray', true: 'green'}}
                                thumbColor={isEnabled(idx) ? 'lime' : 'gray'}
                                onValueChange={ () => setToggleSwitch(toggleSwitch(idx)) }
                                value={isEnabled(idx)}
                                className="scale-7 my-auto"
                            />
                            <Text className="text-white text-left my-auto text-md pl-12 w-1/2">
                                {description.description}
                            </Text>
                        </View>
                    )
                })
            }  
        </View>
    )
}