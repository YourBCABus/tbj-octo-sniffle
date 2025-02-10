import React, { useMemo } from 'react';
import TeacherEntry from './TeacherEntry';
import { AbsenceState, Period } from '../../lib/types/types';

export interface DummyTeacherEntryProps {
    name: string;
    starred: boolean;
    absenceState: { state: AbsenceState; periods: string[] };
    minimalist: boolean;

    periods: Period[];
}

function useActivateDragDummy() {
    function dragHandle() {}
    return dragHandle;
}
function toggleStarDummy() {}

export default function DummyTeacherEntry({
    name,
    starred,
    absenceState,
    minimalist,
    periods,
}: DummyTeacherEntryProps) {
    const honorific = name.split(' ')[0];
    const noHonorific = name.split(' ').slice(1).join(' ');
    const last = noHonorific.split(' ').slice(1).join(' ');

    const teacher = useMemo(
        () => ({
            id: name,
            fullyAbsent: absenceState.state === AbsenceState.ABSENT_ALL_DAY,
            absence: absenceState.periods,
            name: {
                last,
                honorific,
                normal: `${honorific} ${last}`,
            },
            displayName: `${honorific} ${last}`,
        }),
        [name, absenceState, honorific, last],
    );

    return (
        <TeacherEntry
            teacher={teacher}
            starred={starred}
            toggleStar={toggleStarDummy}
            minimalist={minimalist}
            absent={absenceState.state}
            hapticfeedback={false}
            idx={0}
            periods={periods}
            disableInteraction={true}
            useActivateDrag={useActivateDragDummy}
        />
    );
}
