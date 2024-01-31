import React from 'react';

import Icon from 'react-native-vector-icons/Ionicons';

import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../../lib/fonts/config.json';
const CustomIcon = createIconSetFromFontello(fontelloConfig);

import { AbsenceState } from '../../lib/types/types';
import { colors } from './TeacherEntry';
import { View } from 'react-native';

interface IconProps {
    status: AbsenceState;
    useMinimalistIcons: boolean;
}

export function DefaultIcon({ status }: IconProps) {
    switch (status) {
        case AbsenceState.ABSENT_PART_UNSURE:
            return (
                <View className="relative">
                    <CustomIcon
                        color={colors.partialOrange}
                        size={30}
                        name="partial-bg"
                    />
                    <CustomIcon
                        color={colors.partialOrange}
                        size={30}
                        name="unknown-fg"
                        className="absolute top-0 left-0"
                    />
                </View>
            );
        case AbsenceState.ABSENT_PART_ABSENT:
            return (
                <View className="relative">
                    <CustomIcon
                        color={colors.partialOrange}
                        size={30}
                        name="partial-bg"
                    />
                    <CustomIcon
                        color={colors.absentRed}
                        size={30}
                        name="absent-fg"
                        className="absolute top-0 left-0"
                    />
                </View>
            );
        case AbsenceState.ABSENT_PART_PRESENT:
            return (
                <View className="relative">
                    <CustomIcon
                        color={colors.partialOrange}
                        size={30}
                        name="partial-bg"
                        className="h-8"
                    />
                    <CustomIcon
                        color={colors.presentGreen}
                        size={30}
                        name="present-fg"
                        className="absolute top-0 left-0 h-8"
                    />
                </View>
            );
        case AbsenceState.ABSENT_ALL_DAY:
            return <Icon color={colors.absentRed} size={30} name="close-circle" />;
        case AbsenceState.PRESENT:
            return <Icon color={colors.presentGreen} size={30} name="checkmark-circle" />;
        case AbsenceState.DAY_OVER:
            return <Icon color={colors.defaultGray} size={30} name="ellipse" />;
    }
}

export function MinimalistIcon({ status }: IconProps) {
    switch (status) {
        case AbsenceState.ABSENT_PART_UNSURE:
        case AbsenceState.ABSENT_PART_ABSENT:
        case AbsenceState.ABSENT_PART_PRESENT:
            return <Icon color={colors.partialOrange} size={30} name="ellipse-outline" />;
        case AbsenceState.ABSENT_ALL_DAY:
            return <Icon color={colors.absentRed} size={30} name="ellipse-outline" />;
        case AbsenceState.PRESENT:
            return <Icon color={colors.presentGreen} size={30} name="ellipse-outline" />;
            case AbsenceState.DAY_OVER:
            return <Icon color={colors.defaultGray} size={30} name="ellipse-outline" />;

    }
}

export default function AbsentIcon(props: IconProps): JSX.Element {
    if (props.useMinimalistIcons) return <MinimalistIcon {...props} />;
    else return <DefaultIcon {...props} />;
}
