import { DummyTeacherEntryProps } from '../components/TeacherEntry/DummyTeacherEntry';
import { AbsenceState, Period } from './types/types';

export const examplePeriods: Period[] = [
    {
        id: '1',
        name: 'Period 1',
        defaultTimeRange: {
            start: 0,
            end: 1 * 60 * 60,
        },
        timeRange: {
            start: 0,
            end: 1 * 60 * 60,
        },
        teachersAbsent: [],
    },
    {
        id: '2',
        name: 'Period 2',
        defaultTimeRange: {
            start: 1.5 * 60 * 60,
            end: 2.5 * 60 * 60,
        },
        timeRange: {
            start: 1.5 * 60 * 60,
            end: 2.5 * 60 * 60,
        },
        teachersAbsent: [],
    },
    {
        id: '3',
        name: 'Period 3',
        defaultTimeRange: {
            start: 3 * 60 * 60,
            end: 4 * 60 * 60,
        },
        timeRange: {
            start: 3 * 60 * 60,
            end: 4 * 60 * 60,
        },
        teachersAbsent: [],
    },
    {
        id: '4',
        name: 'Period 4',
        defaultTimeRange: {
            start: 4.5 * 60 * 60,
            end: 5.5 * 60 * 60,
        },
        timeRange: {
            start: 4.5 * 60 * 60,
            end: 5.5 * 60 * 60,
        },
        teachersAbsent: [],
    },
    {
        id: '5',
        name: 'Period 5',
        defaultTimeRange: {
            start: 6 * 60 * 60,
            end: 7 * 60 * 60,
        },
        timeRange: {
            start: 6 * 60 * 60,
            end: 7 * 60 * 60,
        },
        teachersAbsent: [],
    },
    {
        id: '6',
        name: 'Period 6',
        defaultTimeRange: {
            start: 7.5 * 60 * 60,
            end: 8.5 * 60 * 60,
        },
        timeRange: {
            start: 7.5 * 60 * 60,
            end: 8.5 * 60 * 60,
        },
        teachersAbsent: [],
    },
    {
        id: '7',
        name: 'Period 7',
        defaultTimeRange: {
            start: 9 * 60 * 60,
            end: 10 * 60 * 60,
        },
        timeRange: {
            start: 9 * 60 * 60,
            end: 10 * 60 * 60,
        },
        teachersAbsent: [],
    },
    {
        id: '8',
        name: 'Period 8',
        defaultTimeRange: {
            start: 10.5 * 60 * 60,
            end: 11.5 * 60 * 60,
        },
        timeRange: {
            start: 10.5 * 60 * 60,
            end: 11.5 * 60 * 60,
        },
        teachersAbsent: [],
    },
    {
        id: '9',
        name: 'Period 9',
        defaultTimeRange: {
            start: 12 * 60 * 60,
            end: 13 * 60 * 60,
        },
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
        name: 'Mx. Alex brown',
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
];
