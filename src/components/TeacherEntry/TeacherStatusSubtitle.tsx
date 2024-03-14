import React, { useMemo } from 'react';

import { Text } from 'react-native';
import { AbsenceState, Period, Teacher } from '../../lib/types/types';
import { formatPeriodRanges } from '../../lib/utils';
import { colors } from './TeacherEntry';

interface TeacherStatusSubtitleProps {
    status: AbsenceState;
    teacher: Teacher;
    periods: Period[];
    alwaysShow?: boolean;
}

export default function TeacherStatusSubtitle(
    props: TeacherStatusSubtitleProps,
): JSX.Element {
    const periodRangeString = useMemo(() => {
        const periods = [...props.periods].sort(
            (a, b) => a.timeRange.start - b.timeRange.start,
        );

        return formatPeriodRanges(
            periods.map(period => [
                period,
                props.teacher.absence.includes(period.id),
            ]),
        );
    }, [props.periods, props.teacher.absence]);

    switch (props.status) {
        case AbsenceState.ABSENT_PART_ABSENT:
        case AbsenceState.ABSENT_PART_PRESENT:
        case AbsenceState.ABSENT_PART_UNSURE:
            return (
                <Text className="text-sm" style={{ color: colors.partialOrange }}>
                    Absent period(s) {periodRangeString}
                </Text>
            );
        case AbsenceState.ABSENT_ALL_DAY:
            return (
                <Text className="text-sm" style={{ color: colors.absentRed }}>
                    Absent All Day
                </Text>
            );
        case AbsenceState.PRESENT:
            if (!props.alwaysShow) return <></>;
            return (
                <Text
                    className="text-sm"
                    style={{ color: colors.presentGreen }}>
                    Present All Day
                </Text>
            );
        case AbsenceState.DAY_OVER:
            if (!props.alwaysShow) return <></>;
            return (
                <Text className="text-sm" style={{ color: colors.defaultGray }}>
                    Day is over
                </Text>
            );
    }
}
