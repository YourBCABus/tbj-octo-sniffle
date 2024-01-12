import React from 'react';

import Icon from 'react-native-vector-icons/Ionicons';
import { AbsenceState } from '../../lib/types/types';
import { colors } from './TeacherEntry';

interface IconProps {
    status: AbsenceState;
    useMinimalistIcons: boolean;
}

export function DefaultIcon({ status }: IconProps) {
    switch (status) {
        case AbsenceState.ABSENT:
            return <Icon color={colors.absentRed} size={30} name="close-sharp" />;
        case AbsenceState.ABSENT_ALL_DAY:
            return <Icon color={colors.absentRed} size={30} name="close" />;
        case AbsenceState.PRESENT:
            return <Icon color={colors.presentGreen} size={30} name="checkmark-outline"/>;
        case AbsenceState.NO_PERIOD:
            return <Icon color={colors.defaultGray} size={30} name="ellipse" />;
    }
}

export function MinimalistIcon({ status }: IconProps) {
    switch (status) {
        case AbsenceState.ABSENT:
            return <Icon color={colors.absentRed} size={30} name="ellipse-outline" />;
        case AbsenceState.ABSENT_ALL_DAY:
            return <Icon color={colors.absentRed} size={30} name="close-circle-outline"/>;
        case AbsenceState.PRESENT:
            return <Icon color={colors.presentGreen} size={30} name="ellipse-outline"/>;
        case AbsenceState.NO_PERIOD:
            return <Icon color={colors.defaultGray} size={30} name="ellipse-outline"/>;
    }
}

export default function AbsentIcon(props: IconProps): JSX.Element {
    if (props.useMinimalistIcons) return <MinimalistIcon {...props} />;
    else return <DefaultIcon {...props} />;
}
