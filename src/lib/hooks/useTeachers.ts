import { useMemo } from 'react';
import { Teacher } from '../types/types';

const useTeachers = (data: { teachers: Teacher[] } | undefined): Teacher[] => {
    return useMemo(() => {
        if (!data) {
            return [];
        }
        return data.teachers.map((teacher: Teacher) => {
            return {
                id: teacher.id,
                displayName: teacher.name.normal,
                name: {
                    honorific: teacher.name.honorific,
                    first: teacher.name.first,
                    middles: teacher.name.middles,
                    last: teacher.name.last,
                    full: teacher.name.full,
                    firstLast: teacher.name.firstLast,
                    normal: teacher.name.normal,
                },
                pronouns: {
                    sub: teacher.pronouns.sub,
                    subject: teacher.pronouns.subject,
                    obj: teacher.pronouns.obj,
                    object: teacher.pronouns.object,
                    posAdj: teacher.pronouns.posAdj,
                    possAdjective: teacher.pronouns.possAdjective,
                    posPro: teacher.pronouns.posPro,
                    possPronoun: teacher.pronouns.possPronoun,
                    refx: teacher.pronouns.refx,
                    reflexive: teacher.pronouns.reflexive,
                    grammPlu: teacher.pronouns.grammPlu,
                    grammaticallyPlural: teacher.pronouns.grammaticallyPlural,
                    setStr: teacher.pronouns.setStr,
                },
                absence:
                    teacher.absence.map(
                        (absenceResult: any) => absenceResult.id,
                    ) ?? [],
                fullyAbsent: teacher.fullyAbsent,
            };
        });
    }, [data]);
};

export default useTeachers;
