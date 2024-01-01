import { gql } from '@apollo/client';

/*
 * GraphQL Queries
 */

/**
 * Query to get all teachers and periods
 *
 * To access teachers, use `data.teachers`
 * To access periods, use `data.periods`
 */
export const GET_ALL_TEACHERS_PERIODS = gql`
    query getAllData {
        teachers: allTeachers {
            id
            pronouns {
                sub
                subject
                obj
                object
                posAdj
                possAdjective
                posPro
                possPronoun
                refx
                reflexive
                grammPlu
                grammaticallyPlural
                setStr
            }
            name {
                honorific
                first
                middles
                last
                full
                firstLast
                normal
            }
            absence {
                id
            }
            fullyAbsent
        }
        periods: allPeriods {
            id
            name
            defaultTimeRange {
                start
                end
            }
            timeRange {
                start
                end
            }
            teachersAbsent {
                id
                name {
                    full
                }
            }
        }
    }
`;
