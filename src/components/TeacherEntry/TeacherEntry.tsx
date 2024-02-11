// Make JSX happy
import React from 'react';

// Components
import { View, Text, Pressable, ColorValue, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import AbsentIcon from './AbsentIcon';
import TeacherStatusSubtitle from './TeacherStatusSubtitle';
import TeacherBottomModal from '../TeacherBottomModal/TeacherBottomModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

// Types and utility functions
import ReactNativeHapticFeedback from 'react-native-haptic-feedback';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { Camelize } from '../../lib/utils';
import { TeacherEntryProps } from '../../lib/types/types';

// Hooks
import { useCallback, useRef } from 'react';
import { useBottomSheetModal } from '@gorhom/bottom-sheet';

// Styles
import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config';
import { camelize } from '../../lib/utils';

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
    let defaults = ['red', 'amber', 'lime', 'gray', 'black', 'yellow'];
    if (fullConfig && fullConfig.theme && fullConfig.theme.colors) {
        for (let i = 0; i < colors.length; i++) {
            const configColor =
                fullConfig.theme.colors[colors[i]] ??
                fullConfig.theme.colors[defaults[i]];

            const actualConfigColor =
                typeof configColor === 'string'
                    ? configColor
                    : (configColor['600'] as ColorValue);

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
    'partial-orange',
    'present-green',
    'default-gray',
    'ebony',
    'starred-yellow',
]);

function useBottomSheetModalWithCatch() {
    try {
        return useBottomSheetModal();
    } catch {
        return { dismissAll: () => {}, dismiss: () => {} };
    }
}

export default function TeacherEntry(props: TeacherEntryProps) {
    let useMinimalistMode = props.minimalist;

    const { dismissAll } = useBottomSheetModalWithCatch();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const handlePresentModalPress = useCallback(() => {
        if (props.disableInteraction) return;
        dismissAll();
        bottomSheetModalRef.current?.present();
    }, [dismissAll, props.disableInteraction]);

    const starred = props.starred;
    const { id } = props.teacher;
    let name = props.teacher.displayName;
    const toggleStar = props.setStar;

    // could make haptics a little less powerful if it's too much
    const toggle = useCallback(() => {
        if (props.disableInteraction) return;

        toggleStar(id);
        if (props.hapticfeedback) {
            ReactNativeHapticFeedback.trigger('impactHeavy', HAPTIC_OPTIONS);
        }
    }, [id, props.hapticfeedback, props.disableInteraction, toggleStar]);

    return (
        <GestureHandlerRootView className="flex-1" id={id}>
            <Pressable
                disabled={props.disableInteraction}
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
                                    periods={props.periods}
                                />
                            </View>
                        </View>
                    </View>
                    <View className="flex flex-row space-x-2">
                        <Pressable
                            disabled={props.disableInteraction}
                            onPress={toggle}
                            hitSlop={2}
                            className="my-auto">
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
                        <View className="my-auto">
                            <Icon
                                name="chevron-forward-outline"
                                size={21}
                                color="rgb(121 120 129)"
                            />
                        </View>
                    </View>
                </View>
            </Pressable>
            {!props.disableInteraction && Platform.OS !== 'web' && (
                <TeacherBottomModal
                    modalRef={bottomSheetModalRef}
                    teacher={props.teacher}
                    status={props.absent}
                    periods={props.periods}
                    starred={props.starred}
                    toggleStar={toggle}
                />
            )}
        </GestureHandlerRootView>
    );
}
