// JSX just loves React
import React, { useCallback, useMemo } from 'react';

// Types + Queries for GraphQL
import { AbsenceState, Period, Teacher } from '../../lib/types/types';

// Components
import TeacherEntry from './TeacherEntry';
import { ListRenderItemInfo, Text, View } from 'react-native';
import { ReorderTeachers } from '../../lib/hooks/useStarredTeachers';
import NestedReorderableList from '../reordering/NestedReorderableList';

const SUBHEADER = 'text-zinc-aa-compliant font-medium pl-2 text-sm';

function getAbsenceState(
    teacher: Teacher,
    currPeriod: Period | null,
    dayIsOver: boolean,
): AbsenceState {
    if (dayIsOver) {
        return AbsenceState.DAY_OVER;
    }

    const partAbsent = teacher.absence.length > 0;
    const fullAbsent = teacher.fullyAbsent;
    if (fullAbsent) {
        return AbsenceState.ABSENT_ALL_DAY;
    } else if (!fullAbsent && !partAbsent) {
        return AbsenceState.PRESENT;
    } else {
        if (currPeriod === null || currPeriod === undefined) {
            return AbsenceState.ABSENT_PART_UNSURE;
        }

        const isAbsentRightNow = teacher.absence.some(
            periodId => periodId === currPeriod?.id,
        );
        if (isAbsentRightNow) {
            return AbsenceState.ABSENT_PART_ABSENT;
        } else {
            return AbsenceState.ABSENT_PART_PRESENT;
        }
    }
}

// await signOut

interface TeacherListProps {
    listTitle: string;

    teachers: Teacher[];

    periods: Period[];
    currPeriod: Period | null;
    dayIsOver: boolean;

    toggleStar: (id: string) => void;
    starred: string[];

    reorderable?: boolean;
    reorder?: ReorderTeachers;

    minimalist: boolean;
    hapticFeedback: boolean;
}

export default function TeacherList(props: TeacherListProps) {
    const {
        listTitle,

        teachers,

        periods,
        currPeriod,
        dayIsOver,

        toggleStar,
        starred,

        reorder,
        reorderable,

        minimalist,
        hapticFeedback,
    } = props;

    const onReorder = useMemo(
        () => (reorderable && reorder ? reorder : () => {}),
        [reorder, reorderable],
    );
    const renderTeacher = useCallback(
        ({
            item: teacher,
            index,
        }: Pick<ListRenderItemInfo<Teacher>, 'item' | 'index'>) => {
            return (
                <TeacherEntry
                    key={teacher.id}
                    teacher={teacher}
                    starred={starred.includes(teacher.id)}
                    toggleStar={toggleStar}
                    minimalist={minimalist}
                    absent={getAbsenceState(teacher, currPeriod, dayIsOver)}
                    hapticfeedback={hapticFeedback}
                    idx={index}
                    periods={periods}
                    draggable={reorderable}
                />
            );
        },
        [
            periods,
            currPeriod,
            dayIsOver,
            toggleStar,
            starred,
            minimalist,
            hapticFeedback,
            reorderable,
        ],
    );
    return (
        <>
            {props.teachers.length > 0 ? (
                <View className="mt-1 pt-2 border-t border-zinc-aa-compliant">
                    <Text className={SUBHEADER}>{listTitle}</Text>
                </View>
            ) : null}
            <NestedReorderableList
                data={teachers}
                onReorder={onReorder}
                renderItem={renderTeacher}
                keyExtractor={teacher => teacher.id}
                scrollEnabled={false}
            />
            {/* {Platform.OS === 'ios' ? (
            ) : (
                teachers.map((item, idx) => renderTeacher({ item, index: idx }))
            )} */}
        </>
    );
}
