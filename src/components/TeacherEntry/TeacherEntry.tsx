// Make JSX happy
import React from 'react';

// Components
import { View, Text, Pressable, ColorValue, Platform } from 'react-native';
import AbsentIcon from './AbsentIcon';
import TeacherStatusSubtitle from './TeacherStatusSubtitle';
import TeacherBottomModal from '../TeacherBottomModal/TeacherBottomModal';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { RightIconBar } from './Icons';

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

const TeacherEntry = React.memo(function TeacherEntry({
    absent,
    teacher,
    periods,
    toggleStar,
    starred,
    minimalist,
    hapticfeedback,
    disableInteraction,
    draggable,
    useActivateDrag,
}: TeacherEntryProps) {
    const { dismissAll } = useBottomSheetModalWithCatch();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const handlePresentModalPress = useCallback(() => {
        if (disableInteraction) {
            return;
        }

        dismissAll();
        bottomSheetModalRef.current?.present();
    }, [dismissAll, disableInteraction]);

    const onLongPress = useActivateDrag(!!draggable);

    const { id } = teacher;
    let name = teacher.displayName;

    // could make haptics a little less powerful if it's too much
    const toggle = useCallback(() => {
        if (disableInteraction) {
            return;
        }

        toggleStar(id);
        if (hapticfeedback) {
            ReactNativeHapticFeedback.trigger('impactHeavy', HAPTIC_OPTIONS);
        }
    }, [id, hapticfeedback, disableInteraction, toggleStar]);

    const presentModalPress = useCallback(() => {
        handlePresentModalPress();
        if (hapticfeedback) {
            ReactNativeHapticFeedback.trigger('impactHeavy', HAPTIC_OPTIONS);
        }
    }, [handlePresentModalPress, hapticfeedback]);

    return (
        <GestureHandlerRootView className="flex-1" id={id}>
            <Pressable
                disabled={disableInteraction}
                className="my-auto"
                hitSlop={1}
                onPress={presentModalPress}
                onLongPress={onLongPress}>
                <View className="flex flex-row p-2 m-2 pl-0 justify-between">
                    <View className="flex flex-row space-x-3 my-auto h-10">
                        <View className="my-auto">
                            <AbsentIcon
                                status={absent}
                                useMinimalistIcons={minimalist}
                            />
                        </View>
                        <View className="flex flex-col">
                            <Text className="text-zinc-100 font-normal my-auto text-lg">
                                {name}
                            </Text>
                            <View className="flex flex-row">
                                <TeacherStatusSubtitle
                                    teacher={teacher}
                                    status={absent}
                                    periods={periods}
                                />
                            </View>
                        </View>
                    </View>
                    <RightIconBar
                        hasComments={!!teacher.comments}
                        starred={starred}
                        toggleStar={toggle}
                        disableInteraction={!!disableInteraction}
                    />
                </View>
            </Pressable>
            {!disableInteraction && Platform.OS !== 'web' && (
                <TeacherBottomModal
                    modalRef={bottomSheetModalRef}
                    teacher={teacher}
                    status={absent}
                    periods={periods}
                    starred={starred}
                    toggleStar={toggle}
                />
            )}
        </GestureHandlerRootView>
    );
});

export default TeacherEntry;
