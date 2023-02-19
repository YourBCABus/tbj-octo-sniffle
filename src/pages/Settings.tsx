import { useCallback, useEffect, useState } from "react";
import { Switch, Text, View } from "react-native";
import SettingEntry from "../components/SettingEntry/SettingEntry";
import { Setting } from "../lib/types";
import { initialSettingsLoad, updateSettingStorage } from "../lib/storage/SettingStorage";

export default function Settings() {
    const [settings, setSettingValue] = useState(new Array<Setting>);
    useEffect(
        () => {
            initialSettingsLoad()
                .then((userSettings) => setSettingValue(userSettings) )},
        [setSettingValue]
    );
    
    const toggleSettingValue = useCallback(
        (id: string) => updateSettingStorage(setSettingValue, id),
        [setSettingValue],
    );
    
    return (
        <View className="flex-1 items-center justify-center bg-ebony space-y-5">
            {
                settings.map((setting) => {
                    return (
                        <SettingEntry 
                            key={setting.id}
                            setting={setting}
                            setValue={ toggleSettingValue }  />
                    )
                })
            }
            <Text className="text-gray-300 absolute bottom-10 text-center">© Yenowa</Text>  
        </View>
    )
}