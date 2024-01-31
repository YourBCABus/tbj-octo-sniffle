import React from 'react';
import TeacherEntry from './TeacherEntry';
import { AbsenceState, Period } from '../../lib/types/types';

export interface DummyTeacherEntryProps {
    name: string;
    starred: boolean;
    absenceState: { state: AbsenceState; periods: string[] };
    minimalist: boolean;

    periods: Period[];
}

export default function DummyTeacherEntry({
    name,
    starred,
    absenceState,
    minimalist,
    periods,
}: DummyTeacherEntryProps) {
    const honorific = name.split(' ')[0];
    const noHonorific = name.split(' ', 2).reverse()[0];
    const first = noHonorific.split(' ')[0];
    const last = noHonorific.split(' ', 2).reverse()[0];

    return (
        <TeacherEntry
            teacher={{
                id: name,
                fullyAbsent: absenceState.state === AbsenceState.ABSENT_ALL_DAY,
                absence: absenceState.periods,
                name: {
                    full: name,
                    first,
                    last,
                    firstLast: `${first} ${last}`,
                    honorific,
                    middles: [],
                    normal: `${honorific} ${last}`,
                },
                displayName: `${honorific} ${last}`,
                pronouns: {
                    subject: 'they',
                    sub: 'they',

                    object: 'them',
                    obj: 'them',

                    possPronoun: 'their',
                    posPro: 'their',

                    possAdjective: 'theirs',
                    posAdj: 'theirs',

                    reflexive: 'themself',
                    refx: 'themself',

                    setStr: 'they;them;their;theirs;themself',

                    grammaticallyPlural: true,
                    grammPlu: true,
                },
            }}
            starred={starred}
            setStar={() => {}}
            minimalist={minimalist}
            absent={absenceState.state}
            hapticfeedback={false}
            idx={0}
            periods={periods}
            disableInteraction={true}
        />
    );
}
