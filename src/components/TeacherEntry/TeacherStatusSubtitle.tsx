import React, { useMemo } from 'react';

import { Text } from 'react-native';
import { AbsenceState, Period, Teacher } from '../../lib/types/types';
import { formatPeriodRanges } from '../../lib/utils';

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
        return formatPeriodRanges(
            props.periods.map(period => [
                period,
                props.teacher.absence.includes(period.id),
            ]),
        );
    }, [props.periods, props.teacher.absence]);

    switch (props.status) {
        case AbsenceState.ABSENT:
            return (
                <Text className="text-orange-500 text-sm">
                    Absent Periods {periodRangeString}
                </Text>
            );
        case AbsenceState.ABSENT_ALL_DAY:
            return <Text className="text-red-500 text-sm">Absent All Day</Text>;
        case AbsenceState.PRESENT:
            if (!props.alwaysShow) return <></>;
            return (
                <Text className="text-lime-500 text-sm">Present All Day</Text>
            );
        case AbsenceState.NO_PERIOD:
            if (!props.alwaysShow) return <></>;
            return <Text className="text-zinc-100 text-sm">Unknown</Text>;
    }
}
