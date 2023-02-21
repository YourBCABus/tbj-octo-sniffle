import { Switch, Text, View } from "react-native";

import { SettingEntryProps } from "../../lib/types/types";
import { useCallback } from "react";

export default function SettingEntry(props: SettingEntryProps): JSX.Element {
    const { value, description, id } = props.setting
    const toggleSwitch = props.setValue
    const toggle = useCallback(() => toggleSwitch(id), [props.setting]);

    return (
        // could maybe make it so if enabled, the text is a brighter white or something
        <View className="flex flex-row justify-around py-2 my-3 bg-white/5 w-11/12 rounded-2xl" key={id}>
            <Text className="text-white text-left my-auto text-md w-2/3">
                { description }
            </Text>
            <Switch
                trackColor={{false: 'gray', true: 'green'}}
                thumbColor={value ? 'lime' : 'gray'}
                onValueChange={ toggle }
                value={ value }
                className="scale-7 my-auto"
            />
        </View>
    )
}