import { View, Text, Pressable, ColorValue } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { TeacherEntryProps } from '../../lib/types/types';
import React, { useCallback, useMemo, useRef } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
    BottomSheetModal,
    useBottomSheetModal,
    BottomSheetBackdrop,
} from '@gorhom/bottom-sheet';

import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config';
import { Camelize, camelize } from '../../lib/utils';
import AbsentIcon from './AbsentIcon';
import TeacherStatusSubtitle from './TeacherStatusSubtitle';

const fullConfig = resolveConfig(tailwindConfig);

const STAR_SIZE = 30;

const HAPTIC_OPTIONS = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false,
};

function validateColors<T extends string>(
    colors: T[],
): Record<Camelize<T>, ColorValue> {
    let validColors: ColorValue[] = [];
    let defaults = ['red', 'lime', 'gray', 'black', 'yellow'];
    if (fullConfig && fullConfig.theme && fullConfig.theme.colors) {
        for (let i = 0; i < colors.length; i++) {
            const configColor =
                fullConfig.theme.colors[colors[i]] ??
                fullConfig.theme.colors[defaults[i]];

            // console.log(configColor);

            const actualConfigColor =
                typeof configColor === 'string'
                    ? configColor
                    : (configColor['600'] as ColorValue);

            console.log(actualConfigColor);
            validColors.push(actualConfigColor);
        }
    } else {
        validColors = defaults as ColorValue[];
    }

    return Object.fromEntries(
        colors.map((color, i) => [camelize(color), validColors[i]] as const),
    ) as Record<Camelize<T>, ColorValue>;
}

// hack right now, if you need a color in this file from the
// tailwindconfig just add to this and access its location in the array
export const colors = validateColors([
    'absent-red',
    'present-green',
    'default-gray',
    'ebony',
    'starred-yellow',
]);

type BackdropProps = JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps;

export default function TeacherEntry(props: TeacherEntryProps) {
    let useMinimalistMode = props.minimalist;

    const { dismissAll } = useBottomSheetModal();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['45%'], []);

    const handlePresentModalPress = useCallback(() => {
        dismissAll();
        bottomSheetModalRef.current?.present();
    }, [dismissAll]);

    const renderBackdrop = useCallback(
        (backdropProps: BackdropProps) => (
            <BottomSheetBackdrop
                {...backdropProps}
                disappearsOnIndex={-1}
                appearsOnIndex={0}
            />
        ),
        [],
    );

    const starred = props.starred;
    const { id } = props.teacher;
    let name = props.teacher.displayName;
    const toggleStar = props.setStar;

    // could make haptics a little less powerful if it's too much
    const toggle = useCallback(() => {
        toggleStar(id);
        if (props.hapticfeedback) {
            ReactNativeHapticFeedback.trigger('impactHeavy', HAPTIC_OPTIONS);
        }
    }, [id, props.hapticfeedback, toggleStar]);

    return (
        <GestureHandlerRootView className="flex-1" id={id}>
            <View className="flex flex-row p-2 m-2 pl-0 justify-between">
                <View className="flex flex-row space-x-3 my-auto h-10">
                    <View className="my-auto">
                        <AbsentIcon
                            status={props.absent}
                            useMinimalistIcons={useMinimalistMode}
                        />
                    </View>
                    <View className="flex flex-col">
                        <Text className="text-zinc-100 font-normal my-auto text-lg">
                            {name}
                        </Text>
                        <View className="flex flex-row">
                            <TeacherStatusSubtitle
                                teacher={props.teacher}
                                status={props.absent}
                                periods={props.periods}/>
                        </View>
                    </View>
                </View>
                <View className="flex flex-row space-x-2">
                    <Pressable onPress={toggle} hitSlop={2} className="my-auto">
                        {starred ? (
                            <Icon
                                name="star"
                                size={STAR_SIZE}
                                color="#9898f5"
                            />
                        ) : (
                            <Icon
                                name="star-outline"
                                size={STAR_SIZE}
                                color="#9898f5"
                            />
                        )}
                    </Pressable>
                    <Pressable
                        className="my-auto"
                        hitSlop={1}
                        onPress={() => {
                            handlePresentModalPress();
                            if (props.hapticfeedback) {
                                ReactNativeHapticFeedback.trigger(
                                    'impactHeavy',
                                    HAPTIC_OPTIONS,
                                );
                            }
                        }}>
                        <View className="pt-1">
                            <Icon
                                name="chevron-forward-outline"
                                size={21}
                                color="rgb(63 63 70)"
                            />
                        </View>
                    </Pressable>
                </View>
            </View>
            <BottomSheetModal
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: 'rgb(9 9 11)' }}
                handleIndicatorStyle={{ backgroundColor: 'white' }}
                enableOverDrag={true}
                backdropComponent={renderBackdrop}>
                <View className="flex h-full bg-zinc-950 align-middle">
                    <View className="flex flex-row mt-2">
                        <Text className="text-[#9898f5] text-center w-full text-xl">
                            {name}
                        </Text>
                    </View>
                    {/* <Text className="text-white">13lkfjdaf</Text> */}
                    {/* { renderModalBody(props) } */}
                </View>
            </BottomSheetModal>
        </GestureHandlerRootView>
    )

}