import { View, Text, Pressable } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { AbsenceState, TeacherEntryProps } from '../../lib/types/types';
import { useCallback, useMemo, useRef } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'; 

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
    BottomSheetModal,  useBottomSheetModal, BottomSheetBackdrop,
  } from '@gorhom/bottom-sheet';

import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

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
                return ( <Icon color="red" size={30} name="close-circle-outline"></Icon> );
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
                return ( <Icon color="red" size={30} name="close"></Icon> );
            case AbsenceState.PRESENT:
                return ( <Icon color="lime" size={30} name="checkmark-outline"></Icon> );
            default:
                return ( <Icon color="gray" size={30} name="ellipse"></Icon> );
        }
    }
}

export default function TeacherEntry(props: TeacherEntryProps) {
    let useMinimalistMode = props.minimalist
    
    const { dismissAll } = useBottomSheetModal();
    const bottomSheetModalRef = useRef<BottomSheetModal>(null);
    const snapPoints = useMemo(() => ['45%'], []);

    const handlePresentModalPress = useCallback(() => {
        dismissAll();
        bottomSheetModalRef.current?.present();
    }, []);

    const handleSheetChanges = useCallback((index: number) => {
        console.log('handleSheetChanges', index);
    }, []);

    const renderBackdrop = useCallback(
        (    props: JSX.IntrinsicAttributes & BottomSheetDefaultBackdropProps) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
          />
        ),
        []
    );

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
        <GestureHandlerRootView className="flex-1">
            <View className="flex flex-row p-2 m-2 pl-0 justify-between" id={id}>
                <View className="flex flex-row space-x-3 my-auto">
                    <View className="my-auto">
                        {
                            getAbsentIcon(props.absent, useMinimalistMode)
                        }
                    </View>
                    <View className="flex flex-col">
                        {
                        starred ? 
                            (
                                useMinimalistMode ?
                                    (
                                        <Text className="text-yellow-400 my-auto text-lg font-light">{name}</Text>
                                    ) :
                                    (
                                        <Text className="text-yellow-400 my-auto text-lg">{name}</Text>
                                    )
                            ) : 
                            (
                                useMinimalistMode ? 
                                    (
                                        <Text className="text-white my-auto text-lg font-light">{name}</Text>
                                    ) :
                                    (
                                        <Text className="text-white my-auto text-lg">{name}</Text>
                                    )
                            )
                        }
                        <View className="flex flex-row">
                        {
                            props.absent === AbsenceState.ABSENT_ALL_DAY ?
                                useMinimalistMode ?
                                    (
                                        <Text className="text-neutral-400 my-auto font-extralight">Out All Day</Text>
                                    ) :
                                    (
                                        <Text className="text-neutral-500 my-auto">Out All Day</Text>
                                    )
                            : null
                        }
                        </View>
                    </View>
                </View>
                <View className="flex flex-row space-x-3">
                    <Pressable className="my-auto" hitSlop={1} onPress={() => {
                        handlePresentModalPress()
                        if(props.hapticfeedback) {
                            ReactNativeHapticFeedback.trigger("impactHeavy", HAPTIC_OPTIONS);
                        }
                    }}>
                            <Icon name="information-circle-outline" size={32} color="gray" />
                    </Pressable>
                    <Pressable onPress={ toggle } hitSlop={2} className="my-auto">
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
            </View>
            <BottomSheetModal 
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                onChange={ handleSheetChanges }
                backgroundStyle={{ backgroundColor: '#1f1d1e' }}
                handleIndicatorStyle={{ backgroundColor: 'white' }}
                enableOverDrag={true}
                backdropComponent={renderBackdrop}
                >
                <View className="flex h-full bg-ebony align-middle">
                    <View className="flex flex-row mt-2">
                        {
                            starred ?
                            (
                                <Text className="text-yellow-400 text-center w-full text-xl">{name}</Text>
                            ) :
                            (
                                <Text className="text-white text-center w-full text-xl">{name}</Text>
                            )
                        }
                    </View>
                </View>
            </BottomSheetModal>
        </GestureHandlerRootView>
    )

}