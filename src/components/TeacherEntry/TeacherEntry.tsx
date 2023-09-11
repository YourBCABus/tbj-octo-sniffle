import { View, Text, Pressable, ColorValue } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons';
import { AbsenceState, TeacherEntryProps } from '../../lib/types/types';
import React, { useCallback, useMemo, useRef } from 'react';
import ReactNativeHapticFeedback from 'react-native-haptic-feedback'; 

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import {
    BottomSheetModal,  useBottomSheetModal, BottomSheetBackdrop,
  } from '@gorhom/bottom-sheet';

import { BottomSheetDefaultBackdropProps } from '@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types';

import resolveConfig from 'tailwindcss/resolveConfig';
import tailwindConfig from '../../../tailwind.config';

const fullConfig = resolveConfig(tailwindConfig)

const STAR_SIZE = 30;

const HAPTIC_OPTIONS = {
    enableVibrateFallback: true,
    ignoreAndroidSystemSettings: false
  };

function validateColors(colors: string[]) : ColorValue[] {
    let validColors: ColorValue[] = []
    let defaults = ["red", "lime", "gray", "black", "yellow"]
    if(!(fullConfig && fullConfig.theme && fullConfig.theme.colors)) {
        return defaults;
    }
    
    for(let i = 0; i < colors.length; i++) {
        if(fullConfig.theme.colors[colors[i]] !== undefined) {
            validColors.push(fullConfig.theme.colors[colors[i]] as ColorValue)
        } else {
            validColors.push(defaults[i] as ColorValue)
        }
    }
    return validColors
}

// hack right now, if you need a color in this file from the 
// tailwindconfig just add to this and access its location in the array
const colors = validateColors(["absent-red", "present-green", "default-gray", "ebony", "starred-yellow"]);

function getAbsentIcon(status: AbsenceState, useMinimalistIcons: boolean): JSX.Element {
    if(useMinimalistIcons) {
        switch (status) {
            case AbsenceState.ABSENT:
                return ( <Icon color={colors[0]} size={30} name="ellipse-outline"></Icon> );
            case AbsenceState.ABSENT_ALL_DAY:
                return ( <Icon color={colors[0]} size={30} name="close-circle-outline"></Icon> );
            case AbsenceState.PRESENT:
                return ( <Icon color={colors[1]} size={30} name="ellipse-outline"></Icon> );
            default:
                return ( <Icon color={colors[2]} size={30} name="ellipse-outline"></Icon> );
        }
    } else {
        switch (status) {
            case AbsenceState.ABSENT:
                return ( <Icon color={colors[0]} size={30} name="close-sharp"></Icon> );
            case AbsenceState.ABSENT_ALL_DAY:
                return ( <Icon color={colors[0]} size={30} name="close"></Icon> );
            case AbsenceState.PRESENT:
                return ( <Icon color={colors[1]} size={30} name="checkmark-outline"></Icon> );
            default:
                return ( <Icon color={colors[2]} size={30} name="ellipse"></Icon> );
        }
    }
}

function renderAbsenceStatus(status: AbsenceState): React.ReactNode {
    switch (status) {
        case AbsenceState.ABSENT:
            return ( <Text className="text-white">asdhfjashfjks</Text> );
        case AbsenceState.ABSENT_ALL_DAY:
            return ( <Icon color={colors[0]} size={30} name="close"></Icon> );
        case AbsenceState.PRESENT:
            return ( <Icon color={colors[1]} size={30} name="checkmark-outline"></Icon> );
        default:
            return ( <Icon color={colors[2]} size={30} name="ellipse"></Icon> );
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
    const { id } = props.teacher;
    const teacher = props.teacher; 
    let name = props.teacher.displayName;
    const toggleStar = props.setStar;
    
    // could make haptics a little less powerful if it's too much
    const toggle = useCallback(() => { 
            toggleStar(id); 
            if(props.hapticfeedback) {
                ReactNativeHapticFeedback.trigger("impactHeavy", HAPTIC_OPTIONS);
            }
        }, [id, props.hapticfeedback])

    return (
        <GestureHandlerRootView className="flex-1" id={id}>
            <View className="flex flex-row p-2 m-2 pl-0 justify-between">
                <View className="flex flex-row space-x-3 my-auto h-10">
                    <View className="my-auto">
                        {
                            getAbsentIcon(props.absent, useMinimalistMode)
                        }
                    </View>
                    <View className="flex flex-col">
                        {
                        starred ? 
                            (
                                // useMinimalistMode ?
                                //     (
                                //         <Text className="text-zinc-100 my-auto text-lg font-light">{name}</Text>
                                //     ) :
                                    // (
                                        <Text className="text-zinc-100 font-normal my-auto text-lg">{name}</Text>
                                    // )
                            ) : 
                            (
                                // useMinimalistMode ? 
                                //     (
                                //         <Text className="text-zinc-100 my-auto text-lg font-light">{name}</Text>
                                //     ) :
                                //     (
                                        <Text className="text-zinc-100 font-normal my-auto text-lg">{name}</Text>
                                    // )
                            )
                        }
                        <View className="flex flex-row">
                        {
                            props.absent === AbsenceState.ABSENT_ALL_DAY ?
                                // useMinimalistMode ?
                                //     (
                                //         <Text className="text-zinc-700 my-auto font-extralight">Out All Day</Text>
                                //     ) :
                                    // (
                                        <Text className="text-zinc-600 my-auto">Out All Day</Text>
                                    // )
                            : null
                        }
                        </View>
                    </View>
                </View>
                <View className="flex flex-row space-x-2">
                    <Pressable onPress={ toggle } hitSlop={2} className="my-auto">
                        {
                        starred ? 
                        (
                            <Icon name="star" size={STAR_SIZE} color={ "#9898f5"}/>
                        ) :
                        (
                            <Icon name="star-outline" size={STAR_SIZE} color={"#9898f5"} />
                        )
                        }
                    </Pressable>
                    <Pressable className="my-auto" hitSlop={1} onPress={() => {
                        handlePresentModalPress()
                        if(props.hapticfeedback) {
                            ReactNativeHapticFeedback.trigger("impactHeavy", HAPTIC_OPTIONS);
                        }
                    }}>
                    <View className="pt-1">
                        <Icon name="chevron-forward-outline" size={21} color={"rgb(63 63 70)"} />
                    </View>
                    
                    </Pressable>
                </View>
            </View>
            <BottomSheetModal 
                ref={bottomSheetModalRef}
                index={0}
                snapPoints={snapPoints}
                backgroundStyle={{ backgroundColor: "rgb(9 9 11)" }}
                handleIndicatorStyle={{ backgroundColor: 'white' }}
                enableOverDrag={true}
                backdropComponent={renderBackdrop}
                >
                <View className="flex h-full bg-zinc-950 align-middle">
                    <View className="flex flex-row mt-2">
                            
                            {
                                // starred ?
                                // (
                                //         <Text className="text-yellow-400 text-center w-full text-xl">{name}</Text>
                                // ) :
                                // (
                                //     <Text className="text-zinc-100 text-center w-full text-xl">{name}</Text>
                                // )
                                <Text className="text-[#9898f5] text-center w-full text-xl">{name}</Text>
                            }


                    </View>
                    {/* <Text className="text-white">13lkfjdaf</Text> */}
                    {/* { renderModalBody(props) } */}
                </View>
            </BottomSheetModal>
        </GestureHandlerRootView>
    )

}