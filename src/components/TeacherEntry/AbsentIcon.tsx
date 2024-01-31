import React from 'react';

import Icon from 'react-native-vector-icons/Ionicons';

import { createIconSetFromFontello } from 'react-native-vector-icons';
import fontelloConfig from '../../lib/fonts/config.json';
const CustomIcon = createIconSetFromFontello(fontelloConfig);

import { AbsenceState } from '../../lib/types/types';
import { colors } from './TeacherEntry';
import { ColorValue, StyleProp, TextStyle, View } from 'react-native';

interface IconProps {
    status: AbsenceState;
    useMinimalistIcons: boolean;
}

interface IconLayer {
    size: number;
    Icon: React.JSXElementConstructor<{
        color: ColorValue;
        style?: StyleProp<TextStyle>;
        className: string;
        size: number;
        name: string;
    }>;
    name: string;
    color: ColorValue;
    className: string;
}
interface LayeredIconProps {
    bg: IconLayer;
    fg: IconLayer;
}

function LayeredIcon({ bg, fg }: LayeredIconProps) {
    return (
        <View className="relative">
            <bg.Icon
                color={bg.color}
                size={bg.size}
                name={bg.name}
                style={{
                    height: bg.size,
                }}
                className={bg.className}
            />
            <fg.Icon
                color={fg.color}
                size={fg.size}
                name={fg.name}
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: fg.size,
                }}
                className={fg.className}
            />
        </View>
    );
}

const partialBgColorless = {
    size: 30,
    Icon: CustomIcon,
    name: 'partial-bg',
    className: 'h-8',
};
const unknownFgColorless = {
    size: 30,
    Icon: CustomIcon,
    name: 'unknown-fg',
    className: 'h-8',
};
const absentFgColorless = {
    size: 30,
    Icon: CustomIcon,
    name: 'absent-fg',
    className: 'h-8',
};
const presentFgColorless = {
    size: 30,
    Icon: CustomIcon,
    name: 'present-fg',
    className: 'h-8',
};
export function DefaultIcon({ status }: IconProps) {
    const partialBg = { ...partialBgColorless, color: colors.partialOrange };
    const unknownFg = { ...unknownFgColorless, color: colors.partialOrange };
    const absentFg = { ...absentFgColorless, color: colors.absentRed };
    const presentFg = { ...presentFgColorless, color: colors.presentGreen };
    if (Math.random() < 0.01) {
        return <Icon color={colors.presentGreen} size={30} name="checkmark-circle" className="h-8" />;
    }
    switch (status) {
        case AbsenceState.ABSENT_PART_UNSURE:
            return <LayeredIcon bg={partialBg} fg={unknownFg} />;
        case AbsenceState.ABSENT_PART_ABSENT:
            return <LayeredIcon bg={partialBg} fg={absentFg} />;
        case AbsenceState.ABSENT_PART_PRESENT:
            return <LayeredIcon bg={partialBg} fg={presentFg} />;
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
