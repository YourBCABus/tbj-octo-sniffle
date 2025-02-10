import { DummyTeacherEntryProps } from '../components/TeacherEntry/DummyTeacherEntry';
import { AbsenceState, Period } from './types/types';

export const examplePeriods: Period[] = [
    {
        id: '1',
        name: 'Period 1',
        timeRange: {
            start: 0,
            end: 1 * 60 * 60,
        },
        teachersAbsent: [],
    },
    {
        id: '2',
        name: 'Period 2',
        timeRange: {
            start: 1.5 * 60 * 60,
            end: 2.5 * 60 * 60,
        },
        teachersAbsent: [],
    },
    {
        id: '3',
        name: 'Period 3',
        timeRange: {
            start: 3 * 60 * 60,
            end: 4 * 60 * 60,
        },
        teachersAbsent: [],
    },
    {
        id: '4',
        name: 'Period 4',
        timeRange: {
            start: 4.5 * 60 * 60,
            end: 5.5 * 60 * 60,
        },
        teachersAbsent: [],
    },
    {
        id: '5',
        name: 'Period 5',
        timeRange: {
            start: 6 * 60 * 60,
            end: 7 * 60 * 60,
        },
        teachersAbsent: [],
    },
    {
        id: '6',
        name: 'Period 6',
        timeRange: {
            start: 7.5 * 60 * 60,
            end: 8.5 * 60 * 60,
        },
        teachersAbsent: [],
    },
    {
        id: '7',
        name: 'Period 7',
        timeRange: {
            start: 9 * 60 * 60,
            end: 10 * 60 * 60,
        },
        teachersAbsent: [],
    },
    {
        id: '8',
        name: 'Period 8',
        timeRange: {
            start: 10.5 * 60 * 60,
            end: 11.5 * 60 * 60,
        },
        teachersAbsent: [],
    },
    {
        id: '9',
        name: 'Period 9',
        timeRange: {
            start: 12 * 60 * 60,
            end: 13 * 60 * 60,
        },
        teachersAbsent: [],
    },
];

export const exampleTeachers: DummyTeacherEntryProps[] = [
    {
        name: 'Ms. Jane Smith',
        starred: true,
        absenceState: {
            state: AbsenceState.ABSENT_ALL_DAY,
            periods: ['1', '2', '3', '4', '5', '6', '7', '8', '9'],
        },
        periods: examplePeriods,
        minimalist: false,
    },
    {
        name: 'Mr. John Doe',
        starred: false,
        absenceState: {
            state: AbsenceState.ABSENT_PART_PRESENT,
            periods: ['1', '2', '3'],
        },
        periods: examplePeriods,
        minimalist: false,
    },
    {
        name: 'Dr. Ryan Johnson',
        starred: false,
        absenceState: {
            state: AbsenceState.ABSENT_PART_ABSENT,
            periods: ['4', '5', '7', '8'],
        },
        periods: examplePeriods,
        minimalist: false,
    },
    {
        name: 'Mx. Alex Brown',
        starred: true,
        absenceState: {
            state: AbsenceState.PRESENT,
            periods: [],
        },
        periods: examplePeriods,
        minimalist: false,
    },
    {
        name: 'Mr. Example Easton',
        starred: false,
        absenceState: {
            state: AbsenceState.ABSENT_PART_PRESENT,
            periods: ['1', '3'],
        },
        periods: examplePeriods,
        minimalist: false,
    },
    {
        name: 'Dr. Joe Adams',
        starred: false,
        absenceState: {
            state: AbsenceState.ABSENT_PART_PRESENT,
            periods: ['4', '5', '6'],
        },
        periods: examplePeriods,
        minimalist: false,
    },
    {
        name: 'Ms. Rachel Sanders',
        starred: false,
        absenceState: {
            state: AbsenceState.PRESENT,
            periods: [],
        },
        periods: examplePeriods,
        minimalist: false,
    },
    {
        name: 'Mr. Darragh Decker',
        starred: false,
        absenceState: {
            state: AbsenceState.PRESENT,
            periods: [],
        },
        periods: examplePeriods,
        minimalist: false,
    },
    {
        name: 'Dr. Athena Hill',
        starred: false,
        absenceState: {
            state: AbsenceState.PRESENT,
            periods: [],
        },
        periods: examplePeriods,
        minimalist: false,
    },
];

const defaultPronouns = {
    sub: 'they',
    subject: 'they',
    obj: 'them',
    object: 'them',
    posAdj: 'their',
    possAdjective: 'their',
    posPro: 'theirs',
    possPronoun: 'theirs',
    refx: 'themself',
    reflexive: 'themself',
    grammPlu: true,
    grammaticallyPlural: true,
    setStr: 'they;them;their;theirs;themself',
};

const parseName = (name: string) => {
    const [honorific, first, ...rest] = name.split(' ');
    const last = rest.pop() ?? first;
    const middles = rest;
    const full = name;
    const firstLast = `${first} ${last}`;
    const normal = `${honorific} ${last}`;
    return {
        honorific,
        first,
        middles,
        last,
        full,
        firstLast,
        normal,
    };
};

// const lookupPeriodIds = (periods: string[]) => {
//     return examplePeriods
//         .filter(period => periods.includes(period.id))
//         .map(period => period.id);
// };

export const exampleGraphqlData = {
    teachers: exampleTeachers.map((teacher, idx) => {
        return {
            id: `00000000-0000-0000-0000-${idx.toString(16).padStart(12, '0')}`,
            pronouns: defaultPronouns,
            name: parseName(teacher.name),
            displayName: parseName(teacher.name).normal,
            absence: teacher.absenceState.periods.map(id => ({ id })),
            fullyAbsent:
                teacher.absenceState.state === AbsenceState.ABSENT_ALL_DAY,
        };
    }),
    periods: examplePeriods,
};
