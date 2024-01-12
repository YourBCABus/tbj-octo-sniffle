import { useMemo } from 'react';
import Fuse from 'fuse.js';
import { Teacher } from '../types/types';

const useSortedFilteredTeachers = (
    teachers: Teacher[],
    fuse: Fuse<Teacher>,
    search: string,
) => {
    return useMemo(() => {
        let resultedTeachers =
            search !== ''
                ? fuse.search(search).map(result => result.item)
                : [...teachers];

        // console.log(resultedTeachers);
        // names are sorted only by last name
        const newSorted = resultedTeachers.sort((a, b) => {
            return a.name.last.localeCompare(b.name.last);
        });
        return newSorted;
    }, [teachers, fuse, search]);
};

export default useSortedFilteredTeachers;
